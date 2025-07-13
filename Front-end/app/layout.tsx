import React from 'react';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerForge AI - AI-Powered Career Optimization',
  description: 'Transform your career with AI-powered resume optimization, job matching, and career insights. Get personalized recommendations and improve your ATS score.',
  keywords: 'AI, career, resume, job matching, ATS optimization, career advice, job search',
  authors: [{ name: 'CareerForge AI Team' }],
  creator: 'CareerForge AI',
  publisher: 'CareerForge AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://careerforge.ai',
    title: 'CareerForge AI - AI-Powered Career Optimization',
    description: 'Transform your career with AI-powered resume optimization, job matching, and career insights.',
    siteName: 'CareerForge AI',
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: 'CareerForge AI - AI-Powered Career Optimization' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerForge AI - AI-Powered Career Optimization',
    description: 'Transform your career with AI-powered resume optimization, job matching, and career insights.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#18181b" />
        <meta name="msapplication-TileColor" content="#18181b" />
      </head>
      <body className={inter.className + " bg-[#18181b] min-h-screen flex flex-row overflow-hidden"}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
