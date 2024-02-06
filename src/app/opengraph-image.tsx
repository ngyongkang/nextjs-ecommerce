import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Stick & Treat';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  // Font
  // const interSemiBold = fetch(
  //   new URL('./Inter-SemiBold.ttf', import.meta.url),
  // ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          backgroundImage: process.env.NEXT_PUBLIC_VERCEL_URL
            ? `url(https://${process.env.NEXT_PUBLIC_VERCEL_URL}/opengraph-image.png)`
            : `url(http://localhost:3000/opengraph-image.png)`,
          backgroundSize: '100% 100%',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontFamily: 'Inter',
          padding: '40px 80px',
        }}
      ></div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      // fonts: [
      //   {
      //     name: 'Inter',
      //     data: await interSemiBold,
      //     style: 'normal',
      //     weight: 400,
      //   },
      // ],
    },
  );
}
