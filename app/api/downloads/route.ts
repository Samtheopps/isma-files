import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';
import connectDB from '@/lib/db/mongodb';
import Download from '@/models/Download';

export async function GET(request: NextRequest) {
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

    // Support du filtrage par orderId via query param
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    const query: any = { userId: decoded.userId };
    if (orderId) {
      query.orderId = orderId;
    }
    
    const downloads = await Download.find(query)
      .sort({ createdAt: -1 })
      .populate('beatId', 'title coverImage');

    return NextResponse.json({
      success: true,
      downloads,
    });
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
