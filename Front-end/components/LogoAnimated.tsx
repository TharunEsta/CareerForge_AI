"use client";

"use client";

"use client";

import * as React from 'react';

interface LogoAnimatedProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LogoAnimated: React.FC<LogoAnimatedProps> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      {/* Replace this with your actual animated logo */}
      <img src="/logo.svg" alt="Animated Logo" className="w-full h-full animate-spin" />
    </div>
  );
};
