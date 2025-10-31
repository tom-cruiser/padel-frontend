import { api } from './api';
import { User } from '@/types';

export async function getAllUsers(): Promise<User[]> {
  try {
    console.log('Making request to fetch users...');
    const token = localStorage.getItem('accessToken');
    console.log('Using token:', token ? 'Present' : 'Missing');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    // Debug request configuration
    const config = {
      url: '/api/users',
      method: 'get',
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    };
    console.log('Request config:', config);
    
    const response = await api.get('/api/users');
    console.log('API Response:', response.data);
    
    // Handle both possible response formats
    const users = response.data.users || response.data;
    if (!Array.isArray(users)) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
    
    return users;
  } catch (error: any) {
    console.error('Error fetching users:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error; // Let the component handle the error
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}