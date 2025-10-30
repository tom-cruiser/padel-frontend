import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// Update user's last seen timestamp
export async function middleware(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (user) {
      // Update lastSeen only for API routes and page loads
      if (
        request.url.includes('/api/') ||
        (!request.url.includes('/_next/') &&
          !request.url.includes('/favicon.ico'))
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSeen: new Date() },
        });
      }
    }
  } catch (error) {
    console.error('Update last seen error:', error);
  }

  return NextResponse.next();
}

// Only run middleware for API routes and page loads
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};