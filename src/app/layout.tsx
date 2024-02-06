import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from './Footer';
import Navbar from './Navbar/Navbar';
import SessionProvider from './SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stick & Treat',
  description: 'For sticker lovers who want to treat themselves.',
  openGraph: {
    url: process.env.NEXTAUTH_URL as string | 'https://localhost:3000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="mx-auto min-w-[300px] max-w-7xl p-4">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
