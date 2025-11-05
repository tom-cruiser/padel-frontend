'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';

interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export default function OnlineUsersButton() {
  console.log('OnlineUsersButton rendering');
  const [showModal, setShowModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    // Listen for online users updates
    socket.on('users:online', (users: OnlineUser[]) => {
      // Filter out current user from the list
      const filteredUsers = users.filter(u => u.id !== user.id);
      setOnlineUsers(filteredUsers);
    });

    // Request current online users
    socket.emit('users:get_online');

    return () => {
      socket.off('users:online');
    };
  }, [user, socket]);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center z-[100]"
        title="Show Online Users"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-green-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
            {onlineUsers.length}
          </span>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Online Users</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {onlineUsers.length === 0 ? (
                <p className="text-gray-500 text-center">No users online</p>
              ) : (
                <div className="space-y-4">
                  {onlineUsers.map((onlineUser) => (
                    <div
                      key={onlineUser.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        window.location.href = `/messages?userId=${onlineUser.id}`;
                        setShowModal(false);
                      }}
                    >
                      <div className="relative">
                        {onlineUser.avatar ? (
                          <img
                            src={onlineUser.avatar}
                            alt={`${onlineUser.firstName} ${onlineUser.lastName}`}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-lg text-gray-600">
                              {onlineUser.firstName[0]}
                              {onlineUser.lastName[0]}
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {onlineUser.firstName} {onlineUser.lastName}
                        </p>
                        <p className="text-sm text-green-500">Online</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}