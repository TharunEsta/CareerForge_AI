import React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'minimal';
  className?: string;
}

const sizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  return (
    <div className={cn('flex items-center font-bold', sizeMap[size as keyof typeof sizeMap], className)}>
      <span className="text-primary">CF</span>
      {variant !== 'icon-only' && (
        <span className="ml-2 text-muted-foreground">CareerForge</span>
      )}
    </div>
  );
};

export const LogoAnimated: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <Logo size={size} variant={variant} />
    </div>
  );
};