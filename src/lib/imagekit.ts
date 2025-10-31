import ImageKit from 'imagekit-javascript';

// Ensure required environment variables are available
if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
  console.error('Missing NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY environment variable');
}

if (!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
  console.error('Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT environment variable');
}

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  authenticationEndpoint: '/api/imagekit/auth',
});