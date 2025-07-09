<<<<<<< HEAD
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import * as React from 'react'
import ClientAppWrapper from '@/components/ClientAppWrapper'
import ClientRootLayout from '@/components/ClientRootLayout'
=======
"use client";
>>>>>>> dabb9f7 (Perplexity-style UI: sidebar, centered chat, build fixes, and dependency updates)

<<<<<<< Updated upstream
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import SplashScreen from "@/components/ui/SplashScreen"
import * as React from "react"
import MicroDashboardMenu from "@/components/ui/MicroDashboardMenu"
import { Logo } from "@/components/ui/logo"

const inter = Inter({ subsets: ["latin"] })
=======
const inter = Inter({ subsets: ['latin'] })
>>>>>>> Stashed changes

export const metadata: Metadata = {
  title: 'CareerForge AI - AI-Powered Career Optimization',
  description:
    'Transform your career with AI-powered resume optimization, job matching, and career insights. Get personalized recommendations and improve your ATS score.',
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
    description:
      'Transform your career with AI-powered resume optimization, job matching, and career insights.',
    siteName: 'CareerForge AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CareerForge AI - AI-Powered Career Optimization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerForge AI - AI-Powered Career Optimization',
    description:
      'Transform your career with AI-powered resume optimization, job matching, and career insights.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
      </head>
<<<<<<< HEAD
<<<<<<< Updated upstream
      <body className={inter.className + " bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 min-h-screen flex flex-col items-center justify-center"}>
=======
      <body className={inter.className + " bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 min-h-screen flex flex-row"}>
>>>>>>> dabb9f7 (Perplexity-style UI: sidebar, centered chat, build fixes, and dependency updates)
        <Providers>
          <MicroDashboardMenu />
          <aside className="hidden md:flex flex-col w-64 h-screen bg-black/80 border-r border-gray-800 p-6 fixed left-0 top-0 z-40">
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
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen ml-0 md:ml-64 transition-all duration-300">
            <main className="w-full max-w-2xl flex flex-col items-center justify-center bg-black/60 rounded-2xl shadow-xl p-8 my-8 mx-auto">
              <ClientRootLayout>{children}</ClientRootLayout>
            </main>
          </div>
        </Providers>
=======
      <body className={inter.className}>
        <ClientAppWrapper>
          <ClientRootLayout>{children}</ClientRootLayout>
        </ClientAppWrapper>
>>>>>>> Stashed changes
      </body>
    </html>
  )
}

