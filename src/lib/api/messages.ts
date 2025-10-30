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
  timestamp: string;
  createdAt?: string;
  read: boolean;
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

export async function fetchMessages(userId: string, token: string): Promise<Message[]> {
  try {
    console.log(`Fetching messages for user ${userId}...`);
    const response = await api.get(`/messages/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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
  conversationId: number,
  content: string
): Promise<Message> {
  try {
    console.log(`Sending message to conversation ${conversationId}...`);
    const response = await api.post(`/messages/${conversationId}`, { content });
    console.log('Send message response:', response.data);
    return response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    console.error('Failed to send message:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
    throw new Error(axiosError.response?.data?.error || 'Failed to send message');
  }
}