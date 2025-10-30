import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  uploadedBy: string;
  createdAt: string;
}

interface GalleryProps {
  images: GalleryImage[];
  isAdmin: boolean;
  onDelete?: (imageId: string) => Promise<void>;
}

export function Gallery({ images, isAdmin, onDelete }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleDelete = async (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await onDelete?.(imageId);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-lg shadow-md">
              <Image
                src={image.thumbnail}
                alt={image.caption || 'Gallery image'}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                onClick={() => setSelectedImage(image)}
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
                onClick={() => setSelectedImage(image)}
              >
                View
              </button>
              {isAdmin && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md ml-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
                  onClick={() => handleDelete(image.id)}
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 truncate">{image.caption}</p>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption || 'Gallery image'}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.caption && (
              <p className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-2">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}