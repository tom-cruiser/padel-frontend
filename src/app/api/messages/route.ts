import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get messages between current user and selected user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            fromUserId: session.user.id,
            toUserId: userId,
          },
          {
            fromUserId: userId,
            toUserId: session.user.id,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        message: true,
        fromUserId: true,
        toUserId: true,
        createdAt: true,
        isRead: true,
      },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: {
        fromUserId: userId,
        toUserId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { toUserId, message } = await req.json();

    if (!toUserId || !message) {
      return NextResponse.json(
        { message: 'Recipient ID and message content are required' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { message: 'Message must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Create new message
    const newMessage = await prisma.message.create({
      data: {
        fromUserId: session.user.id,
        toUserId,
        message,
        isRead: false,
      },
      select: {
        id: true,
        message: true,
        fromUserId: true,
        toUserId: true,
        createdAt: true,
        isRead: true,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}