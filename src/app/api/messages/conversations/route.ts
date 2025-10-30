import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// Get conversations list
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all unique users the current user has messaged with
    const sentMessages = await prisma.message.findMany({
      where: { fromUserId: user.id },
      select: { toUserId: true },
      distinct: ['toUserId'],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { toUserId: user.id },
      select: { fromUserId: true },
      distinct: ['fromUserId'],
    });

    const userIds = [
      ...new Set([
        ...sentMessages.map((m) => m.toUserId),
        ...receivedMessages.map((m) => m.fromUserId),
      ]),
    ];

    // Get user details and unread counts
    const conversations = await Promise.all(
      userIds.map(async (userId) => {
        const otherUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        });

        if (!otherUser) return null;

        const unreadCount = await prisma.message.count({
          where: {
            fromUserId: userId,
            toUserId: user.id,
            isRead: false,
          },
        });

        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { fromUserId: user.id, toUserId: userId },
              { fromUserId: userId, toUserId: user.id },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return {
          user: otherUser,
          unreadCount,
          lastMessage: lastMessage
            ? {
                message: lastMessage.message,
                timestamp: lastMessage.createdAt,
                fromMe: lastMessage.fromUserId === user.id,
              }
            : null,
        };
      })
    );

    // Filter out null values and sort by last message timestamp
    const validConversations = conversations
      .filter((conv): conv is NonNullable<typeof conv> => conv !== null)
      .sort((a, b) => {
        const aTime = a.lastMessage?.timestamp || new Date(0);
        const bTime = b.lastMessage?.timestamp || new Date(0);
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

    return NextResponse.json({ conversations: validConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}