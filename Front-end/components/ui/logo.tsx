import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'icon-only';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  variant = 'default',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const LogoIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
    >
      {/* Modern Career/Forge Icon */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      
      {/* Main Shape - Modern Briefcase/Forge */}
      <path
        d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7Z"
        fill="url(#logoGradient)"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
      />
      
      {/* Handle */}
      <path
        d="M8 5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7H8V5Z"
        fill="url(#logoGradient)"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
      />
      
      {/* AI Circuit Pattern */}
      <path
        d="M7 9H17M7 12H17M7 15H17M7 18H15"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Sparkle/Intelligence Indicator */}
      <circle
        cx="18"
        cy="9"
        r="1.5"
        fill="white"
        opacity="0.9"
      />
      
      {/* Gear/Technology Symbol */}
      <path
        d="M6 9C6 9.55228 5.55228 10 5 10C4.44772 10 4 9.55228 4 9C4 8.44772 4.44772 8 5 8C5.55228 8 6 8.44772 6 9Z"
        fill="white"
        opacity="0.7"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <LogoIcon />;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon />
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent",
            textSizes[size]
          )}>
            CareerForge
          </span>
          {variant === 'default' && (
            <span className="text-xs text-muted-foreground font-medium">
              AI
            </span>
          )}
        </div>
      )}
    </div>
  );
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