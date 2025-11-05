'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CourtOccupancy {
  name: string;
  occupancyRate: number;
}

export function CourtOccupancy() {
  const [data, setData] = useState<CourtOccupancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real occupancy data from API
    const fetchOccupancy = async () => {
      try {
        // Mock data for now
        setData([
          { name: 'Court 1', occupancyRate: 85 },
          { name: 'Court 2', occupancyRate: 75 },
          { name: 'Court 3', occupancyRate: 90 },
          { name: 'Court 4', occupancyRate: 65 },
        ]);
      } catch (error) {
        console.error('Failed to fetch court occupancy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupancy();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading court occupancy data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Court Occupancy
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Occupancy rates for each court
        </p>
      </div>
      <div className="p-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Occupancy Rate']}
            />
            <Bar
              dataKey="occupancyRate"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}