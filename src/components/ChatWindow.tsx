'use client';

import { useState, useEffect, useRef } from 'react';
import { socketService, type ChatMessage, type OnlineUser } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { getConversation, markMessagesAsRead } from '@/services/message';

interface ChatWindowProps {
  recipient: OnlineUser;
  onClose: () => void;
  embedded?: boolean; // For full-page chat vs floating window
}

export default function ChatWindow({ recipient, onClose, embedded = false }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Scroll handling
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  // Check if scrolled to bottom
  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setIsAtBottom(atBottom);
      if (atBottom) {
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages]);

  // Load message history when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      if (!recipient?.userId || !user?.id) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const history = await getConversation(recipient.userId);
        
        // Convert to ChatMessage format with proper typing
        const chatMessages: ChatMessage[] = history.map((msg: any) => ({
          id: msg.id,
          fromUserId: msg.fromUserId,
          toUserId: msg.toUserId,
          message: msg.message,
          timestamp: new Date(msg.createdAt).toISOString(),
          status: 'sent',
          sender: msg.sender || {
            id: msg.fromUserId,
            firstName: msg.fromUserId === user.id ? user.firstName : recipient.firstName,
            lastName: msg.fromUserId === user.id ? user.lastName : recipient.lastName,
            role: msg.fromUserId === user.id ? user.role : recipient.role
          }
        }));
        
        setMessages(chatMessages);
        
        // Mark messages as read
        await markMessagesAsRead(recipient.userId);
        
        // Scroll to bottom on initial load
        setTimeout(() => scrollToBottom('auto'), 100);
      } catch (error) {
        console.error('Failed to load message history:', error);
        setError('Failed to load messages. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [recipient?.userId, user?.id]);

  // Listen for incoming messages and message status updates
  useEffect(() => {
    const handleNewMessage = (message: ChatMessage) => {
      // Only add messages from this conversation
      if (
        (message.fromUserId === recipient.userId && message.toUserId === user?.id) ||
        (message.fromUserId === user?.id && message.toUserId === recipient.userId)
      ) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some((m) => 
            (m.timestamp === message.timestamp && m.fromUserId === message.fromUserId) ||
            (m.id && m.id === message.id)
          );
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    const handleMessageStatus = (updatedMessage: ChatMessage) => {
      setMessages((prev) => prev.map((msg) => 
        msg.fromUserId === updatedMessage.fromUserId && 
        msg.timestamp === updatedMessage.timestamp
          ? { ...msg, status: updatedMessage.status }
          : msg
      ));
    };

    socketService.onMessage(handleNewMessage);
    socketService.onMessageSent(handleMessageStatus);

    // Cleanup listener on unmount
    return () => {
      socketService.removeListeners();
    };
  }, [recipient.userId, user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user) return;
    setError(null);
    
    // Generate a temporary ID for the message
    const tempId = `temp-${Date.now()}`;
    const trimmedMessage = messageText.trim();
    
    // Clear input early for better UX
    setMessageText('');
    
    // Ensure socket is connected
    if (!socketService.getSocket()?.connected) {
      try {
        socketService.connect(user.id, {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
        
        // Wait for connection with timeout
        await Promise.race([
          new Promise((resolve) => {
            const socket = socketService.getSocket();
            if (socket?.connected) {
              resolve(true);
            } else {
              socket?.once('connect', () => resolve(true));
            }
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          )
        ]);
      } catch (error) {
        console.error('Socket connection error:', error);
        setError('Failed to connect to chat server. Please check your connection.');
        // Restore the message text
        setMessageText(trimmedMessage);
        return;
      }
    }

    setIsSending(true);
    
    try {
      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: tempId,
        fromUserId: user.id,
        toUserId: recipient.userId,
        message: trimmedMessage,
        timestamp: new Date().toISOString(),
        status: 'pending',
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };

      // Add to UI immediately with pending state
      const messageId = Date.now().toString();
      setMessages((prev) => [...prev, { ...optimisticMessage, id: messageId }]);
      
      // Clear input early for better UX
      setMessageText('');
      
      // Send via socket and wait for confirmation
      const confirmedMessage = await socketService.sendMessage(
        recipient.userId,
        trimmedMessage,
        user.id
      );
      
      // Update the message status to sent
      setMessages((prev) => prev.map((msg) => 
        msg.id === messageId ? { ...confirmedMessage, status: 'sent' } : msg
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Show error in UI
      setMessages((prev) => prev.filter((msg) => msg.status !== 'pending'));
      
      // Restore the message text so user can try again
      setMessageText(trimmedMessage);
      
      // Show error toast or feedback
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      alert(errorMessage); // Replace with your toast/notification system
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, 'HH:mm');
      } else {
        return format(date, 'MMM dd, HH:mm');
      }
    } catch {
      return '';
    }
  };

  return (
    <div className={`${
      embedded 
        ? 'w-full h-full bg-white flex flex-col' 
        : 'fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200'
    }`}>
      {/* Header */}
      <div className={`bg-primary-600 text-white px-4 py-3 ${embedded ? '' : 'rounded-t-lg'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <div>
            <h3 className="font-semibold">
              {recipient.firstName} {recipient.lastName}
            </h3>
            <p className="text-xs text-primary-100">{recipient.role}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm italic">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.fromUserId === user?.id;
            return (
              <div
                key={`${msg.timestamp}-${index}`}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <div className="flex items-center gap-1">
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </p>
                    {isOwnMessage && (
                      <span className="text-xs mt-1">
                        {msg.status === 'pending' ? (
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : msg.status === 'sent' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : msg.status === 'error' ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : null}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 bg-white border-t border-gray-100 ${embedded ? '' : 'rounded-b-lg'}`}>
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-2 rounded-lg text-xs mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder-gray-400"
            disabled={isSending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
            <span className={`text-xs ${
              messageText.length > 450 ? 'text-amber-500' : 'text-gray-400'
            }`}>
              {messageText.length}/500
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
