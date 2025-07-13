"use client";

"use client";

"use client";

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-glow',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-lg',
        outline:
          'border-2 border-primary/20 bg-transparent hover:bg-primary/5 text-primary font-medium hover:border-primary/40 shadow-soft hover:shadow-glow',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-lg',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-primary text-white font-semibold shadow-soft hover:shadow-glow',
        gradientSecondary:
          'bg-gradient-secondary text-white font-semibold shadow-soft hover:shadow-glow',
        success: 'bg-success-500 text-white hover:bg-success-600 shadow-soft hover:shadow-lg',
        warning: 'bg-warning-500 text-white hover:bg-warning-600 shadow-soft hover:shadow-lg',
        info: 'bg-info-500 text-white hover:bg-info-600 shadow-soft hover:shadow-lg',
        glass:
          'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-soft hover:shadow-glow',
        modern:
          'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-soft hover:shadow-glow hover:scale-105 transform transition-all duration-300',
      },
      size: {
        default: 'h-9 sm:h-11 px-4 sm:px-6 py-2 sm:py-3',
        sm: 'h-8 sm:h-9 rounded-md px-3 sm:px-4 py-1.5 sm:py-2',
        lg: 'h-10 sm:h-12 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base',
        xl: 'h-12 sm:h-14 rounded-xl px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold',
        icon: 'h-9 sm:h-11 w-9 sm:w-11',
        'icon-sm': 'h-8 sm:h-9 w-8 sm:w-9',
        'icon-lg': 'h-10 sm:h-12 w-10 sm:w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
