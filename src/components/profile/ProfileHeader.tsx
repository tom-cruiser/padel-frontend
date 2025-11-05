'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Award, Calendar } from 'lucide-react';

interface ProfileHeaderProps {
  profile: any;
  onAvatarUpload: (file: File) => void;
}

export default function ProfileHeader({ profile, onAvatarUpload }: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    await onAvatarUpload(file);
    setUploading(false);
  };

  const membershipBadgeColor = profile.membershipStatus === 'MEMBER'
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
            )}
          </div>
          
          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-600 mt-1">{profile.email}</p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${membershipBadgeColor}`}>
              <Award className="w-4 h-4 mr-1" />
              {profile.membershipStatus === 'MEMBER' ? `${profile.membershipType || 'Member'}` : 'Non-Member'}
            </span>
            
            {profile.role === 'ADMIN' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Admin
              </span>
            )}
            
            {profile.joinDate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {new Date(profile.joinDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Member stats */}
          {profile.membershipStatus === 'MEMBER' && (
            <div className="mt-4 flex flex-wrap gap-6 text-sm justify-center sm:justify-start">
              <div>
                <span className="text-gray-500">Total Bookings:</span>
                <span className="ml-2 font-semibold text-gray-900">{profile.bookings?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Achievements:</span>
                <span className="ml-2 font-semibold text-gray-900">{profile.achievements?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Friends:</span>
                <span className="ml-2 font-semibold text-gray-900">{profile.friends?.length || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
