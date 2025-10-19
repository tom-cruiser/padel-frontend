'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { profileService } from '@/services/api';
import { toast } from 'react-hot-toast';

interface SettingsSectionProps {
  profile: any;
  onUpdate: (updates: any) => void;
}

export default function SettingsSection({ profile, onUpdate }: SettingsSectionProps) {
  const [privacy, setPrivacy] = useState(profile.privacy || 'public');
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const handlePrivacyChange = async (newPrivacy: string) => {
    try {
      setSavingPrivacy(true);
      await profileService.updatePrivacy(newPrivacy);
      setPrivacy(newPrivacy);
      toast.success('Privacy settings updated');
    } catch (error) {
      toast.error('Failed to update privacy settings');
      console.error('Privacy update error:', error);
    } finally {
      setSavingPrivacy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Control who can view your profile information
          </p>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === 'public'}
                onChange={(e) => handlePrivacyChange(e.target.value)}
                disabled={savingPrivacy}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">Public</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Anyone can view your profile and activity
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="privacy"
                value="friends"
                checked={privacy === 'friends'}
                onChange={(e) => handlePrivacyChange(e.target.value)}
                disabled={savingPrivacy}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Friends Only</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Only your friends can view your profile details
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === 'private'}
                onChange={(e) => handlePrivacyChange(e.target.value)}
                disabled={savingPrivacy}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <EyeOff className="w-4 h-4 text-red-600 mr-2" />
                  <span className="font-medium text-gray-900">Private</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Keep your profile completely private
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Lock className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Account Preferences */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates about your bookings</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Booking Reminders</p>
              <p className="text-sm text-gray-500">Get reminders before your booking time</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Promotional Emails</p>
              <p className="text-sm text-gray-500">Receive offers and promotions</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Community Updates</p>
              <p className="text-sm text-gray-500">Stay updated with community events</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
