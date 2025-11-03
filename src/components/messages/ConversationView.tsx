'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { socketService } from '@/lib/socket';
import { fetchMessages, getUserDetails, markMessagesAsRead, Message } from '@/lib/api/messages';

interface ConversationViewProps {
  userId: string;
}

export function ConversationView({ userId }: ConversationViewProps) {
  const { user, getAccessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch data for conversation');
        const token = getAccessToken();
        if (!token) {
          console.error('Authentication token missing');
          throw new Error('No authentication token found');
        }

  console.log('Fetching messages...');
  const fetchedMessages = await fetchMessages(userId);
        
        // Extract user details from the first message's sender information
        const otherUserDetails = fetchedMessages.find(msg => msg.fromUserId === userId)?.sender;
        
        // Set the fetched messages
        setMessages(fetchedMessages.map((msg: Message) => ({
          ...msg,
          status: 'sent' as const
        })));
        
        // Set other user details if available
        if (otherUserDetails) {
          setOtherUser(otherUserDetails);
        }
        
        console.log('Successfully fetched data:', {
          messagesCount: fetchedMessages?.length,
          userData: otherUserDetails?.id
        });

        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    const markAsRead = async () => {
      try {
        await markMessagesAsRead(userId);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    };

    fetchData();
    markAsRead();

    // Connect to socket if user is authenticated
    if (user?.id) {
      // Initialize socket connection
      const socket = socketService.connect(user.id, {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });

      socket.on('message:receive', (message: Message) => {
        console.log('Received message:', message);
        if ((message.fromUserId === userId && message.toUserId === user.id) || 
            (message.fromUserId === user.id && message.toUserId === userId)) {
          setMessages(prev => {
            // Check if message already exists
            const exists = prev.some(m => m.id === message.id);
            if (!exists) {
              const newMessage: Message = {
                ...message,
                status: 'sent' as const,
                isRead: message.fromUserId === userId ? false : true
              };
              if (message.fromUserId === userId) {
                markAsRead();
              }
              scrollToBottom();
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      });

      // Listen for typing events
      socket.on('user:typing', (data: { userId: string }) => {
        if (data.userId === userId) {
          setIsTyping(true);
          // Clear previous timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          // Set new timeout
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      });
    }

    return () => {
      socketService.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;

    try {
      // Add optimistic message
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        message: newMessage,
        fromUserId: user.id,
        toUserId: userId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        isRead: false,
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Send message through socket
      const sentMessage = await socketService.sendMessage(userId, newMessage, user.id);
      
      // Update the message status without replacing the entire message
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? {
          ...msg,
          id: sentMessage.id || msg.id,
          status: 'sent',
          timestamp: sentMessage.timestamp
        } : msg
      ));
      
      setError(null);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
      
      // Remove failed message from the list
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
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

  return (
    <>
      <div className="p-4 border-b border-gray-200 flex items-center space-x-4">
        {otherUser && (
          <>
            <div className="relative">
              {otherUser.avatar ? (
                <Image
                  src={otherUser.avatar}
                  alt={`${otherUser.firstName} ${otherUser.lastName}`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg text-gray-600">
                    {otherUser.firstName[0]}
                    {otherUser.lastName[0]}
                  </span>
                </div>
              )}
              {otherUser.lastSeen && otherUser.lastSeen instanceof Date && (
                new Date().getTime() - new Date(otherUser.lastSeen).getTime() < 300000
              ) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {otherUser.firstName} {otherUser.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                {isTyping ? (
                  <span className="text-blue-600">typing...</span>
                ) : otherUser.lastSeen && !isNaN(new Date(otherUser.lastSeen).getTime()) ? (
                  `last seen ${formatDistanceToNow(new Date(otherUser.lastSeen), { addSuffix: true })}`
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 animate-fade-in">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start transition-all duration-200 ease-in-out ${
                message.fromUserId === user?.id ? 'flex-row-reverse justify-start' : 'justify-end'
              } mb-3`}
            >
              <div className={`flex flex-col max-w-[70%] ${message.fromUserId === user?.id ? 'ml-auto' : 'mr-auto'}`}>
                <div
                  className={`rounded-2xl px-4 py-2 shadow-sm mx-2 ${
                    message.fromUserId === user?.id
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{message.message}</p>
                </div>
                <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                  message.fromUserId === user?.id ? 'justify-end' : 'justify-start'
                }`}>
                  <span>
                    {message.createdAt 
                      ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
                      : 'Just now'}
                  </span>
                  {message.fromUserId === user?.id && (
                    <span className="ml-2">
                      {message.status === 'pending' && '🕒'}
                      {message.status === 'sent' && '✓'}
                      {message.status === 'error' && '❌'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              // Emit typing event
              socketService.getSocket()?.emit('user:typing', { toUserId: userId });
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Press Enter to send, Shift + Enter for new line
        </div>
      </form>
    </>
  );
}