import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';

async function forward(request: Request, backendPath: string) {
  const url = new URL((request as any).url);
  const search = url.search || '';
  const headers: Record<string, string> = {};
  const cookie = (request as any).headers?.get?.('cookie');
  if (cookie) headers['cookie'] = cookie;
  const auth = (request as any).headers?.get?.('authorization');
  if (auth) headers['authorization'] = auth;
  const contentType = (request as any).headers?.get?.('content-type');
  if (contentType) headers['content-type'] = contentType;

  const init: any = { method: (request as any).method || 'GET', headers };
  if (init.method !== 'GET' && init.method !== 'HEAD') {
    init.body = await (request as any).text();
  }

  const res = await fetch(`${BACKEND}${backendPath}${search}`, init);
  const text = await res.text();
  const contentTypeRes = res.headers.get('content-type') || '';
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: res.status });
  } catch {
    return new NextResponse(text, { status: res.status, headers: { 'content-type': contentTypeRes } });
  }
}

export async function GET(request: Request) {
  return forward(request, '/api/users/online');
}