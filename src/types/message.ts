export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  lastMessage: Message | null;
  unreadCount: number;
  user: {
    id: string;
    name: string;
    role: string;
  };
}