import api from '@/lib/api';

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
  unreadCount: number;
  lastMessage: {
    message: string;
    timestamp: string;
    fromMe: boolean;
  } | null;
}

// Get conversation with a user
export const getConversation = async (userId: string, limit = 50, offset = 0): Promise<Message[]> => {
  const response = await api.get(`/messages/conversation/${userId}`, {
    params: { limit, offset },
  });
  return response.data.messages;
};

// Get all conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/messages/conversations');
  return response.data.conversations;
};

// Send a message
export const sendMessage = async (toUserId: string, message: string): Promise<Message> => {
  const response = await api.post('/messages', { toUserId, message });
  return response.data.data;
};

// Get unread message count
export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/messages/unread-count');
  return response.data.unreadCount;
};

// Mark messages from a user as read
export const markMessagesAsRead = async (userId: string): Promise<void> => {
  await api.patch(`/messages/read/${userId}`);
};

// Delete a message
export const deleteMessage = async (messageId: string): Promise<void> => {
  await api.delete(`/messages/${messageId}`);
};
