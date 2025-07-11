import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerForge AI - AI-Powered Career Assistant',
  description:
    'Your AI-powered assistant for resumes, job matching, and career help. Transform your career with intelligent insights and personalized recommendations.',
  keywords:
    'AI, career, resume, job matching, ATS optimization, career advice, job search, AI assistant',
  authors: [{ name: 'CareerForge AI Team' }],
  creator: 'CareerForge AI',
  publisher: 'CareerForge AI',
  robots: 'index, follow',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://careerforge.ai',
    title: 'CareerForge AI - AI-Powered Career Assistant',
    description: 'Your AI-powered assistant for resumes, job matching, and career help.',
    siteName: 'CareerForge AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CareerForge AI - AI-Powered Career Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerForge AI - AI-Powered Career Assistant',
    description: 'Your AI-powered assistant for resumes, job matching, and career help.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1117',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
