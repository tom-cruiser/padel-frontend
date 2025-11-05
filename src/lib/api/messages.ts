import api from '@/lib/api';
import { AxiosError } from 'axios';

export interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isOnline?: boolean;
  };
  unreadCount: number;
  lastMessage?: {
    message: string;
    timestamp: string;
    fromMe: boolean;
  };
}

export interface Message {
  id: string;
  message: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  isRead: boolean;
  status?: 'pending' | 'sent' | 'error';
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export async function fetchConversations(): Promise<Conversation[]> {
  try {
    console.log('Fetching conversations...');
    const response = await api.get('/messages/conversations');
    console.log('Conversations response:', response.data);
    return response.data.conversations;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Failed to fetch conversations:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
    throw new Error(
      axiosError.response?.data?.error || 'Failed to fetch conversations'
    );
  }
}

export async function fetchMessages(userId: string): Promise<Message[]> {
  try {
    console.log(`Fetching messages for user ${userId}...`);
    const response = await api.get(`/messages/conversation/${userId}`);
    console.log('Messages response:', response.data);
    return response.data.messages;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Failed to fetch messages:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
    throw new Error(
      axiosError.response?.data?.error || 'Failed to fetch messages'
    );
  }
}

export async function sendMessage(
  toUserId: string,
  message: string
): Promise<Message> {
  try {
    console.log(`Sending message to user ${toUserId}...`);
    const response = await api.post('/messages', { toUserId, message });
    console.log('Send message response:', response.data);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Failed to send message:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
    throw new Error(axiosError.response?.data?.error || 'Failed to send message');
  }
}

export async function getUserDetails(userId: string, token: string): Promise<any> {
  try {
    console.log(`Fetching user details for user ${userId}...`);
    const response = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('User details response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Failed to fetch user details:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
    throw new Error(
      axiosError.response?.data?.error || 'Failed to fetch user details'
    );
  }
}

export async function markMessagesAsRead(userId: string): Promise<void> {
  try {
    console.log(`Marking messages as read for user ${userId}...`);
    await api.patch(`/messages/read/${userId}`);
    console.log('Messages marked as read');
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Failed to mark messages as read:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
  }
}