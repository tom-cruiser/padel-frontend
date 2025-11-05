import { api } from './api';

import { GalleryImage, GalleryImageResponse } from '@/types/gallery';

export async function getGalleryImages(activeOnly = true): Promise<GalleryImageResponse[]> {
  try {
    const response = await api.get(`/gallery${activeOnly ? '?isActive=true' : ''}`);
    console.log('Gallery response:', response.data);
    return response.data.images;
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    throw error;
  }
}

export async function addGalleryImage(formData: FormData): Promise<GalleryImage> {
  try {
    // Validate input
    const file = formData.get('image') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      throw new Error('No image file provided');
    }

    if (!title) {
      throw new Error('Title is required');
    }

    // Validate file size and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    console.log('Starting image upload process');

    // Get ImageKit authentication parameters
    console.log('Getting ImageKit auth parameters...');
    const authResponse = await fetch('/api/imagekit/auth');
    if (!authResponse.ok) {
      throw new Error('Failed to get ImageKit authentication');
    }
    const authData = await authResponse.json();
    console.log('Auth parameters received:', authData);
    
    if (!authData.token || !authData.signature || !authData.expire) {
      throw new Error('Invalid ImageKit authentication parameters');
    }

    const { imagekit } = await import('@/lib/imagekit');
    console.log('ImageKit client initialized');

    const uploadParams = {
      file: file,
      fileName: `gallery-${Date.now()}-${file.name}`,
      useUniqueFileName: true,
      folder: '/gallery',
      tags: ['gallery'],
      token: authData.token,
      signature: authData.signature,
      expire: authData.expire
    };
    console.log('Preparing upload with params:', uploadParams);
    
    const uploadResponse = await imagekit.upload(uploadParams);

    const imageKitData = {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId
    };
    console.log('Upload successful:', imageKitData);

    // 3. Save to our backend
    const galleryData = new FormData();
    galleryData.append('title', title);
    galleryData.append('imageUrl', imageKitData.url);
    galleryData.append('fileId', imageKitData.fileId);
    if (formData.get('description')) {
      galleryData.append('description', formData.get('description') as string);
    }

    // Log the FormData contents for debugging
    console.log('FormData contents:', {
      title: galleryData.get('title'),
      imageUrl: galleryData.get('imageUrl'),
      fileId: galleryData.get('fileId'),
      description: galleryData.get('description')
    });

    // Log the request details
    console.log('Sending gallery data to backend:', {
      endpoint: '/gallery',
      formData: {
        title: galleryData.get('title'),
        imageUrl: galleryData.get('imageUrl'),
        fileId: galleryData.get('fileId'),
        description: galleryData.get('description')
      }
    });

    const response = await api.post('/gallery', galleryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (!response.data.gallery) {
      throw new Error('Invalid response format from server');
    }

    return response.data.gallery;
  } catch (error: any) {
    console.error('Gallery image upload failed:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Handle specific error cases
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.data?.details) {
      throw new Error(error.response.data.details);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timed out. Please try again with a smaller image.');
    } else if (error.message.includes('Network Error')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error('Failed to upload image. Please try again.');
  }
}

export async function updateGalleryImage(id: string, data: Partial<GalleryImageResponse>): Promise<GalleryImage> {
  try {
    const response = await api.patch(`/gallery/${id}`, data);
    return response.data.gallery;
  } catch (error) {
    console.error('Failed to update gallery image:', error);
    throw error;
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    await api.delete(`/gallery/${id}`);
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    throw error;
  }
}