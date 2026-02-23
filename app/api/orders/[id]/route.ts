import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Beat from '@/models/Beat';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Récupérer la commande
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que la commande appartient à l'utilisateur
    if (order.userId?.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Enrichir les items avec les informations des beats
    const enrichedItems = await Promise.all(
      order.items.map(async (item: any) => {
        const beat = await Beat.findById(item.beatId);
        return {
          ...item.toObject(),
          beat: beat ? {
            _id: beat._id,
            title: beat.title,
            coverImage: beat.coverImage,
            licenses: beat.licenses,
          } : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      order: {
        ...order.toObject(),
        items: enrichedItems,
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
