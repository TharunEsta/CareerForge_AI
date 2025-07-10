"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Plus, History, UserCircle, Cog, Zap, Home, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

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

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (open) {
        if (e.key === 'ArrowDown') {
          setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
          setHighlighted((h) => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
          handleAction(filtered[highlighted]);
        } else if (e.key === 'Escape') {
          setOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, highlighted, query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setHighlighted(0);
    }
  }, [open]);

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleAction = (action: any) => {
    if (!action) return;
    if (action.label === 'Toggle Theme') {
      action.action(router, setTheme, theme);
    } else {
      action.action(router, setTheme, theme);
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.98, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 30 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 flex flex-col"
          >
            <input
              ref={inputRef}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-gray-900"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
                if (e.key === 'ArrowUp') setHighlighted((h) => Math.max(h - 1, 0));
                if (e.key === 'Enter') handleAction(filtered[highlighted]);
              }}
            />
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="text-gray-400 text-center py-6">No results</div>
              )}
              {filtered.map((a, i) => (
                <button
                  key={a.label}
                  className={`flex items-center w-full px-3 py-2 rounded-lg mb-1 text-left transition-colors ${i === highlighted ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => handleAction(a)}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  <span className="mr-3">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-3 text-center">Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">⌘K</kbd> or <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl+K</kbd> to open</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 