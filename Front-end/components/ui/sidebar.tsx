"use client";

"use client";

"use client";

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Logo } from './logo';

const SidebarVariants = cva(
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

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary';
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, variant, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(SidebarVariants({ variant }), className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);
Sidebar.displayName = 'Sidebar';

export const SidebarHeader = ({ children }: { children?: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const SidebarFooter = ({ children }: { children?: React.ReactNode }) => (
  <div className="mt-auto">{children}</div>
);

export const SidebarNav = ({ children }: { children?: React.ReactNode }) => (
  <div className="space-y-1">{children}</div>
);

export const SidebarNavItem = ({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) => (
  <div className="flex items-center space-x-2 px-2 py-1 hover:bg-accent rounded-md cursor-pointer" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
    {children}
  </div>
);

export const SidebarNavItemIcon = ({ children }: { children?: React.ReactNode }) => (
  <span className="text-muted-foreground">{children}</span>
);

export const SidebarNavItemText = ({ children }: { children?: React.ReactNode }) => (
  <span className="text-sm font-medium">{children}</span>
);

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
    {...props}
  />
));
SidebarNavItemBadge.displayName = 'SidebarNavItemBadge';

export const SidebarWithLogo: React.FC<SidebarProps> = ({
  className,
  children,
  ...props
}) => (
  <Sidebar className={className} {...props}>
    <SidebarHeader>
      <Logo size="md" className="mx-auto" />
    </SidebarHeader>
    {children}
  </Sidebar>
);

