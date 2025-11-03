'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types';
import api from '@/lib/api';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No notifications</p>
          <p className="mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}