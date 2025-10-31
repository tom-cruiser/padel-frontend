'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiX, FiSend } from 'react-icons/fi';

type User = {
  id: string;
  name: string;
  email: string;
  online: boolean;
};

type Message = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
};

export default function ChatPopup({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch online users from your API
    // This is a placeholder
    setOnlineUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', online: true },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', online: true },
    ]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // TODO: Send message to your API
    // This is a placeholder
    const message = {
      id: Math.random().toString(),
      senderId: user?.id || '',
      recipientId: selectedUser.id,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <h3 className="font-semibold">
          {selectedUser ? selectedUser.name : 'Messages'}
        </h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Content */}
      {!selectedUser ? (
        // Users List
        <div className="h-96 overflow-y-auto p-4">
          {onlineUsers.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                {user.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Chat View
        <>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.id
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.senderId === user?.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <FiSend size={20} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}