import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Beat from '@/models/Beat';
import { getAdminFromRequest } from '@/lib/utils/adminAuth';

/**
 * GET /api/admin/beats/[id]
 * Récupère les détails d'un beat (vue admin)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    const beat = await Beat.findById(params.id).lean();

    if (!beat) {
      return NextResponse.json(
        { success: false, error: 'Beat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: beat,
    });
  } catch (error: any) {
    console.error('Admin beat GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch beat' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

/**
 * PUT /api/admin/beats/[id]
 * Modifier un beat existant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive,
    } = body;

    // Vérifier que le beat existe
    const existingBeat = await Beat.findById(params.id);
    if (!existingBeat) {
      return NextResponse.json(
        { success: false, error: 'Beat not found' },
        { status: 404 }
      );
    }

    // Mettre à jour le beat
    const updatedBeat = await Beat.findByIdAndUpdate(
      params.id,
      {
        $set: {
          title,
          bpm,
          key,
          genre: Array.isArray(genre) ? genre : [genre],
          mood: mood || [],
          tags: tags || [],
          previewUrl,
          coverImage,
          files,
          licenses,
          waveformData,
          isActive,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      data: updatedBeat,
      message: 'Beat updated successfully',
    });
  } catch (error: any) {
    console.error('Admin beat PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update beat' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

/**
 * DELETE /api/admin/beats/[id]
 * Supprimer un beat (soft delete: isActive = false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    // Vérifier que le beat existe
    const beat = await Beat.findById(params.id);
    if (!beat) {
      return NextResponse.json(
        { success: false, error: 'Beat not found' },
        { status: 404 }
      );
    }

    // Soft delete: désactiver le beat
    await Beat.findByIdAndUpdate(params.id, {
      $set: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Beat deleted successfully',
    });
  } catch (error: any) {
    console.error('Admin beat DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete beat' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
