'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaBell,
  FaUserCog,
  FaChartBar,
} from 'react-icons/fa';

interface NavItem {
  name: string;
  href: string;
  icon: IconType;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: FaHome },
  { name: 'Bookings', href: '/bookings', icon: FaCalendarAlt },
  { name: 'Courts', href: '/courts', icon: FaUsers },
  { name: 'Messages', href: '/messages', icon: FaEnvelope },
  { name: 'Notifications', href: '/notifications', icon: FaBell },
  { name: 'Profile', href: '/profile', icon: FaUserCog },
  { 
    name: 'Admin', 
    href: '/admin/dashboard', 
    icon: FaChartBar,
    roles: ['ADMIN'] 
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
          <h1 className="text-2xl font-bold text-white">Padel Courts</h1>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 h-6 w-6 flex-shrink-0`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}