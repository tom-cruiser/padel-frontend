import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Proxied routes read request headers/cookies and must be executed
// dynamically at request time to forward authentication information.
export const dynamic = 'force-dynamic';

// This route proxies gallery requests to the backend API. The frontend
// does not run Prisma directly in production builds here, and the
// backend is the single source of truth for DB operations.

const BACKEND = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export async function POST(req: NextRequest) {
  try {
    const session = await auth(req as unknown as Request);
    if (!session?.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fileId = formData.get('fileId') as string;

    if (!imageUrl || !title || !fileId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

  const payload = { imageUrl, title, description: description || null, fileId, userId: session.userId };

    const res = await fetch(`${BACKEND}/api/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // include credentials if your backend requires cookies
      // credentials: 'include',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Gallery upload proxy error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');

    const url = new URL(`${BACKEND}/api/gallery`);
    if (typeof isActive === 'string') url.searchParams.set('isActive', isActive);

    const res = await fetch(url.toString());
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Gallery fetch proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}