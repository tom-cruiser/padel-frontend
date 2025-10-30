'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Court {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  user: User;
  court: Court;
  date: string;
  startTime: number;
  endTime: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function useBookings(startDate: Date | null, endDate: Date | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams();
        
        if (startDate) {
          queryParams.set('startDate', format(startDate, 'yyyy-MM-dd'));
        }
        if (endDate) {
          queryParams.set('endDate', format(endDate, 'yyyy-MM-dd'));
        }

        const response = await fetch(`/api/admin/bookings?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data.bookings);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [startDate, endDate]);

  return { bookings, isLoading, error };
}