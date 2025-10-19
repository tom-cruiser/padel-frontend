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
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: string;
}

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string, userData: { firstName: string; lastName: string; role: string }): Socket {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      // Register user as online
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

    return this.socket;
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

  // Send a message to another user
  sendMessage(toUserId: string, message: string, fromUserId: string): void {
    if (this.socket) {
      this.socket.emit('message:send', {
        fromUserId,
        toUserId,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Listen for new messages
  onMessage(callback: (message: ChatMessage) => void): void {
    if (this.socket) {
      this.socket.on('message:receive', callback);
    }
  }

  // Listen for message sent confirmation
  onMessageSent(callback: (message: ChatMessage) => void): void {
    if (this.socket) {
      this.socket.on('message:sent', callback);
    }
  }

  // Listen for online users updates
  onOnlineUsers(callback: (users: OnlineUser[]) => void): void {
    if (this.socket) {
      this.socket.on('users:online', callback);
    }
  }

  // Listen for new notifications
  onNotification(callback: (notification: any) => void): void {
    if (this.socket) {
      this.socket.on('notification:new', callback);
    }
  }

  // Listen for booking events
  onBookingCreated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('booking:created', callback);
    }
  }

  onBookingCancelled(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('booking:cancelled', callback);
    }
  }

  // Remove listeners
  removeListeners(): void {
    if (this.socket) {
      this.socket.off('message:receive');
      this.socket.off('message:sent');
      this.socket.off('users:online');
      this.socket.off('notification:new');
      this.socket.off('booking:created');
      this.socket.off('booking:cancelled');
    }
  }
}

export const socketService = new SocketService();

