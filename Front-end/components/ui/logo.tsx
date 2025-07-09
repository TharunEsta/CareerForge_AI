"use client";

"use client";

"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
<<<<<<< Updated upstream
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
      src="/ai-doc-logo.svg"
      alt="CareerForge Logo"
      className={cn(sizeMap[size as keyof typeof sizeMap], className)}
      draggable={false}
    />
  );
};
=======
  variant?: 'icon-only' | 'text' | 'full';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'icon-only', className }) => {
  const sizeMap: Record<string, string> = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  return (
    <div className={cn(sizeMap[size], className)}>
      {variant === 'icon-only' && <img src="/logo.svg" alt="Logo" className="w-full h-full" />}
      {variant === 'text' && <span className="text-xl font-bold">SkillSync</span>}
      {variant === 'full' && (
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-full" />
          <span className="text-xl font-bold">SkillSync</span>
        </div>
      )}
    </div>
  );
};

export const LogoAnimated: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const sizeMap: Record<string, string> = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };

  return (
    <div className={cn('animate-pulse', sizeMap[size], className)}>
      <img src="/logo.svg" alt="Animated Logo" className="w-full h-full" />
    </div>
  );
};
>>>>>>> Stashed changes
