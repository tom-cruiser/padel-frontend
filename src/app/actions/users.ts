'use client';

import api from '@/lib/api';

const ONLINE_THRESHOLD_MINUTES = 5;

async function getAuthUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.sub as string;
  } catch (error) {
    return null;
  }
}

export async function getOnlineUsers() {
  try {
    const { data } = await api.get('/users/online');
    return { users: data.users };

    const onlineUsers = await prisma.user.findMany({
      where: {
        AND: [
          { lastSeen: { gte: onlineThreshold } },
          { id: { not: currentUserId } },
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

    return { users: onlineUsers };
  } catch (error) {
    console.error('Get online users error:', error);
    return { error: 'Failed to fetch online users' };
  }
}

export async function updateLastSeen() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Update last seen error:', error);
    return { error: 'Failed to update last seen' };
  }
}