'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ExportBookings from '@/components/admin/ExportBookings';
import { getAllBookings } from '@/lib/api/bookings';
import { useToast } from '@/hooks/useToast';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const toast = useToast();

  useEffect(() => {
    fetchBookings();
  }, [dateRange]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) {
        params.append('startDate', format(dateRange.startDate, 'yyyy-MM-dd'));
      }
      if (dateRange.endDate) {
        params.append('endDate', format(dateRange.endDate, 'yyyy-MM-dd'));
      }

      const data = await getAllBookings(params.toString());
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <ExportBookings 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate}
          onError={(message) => toast.error(message)}
          onSuccess={(message) => toast.success(message)} 
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Booking History</h2>
          <div className="flex gap-4">
            <input
              type="date"
              className="border rounded px-3 py-2"
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value ? new Date(e.target.value) : null }))}
            />
            <input
              type="date"
              className="border rounded px-3 py-2"
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value) : null }))}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Court
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking: any) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.user.firstName} {booking.user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.court.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(booking.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.startTime}:00 - {booking.endTime}:00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings found for the selected period
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}