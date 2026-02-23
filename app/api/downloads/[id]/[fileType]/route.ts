import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongodb';
import Download from '@/models/Download';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; fileType: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const download = await Download.findById(params.id);

    if (!download) {
      return NextResponse.json(
        { error: 'Téléchargement non trouvé' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (download.userId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Check expiration
    if (new Date(download.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Le lien de téléchargement a expiré' },
        { status: 410 }
      );
    }

    // Limite de téléchargements désactivée
    // Les clients peuvent télécharger autant de fois qu'ils veulent pendant la période de validité
    // if (download.downloadCount >= download.maxDownloads) {
    //   return NextResponse.json(
    //     { error: 'Limite de téléchargements atteinte' },
    //     { status: 429 }
    //   );
    // }

    const { fileType } = params;
    const validTypes = ['mp3', 'wav', 'stems', 'contract'];

    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Type de fichier invalide' },
        { status: 400 }
      );
    }

    // Get file URL
    let fileUrl: string | undefined;
    
    switch (fileType) {
      case 'mp3':
        fileUrl = download.files.mp3;
        break;
      case 'wav':
        fileUrl = download.files.wav;
        break;
      case 'stems':
        fileUrl = download.files.stems;
        break;
      case 'contract':
        fileUrl = download.files.contract;
        break;
    }

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'Fichier non disponible' },
        { status: 404 }
      );
    }

    // Increment download count de manière asynchrone (non-bloquant)
    // Ne pas attendre la sauvegarde pour renvoyer la réponse
    Download.findByIdAndUpdate(
      params.id,
      { $inc: { downloadCount: 1 } },
      { new: false }
    ).catch(err => console.error('Erreur incrémentation download count:', err));

    // Optimisation Cloudinary : Ajout de fl_attachment pour forcer le download
    // Parsing simplifié avec replace() au lieu de URL parsing
    let optimizedUrl = fileUrl;
    if (fileUrl.includes('cloudinary.com/') && fileUrl.includes('/upload/')) {
      // Insertion directe après /upload/ (plus rapide que URL parsing)
      optimizedUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    // Headers HTTP avec cache agressif (15 minutes)
    // Permet au navigateur de réutiliser les vérifications pour les downloads répétés
    return NextResponse.json(
      {
        success: true,
        url: optimizedUrl,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=900', // 15 min
          'X-Download-Optimized': 'true',
        },
      }
    );
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
