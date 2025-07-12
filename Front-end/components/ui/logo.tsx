"use client";

"use client";

"use client";

import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' | number; className?: string }> = ({ size = 'md', className = '' }) => {
  // Size mapping
  const sizeMap: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };
  const svgSize = typeof size === 'number' ? { width: size, height: size } : {};
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${typeof size === 'string' ? sizeMap[size] : ''} ${className}`}
      {...svgSize}
    >
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#cf-gradient)" />
      <path
        d="M16 32V16h8a8 8 0 110 16h-8z"
        fill="#fff"
        fillOpacity="0.95"
      />
      <circle cx="32" cy="24" r="4" fill="#fff" fillOpacity="0.8" />
      <defs>
        <linearGradient id="cf-gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
