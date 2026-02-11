import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Beat from '@/models/Beat';
import { getAdminFromRequest } from '@/lib/utils/adminAuth';
import { uploadToCloudinary } from '@/lib/services/cloudinary.service';

/**
 * GET /api/admin/beats
 * Liste tous les beats (même inactifs) avec statistiques
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 'active', 'inactive', 'all'
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');

    // Construire le filtre
    const filter: any = {};
    
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }
    
    if (genre) {
      filter.genre = genre;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [beats, total] = await Promise.all([
      Beat.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Beat.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: beats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin beats GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch beats' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

/**
 * POST /api/admin/beats
 * Créer un nouveau beat
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    const body = await request.json();
    const {
      title,
      bpm,
      key,
      genre,
      mood,
      tags,
      previewUrl,
      coverImage,
      files,
      licenses,
      waveformData,
    } = body;

    // Validation basique
    if (!title || !bpm || !key || !genre || !previewUrl || !coverImage || !files || !licenses) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Créer le beat
    const beat = await Beat.create({
      title,
      bpm,
      key,
      genre: Array.isArray(genre) ? genre : [genre],
      mood: mood || [],
      tags: tags || [],
      previewUrl,
      coverImage,
      files: {
        mp3: files.mp3,
        wav: files.wav,
        stems: files.stems,
      },
      licenses,
      waveformData: waveformData || { peaks: [], duration: 0 },
      isActive: true,
      playCount: 0,
      salesCount: 0,
    });

    return NextResponse.json({
      success: true,
      data: beat,
      message: 'Beat created successfully',
    });
  } catch (error: any) {
    console.error('Admin beats POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create beat' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
