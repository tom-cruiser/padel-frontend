'use client';

import api from '@/lib/api';

export async function getOnlineUsers() {
  try {
    const { data } = await api.get('/users/online');
    return { users: data.users };
  } catch (error) {
    console.error('Get online users error:', error);
    return { error: 'Failed to fetch online users' };
  }
}

export async function updateLastSeen() {
  try {
    // Call backend endpoint which will validate the user from cookies/session
    const res = await api.post('/users/update-last-seen');
    return res.data;
  } catch (error) {
    console.error('Update last seen error:', error);
    return { error: 'Failed to update last seen' };
  }
}