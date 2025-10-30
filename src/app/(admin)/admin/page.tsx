'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/admin/Card';
import { BookingStats } from '@/components/admin/BookingStats';
import { RecentBookings } from '@/components/admin/RecentBookings';
import { CourtStatus } from '@/components/admin/CourtStatus';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalCourts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // TODO: Fetch dashboard stats
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📅"
          trend="+12%"
        />
        <Card
          title="Active Bookings"
          value={stats.activeBookings}
          icon="🎾"
          trend="+5%"
        />
        <Card
          title="Available Courts"
          value={stats.totalCourts}
          icon="🏟️"
          trend="0%"
        />
        <Card
          title="Revenue"
          value={`$${stats.totalRevenue}`}
          icon="💰"
          trend="+8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingStats />
        <CourtStatus />
      </div>

      <RecentBookings />
    </div>
  );
}