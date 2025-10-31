import { useState, useRef } from 'react';
import { imagekit } from '@/lib/imagekit';

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  onError: (error: string) => void;
}

interface UploadProgressEvent {
  loaded: number;
  total: number;
}

interface ImageKitResponse {
  url: string;
  fileId: string;
  name: string;
}

export function ImageUpload({ onUploadComplete, onError }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', caption || file.name); // Use caption as title or fallback to filename
      formData.append('description', caption || ''); // Optional description

      // Get ImageKit auth token
      const authResponse = await fetch('/api/imagekit/auth');
      const authData = await authResponse.json();

      if (!authData.signature || !authData.expire || !authData.token) {
        throw new Error('Failed to get upload authorization');
      }

      // Upload to ImageKit first
      const ikResponse = await imagekit.upload({
        file,
        fileName: file.name,
        tags: ['gallery'],
        folder: '/gallery',
        useUniqueFileName: true,
        signature: authData.signature,
        token: authData.token,
        expire: authData.expire,
      }) as unknown as ImageKitResponse;

      // Now save the image reference to our backend
      formData.append('imageUrl', ikResponse.url);
      formData.append('fileId', ikResponse.fileId);

      await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      onUploadComplete(ikResponse.url);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      onError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('Image size should be less than 5MB.');
      return;
    }

    handleUpload(file);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Caption
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter image caption"
          disabled={uploading}
        />
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-sm">Select an image</span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
}