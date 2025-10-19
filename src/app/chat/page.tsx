'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { socketService, type OnlineUser } from '@/lib/socket';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Listen for online users updates
      socketService.onOnlineUsers((users) => {
        // Filter out current user
        const otherUsers = users.filter((u) => u.userId !== user.id);
        setOnlineUsers(otherUsers);
      });
    }
  }, [user]);

  if (loading || !user) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Back to dashboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">💬 Messages</h1>
                <p className="text-sm text-gray-600">
                  {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Online Users List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                👥 Online Users ({onlineUsers.length})
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {onlineUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No other users online</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Users will appear here when they log in
                    </p>
                  </div>
                ) : (
                  onlineUsers.map((onlineUser) => (
                    <button
                      key={onlineUser.userId}
                      onClick={() => setSelectedUser(onlineUser)}
                      className={`w-full p-3 rounded-lg transition-all text-left ${
                        selectedUser?.userId === onlineUser.userId
                          ? 'bg-primary-100 border-2 border-primary-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                            {onlineUser.firstName[0]}{onlineUser.lastName[0]}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {onlineUser.firstName} {onlineUser.lastName}
                          </p>
                          <p className="text-xs text-gray-600">{onlineUser.role}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="card p-0 overflow-hidden h-[600px]">
                <ChatWindow
                  recipient={selectedUser}
                  onClose={() => setSelectedUser(null)}
                  embedded={true}
                />
              </div>
            ) : (
              <div className="card h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-24 h-24 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a user to start chatting
                  </h3>
                  <p className="text-gray-600">
                    Choose a user from the list to begin a conversation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 card bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Real-time Messaging</h4>
              <p className="text-sm text-gray-700">
                Messages are delivered instantly using Socket.IO. Only users who are currently online
                will appear in the list. Start a conversation by selecting a user from the online users list.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
