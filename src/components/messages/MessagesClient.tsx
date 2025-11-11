'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import OnlineUsersButton from './OnlineUsersButton';
import { getConversations } from '@/services/message';

interface Message {
  id: string;
  message: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  userId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesClient() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Monitor socket connection
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('Socket status:', { socket: !!socket, isConnected });
    } else {
      console.log('✅ Socket connected and ready');
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Listen for new messages if socket is available
    if (socket) {
      socket.on('message:receive', (newMessage: Message) => {
        console.log('📨 New message received:', newMessage);
        // Refresh conversations when new message arrives
        fetchConversations();
      });

      socket.on('message:sent', (sentMessage: Message) => {
        console.log('✅ Message sent confirmation:', sentMessage);
        // Refresh conversations when message is sent
        fetchConversations();
      });
    }

    // Fetch initial conversations
    const fetchConversations = async () => {
      try {
        console.log('🔍 Fetching conversations...');
        const data = await getConversations();
        console.log('📋 Conversations fetched:', data);
        setConversations(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('❌ Failed to fetch conversations:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch conversations');
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    return () => {
      if (socket) {
        socket.off('message:receive');
        socket.off('message:sent');
      }
    };
  }, [user, socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading messages</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        {/* Socket Connection Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-xl font-medium">No conversations yet</p>
            <p className="mt-2">Click the chat button to start messaging with online users!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
            {conversations.map((conversation: any) => (
              <div
                key={conversation.userId || conversation.id}
                className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {conversation.firstName && conversation.lastName 
                        ? `${conversation.firstName} ${conversation.lastName}`
                        : conversation.name || 'Unknown User'
                      }
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  <div className="text-right">
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {conversation.lastMessageTime && new Date(conversation.lastMessageTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Online Users Floating Button */}
      <OnlineUsersButton />
    </>
  );
}