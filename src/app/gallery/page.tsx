'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GalleryGrid from '@/components/Gallery/GalleryGrid';
import GalleryUpload from '@/components/Gallery/GalleryUpload';
import { getGalleryImages } from '@/lib/api/gallery';
import { GalleryImage } from '@/types/gallery';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const responseImages = await getGalleryImages(!showInactive);
      // Convert response images to match the GalleryImage type
      const convertedImages: GalleryImage[] = responseImages.map(img => ({
        ...img,
        fileId: img.fileId || '',
        isActive: img.isActive || false
      }));
      setImages(convertedImages);
    } catch (error) {
      toast.error('Failed to load gallery images');
      console.error('Error loading gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [showInactive]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🖼️ Gallery</h1>
              <p className="text-sm text-gray-600">View our facility and courts</p>
            </div>
            {user?.role === 'ADMIN' && (
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-gray-700">Show hidden images</span>
              </label>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'ADMIN' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
            <GalleryUpload onUploadSuccess={fetchImages} />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images available in the gallery.</p>
            {user?.role === 'ADMIN' && (
              <p className="mt-2 text-gray-500">Upload some images to get started</p>
            )}
          </div>
        ) : (
          <GalleryGrid
            images={images}
            onImageDeleted={fetchImages}
            onImageUpdated={fetchImages}
          />
        )}
      </main>
    </div>
  );
}