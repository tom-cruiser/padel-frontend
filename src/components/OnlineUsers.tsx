'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import { OnlineUser, User } from '@/types/user';
import { FiUsers, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function OnlineUsers() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socketInitialized, setSocketInitialized] = useState(false);
  const socketRef = useRef<Socket>();

  // Debug logging
  useEffect(() => {
    console.log('Socket URL:', process.env.NEXT_PUBLIC_SOCKET_URL);
    console.log('User:', user);
  }, [user]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    try {
      console.log('Initializing socket connection...');
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully');
        setSocketInitialized(true);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Could not connect to real-time service');
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
      toast.error('Could not initialize real-time service');
    }

    if (socketRef.current && socketInitialized && user) {
      // Join user's room
      socketRef.current.emit('join', user.id);
      socketRef.current.emit('online', user.id);

      // Listen for online/offline status
      socketRef.current.on('user_online', (userId: string) => {
        console.log('User online:', userId);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isOnline: true } : user
          )
        );
        toast.success('A user has come online');
      });

      socketRef.current.on('user_offline', (userId: string) => {
        console.log('User offline:', userId);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isOnline: false } : user
          )
        );
      });
    }

    return () => {
      if (socketRef.current && user) {
        socketRef.current.emit('offline', user.id);
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Fetch online users
  useEffect(() => {
    if (!user) return;

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
  }, [isOpen, user]);

  // Toggle online users list
  const toggleOnlineUsers = () => {
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Online Users Button */}
      <button
        onClick={toggleOnlineUsers}
        className="fixed bottom-4 right-4 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all z-40 flex items-center justify-center"
        title="View online users"
      >
        <div className="relative">
          <FiUsers size={24} />
          {users.filter(user => user.isOnline).length > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {users.filter(user => user.isOnline).length}
            </div>
          )}
        </div>
      </button>

      {/* Online Users Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-700">Online Users</h3>
            <button
              onClick={toggleOnlineUsers}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">{error}</div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-500">No users available</div>
              ) : (
                <ul className="space-y-2">
                  {users.map((user) => (
                    <li key={user.id} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="flex-1">{user.name}</span>
                      <span className={`text-sm ${user.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}