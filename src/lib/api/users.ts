import { api } from './api';
import { User } from '@/types';

export async function getAllUsers(): Promise<User[]> {
  try {
    console.log('Making request to fetch users...');
    const token = localStorage.getItem('accessToken');
    console.log('Using token:', token ? 'Present' : 'Missing');
    
    const response = await api.get('/api/users');
    console.log('API Response:', response.data);
    
    if (!response.data.users || !Array.isArray(response.data.users)) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
    
    return response.data.users;
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