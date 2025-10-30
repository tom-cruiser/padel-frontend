import { api } from './api';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export async function getGalleryImages(activeOnly = true): Promise<GalleryImage[]> {
  try {
    const response = await api.get(`/gallery${activeOnly ? '?isActive=true' : ''}`);
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

    console.log('Uploading image:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    const config = {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    };

    const response = await api.post('/gallery', formData, config);
    
    console.log('Server response:', response.data);
    
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

export async function updateGalleryImage(id: string, data: Partial<GalleryImage>): Promise<GalleryImage> {
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