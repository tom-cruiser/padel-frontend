import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export interface OnlineUser {
  userId: string;
  socketId: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ChatMessage {
  id?: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  isRead?: boolean;
  status?: 'pending' | 'sent' | 'error';
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export class SocketService {
  private socket: Socket | null = null;

  connect(userId: string, userData: { firstName: string; lastName: string; role: string }): Socket {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      query: { userId },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.socket?.emit('user:online', {
        userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    // Handle online users updates
    this.socket.on('users:online_list', (onlineUsers: OnlineUser[]) => {
      console.log('Online users updated:', onlineUsers);
    });

    return this.socket;
  }

  getOnlineUsers(): Promise<OnlineUser[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('users:get_online');
      this.socket.once('users:online_list', (users: OnlineUser[]) => {
        resolve(users);
      });

      // Add timeout
      setTimeout(() => {
        reject(new Error('Get online users timeout'));
      }, 5000);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  sendMessage(toUserId: string, message: string, fromUserId: string): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timeoutId = setTimeout(() => {
        this.socket?.off('message:sent');
        this.socket?.off('message:error');
        reject(new Error('Message send timeout'));
      }, 5000);

      const handleMessageSent = (sentMessage: ChatMessage) => {
        clearTimeout(timeoutId);
        this.socket?.off('message:sent', handleMessageSent);
        this.socket?.off('message:error', handleMessageError);
        resolve(sentMessage);
      };

      const handleMessageError = (error: any) => {
        clearTimeout(timeoutId);
        this.socket?.off('message:sent', handleMessageSent);
        this.socket?.off('message:error', handleMessageError);
        reject(new Error(error.message || 'Failed to send message'));
      };

      this.socket.on('message:sent', handleMessageSent);
      this.socket.on('message:error', handleMessageError);

      this.socket.emit('message:send', {
        fromUserId,
        toUserId,
        message,
        timestamp: new Date().toISOString(),
      });
    });
  }
}

export const socketService = new SocketService();
