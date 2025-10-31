import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 
        !process.env.IMAGEKIT_PRIVATE_KEY || 
        !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
      console.error('Missing required ImageKit environment variables');
      return NextResponse.json(
        { error: 'ImageKit configuration is incomplete' },
        { status: 500 }
      );
    }

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