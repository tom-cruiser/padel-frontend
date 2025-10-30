'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/message';
import { OnlineUser, User } from '@/types/user';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function ChatList() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!session?.user) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '', {
      path: '/api/socketio',
    });

    // Join user's room
    socketRef.current.emit('join', session.user.id);
    socketRef.current.emit('online', session.user.id);

    // Listen for new messages
    socketRef.current.on('receive_message', (message: Message) => {
      if (selectedUser?.id === message.senderId) {
        setMessages((prev) => [...prev, message]);
        toast.success(`New message from ${selectedUser.name}`);
      }
    });

    // Listen for online/offline status
    socketRef.current.on('user_online', (userId: string) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isOnline: true } : user
        )
      );
    });

    socketRef.current.on('user_offline', (userId: string) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isOnline: false } : user
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('offline', session.user.id);
        socketRef.current.disconnect();
      }
    };
  }, [session]);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch online users
  useEffect(() => {
    if (!isOpen || !session?.user) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (response.ok) {
          setUsers(data.users.map((user: User) => ({ ...user, isOnline: false })));
        } else {
          setError(data.message || 'Failed to fetch users');
          toast.error('Could not load users');
        }
      } catch (err) {
        setError('Failed to fetch users');
        toast.error('Connection error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, session]);

  // Toggle chat list
  const toggleChatList = () => {
    setIsOpen(!isOpen);
  };

  // Handle user selection
  const handleUserSelect = async (selectedUser: OnlineUser) => {
    setSelectedUser(selectedUser);
    // Fetch chat history with selected user
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?userId=${selectedUser.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages);
      } else {
        setError(data.message || 'Failed to fetch messages');
        toast.error('Could not load messages');
      }
    } catch (err) {
      setError('Failed to fetch messages');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim() || !session?.user) return;

    try {
      setLoading(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          content: newMessage.trim(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
        // Emit new message event
        socketRef.current?.emit('new_message', data.message);
        toast.success('Message sent');
      } else {
        setError(data.message || 'Failed to send message');
        toast.error('Could not send message');
      }
    } catch (err) {
      setError('Failed to send message');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChatList}
        className="fixed bottom-4 left-4 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all z-40 flex items-center justify-center"
        title="Open chat"
      >
        <FiMessageCircle size={24} />
      </button>

      {/* Chat List Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 w-80 bg-white rounded-lg shadow-xl z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-700">Messages</h3>
            <button
              onClick={toggleChatList}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Users List or Chat View */}
          <div className="h-96 overflow-y-auto">
            {!selectedUser ? (
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 p-4">{error}</div>
                ) : users.length === 0 ? (
                  <div className="text-center text-gray-500">No users available</div>
                ) : (
                  <ul className="space-y-2">
                    {users.map((user) => (
                      <li key={user.id}>
                        <button
                          onClick={() => handleUserSelect(user)}
                          className="w-full text-left p-2 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                        >
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          <span>{user.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span className="font-medium">{selectedUser.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500 p-4">{error}</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet</div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === session.user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.senderId === session.user.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
