"use client";

<<<<<<< HEAD
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/AuthContext';
import { CommandPalette } from '@/components/CommandPalette';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
        <CommandPalette />
      </AuthProvider>
    </ThemeProvider>
  );
=======
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
>>>>>>> 302f3f2770197901b6cc30f3e45f07976c933ba4
}
