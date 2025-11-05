'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import OnlineUsersButton from './OnlineUsersButton';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export default function MessagesClient() {
  const { user } = useAuth();
  const socketContext = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Monitor socket connection
  useEffect(() => {
    if (!socketContext.socket || !socketContext.isConnected) {
      console.log('Waiting for socket connection...');
    }
  }, [socketContext]);

  useEffect(() => {
    if (!user || !socketContext.socket) {
      setLoading(false);
      return;
    }

    // Listen for new messages
    socketContext.socket.on('message:received', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage]);
    });

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch messages');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      socketContext.socket?.off('message:received');
    };
  }, [user, socketContext.socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        {!messages ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">No messages yet</p>
            <p className="mt-2">Start a conversation with someone!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg max-w-2xl ${
                  message.senderId === user?.id
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-sm mt-1 opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
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