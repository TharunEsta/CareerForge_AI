"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/AuthContext';
import { CommandPalette } from '@/components/CommandPalette';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
        <CommandPalette />
      </AuthProvider>
    </ThemeProvider>
  );

import React from 'react'
import { AuthProvider } from '@/context/AuthContext'
import SplashScreen from '@/components/SplashScreen'
import React from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Briefcase, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut, 
  UserCircle, 
  Plus, 
  History, 
  Cog, 
  Menu,
  X,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { SidebarWithLogo, SidebarNav, SidebarNavItem, SidebarNavItemIcon, SidebarNavItemText, SidebarFooter } from '@/components/ui/sidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CommandPalette } from '@/components/CommandPalette';
import SplashScreen from '@/components/SplashScreen';
import { Providers } from '@/components/Providers';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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
    // Reset chat state by clearing messages and redirecting to dashboard
    if (typeof window !== 'undefined') {
      // Clear chat store
      const chatStore = JSON.parse(localStorage.getItem('chat-storage') || '{}');
      chatStore.messages = [];
      localStorage.setItem('chat-storage', JSON.stringify(chatStore));
    }
    router.push('/dashboard');
    setSidebarOpen(false);
  };

  // Handler for Previous Chats
  const handlePreviousChats = () => {
    // Open chat history by navigating to dashboard with history parameter
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
      <SplashScreen />
      <AuthProvider>{children}</AuthProvider>
    </>
  )
    <Providers>
      {showSplash && <SplashScreen />}
      <ErrorBoundary>
        <CommandPalette />
        
        {/* Mobile Hamburger Menu */}
        <button
          className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-white shadow-lg backdrop-blur-sm border border-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-40 flex flex-col h-screen w-80 bg-gray-900/95 border-r border-gray-800 backdrop-blur-xl md:translate-x-0 md:static md:flex md:z-30"
              style={{ boxShadow: sidebarOpen ? '0 0 0 9999px rgba(0,0,0,0.5)' : undefined }}
            >
              <SidebarWithLogo className="flex-1 flex flex-col p-6">
                {/* Logo Section */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">CF</span>
                  </div>
                  <span className="text-white font-semibold text-xl">CareerForge</span>
                </div>

                {/* Navigation */}
                <SidebarNav className="flex-1">
                  <SidebarNavItem onClick={() => { router.push('/'); setSidebarOpen(false); }}>
                    <SidebarNavItemIcon><Home size={20} /></SidebarNavItemIcon>
                    <SidebarNavItemText>Home</SidebarNavItemText>
                  </SidebarNavItem>
                  <SidebarNavItem onClick={() => { router.push('/dashboard'); setSidebarOpen(false); }}>
                    <SidebarNavItemIcon><Briefcase size={20} /></SidebarNavItemIcon>
                    <SidebarNavItemText>Dashboard</SidebarNavItemText>
                  </SidebarNavItem>
                  <SidebarNavItem onClick={() => { router.push('/pricing'); setSidebarOpen(false); }}>
                    <SidebarNavItemIcon><CreditCard size={20} /></SidebarNavItemIcon>
                    <SidebarNavItemText>Pricing</SidebarNavItemText>
                  </SidebarNavItem>
                  <SidebarNavItem onClick={() => { router.push('/settings'); setSidebarOpen(false); }}>
                    <SidebarNavItemIcon><Settings size={20} /></SidebarNavItemIcon>
                    <SidebarNavItemText>Settings</SidebarNavItemText>
                  </SidebarNavItem>
                  <SidebarNavItem onClick={() => { router.push('/help'); setSidebarOpen(false); }}>
                    <SidebarNavItemIcon><HelpCircle size={20} /></SidebarNavItemIcon>
                    <SidebarNavItemText>Help</SidebarNavItemText>
                  </SidebarNavItem>
                </SidebarNav>

                {/* User Section */}
                <div className="border-t border-gray-800 pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                      <UserCircle size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">User</p>
                      <p className="text-gray-400 text-xs">Free Plan</p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={() => { router.push('/settings'); setSidebarOpen(false); }}
                    >
                      <Cog size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="border-t border-gray-800 pt-4">
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center space-x-3 w-full p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>Toggle Theme</span>
                  </button>
                </div>
              </SidebarWithLogo>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </ErrorBoundary>
    </Providers>
  );
}
