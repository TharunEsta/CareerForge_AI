'use client';

import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';
import LoginPage from '@/app/login/page';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // If user is not logged in and not on login/signup pages, show login
  if (!user && pathname !== '/login' && pathname !== '/signup') {
    return <LoginPage />;
  }

  // If user is logged in and on login page, redirect to dashboard
  if (user && pathname === '/login') {
    return children;
  }

  return <>{children}</>;
}
