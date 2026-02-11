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

    // Check download limit
    if (download.downloadCount >= download.maxDownloads) {
      return NextResponse.json(
        { error: 'Limite de téléchargements atteinte' },
        { status: 429 }
      );
    }

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

    // Increment download count
    download.downloadCount += 1;
    await download.save();

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
