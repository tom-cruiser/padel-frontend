import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from './prisma';

interface AuthResult {
  isAuthenticated: boolean;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PLAYER' | 'ADMIN';
  avatar: string | null;
  lastSeen: Date;
}

export async function auth(request: Request): Promise<AuthResult> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { isAuthenticated: false };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      isAuthenticated: true,
      userId: payload.sub as string
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { isAuthenticated: false };
  }
}

export async function getAuthUser(request: Request): Promise<User | null> {
  try {
    const authResult = await auth(request);
    if (!authResult.isAuthenticated || !authResult.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        lastSeen: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Get auth user error:', error);
    return null;
  }
}