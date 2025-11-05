import { useEffect, useState } from 'react';

interface Court {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  currentBooking?: {
    user: string;
    endTime: string;
  };
}

export function CourtStatus() {
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    // TODO: Fetch real court data
    const mockCourts: Court[] = [
      { id: '1', name: 'Court 1', status: 'available' },
      { id: '2', name: 'Court 2', status: 'occupied', currentBooking: { user: 'John Doe', endTime: '14:30' } },
      { id: '3', name: 'Court 3', status: 'maintenance' },
      { id: '4', name: 'Court 4', status: 'available' },
    ];
    setCourts(mockCourts);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Court Status</h2>
      <div className="space-y-4">
        {courts.map((court) => (
          <div
            key={court.id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
          >
            <div>
              <h3 className="font-medium text-gray-900">{court.name}</h3>
              {court.currentBooking && (
                <p className="text-sm text-gray-500">
                  Booked by {court.currentBooking.user} until {court.currentBooking.endTime}
                </p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                court.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : court.status === 'occupied'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}