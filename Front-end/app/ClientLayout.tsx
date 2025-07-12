"use client";

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
}
