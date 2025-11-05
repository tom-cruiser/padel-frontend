'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/api';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ContactInfoForm from '@/components/profile/ContactInfoForm';
import MembershipCard from '@/components/profile/MembershipCard';
import ActivityTracking from '@/components/profile/ActivityTracking';
import SettingsSection from '@/components/profile/SettingsSection';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: any) => {
    try {
      const updated = await profileService.updateProfile(updates);
      setProfile({ ...profile, ...updated });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await profileService.uploadAvatar(file);
      setProfile({ ...profile, avatar: result.avatar });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
      console.error('Avatar upload error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onAvatarUpload={handleAvatarUpload}
        />

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Contact Info
            </button>
            {profile.membershipStatus === 'MEMBER' && (
              <button
                onClick={() => setActiveTab('membership')}
                className={`${
                  activeTab === 'membership'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Membership
              </button>
            )}
            <button
              onClick={() => setActiveTab('activity')}
              className={`${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContactInfoForm
                profile={profile}
                onUpdate={handleProfileUpdate}
              />
              {profile.membershipStatus === 'MEMBER' && (
                <MembershipCard profile={profile} />
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <ContactInfoForm
              profile={profile}
              onUpdate={handleProfileUpdate}
            />
          )}

          {activeTab === 'membership' && profile.membershipStatus === 'MEMBER' && (
            <MembershipCard profile={profile} />
          )}

          {activeTab === 'activity' && (
            <ActivityTracking profile={profile} />
          )}

          {activeTab === 'settings' && (
            <SettingsSection
              profile={profile}
              onUpdate={handleProfileUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
