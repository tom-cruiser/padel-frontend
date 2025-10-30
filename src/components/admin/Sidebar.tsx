import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/courts', label: 'Courts', icon: '🏟️' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      <nav className="flex flex-col flex-1 pt-6">
        {menuItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                isActive ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : ''
              }`}
            >
              <span className="text-xl mr-3">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 p-6 border-t border-gray-200">
        <Link
          href="/dashboard"
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <span className="text-xl mr-3">🏠</span>
          <span className="text-sm font-medium">Back to App</span>
        </Link>
      </div>
    </div>
  );
}