'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PromptSuggestions } from './ui/PromptSuggestions';
import { MessageBubble } from './ui/MessageBubble';
import {
  Loader2,
  RefreshCw,
  Sparkles,
  Globe,
  Paperclip,
  Mic,
  AudioLines,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useChat } from '@/lib/hooks';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [freeCount, setFreeCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const FREE_TIER_LIMIT = 15;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const chatMutation = useChat();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = async (prompt?: string) => {
    const content = prompt || input.trim();
    if (!content) return;
    if (freeCount >= FREE_TIER_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages as Message[]);
    setInput('');
    setFreeCount((c) => c + 1);
    setThinking(true);

    try {
      await chatMutation.sendMessage(content);
      const newAIResponse = chatMutation.messages[chatMutation.messages.length - 1];
        if (newAIResponse && newAIResponse.role === 'ai') {
        setMessages((msgs) => [...msgs, newAIResponse]);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { role: 'ai', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isEmpty = messages.length === 0 && !thinking;

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-background">
      <div className={`flex-1 w-full flex flex-col items-center justify-${isEmpty ? 'center' : 'end'} transition-all duration-300 pt-8 pb-0 md:pb-8`}>
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-end">
          <div className={`flex-1 overflow-y-auto px-2 md:px-0 space-y-4 ${isEmpty ? 'hidden' : 'block'}`}>
            <PromptSuggestions onSelect={handleSend} />
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageBubble
                    role={msg.role}
                    content={msg.content}
                    showCopy={msg.role === 'ai'}
                    onCopy={() => handleCopy(msg.content)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-900 flex items-center gap-2 animate-pulse">
                  <TypingIndicator />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {chatMutation.error && (
              <div className="text-red-600 text-center text-sm">Failed to get AI response. Please try again.</div>
            )}

            <div ref={chatEndRef} />
          </div>

          {freeCount >= FREE_TIER_LIMIT && (
            <div className="w-full max-w-2xl mx-auto my-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-2 shadow">
              <div className="flex justify-between items-center text-sm">
                <span>Free usage limit reached.</span>
                <button
                  className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded"
                  onClick={() => router.push('/pricing')}
                >
                  Get Plus
                </button>
              </div>
            </div>
          )}

          <motion.div
            className={`w-full flex flex-col items-center transition-all duration-300 ${isEmpty ? 'justify-center min-h-[60vh]' : 'justify-end'}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-xl px-2 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <IconBtn icon={<Search size={20} />} label="Search" />
                <IconBtn icon={<RefreshCw size={20} />} label="Rephrase" />
                <IconBtn icon={<Sparkles size={20} />} label="Suggestions" />
                <IconBtn icon={<Globe size={20} />} label="Language" />
                <IconBtn icon={<Paperclip size={20} />} label="Attach" />
                <IconBtn icon={<Mic size={20} />} label="Mic" />
                <button
                  className="ml-auto p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => handleSend()}
                  disabled={loading || thinking || !input.trim()}
                  aria-label="Send"
                >
                  <AudioLines size={22} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  disabled={loading || thinking}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label={label}>
      {icon}
    </button>
  );
}

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}

