"use client";

"use client";

"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
  Home,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems?: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
    badge?: string;
  }>;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarItems = [
    { icon: <Home className="h-4 w-4" />, label: 'Dashboard', href: '/dashboard' , active: false, badge: undefined},
    { icon: <FileText className="h-4 w-4" />, label: 'Resume', href: '/resume' , active: false, badge: undefined},
    { icon: <Briefcase className="h-4 w-4" />, label: 'Job Match', href: '/job-match' , active: false, badge: undefined},
    { icon: <MessageSquare className="h-4 w-4" />, label: 'Chat', href: '/chat' , active: false, badge: undefined},
    { icon: <Settings className="h-4 w-4" />, label: 'Settings', href: '/settings' , active: false, badge: undefined},
  ],
  user,
  onLogout,
  title,
  subtitle,
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/20 dark:to-primary-950/20">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                CareerForge
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group',
                  item.active
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <div
                  className={cn(
                    'transition-colors',
                    item.active
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {item.icon}
                </div>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* User Section */}
          {user && (
            <div className="p-4 border-t border-gray-200/50">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div>
                {title && <h1 className="text-xl font-semibold">{title}</h1>}
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-muted/50 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>

              {/* User Menu */}
              {user && (
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('hover:shadow-lg transition-all duration-300', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-success-600' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
