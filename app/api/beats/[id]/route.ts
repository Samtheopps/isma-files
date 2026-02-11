import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Beat from '@/models/Beat';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const beat = await Beat.findById(params.id);

    if (!beat) {
      return NextResponse.json(
        { error: 'Beat non trouvé' },
        { status: 404 }
      );
    }

    // Increment play count
    beat.playCount += 1;
    await beat.save();

    return NextResponse.json({
      success: true,
      beat,
    });
  } catch (error) {
    console.error('Error fetching beat:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
