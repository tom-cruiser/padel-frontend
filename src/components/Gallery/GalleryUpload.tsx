import { useState, useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { addGalleryImage } from '@/lib/api/gallery';
import toast from 'react-hot-toast';

interface GalleryUploadProps {
  onUploadSuccess: () => void;
}

export default function GalleryUpload({ onUploadSuccess }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await addGalleryImage(formData);
      toast.success('Image uploaded successfully');
      onUploadSuccess();
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4"
      onDragEnter={handleDrag}
    >
      <div
        className={`max-w-2xl mx-auto p-6 border-2 border-dashed rounded-lg 
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
        ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <PhotoIcon
            className="mx-auto h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
              <span>Upload a file</span>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                className="sr-only"
                accept="image/*"
                disabled={isUploading}
                required
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter image title"
            disabled={isUploading}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (optional)
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter image description"
            disabled={isUploading}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className={`inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </form>
  );
}