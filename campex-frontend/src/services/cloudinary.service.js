import { MAX_IMAGE_SIZE_MB } from '@/constants';
import { isValidImageFile, isImageSizeValid } from '@/utils/helpers';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Validate Cloudinary configuration
if (!CLOUDINARY_CLOUD_NAME) {
  console.error('VITE_CLOUDINARY_CLOUD_NAME is not set in environment variables');
}

if (!CLOUDINARY_UPLOAD_PRESET) {
  console.warn('VITE_CLOUDINARY_UPLOAD_PRESET is not set. Image uploads may fail.');
}

export const cloudinaryService = {
  uploadImage: async (file) => {
    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name is not configured. Please check your environment variables.');
    }

    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset is not configured. Please create an upload preset in Cloudinary Dashboard and set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
    }

    // Validate file
    if (!isValidImageFile(file)) {
      throw new Error('Invalid file type. Please upload JPG, JPEG, PNG, or WebP images.');
    }

    if (!isImageSizeValid(file, MAX_IMAGE_SIZE_MB)) {
      throw new Error(`Image size must be less than ${MAX_IMAGE_SIZE_MB}MB`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'campex/products');

    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary upload failed:', response.status, errorText);
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },

  uploadMultipleImages: async (files) => {
    const uploadPromises = Array.from(files).map(file => 
      cloudinaryService.uploadImage(file)
    );

    return await Promise.all(uploadPromises);
  },
};