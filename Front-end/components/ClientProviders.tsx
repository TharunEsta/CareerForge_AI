'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './theme-provider';

interface ClientProvidersProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // Log error to monitoring service if needed
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed top-0 left-0 w-full z-50 bg-red-600 text-white p-4 text-center font-semibold shadow-lg">
          Oops! Something went wrong. Please try again later.
          <br />
          <span className="text-xs">{this.state.error?.message || ''}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default ClientProviders;
