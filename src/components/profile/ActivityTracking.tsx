'use client';

import { useEffect, useState } from 'react';
import { Trophy, Calendar, Users, FileText } from 'lucide-react';
import { profileService } from '@/services/api';

interface ActivityTrackingProps {
  profile: any;
}

export default function ActivityTracking({ profile }: ActivityTrackingProps) {
  const [achievements, setAchievements] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      const [achievementsData, attendanceData, postsData] = await Promise.all([
        profileService.getAchievements(),
        profileService.getAttendance(),
        profileService.getPosts(),
      ]);
      setAchievements(achievementsData);
      setAttendance(attendanceData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </h3>
          <span className="text-sm text-gray-500">{achievements.length} total</span>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement: any) => (
              <div
                key={achievement.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    {achievement.description && (
                      <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Earned {new Date(achievement.awardedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No achievements yet</p>
            <p className="text-sm text-gray-400 mt-1">Keep playing to earn badges!</p>
          </div>
        )}
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-500" />
            Attendance Records
          </h3>
          <span className="text-sm text-gray-500">{attendance.length} events</span>
        </div>

        {attendance.length > 0 ? (
          <div className="space-y-3">
            {attendance.slice(0, 10).map((record: any) => (
              <div
                key={record.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.event}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.attendedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No attendance records</p>
          </div>
        )}
      </div>

      {/* Community Posts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Community Posts
          </h3>
          <span className="text-sm text-gray-500">{posts.length} posts</span>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.slice(0, 5).map((post: any) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <p className="text-gray-900">{post.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Posted {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No posts yet</p>
            <p className="text-sm text-gray-400 mt-1">Share your thoughts with the community!</p>
          </div>
        )}
      </div>

      {/* Friends List Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Friends
          </h3>
          <span className="text-sm text-gray-500">{profile.friends?.length || 0} friends</span>
        </div>

        {profile.friends && profile.friends.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.friends.slice(0, 8).map((friendRecord: any) => (
              <div key={friendRecord.id} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold text-gray-500">
                  {friendRecord.friend.firstName?.[0]}{friendRecord.friend.lastName?.[0]}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {friendRecord.friend.firstName} {friendRecord.friend.lastName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No friends yet</p>
            <p className="text-sm text-gray-400 mt-1">Connect with other players!</p>
          </div>
        )}
      </div>
    </div>
  );
}
