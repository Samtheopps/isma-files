import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (
  file: File | string | Buffer,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
) => {
  try {
    let uploadSource: string;

    // Si c'est un Buffer, le convertir en base64
    if (Buffer.isBuffer(file)) {
      uploadSource = `data:application/pdf;base64,${file.toString('base64')}`;
    } else {
      uploadSource = file as string;
    }

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder: `isma-files/${folder}`,
      resource_type: resourceType,
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Generate signed URL for secure download (expires in 1 hour)
 */
export const generateSignedUrl = (publicId: string, expiresIn: number = 3600): string => {
  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
  
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    resource_type: 'raw',
    expires_at: timestamp,
  });
};
