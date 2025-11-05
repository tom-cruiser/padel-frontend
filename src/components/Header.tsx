'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      // Clear any client-side data
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-green-600">Padel Club de Bujumbura</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Home
            </Link>
            <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link href="/services" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              Services
            </Link>
            <Link href="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              Contact
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/messages" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <div className="relative">
                    Messages
                    <span className="absolute -top-2 -right-2 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                      {/* We'll add the unread count here later */}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  Book a Court
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;