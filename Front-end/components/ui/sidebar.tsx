"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutDashboard, DollarSign, Settings, HelpCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

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
  children?: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className="flex items-center space-x-2 px-2 py-1 hover:bg-accent rounded-md"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
interface SidebarNavProps {
  children?: React.ReactNode;
  className?: string;
}
export const SidebarNav = ({ children, className }: SidebarNavProps) => (
  <div className={cn('space-y-1', className)}>{children}</div>
);

interface SidebarNavItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
}
export const SidebarNavItem = ({ children, onClick }: SidebarNavItemProps) => (
  <div className="flex items-center space-x-2 px-2 py-1 hover:bg-accent rounded-md cursor-pointer" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
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
interface SidebarNavItemIconProps {
  children?: React.ReactNode;
}
export const SidebarNavItemIcon = ({ children }: SidebarNavItemIconProps) => (
  <span className="text-muted-foreground">{children}</span>
);

interface SidebarNavItemTextProps {
  children?: React.ReactNode;
}
export const SidebarNavItemText = ({ children }: SidebarNavItemTextProps) => (
  <span className="text-sm font-medium">{children}</span>
);

interface SidebarNavItemBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const SidebarNavItemBadge = React.forwardRef<HTMLDivElement, SidebarNavItemBadgeProps>(({ className, ...props }, ref) => (
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
      <div className="mx-auto">Logo</div>
    </SidebarHeader>
    {children}
  </Sidebar>
);

interface SidebarCollapsibleProps {
  collapsed: boolean;
  onToggle: () => void;
  open: boolean;
}
export function SidebarCollapsible({ collapsed, onToggle, open }: SidebarCollapsibleProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => onToggle()}
          />
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed lg:static left-0 top-0 z-50 flex flex-col h-screen bg-[#18181b] text-white border-r border-gray-800 transition-all duration-300 ${
              collapsed ? 'w-16 p-2' : 'w-64 p-6'
            }`}
          >
            <button
              className="hidden lg:block absolute top-4 right-2 z-50 p-1 rounded hover:bg-gray-700 transition"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={onToggle}
              type="button"
            >
              {collapsed ? <LayoutDashboard size={18} /> : <Home size={18} />}
            </button>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              {!collapsed && <span className="font-bold text-xl">CareerForge</span>}
            </div>
            <nav className="flex flex-col gap-2">
              <SidebarLink icon={<Home />} label="Home" href="/" collapsed={collapsed} />
              <SidebarLink icon={<LayoutDashboard />} label="Dashboard" href="/dashboard" collapsed={collapsed} />
              <SidebarLink icon={<DollarSign />} label="Pricing" href="/pricing" collapsed={collapsed} />
              <SidebarLink icon={<Settings />} label="Settings" href="/settings" collapsed={collapsed} />
              <SidebarLink icon={<HelpCircle />} label="Help" href="/help" collapsed={collapsed} />
            </nav>
            <div className="mt-auto flex flex-col items-center gap-2 py-6">
              <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-lg">U</div>
              {!collapsed && <span>User</span>}
              {!collapsed && <span className="bg-blue-700 text-xs px-3 py-1 rounded-full mt-1">FREE Plan</span>}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
}
function SidebarLink({ icon, label, href, collapsed }: SidebarLinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition-all ${collapsed ? 'justify-center' : ''}`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </a>
  );
}


