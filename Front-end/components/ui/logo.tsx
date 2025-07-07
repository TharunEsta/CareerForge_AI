import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: string;
  variant?: string;
  className?: string;
}

export const Logo = ({ size, variant, className = "" }: LogoProps) => {
  return <div className={`logo ${size} ${variant} ${className}`}>LOGO</div>;
};

// Minimal Logo Variant
export const LogoMinimal: React.FC<LogoProps> = (props) => (
  <Logo {...props} variant="minimal" />
);

// Icon Only Variant
export const LogoIcon: React.FC<LogoProps> = (props) => (
  <Logo {...props} variant="icon-only" />
);

// Animated Logo
export const LogoAnimated: React.FC<LogoProps> = ({ className, ...props }) => (
  <div className={cn("animate-pulse-soft", className)}>
    <Logo {...props} />
  </div>
);

// Glowing Logo
export const LogoGlowing: React.FC<LogoProps> = ({ className, ...props }) => (
  <div className={cn("animate-glow", className)}>
    <Logo {...props} />
  </div>
); 