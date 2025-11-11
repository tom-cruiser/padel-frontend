'use client';

import { useState, useEffect } from 'react';
import { socketService, type OnlineUser } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from './ChatWindow';

export default function ChatList() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      console.log('🔌 Connecting socket for user:', user.id);
      socketService.connect(user.id, {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });

      // Listen for online users updates
      socketService.onOnlineUsers((users) => {
        // Filter out current user
        const otherUsers = users.filter((u) => u.userId !== user.id);
        setOnlineUsers(otherUsers);
        console.log('📊 Online users updated:', otherUsers);
      });

      return () => {
        console.log('🔌 Cleaning up socket listeners');
        socketService.removeListeners();
      };
    }
  }, [user]);

  const handleUserSelect = (selectedUser: OnlineUser) => {
    console.log('👤 Selected user for chat:', selectedUser);
    setSelectedUser(selectedUser);
  };

  const handleCloseChatWindow = () => {
    setSelectedUser(null);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all z-40 flex items-center justify-center"
        title="Open chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat List Panel */}
      {isOpen && !selectedUser && (
        <div className="fixed bottom-20 left-4 w-80 bg-white rounded-lg shadow-xl z-40 max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">Online Users ({onlineUsers.length})</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Users List */}
          <div className="max-h-80 overflow-y-auto">
            {onlineUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-4xl mb-2">💤</div>
                <p className="text-sm">No users online</p>
                <p className="text-xs mt-1">Check back later</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {onlineUsers.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleUserSelect(user)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {selectedUser && (
        <div className="fixed bottom-4 left-4 w-96 h-[500px] z-50">
          <ChatWindow
            recipient={selectedUser}
            onClose={handleCloseChatWindow}
            embedded={false}
          />
        </div>
      )}
    </>
  );
}
