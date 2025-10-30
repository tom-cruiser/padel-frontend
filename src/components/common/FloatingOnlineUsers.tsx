'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getOnlineUsers } from '@/app/actions/users';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, Users, X, MessageSquare } from 'lucide-react';

interface OnlineUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  lastSeen: string;
}

export function FloatingOnlineUsers() {
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching online users...');
        const result = await getOnlineUsers();
        console.log('Online users response:', result);
        if ('error' in result) {
          throw new Error(result.error);
        }
        setOnlineUsers(result.users);
      } catch (error: any) {
        console.error('Error fetching online users:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to fetch online users');
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Online Users ({onlineUsers.length})
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="space-y-4 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : onlineUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No users online</div>
            ) : (
              <div className="space-y-2">
                {onlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {onlineUser.avatar ? (
                        <Image
                          src={onlineUser.avatar}
                          alt={`${onlineUser.firstName} ${onlineUser.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg text-gray-600">
                            {onlineUser.firstName[0]}
                            {onlineUser.lastName[0]}
                          </span>
                        </div>
                      )}
                      <Badge
                        variant="success"
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full p-0"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {onlineUser.firstName} {onlineUser.lastName}
                      </span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  <Link href={`/messages/${onlineUser.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
              </div>
            )}
          </ScrollArea>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <div className="relative">
            <Users className="w-6 h-6" />
            {onlineUsers.length > 0 && (
              <Badge
                variant="success"
                className="absolute -top-2 -right-2 min-w-[20px] h-5"
              >
                {onlineUsers.length}
              </Badge>
            )}
          </div>
        </Button>
      )}
    </div>
  );
}