'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Plus, History, UserCircle, Cog, Zap, Home, DollarSign, Upload, Briefcase, Settings } from 'lucide-react';
import { Sun, Moon, Plus, History, UserCircle, Cog, Zap, Home, DollarSign, Search, X, Briefcase, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import * as Cmdk from 'cmdk';


const actions = [
  { label: 'Home', icon: <Home size={18} />, action: (router: any) => router.push('/') },
  { label: 'Dashboard', icon: <History size={18} />, action: (router: any) => router.push('/dashboard') },
  { label: 'New Chat', icon: <Plus size={18} />, action: (router: any) => router.push('/dashboard') },
  { label: 'Account', icon: <UserCircle size={18} />, action: (router: any) => router.push('/account') },
  { label: 'Settings', icon: <Cog size={18} />, action: (router: any) => router.push('/settings') },
  { label: 'Pricing', icon: <DollarSign size={18} />, action: (router: any) => router.push('/pricing') },
  { label: 'Get Plus', icon: <Zap size={18} />, action: (router: any) => router.push('/pricing') },
  { label: 'Toggle Theme', icon: <Sun size={18} />, action: (_: any, setTheme: any, theme: string) => setTheme(theme === 'dark' ? 'light' : 'dark') },
];

const commands = [
  { label: 'New Chat', icon: <Plus size={18} />, action: () => window.location.href = '/chat' },
  { label: 'Resume Upload', icon: <Upload size={18} />, action: () => window.location.href = '/resume-upload' },
  { label: 'Job Matches', icon: <Briefcase size={18} />, action: () => window.location.href = '/job-matches' },
  { label: 'Settings', icon: <Settings size={18} />, action: () => window.location.href = '/settings' },
];

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [filtered, setFiltered] = useState(commands);

  const handleAction = useCallback((action: { label: string; icon: React.ReactNode; action: () => void }) => {
    if (!action) return;
    if (action.label === 'Toggle Theme') {
      action.action();
    } else {
      action.action();
      setOpen(false);
    }
  }, [router, setTheme, theme]);
interface CommandItem {
interface CommandItemType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (open) {
        if (e.key === 'ArrowDown') {
          setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
          setHighlighted((h) => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
          if (filtered[highlighted]) handleAction(filtered[highlighted]);
        } else if (e.key === 'Escape') {
          setOpen(false);
        }
      if (e.key === 'Escape') {
        setIsOpen(false);
    }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: CommandItemType[] = [
    {
      id: 'home',
      title: 'Go to Home',
      description: 'Navigate to the home page',
      icon: <Home size={16} />,
      action: () => {
        router.push('/');
        setIsOpen(false);
      }
    },
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      description: 'Open the main dashboard',
      icon: <Briefcase size={16} />,
      action: () => {
        router.push('/dashboard');
        setIsOpen(false);
      }
    },
    {
      id: 'pricing',
      title: 'View Pricing',
      description: 'See subscription plans',
      icon: <CreditCard size={16} />,
      action: () => {
        router.push('/pricing');
        setIsOpen(false);
      }
    },
    {
      id: 'settings',
      title: 'Open Settings',
      description: 'Manage your account settings',
      icon: <Settings size={16} />,
      action: () => {
        router.push('/settings');
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      title: 'Get Help',
      description: 'View help and documentation',
      icon: <HelpCircle size={16} />,
      action: () => {
        router.push('/help');
        setIsOpen(false);
      }
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCommands.map((command) => (
                <button
                  key={command.id}
                  onClick={command.action}
                  className="flex items-center space-x-3 w-full p-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 text-gray-400">
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{command.title}</div>
                    <div className="text-sm text-gray-500">{command.description}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
              <div className="flex items-center justify-center space-x-4">
                <span>Press ⌘K to open</span>
                <span>Press Esc to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
} 
