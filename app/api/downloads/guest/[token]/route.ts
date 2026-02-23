import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Beat from '@/models/Beat';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Trouver la commande avec ce token
    const order = await Order.findOne({ downloadToken: token });

    if (!order) {
      return NextResponse.json(
        { error: 'Lien de téléchargement invalide' },
        { status: 404 }
      );
    }

    // Vérifier que c'est bien une commande guest
    if (!order.isGuestOrder) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier l'expiration
    if (order.downloadExpiry && new Date() > order.downloadExpiry) {
      return NextResponse.json(
        { error: 'Lien de téléchargement expiré (30 jours)' },
        { status: 410 }
      );
    }

    // Vérifier le nombre de téléchargements
    if (order.downloadCount >= 3) {
      return NextResponse.json(
        { error: 'Limite de téléchargements atteinte (3 max)' },
        { status: 429 }
      );
    }

    // Récupérer les détails des beats
    const beatsWithFiles = await Promise.all(
      order.items.map(async (item: any) => {
        const beat = await Beat.findById(item.beatId);
        if (!beat) return null;

        const license = beat.licenses.find((l: any) => l.type === item.licenseType);

        return {
          beatId: item.beatId.toString(),
          beatTitle: item.beatTitle,
          licenseType: item.licenseType,
          price: item.price,
          coverImage: beat.coverImage,
          files: {
            mp3: license?.features.mp3 ? beat.files.mp3 : undefined,
            wav: license?.features.wav ? beat.files.wav : undefined,
            stems: license?.features.stems ? beat.files.stems : undefined,
          },
        };
      })
    );

    const validBeats = beatsWithFiles.filter((beat) => beat !== null);

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        deliveryEmail: order.deliveryEmail,
        createdAt: order.createdAt,
        downloadCount: order.downloadCount,
        maxDownloads: 3,
        expiresAt: order.downloadExpiry,
        licenseContract: order.licenseContract,
      },
      items: validBeats,
    });

  } catch (error: any) {
    console.error('Erreur guest download:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * Incrémenter le compteur de téléchargements
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Trouver et incrémenter le compteur
    const order = await Order.findOneAndUpdate(
      { 
        downloadToken: token,
        isGuestOrder: true,
        downloadCount: { $lt: 3 },
        downloadExpiry: { $gt: new Date() },
      },
      { 
        $inc: { downloadCount: 1 } 
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Impossible d\'incrémenter le compteur (limite atteinte ou expiré)' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadCount: order.downloadCount,
    });

  } catch (error: any) {
    console.error('Erreur increment download:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
