'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers } from '@/lib/api/users';
import { socketService } from '@/lib/socket';
import { User } from '@/types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface UsersListProps {
  onUserSelect: (userId: string) => void;
  selectedUserId: string | null;
}

export function UsersList({ onUserSelect, selectedUserId }: UsersListProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const allUsers = await getAllUsers();
        // Filter out current user
        const filteredUsers = allUsers.filter(u => u.id !== user.id);
        console.log('Users fetched:', filteredUsers);
        setUsers(filteredUsers);

        // Set up socket listener for online status
        const socket = socketService.getSocket();
        if (socket) {
          socket.emit('users:get_online');
          
          socket.on('users:online_list', (onlineUsersList: { userId: string }[]) => {
            setOnlineUsers(new Set(onlineUsersList.map(u => u.userId)));
          });
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // Poll for updates every minute
    const interval = setInterval(fetchUsers, 60000);
    return () => clearInterval(interval);
  }, [user]); // Only re-run if user changes

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

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Search input */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              {searchQuery ? 'No users found' : 'No users available'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
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
                  {onlineUsers.has(user.id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {user.role.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}