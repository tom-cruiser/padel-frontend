import { api } from './api';

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  date: string;
  startTime: number;
  endTime: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  user: {
    firstName: string;
    lastName: string;
  };
  court: {
    name: string;
  };
}

export async function getAllBookings(queryString?: string): Promise<Booking[]> {
  try {
    const url = `/admin/bookings${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
}