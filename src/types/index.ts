export type UserRole = 'PLAYER' | 'ADMIN';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type NotificationType =
  | 'BOOKING_CONFIRMATION'
  | 'BOOKING_CANCELLATION'
  | 'WAIT_LIST_NOTIFICATION'
  | 'ADMIN_MESSAGE'
  | 'REMINDER';

export type RecurrenceType = 'NONE' | 'WEEKLY' | 'MONTHLY';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  preferredCourt?: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Court {
  id: string;
  name: string;
  color: string;
  description?: string;
  openingTime: number;
  closingTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  date: string;
  startTime: number;
  endTime: number;
  status: BookingStatus;
  recurrenceType: RecurrenceType;
  recurrenceEndDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: Partial<User>;
  court?: Court;
}

export interface WaitList {
  id: string;
  userId: string;
  courtId: string;
  date: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  user?: Partial<User>;
  court?: Court;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: Partial<User>;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  details?: any;
}
