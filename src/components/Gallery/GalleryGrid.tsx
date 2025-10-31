import { useState } from 'react';
import { GalleryImage } from '@/types/gallery';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { TrashIcon, PencilIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { deleteGalleryImage, updateGalleryImage } from '@/lib/api/gallery';
import toast from 'react-hot-toast';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageDeleted: () => void;
  onImageUpdated: () => void;
}

export default function GalleryGrid({ images, onImageDeleted, onImageUpdated }: GalleryGridProps) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: ''
  });

  const handleDelete = async (image: GalleryImage) => {
    try {
      await deleteGalleryImage(image.id);
      toast.success('Image deleted successfully');
      onImageDeleted();
      setIsConfirmDelete(false);
    } catch (error) {
      toast.error('Failed to delete image');
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.id, {
        title: editForm.title,
        description: editForm.description || null,
        isActive: image.isActive
      });
      toast.success('Image updated successfully');
      onImageUpdated();
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update image');
      console.error('Update error:', error);
    }
  };

  const toggleVisibility = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.id, {
        isActive: !image.isActive
      });
      toast.success(`Image ${image.isActive ? 'hidden' : 'shown'} successfully`);
      onImageUpdated();
    } catch (error) {
      toast.error('Failed to update image visibility');
      console.error('Visibility update error:', error);
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setEditForm({
      title: image.title,
      description: image.description || ''
    });
    setIsEditing(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="aspect-w-4 aspect-h-3">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  !image.isActive ? 'opacity-50' : ''
                }`}
              />
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm truncate">{image.description}</p>
                )}
              </div>

              {user?.role === 'ADMIN' && (
                <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggleVisibility(image)}
                    className="p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700"
                    title={image.isActive ? 'Hide image' : 'Show image'}
                  >
                    {image.isActive ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(image)}
                    className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-500"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(image);
                      setIsConfirmDelete(true);
                    }}
                    className="p-2 text-white bg-red-600 rounded-full hover:bg-red-500"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Delete Image
            </Dialog.Title>
            <p>Are you sure you want to delete this image?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedImage && handleDelete(selectedImage)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Edit Image
            </Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                selectedImage && handleUpdate(selectedImage);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}