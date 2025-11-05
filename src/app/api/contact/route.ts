import { NextResponse } from 'next/server';

// This proxy may need runtime headers and should be executed dynamically.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Be defensive: backend may return HTML (error page) or JSON. Check content-type
    const contentType = response.headers.get('content-type') || '';
    let data: any = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (err) {
        console.error('Failed to parse JSON from contact backend response:', err);
        const text = await response.text();
        // Return a 502 with the raw text for easier debugging
        return NextResponse.json(
          { success: false, message: 'Invalid JSON from contact backend', raw: text.slice(0, 200) },
          { status: 502 }
        );
      }
    } else {
      // Not JSON — capture text for diagnostics
      const text = await response.text();
      console.error('Contact backend returned non-JSON response:', { status: response.status, text: text.slice(0, 500) });
      return NextResponse.json(
        { success: false, message: 'Contact backend returned non-JSON response', raw: text.slice(0, 500) },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Failed to send message', raw: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in contact route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}