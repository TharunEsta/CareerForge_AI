'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

// Sidebar variants using class-variance-authority
const sidebarVariants = cva(
  'group relative flex h-full w-full flex-col gap-4 border-r bg-background p-4',
  {
    variants: {
      variant: {
        default: 'border-border',
        secondary: 'border-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  children?: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, variant, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(sidebarVariants({ variant }), className)}
        {...props as any}
      >
        {children}
      </motion.div>
    );
  }
);
Sidebar.displayName = 'Sidebar';

// Header
export const SidebarHeader = ({ children }: { children?: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

// Footer
export const SidebarFooter = ({ children }: { children?: React.ReactNode }) => (
  <div className="mt-auto">{children}</div>
);

// Navigation wrapper
export const SidebarNav = ({ children }: { children?: React.ReactNode }) => (
  <div className="space-y-1">{children}</div>
);

// Nav item
export const SidebarNavItem = ({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className="flex items-center space-x-2 px-2 py-1 hover:bg-accent rounded-md"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {children}
  </div>
);

// Nav item icon
export const SidebarNavItemIcon = ({
  children,
}: {
  children?: React.ReactNode;
}) => <span className="text-muted-foreground">{children}</span>;

// Nav item text
export const SidebarNavItemText = ({
  children,
}: {
  children?: React.ReactNode;
}) => <span className="text-sm font-medium">{children}</span>;

// Nav item badge
export const SidebarNavItemBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground',
      className
    )}
    {...props as any}
  />
));
SidebarNavItemBadge.displayName = 'SidebarNavItemBadge';

// Sidebar with logo at top
export const SidebarWithLogo: React.FC<SidebarProps> = ({
  className,
  children,
  ...props
}) => (
  <Sidebar className={className} {...props as any}>
    <SidebarHeader>
      <Logo size="md" className="mx-auto" />
    </SidebarHeader>
    {children}
  </Sidebar>
);
