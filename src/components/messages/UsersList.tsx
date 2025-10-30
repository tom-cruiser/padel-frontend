'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { fetchConversations, type Conversation } from '@/lib/api/messages';
import { socketService, type ChatMessage } from '@/lib/socket';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  lastSeen?: string;
  isOnline?: boolean;
  unreadCount?: number;
  lastMessage?: {
    message: string;
    timestamp: string;
    fromMe: boolean;
  };
}

interface UsersListProps {
  onUserSelect: (userId: string) => void;
  selectedUserId: string | null;
}

export function UsersList({ onUserSelect, selectedUserId }: UsersListProps) {
  const { user, getAccessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const conversations = await fetchConversations();
        console.log('Conversations fetched:', conversations);
        console.log('Fetched conversations:', conversations);
        
        setUsers(conversations.map(conv => ({
          ...conv.user,
          unreadCount: conv.unreadCount,
          lastMessage: conv.lastMessage,
        })));

        // Set up socket listener for new messages
        const socket = socketService.getSocket();
        if (socket) {
          socket.on('message:receive', (message) => {
            setUsers(prevUsers => {
              return prevUsers.map(u => {
                if (u.id === message.fromUserId || u.id === message.toUserId) {
                  return {
                    ...u,
                    lastMessage: {
                      message: message.message,
                      timestamp: message.timestamp,
                      fromMe: message.fromUserId === user.id
                    },
                    unreadCount: u.id === message.fromUserId ? (u.unreadCount || 0) + 1 : u.unreadCount
                  };
                }
                return u;
              });
            });
          });

          // Listen for read receipts
          socket.on('message:read', ({ fromUserId }) => {
            setUsers(prevUsers => {
              return prevUsers.map(u => {
                if (u.id === fromUserId) {
                  return {
                    ...u,
                    unreadCount: 0
                  };
                }
                return u;
              });
            });
          });
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, [user, getAccessToken]); // Add dependencies to ensure updates when auth changes

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {users.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No conversations yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onUserSelect(user.id)}
              className={`w-full p-4 hover:bg-gray-50 transition-colors duration-150 flex items-start space-x-3 ${
                selectedUserId === user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg text-gray-600">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  </div>
                )}
                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  {user.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(user.lastMessage.timestamp), { addSuffix: true })}
                    </span>
                  )}
                </div>
                {user.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage.fromMe ? 'You: ' : ''}{user.lastMessage.message}
                  </p>
                )}
                {user.unreadCount && user.unreadCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {user.unreadCount} new
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}