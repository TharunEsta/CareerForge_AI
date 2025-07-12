"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Plus, History, UserCircle, Cog, Zap, Home, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, CommandInput, CommandList, CommandItem } from 'cmdk';

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
  { label: 'New Chat', action: () => window.location.href = '/chat' },
  { label: 'Resume Upload', action: () => window.location.href = '/resume-upload' },
  { label: 'Job Matches', action: () => window.location.href = '/job-matches' },
  { label: 'Settings', action: () => window.location.href = '/settings' },
];

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [filtered, setFiltered] = useState(commands);

  const handleAction = useCallback((action: { label: string; icon: React.ReactNode; action: () => void }) => {
    if (!action) return;
    if (action.label === 'Toggle Theme') {
      action.action(router, setTheme, theme);
    } else {
      action.action(router, setTheme, theme);
      setOpen(false);
    }
  }, [router, setTheme, theme]);

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
  }, [open, highlighted, query, filtered, handleAction]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setHighlighted(0);
    }
  }, [open]);

  useEffect(() => {
    setFiltered(
      commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30"
        >
          <Cmdk.Command
            label="Command Palette"
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-4"
            value={query}
            onValueChange={setQuery}
          >
            <Cmdk.CommandInput
              placeholder="Type a command or search..."
              autoFocus
              className="w-full p-2 rounded border mb-2"
            />
            <Cmdk.CommandList>
              {filtered.map((cmd, i) => (
                <Cmdk.CommandItem
                  key={cmd.label}
                  onSelect={() => {
                    setOpen(false);
                    cmd.action();
                  }}
                  className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                >
                  {cmd.label}
                </Cmdk.CommandItem>
              ))}
            </Cmdk.CommandList>
          </Cmdk.Command>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 