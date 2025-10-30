'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/lib/api/gallery';
import Image from 'next/image';
import toast from 'react-hot-toast';

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

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchGalleryImages();
  }, [user, router]);

  const fetchGalleryImages = async () => {
    try {
      const data = await getGalleryImages(false);
      setImages(data);
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    if (!uploadData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const formData = new FormData();
    
    try {
      console.log('Preparing to upload:', {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      });

      formData.append('image', selectedFile);
      formData.append('title', uploadData.title.trim());
      if (uploadData.description?.trim()) {
        formData.append('description', uploadData.description.trim());
      }

      const loadingToast = toast.loading('Uploading image...');
      
      const response = await addGalleryImage(formData);
      
      toast.dismiss(loadingToast);
      toast.success('Image added successfully');
      
      console.log('Upload successful:', response);
      
      setSelectedFile(null);
      setUploadData({ title: '', description: '' });
      fetchGalleryImages();
    } catch (error: any) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add image';
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (image: GalleryImage) => {
    try {
      await updateGalleryImage(image.id, { isActive: !image.isActive });
      toast.success(`Image ${image.isActive ? 'hidden' : 'shown'} successfully`);
      fetchGalleryImages();
    } catch (error) {
      toast.error('Failed to update image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteGalleryImage(id);
      toast.success('Image deleted successfully');
      fetchGalleryImages();
    } catch (error) {
      toast.error('Failed to delete image');
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
              <h1 className="text-2xl font-bold text-gray-900">🖼️ Manage Gallery</h1>
              <p className="text-sm text-gray-600">Upload and manage gallery images</p>
            </div>
            <button
              onClick={() => router.push('/gallery')}
              className="btn btn-secondary"
            >
              View Gallery
            </button>
          </div>
        </div>
      </header>

      {/* Upload Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Image</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!selectedFile || !uploadData.title}
            >
              Upload Image
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                !image.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="relative h-64">
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  style={{ objectFit: 'cover' }}
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
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(image)}
                    className={`btn ${image.isActive ? 'btn-warning' : 'btn-success'}`}
                  >
                    {image.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}