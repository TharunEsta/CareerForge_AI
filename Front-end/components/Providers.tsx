'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

