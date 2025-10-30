import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useUpdateLastSeen() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const updateLastSeen = async () => {
      try {
        await fetch('/api/users/update-last-seen', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to update last seen:', error);
      }
    };

    // Update immediately
    updateLastSeen();

    // Then update every minute
    const interval = setInterval(updateLastSeen, 60000);

    return () => clearInterval(interval);
  }, [user]);
}