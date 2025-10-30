import ImageKit from 'imagekit-javascript';

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  authenticationEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/imagekit/auth`,
});