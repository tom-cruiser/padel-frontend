'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/api';
import { Booking } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const bookingsData = await bookingService.getMyBookings();
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to cancel booking';
      toast.error(message);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      CONFIRMED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      CANCELLED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();

    if (filter === 'upcoming') {
      return bookingDate >= now && booking.status !== 'CANCELLED';
    } else if (filter === 'past') {
      return bookingDate < now || booking.status === 'CANCELLED';
    }
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 My Bookings</h1>
              <p className="text-sm text-gray-600">View and manage your court reservations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/booking')}
                className="btn btn-primary"
              >
                + New Booking
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-secondary"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming ({bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'CANCELLED').length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Past ({bookings.filter(b => new Date(b.date) < new Date() || b.status === 'CANCELLED').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet."
                : filter === 'upcoming'
                ? "You don't have any upcoming bookings."
                : "You don't have any past bookings."}
            </p>
            <button
              onClick={() => router.push('/booking')}
              className="btn btn-primary"
            >
              Book Your First Court
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: booking.court?.color || '#3B82F6' }}
                      ></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.court?.name || 'Court'}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">📅 Date:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {format(new Date(booking.date), 'MMMM dd, yyyy')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">⏰ Time:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {booking.startTime}:00 - {booking.endTime}:00
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">🔁 Type:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {booking.recurrenceType === 'NONE' ? 'One-time' : booking.recurrenceType}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-600">📝 Notes:</span>
                        <span className="ml-2 text-gray-700">{booking.notes}</span>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                      Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                    {booking.status === 'CONFIRMED' && new Date(booking.date) >= new Date() && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn btn-danger text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="btn btn-secondary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
