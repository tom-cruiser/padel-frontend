'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Booking } from '@/types';
import Link from 'next/link';
import ExportBookings from '@/components/admin/ExportBookings';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        // Backend returns { bookings: Booking[] }
        const data = response.data && response.data.bookings ? response.data.bookings : response.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const cancelBooking = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">{user?.role === 'ADMIN' ? 'All Bookings' : 'Your Bookings'}</h1>

        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <ExportBookings
              onError={(msg) => alert(msg)}
              onSuccess={(msg) => console.log(msg)}
            />
          )}

          {/* Show New Booking button to all users, including admins */}
          <Link
            href="/booking"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            New Booking
          </Link>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No bookings found</p>
          {user?.role !== 'ADMIN' && <p className="mt-2">Book a court to get started!</p>}
        </div>
      ) : (
        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.court?.name ?? 'Court'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.user?.firstName} {booking.user?.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.date ? new Date(booking.date).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.startTime ?? ''} - {booking.endTime ?? ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/bookings/${booking.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                    {booking.status !== 'CANCELLED' && (
                      <button onClick={() => cancelBooking(booking.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}