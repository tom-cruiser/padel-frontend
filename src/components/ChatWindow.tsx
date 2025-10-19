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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load message history when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      if (!recipient?.userId || !user?.id) return;
      
      setIsLoading(true);
      try {
        const history = await getConversation(recipient.userId);
        
        // Convert to ChatMessage format
        const chatMessages: ChatMessage[] = history.map((msg: any) => ({
          fromUserId: msg.fromUserId,
          toUserId: msg.toUserId,
          message: msg.message,
          timestamp: msg.createdAt,
        }));
        
        setMessages(chatMessages);
        
        // Mark messages as read
        await markMessagesAsRead(recipient.userId);
      } catch (error) {
        console.error('Failed to load message history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [recipient?.userId, user?.id]);

  // Listen for incoming messages
  useEffect(() => {
    const handleNewMessage = (message: ChatMessage) => {
      // Only add messages from this conversation
      if (
        (message.fromUserId === recipient.userId && message.toUserId === user?.id) ||
        (message.fromUserId === user?.id && message.toUserId === recipient.userId)
      ) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some((m) => m.timestamp === message.timestamp && m.fromUserId === message.fromUserId);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    socketService.onMessage(handleNewMessage);

    // Cleanup listener on unmount
    return () => {
      socketService.removeListeners();
    };
  }, [recipient.userId, user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user) return;

    setIsSending(true);
    
    try {
      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        fromUserId: user.id,
        toUserId: recipient.userId,
        message: messageText.trim(),
        timestamp: new Date().toISOString(),
      };

      // Add to UI immediately
      setMessages((prev) => [...prev, optimisticMessage]);
      
      // Send via socket
      socketService.sendMessage(recipient.userId, messageText.trim(), user.id);
      
      // Clear input
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
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
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className={`p-4 bg-white border-t border-gray-200 ${embedded ? '' : 'rounded-b-lg'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            disabled={isSending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            {isSending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {messageText.length}/500
        </p>
      </form>
    </div>
  );
}
