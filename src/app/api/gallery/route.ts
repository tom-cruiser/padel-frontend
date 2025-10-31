import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fileId = formData.get('fileId') as string;

    if (!imageUrl || !title || !fileId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const gallery = await db.gallery.create({
      data: {
        imageUrl,
        title,
        description: description || null,
        fileId,
        isActive: true,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ gallery });
  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive') === 'true';

    const images = await db.gallery.findMany({
      where: isActive ? { isActive: true } : {},
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}