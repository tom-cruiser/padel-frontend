'use client';

import { useState, useEffect } from 'react';
import { socketService, type OnlineUser } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from './ChatWindow';

export default function ChatList() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleStartChat = (recipient: OnlineUser) => {
    setSelectedUser(recipient);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  const toggleChatList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChatList}
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
        {onlineUsers.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {onlineUsers.length}
          </span>
        )}
      </button>

      {/* Chat User List */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 w-80 bg-white rounded-lg shadow-2xl z-40 border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">💬 Online Users</h3>
            <button
              onClick={toggleChatList}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto">
            {onlineUsers.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No other users online</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {onlineUsers.map((onlineUser) => (
                  <button
                    key={onlineUser.userId}
                    onClick={() => {
                      handleStartChat(onlineUser);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                      {onlineUser.firstName[0]}{onlineUser.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="font-medium text-gray-900">
                          {onlineUser.firstName} {onlineUser.lastName}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">{onlineUser.role}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <ChatWindow recipient={selectedUser} onClose={handleCloseChat} />
      )}
    </>
  );
}
