'use client';

import * as React from 'react';
import { Logo } from '@/components/ui/logo';
import {
  SidebarWithLogo,
  SidebarNav,
  SidebarNavItem,
  SidebarNavItemIcon,
  SidebarNavItemText,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  User,
  Settings,
  Sun,
  Moon,
  History,
  Plus,
  LogOut,
  MessageSquare,
  FileText,
  UserCircle,
  Cog,
  Zap,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandPalette } from '@/components/CommandPalette';

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      <Logo size="xl" className="mb-6" />
      <h1 className="text-3xl font-bold mb-2">CareerForge AI</h1>
      <p className="text-lg text-gray-300">Loading your career tools...</p>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-red-500 bg-black">
          <Logo size="lg" />
          <h2 className="text-2xl font-bold mt-4">Something went wrong.</h2>
          <p className="mt-2">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Handler for New Chat
  const handleNewChat = () => {
    // TODO: Reset chat state here
    router.push('/dashboard');
    setSidebarOpen(false);
  };

  // Handler for Previous Chats
  const handlePreviousChats = () => {
    // TODO: Open chat history or navigate
    router.push('/dashboard?history=1');
    setSidebarOpen(false);
  };

  // Handler for Account
  const handleAccount = () => {
    router.push('/account');
    setSidebarOpen(false);
  };

  // Handler for Settings
  const handleSettings = () => {
    router.push('/settings');
    setSidebarOpen(false);
  };

  // Handler for Get Plus
  const handleGetPlus = () => {
    router.push('/pricing');
    setSidebarOpen(false);
  };

  return (
    <>
      {showSplash && <SplashScreen />}
      <ErrorBoundary>
        <CommandPalette />
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed left-0 top-0 z-50 flex flex-col h-screen bg-black/80 border-r border-gray-800 transition-all duration-300 md:translate-x-0 md:static md:flex md:z-40 ${sidebarCollapsed ? 'w-20 p-2' : 'w-64 p-6'}`}
              style={{ boxShadow: sidebarOpen ? '0 0 0 9999px rgba(0,0,0,0.3)' : undefined }}
              aria-label="Sidebar"
              tabIndex={-1}
            >
              {/* Collapse/Expand button (desktop only) */}
              <button
                className="hidden md:block absolute top-4 right-2 z-50 p-1 rounded hover:bg-gray-700 transition"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={() => setSidebarCollapsed((c) => !c)}
                type="button"
              >
                {sidebarCollapsed ? <Plus size={18} /> : <History size={18} />}
              </button>
              <SidebarWithLogo className="flex-1 flex flex-col">
                <SidebarNav>
                  <SidebarNavItem onClick={handleNewChat}>
                    <SidebarNavItemIcon>
                      <Plus size={20} />
                    </SidebarNavItemIcon>
                    {!sidebarCollapsed && <SidebarNavItemText>New Chat</SidebarNavItemText>}
                  </SidebarNavItem>
                  <SidebarNavItem onClick={handlePreviousChats}>
                    <SidebarNavItemIcon>
                      <History size={20} />
                    </SidebarNavItemIcon>
                    {!sidebarCollapsed && <SidebarNavItemText>Previous Chats</SidebarNavItemText>}
                  </SidebarNavItem>
                  <SidebarNavItem onClick={handleAccount}>
                    <SidebarNavItemIcon>
                      <UserCircle size={20} />
                    </SidebarNavItemIcon>
                    {!sidebarCollapsed && <SidebarNavItemText>Account</SidebarNavItemText>}
                  </SidebarNavItem>
                  <SidebarNavItem onClick={handleSettings}>
                    <SidebarNavItemIcon>
                      <Cog size={20} />
                    </SidebarNavItemIcon>
                    {!sidebarCollapsed && <SidebarNavItemText>Settings</SidebarNavItemText>}
                  </SidebarNavItem>
                  <SidebarNavItem
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setSidebarOpen(false);
                    }}
                  >
                    <SidebarNavItemIcon>
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </SidebarNavItemIcon>
                    {!sidebarCollapsed && <SidebarNavItemText>Theme</SidebarNavItemText>}
                  </SidebarNavItem>
                </SidebarNav>
                <SidebarFooter>
                  <button
                    onClick={handleGetPlus}
                    className={`flex items-center w-full justify-center gap-2 bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg mt-8 hover:bg-yellow-300 transition ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Zap className="text-yellow-600" size={20} />
                    {!sidebarCollapsed && 'Get Plus'}
                  </button>
                </SidebarFooter>
              </SidebarWithLogo>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Hamburger icon for mobile */}
        <button
          className="fixed top-4 left-4 z-50 md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-black/70 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setSidebarOpen((open) => !open)}
          type="button"
        >
          <span
            className="block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300"
            style={{ transform: sidebarOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}
          />
          <span
            className={`block w-6 h-0.5 bg-white mb-1 rounded transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}
          />
          <span
            className="block w-6 h-0.5 bg-white rounded transition-all duration-300"
            style={{ transform: sidebarOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}
          />
        </button>
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen ml-0 md:ml-64 transition-all duration-300">
          <main className="w-full max-w-2xl flex flex-col items-center justify-center bg-black/60 rounded-2xl shadow-xl p-8 my-8 mx-auto">
            {children}
          </main>
        </div>
      </ErrorBoundary>
    </>
  );
}
