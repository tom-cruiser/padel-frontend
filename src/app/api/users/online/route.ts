import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// Consider a user online if they've been active in the last 5 minutes
const ONLINE_THRESHOLD_MINUTES = 5;

export async function GET(request: Request) {
  try {
    const currentUser = await getAuthUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const onlineThreshold = new Date();
    onlineThreshold.setMinutes(onlineThreshold.getMinutes() - ONLINE_THRESHOLD_MINUTES);

    const onlineUsers = await prisma.user.findMany({
      where: {
        AND: [
          { lastSeen: { gte: onlineThreshold } },
          { id: { not: currentUser.id } }, // Exclude current user
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        lastSeen: true,
      },
      orderBy: {
        lastSeen: 'desc',
      },
    });

    return NextResponse.json({ users: onlineUsers });
  } catch (error) {
    console.error('Get online users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch online users' },
      { status: 500 }
    );
  }
}