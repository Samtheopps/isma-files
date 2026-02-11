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
  file: File | string,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
) => {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder: `isma-files/${folder}`,
      resource_type: resourceType,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
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
