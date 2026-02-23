import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Beat from '@/models/Beat';
import cloudinary from '@/lib/services/cloudinary.service';
import { getAdminFromRequest } from '@/lib/utils/adminAuth';

// Limites de taille en bytes
const FILE_SIZE_LIMITS = {
  mp3: 50 * 1024 * 1024, // 50MB
  wav: 200 * 1024 * 1024, // 200MB
  stems: 500 * 1024 * 1024, // 500MB
};

// Extensions autorisées
const ALLOWED_EXTENSIONS = {
  mp3: ['.mp3'],
  wav: ['.wav'],
  stems: ['.zip'],
};

/**
 * Valide un fichier uploadé
 */
function validateFile(
  file: File,
  type: 'mp3' | 'wav' | 'stems'
): { valid: boolean; error?: string } {
  // Vérifier la taille
  if (file.size > FILE_SIZE_LIMITS[type]) {
    const maxSizeMB = FILE_SIZE_LIMITS[type] / (1024 * 1024);
    return {
      valid: false,
      error: `Le fichier ${type.toUpperCase()} dépasse la limite de ${maxSizeMB}MB`,
    };
  }

  // Vérifier l'extension
  const fileName = file.name.toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[type];
  const hasValidExtension = allowedExts.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Extension invalide pour ${type.toUpperCase()}. Attendu: ${allowedExts.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Upload un fichier vers Cloudinary
 */
async function uploadFileToCloudinary(
  file: File,
  beatId: string,
  type: 'mp3' | 'wav' | 'stems'
): Promise<string> {
  try {
    // Convertir le fichier en Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convertir en base64 data URI
    let dataUri: string;
    if (type === 'stems') {
      // ZIP = resource_type 'raw'
      dataUri = `data:application/zip;base64,${buffer.toString('base64')}`;
    } else {
      // MP3/WAV = resource_type 'video' (audio files)
      const mimeType = type === 'mp3' ? 'audio/mpeg' : 'audio/wav';
      dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    // Upload vers Cloudinary
    const folder = `beats/${beatId}`;
    const resourceType = type === 'stems' ? 'raw' : 'video';

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `isma-files/${folder}`,
      resource_type: resourceType,
      public_id: `${beatId}_${type}`,
      overwrite: true, // Écraser si existe déjà
    });

    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload error for ${type}:`, error);
    throw new Error(`Échec de l'upload ${type.toUpperCase()} vers Cloudinary`);
  }
}

/**
 * POST /api/beats/[id]/upload
 * Upload les fichiers audio (MP3, WAV, Stems) pour un beat
 * PROTECTION: Admin uniquement
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification admin
    getAdminFromRequest(request);

    await connectDB();

    const beatId = params.id;

    // Récupérer le beat
    const beat = await Beat.findById(beatId);
    if (!beat) {
      return NextResponse.json(
        { error: 'Beat non trouvé' },
        { status: 404 }
      );
    }

    // Parser le FormData
    const formData = await request.formData();
    const mp3File = formData.get('mp3') as File | null;
    const wavFile = formData.get('wav') as File | null;
    const stemsFile = formData.get('stems') as File | null;

    // Vérifier qu'au moins un fichier est fourni
    if (!mp3File && !wavFile && !stemsFile) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    const uploadedUrls: Partial<{
      mp3: string;
      wav: string;
      stems: string;
    }> = {};

    const errors: string[] = [];

    // Upload MP3
    if (mp3File) {
      const validation = validateFile(mp3File, 'mp3');
      if (!validation.valid) {
        errors.push(validation.error!);
      } else {
        try {
          uploadedUrls.mp3 = await uploadFileToCloudinary(mp3File, beatId, 'mp3');
        } catch (error: any) {
          errors.push(`MP3: ${error.message}`);
        }
      }
    }

    // Upload WAV
    if (wavFile) {
      const validation = validateFile(wavFile, 'wav');
      if (!validation.valid) {
        errors.push(validation.error!);
      } else {
        try {
          uploadedUrls.wav = await uploadFileToCloudinary(wavFile, beatId, 'wav');
        } catch (error: any) {
          errors.push(`WAV: ${error.message}`);
        }
      }
    }

    // Upload Stems
    if (stemsFile) {
      const validation = validateFile(stemsFile, 'stems');
      if (!validation.valid) {
        errors.push(validation.error!);
      } else {
        try {
          uploadedUrls.stems = await uploadFileToCloudinary(stemsFile, beatId, 'stems');
        } catch (error: any) {
          errors.push(`STEMS: ${error.message}`);
        }
      }
    }

    // Si tous les uploads ont échoué
    if (errors.length > 0 && Object.keys(uploadedUrls).length === 0) {
      return NextResponse.json(
        { error: 'Tous les uploads ont échoué', details: errors },
        { status: 500 }
      );
    }

    // Mettre à jour le beat avec les nouvelles URLs
    if (uploadedUrls.mp3) beat.files.mp3 = uploadedUrls.mp3;
    if (uploadedUrls.wav) beat.files.wav = uploadedUrls.wav;
    if (uploadedUrls.stems) beat.files.stems = uploadedUrls.stems;

    await beat.save();

    return NextResponse.json({
      success: true,
      message: 'Upload terminé',
      uploadedUrls,
      errors: errors.length > 0 ? errors : undefined,
      beat: {
        _id: beat._id,
        title: beat.title,
        files: beat.files,
      },
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      {
        error: 'Erreur serveur lors de l\'upload',
        details: error.message,
      },
      { status: error.message?.includes('Unauthorized') || error.message?.includes('Admin') ? 401 : 500 }
    );
  }
}
