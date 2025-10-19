'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle } from 'lucide-react';
import { profileService } from '@/services/api';

interface MembershipCardProps {
  profile: any;
}

export default function MembershipCard({ profile }: MembershipCardProps) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await profileService.getPayments();
      setPayments(data.slice(0, 5)); // Show last 5 payments
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const isExpiringSoon = () => {
    if (!profile.membershipExpiry) return false;
    const expiryDate = new Date(profile.membershipExpiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    if (!profile.membershipExpiry) return false;
    return new Date(profile.membershipExpiry) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Membership Status Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Membership Status</h3>
          <CheckCircle className="w-6 h-6" />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-blue-100 text-sm">Membership Type</p>
            <p className="text-2xl font-bold">{profile.membershipType || 'Standard'}</p>
          </div>

          {profile.joinDate && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-200" />
              <div>
                <p className="text-blue-100 text-xs">Member Since</p>
                <p className="font-medium">{new Date(profile.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {profile.membershipExpiry && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-200" />
              <div>
                <p className="text-blue-100 text-xs">Valid Until</p>
                <p className="font-medium">{new Date(profile.membershipExpiry).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {isExpiringSoon() && (
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-md p-3 mt-4">
              <p className="text-sm font-medium">Your membership expires soon!</p>
              <button className="mt-2 bg-white text-blue-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
                Renew Now
              </button>
            </div>
          )}

          {isExpired() && (
            <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-md p-3 mt-4">
              <p className="text-sm font-medium">Your membership has expired</p>
              <button className="mt-2 bg-white text-blue-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
                Renew Membership
              </button>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-blue-500">
          <p className="text-sm font-medium mb-3">Membership Benefits</p>
          <ul className="space-y-2 text-sm text-blue-100">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Priority court booking</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>10% discount on all bookings</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free access to tournaments</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Exclusive member events</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <CreditCard className="w-5 h-5 text-gray-400" />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{payment.method}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </p>
                  {payment.details && (
                    <p className="text-xs text-gray-400 mt-1">{payment.details}</p>
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  ${parseFloat(payment.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No payment history available</p>
        )}
      </div>
    </div>
  );
}
