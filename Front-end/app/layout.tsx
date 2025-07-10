"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import * as React from 'react'
import { Providers } from '@/components/Providers'
import { Logo } from '@/components/ui/logo'

const inter = Inter({ subsets: ['latin'] })

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      <Logo size="xl" className="mb-6" />
      <h1 className="text-3xl font-bold mb-2">CareerForge AI</h1>
      <p className="text-lg text-gray-300">Loading your career tools...</p>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error(error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="flex flex-col items-center justify-center min-h-screen text-red-500 bg-black"><Logo size="lg" /><h2 className="text-2xl font-bold mt-4">Something went wrong.</h2><p className="mt-2">Please refresh the page or try again later.</p></div>;
    }
    return this.props.children;
  }
}

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
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
      </head>
      <body className={inter.className + " bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 min-h-screen flex flex-row"}>
        <Providers>
          {showSplash && <SplashScreen />}
          <ErrorBoundary>
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-50 flex flex-col w-64 h-screen bg-black/80 border-r border-gray-800 p-6 transition-transform duration-300 md:translate-x-0 md:static md:flex md:z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
              style={{ boxShadow: sidebarOpen ? '0 0 0 9999px rgba(0,0,0,0.3)' : undefined }}
              aria-label="Sidebar"
              tabIndex={-1}
            >
              <div className="flex flex-col items-center mb-8">
                <Logo size="lg" />
                <span className="text-white font-bold text-xl mt-2">CareerForge AI</span>
              </div>
              <nav className="flex-1 flex flex-col gap-4 text-gray-300">
                <a href="/" className="hover:bg-gray-800 rounded-lg px-4 py-2">Home</a>
                <a href="/dashboard" className="hover:bg-gray-800 rounded-lg px-4 py-2">Dashboard</a>
                <a href="/job_match" className="hover:bg-gray-800 rounded-lg px-4 py-2">Job Match</a>
                <a href="/resume" className="hover:bg-gray-800 rounded-lg px-4 py-2">Resume</a>
                <a href="/pricing" className="hover:bg-gray-800 rounded-lg px-4 py-2">Pricing</a>
              </nav>
              <div className="mt-auto text-xs text-gray-500 text-center">© 2024 CareerForge</div>
            </aside>
            {/* Hamburger icon for mobile */}
            <button
              className="fixed top-4 left-4 z-50 md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-black/70 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              onClick={() => setSidebarOpen((open) => !open)}
              type="button"
            >
              <span className="block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300" style={{ transform: sidebarOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
              <span className={`block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`} />
              <span className="block w-6 h-0.5 bg-white rounded transition-all duration-300" style={{ transform: sidebarOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
            </button>
            {/* Sidebar overlay for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/60 md:hidden animate-fade-in"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
            )}
            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen ml-0 md:ml-64 transition-all duration-300">
              <main className="w-full max-w-2xl flex flex-col items-center justify-center bg-black/60 rounded-2xl shadow-xl p-8 my-8 mx-auto">
                {children}
              </main>
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}

