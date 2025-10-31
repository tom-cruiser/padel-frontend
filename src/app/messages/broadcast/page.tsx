'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function BroadcastPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading || !user || user.role !== 'ADMIN') {
      router.push('/messages');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Broadcast Message</h1>
      {/* Broadcast form will go here */}
    </div>
  );
}