'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, getAccessToken } = useAuth();

  useEffect(() => {
    if (user) {
      const token = getAccessToken();
      if (!token) return;

      const newSocket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        setIsConnected(true);
        newSocket.emit('user:online', {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, getAccessToken]);

  const value = React.useMemo(() => ({
    socket,
    isConnected,
  }), [socket, isConnected]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}