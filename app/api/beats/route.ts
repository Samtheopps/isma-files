import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Beat from '@/models/Beat';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Filters
    const genre = searchParams.get('genre');
    const mood = searchParams.get('mood');
    const search = searchParams.get('search');

    // Build query
    const query: any = { isActive: true };

    if (genre) {
      query.genre = genre;
    }

    if (mood) {
      query.mood = mood;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const [beats, total] = await Promise.all([
      Beat.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Beat.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      beats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get beats error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch beats' },
      { status: 500 }
    );
  }
}
