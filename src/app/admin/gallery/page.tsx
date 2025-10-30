'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Gallery } from '@/components/gallery/Gallery';
import { ImageUpload } from '@/components/gallery/ImageUpload';
import { getGalleryImages, deleteGalleryImage, saveGalleryImage } from '@/lib/api/gallery';
import { toast } from 'react-hot-toast';

export default function AdminGalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.role === 'ADMIN') {
      window.location.href = '/';
      return;
    }
    
    fetchImages();
  }, [user]);

  const fetchImages = async () => {
    try {
      const fetchedImages = await getGalleryImages();
      setImages(fetchedImages);
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (imageUrl: string) => {
    try {
      // Create thumbnail URL by adding transformation parameters
      const thumbnailUrl = imageUrl.replace(
        '/gallery/',
        '/gallery/tr:w-400,h-400,fo-auto/'
      );

      const savedImage = await saveGalleryImage({
        url: imageUrl,
        thumbnail: thumbnailUrl,
        caption: '',
      });

      setImages((prev) => [savedImage, ...prev]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to save image details');
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteGalleryImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user?.role === 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gallery Management</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
        <ImageUpload
          onUploadComplete={handleUploadComplete}
          onError={(error) => toast.error(error)}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Images</h2>
        <Gallery
          images={images}
          isAdmin={true}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}