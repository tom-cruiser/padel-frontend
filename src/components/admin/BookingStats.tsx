import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 'Mon', bookings: 24 },
  { day: 'Tue', bookings: 18 },
  { day: 'Wed', bookings: 32 },
  { day: 'Thu', bookings: 27 },
  { day: 'Fri', bookings: 45 },
  { day: 'Sat', bookings: 56 },
  { day: 'Sun', bookings: 42 },
];

export function BookingStats() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // TODO: Fetch real booking stats
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Bookings</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}