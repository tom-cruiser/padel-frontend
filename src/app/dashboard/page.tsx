"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/notification";
import { socketService, type OnlineUser } from "@/lib/socket";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch unread notifications count
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const count = await notificationService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      };
      fetchUnreadCount();

      // Refresh count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Listen for online users updates
  useEffect(() => {
    if (user) {
      socketService.onOnlineUsers((users) => {
        setOnlineUsers(users);
      });

      // Listen for new notifications to update count
      socketService.onNotification(() => {
        notificationService
          .getUnreadCount()
          .then((count) => setUnreadCount(count))
          .catch(console.error);
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary-600">
          Loading...
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">
                🎾 Padel Court Booking
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Badge */}
              <button
                onClick={() => router.push("/notifications")}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Notifications"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Link */}
              <button
                onClick={() => router.push("/profile")}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Profile"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {user.role}
              </span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Bookings
            </h3>
            <p className="text-3xl font-bold text-primary-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Active reservations</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Available Courts
            </h3>
            <p className="text-3xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-600 mt-1">Green & Blue courts</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Notifications
            </h3>
            <p className="text-3xl font-bold text-yellow-600">{unreadCount}</p>
            <p className="text-sm text-gray-600 mt-1">Unread messages</p>
            <button
              onClick={() => router.push("/notifications")}
              className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all →
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 card bg-gradient-to-br from-primary-50 to-primary-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Padel Court Booking System! 🎉
          </h2>
          <p className="text-gray-700 mb-4">
            Your account has been successfully created. You can now start
            booking your favorite courts.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              ✅ <strong>Book Courts:</strong> Reserve time slots from 7 AM to
              10 PM
            </p>
            <p className="text-sm text-gray-600">
              ✅ <strong>Real-time Updates:</strong> Get instant notifications
            </p>
            <p className="text-sm text-gray-600">
              ✅ <strong>Manage Bookings:</strong> View and cancel your
              reservations
            </p>
            {user.role === "ADMIN" && (
              <p className="text-sm text-gray-600">
                ✅ <strong>Admin Access:</strong> Manage courts and view all
                bookings
              </p>
            )}
          </div>
          <div className="mt-6">
            <button
              onClick={() => router.push("/booking")}
              className="btn btn-primary mr-3"
            >
              📅 Book a Court
            </button>
            <button
              onClick={() => router.push("/bookings")}
              className="btn btn-secondary mr-3"
            >
              📊 View History
            </button>
            <button
              onClick={() => router.push("/chat")}
              className="btn btn-secondary"
            >
              💬 Messages
            </button>
          </div>
        </div>

        {/* Feature Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🏟️ Available Courts
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">
                    Green Padel Court
                  </p>
                  <p className="text-sm text-gray-600">Indoor • LED lighting</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">
                    Blue Padel Court
                  </p>
                  <p className="text-sm text-gray-600">
                    Outdoor • Natural ventilation
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⏰ Operating Hours
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Daily:</strong> 7:00 AM - 10:00 PM
              </p>
              <p className="text-gray-700">
                <strong>Slot Duration:</strong> 1 hour
              </p>
              <p className="text-gray-700">
                <strong>Last Booking:</strong> 9:00 PM
              </p>
              <p className="text-sm text-gray-600 mt-3">
                All bookings are subject to availability. Cancel at least 2
                hours in advance for a full refund.
              </p>
            </div>
          </div>

          {/* Online Users */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              👥 Online Users ({onlineUsers.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {onlineUsers.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No users online</p>
              ) : (
                onlineUsers.map((onlineUser) => (
                  <div
                    key={onlineUser.userId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {onlineUser.firstName} {onlineUser.lastName}
                          {onlineUser.userId === user?.id && (
                            <span className="ml-1 text-xs text-gray-500">
                              (You)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-600">
                          {onlineUser.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
