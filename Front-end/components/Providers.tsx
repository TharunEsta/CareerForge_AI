import React from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
} 