'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  CalendarIcon, 
  BanknotesIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      name: 'Total Users',
      value: '0',
      change: '0%',
      changeType: 'increase',
      icon: UsersIcon,
    },
    {
      name: 'Active Bookings',
      value: '0',
      change: '0%',
      changeType: 'increase',
      icon: CalendarIcon,
    },
    {
      name: 'Revenue',
      value: '$0',
      change: '0%',
      changeType: 'increase',
      icon: BanknotesIcon,
    },
    {
      name: 'Court Utilization',
      value: '0%',
      change: '0%',
      changeType: 'increase',
      icon: ChartBarIcon,
    },
  ]);

  useEffect(() => {
    // TODO: Fetch real stats from API
    const fetchStats = async () => {
      try {
        // Mock data for now
        setStats([
          {
            name: 'Total Users',
            value: '2,451',
            change: '12.5%',
            changeType: 'increase',
            icon: UsersIcon,
          },
          {
            name: 'Active Bookings',
            value: '148',
            change: '8.2%',
            changeType: 'increase',
            icon: CalendarIcon,
          },
          {
            name: 'Revenue',
            value: '$24,500',
            change: '15.3%',
            changeType: 'increase',
            icon: BanknotesIcon,
          },
          {
            name: 'Court Utilization',
            value: '85%',
            change: '5.1%',
            changeType: 'increase',
            icon: ChartBarIcon,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className="absolute rounded-md bg-blue-500 p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {stat.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'increase'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {stat.changeType === 'increase' ? '↑' : '↓'}
              {stat.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}