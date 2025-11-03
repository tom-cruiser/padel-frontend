import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET() {
  try {
    // Support both IMAGEKIT_PRIVATE_KEY (server env) and NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY (if mistakenly set)
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error('Missing required ImageKit environment variables', {
        publicKey: !!publicKey,
        privateKey: !!privateKey,
        urlEndpoint: !!urlEndpoint,
      });
      return NextResponse.json(
        { error: 'ImageKit configuration is incomplete' },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey: publicKey,
      privateKey: privateKey,
      urlEndpoint: urlEndpoint,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log('Generated auth parameters:', {
      ...authenticationParameters,
      token: authenticationParameters.token ? 'present' : 'missing',
      signature: authenticationParameters.signature ? 'present' : 'missing',
      expire: authenticationParameters.expire ? 'present' : 'missing'
    });

    if (!authenticationParameters.token || 
        !authenticationParameters.signature || 
        !authenticationParameters.expire) {
      return NextResponse.json(
        { error: 'Failed to generate complete authentication parameters' },
        { status: 500 }
      );
    }

    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
}