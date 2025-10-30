'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

interface LastMessage {
  message: string;
  timestamp: string;
  fromMe: boolean;
}

interface Conversation {
  user: User;
  unreadCount: number;
  lastMessage: LastMessage | null;
}

interface MessageListProps {
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function MessageList({ selectedUserId, onSelectUser }: MessageListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch conversations
        const conversationsResponse = await api.get('/messages/conversations');
        setConversations(conversationsResponse.data.conversations || []);
        
        // If no conversations, fetch all users
        if (!conversationsResponse.data.conversations?.length) {
          const usersResponse = await api.get('/users');
          setAllUsers(usersResponse.data.users || []);
        }
        
        setError(null);
      } catch (error: any) {
        console.error('Failed to fetch data:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
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
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 space-y-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations?.length === 0 ? (
          <>
            {allUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No users available
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {allUsers
                  .filter(user => 
                    `${user.firstName} ${user.lastName}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => onSelectUser(user.id)}
                      className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                        selectedUserId === user.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="relative">
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Click to start a conversation
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </>
        ) : (
          conversations
            .filter(conversation =>
              `${conversation.user.firstName} ${conversation.user.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((conversation) => (
            <button
              key={conversation.user.id}
              onClick={() => onSelectUser(conversation.user.id)}
              className={`w-full p-4 flex items-start space-x-4 hover:bg-gray-50 transition-colors ${
                selectedUserId === conversation.user.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative">
                {conversation.user.avatar ? (
                  <Image
                    src={conversation.user.avatar}
                    alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg text-gray-600">
                      {conversation.user.firstName[0]}
                      {conversation.user.lastName[0]}
                    </span>
                  </div>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">
                    {conversation.user.firstName} {conversation.user.lastName}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.fromMe ? 'You: ' : ''}
                    {conversation.lastMessage.message}
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}