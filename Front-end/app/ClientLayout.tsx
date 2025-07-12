'use client';

import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import SplashScreen from '@/components/SplashScreen'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashScreen />
      <AuthProvider>{children}</AuthProvider>
    </>
  )
}
