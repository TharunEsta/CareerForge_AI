import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-16 w-auto',
  xl: 'h-24 w-auto',
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  return (
    <img
      src="/placeholder-logo.svg"
      alt="CareerForge Logo"
      className={cn(sizeMap[size as keyof typeof sizeMap], className)}
      draggable={false}
    />
  );
};