'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { Toaster } from 'react-hot-toast';

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>{children}</SocketProvider>
    </AuthProvider>
  );
}

export default function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </ClientProviders>
  );
}