'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getGalleryImages } from '@/lib/api/gallery';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const data = await getGalleryImages(true);
      setImages(data);
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary-600">Loading...</div>
      </div>
    );
  }

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
              <button
                onClick={() => router.push('/admin/gallery')}
                className="btn btn-primary"
              >
                Manage Gallery
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No images available in the gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{image.title}</h3>
                  {image.description && (
                    <p className="mt-1 text-gray-600">{image.description}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Added by {image.user.firstName} {image.user.lastName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}