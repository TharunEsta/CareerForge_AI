"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserStore, initializeDemoUser } from '@/store/useUserStore';
import { UploadButton } from '@/components/UploadButton';
import { AskButton } from '@/components/AskButton';
import { UsageCounter } from '@/components/UsageCounter';
import { 
  Search, 
  RotateCcw, 
  Lightbulb, 
  Globe, 
  Link, 
  Mic, 
  Plus,
  Grid3X3,
  Download,
  Crown,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProBanner, setShowProBanner] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { user, canUpload, canAsk } = useUserStore();

  // Initialize demo user
  useEffect(() => {
    initializeDemoUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !canAsk()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'AI response here',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomize = () => {
    const prompts = [
      "Help me optimize my resume for software engineering roles",
      "What skills should I highlight for a data scientist position?",
      "How can I improve my LinkedIn profile for networking?",
      "Create a cover letter for a product manager role",
      "What are the best practices for job interviews?"
    ];
    setInputValue(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const handleTips = () => {
    setInputValue("Show me career tips and best practices");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Main Content */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {/* Brand Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-8 tracking-wide"
          >
            careerforge
          </motion.h1>

          {/* Main Input Container */}
          <div className="w-full max-w-2xl">
            {/* Prompt Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything or @mention a Skill"
                  className="w-full h-14 bg-white/5 border-white/20 text-white placeholder-gray-400 rounded-xl pl-12 pr-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!canAsk()}
                />
                
                {/* Left-side buttons */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <Search size={16} />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={handleRandomize}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <RotateCcw size={16} />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={handleTips}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <Lightbulb size={16} />
                  </motion.button>
                </div>

                {/* Right-side buttons */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <Globe size={16} />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <Link size={16} />
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                  >
                    <Mic size={16} />
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={!inputValue.trim() || !canAsk()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-[#00C2FF] rounded-lg flex items-center justify-center hover:bg-[#00C2FF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={16} className="text-white" />
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Pro Banner */}
            <AnimatePresence>
              {showProBanner && user?.plan === 'free' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Introducing CareerForge Pro
                        </h3>
                        <p className="text-gray-300 text-sm">
                          Early access to resume AI & unlimited uploads
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <Crown size={20} className="text-white" />
                        </div>
                        <Button
                          onClick={() => router.push('/pricing')}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Upgrade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Usage Counter */}
            <div className="mt-6 flex justify-center">
              <UsageCounter />
            </div>
          </div>
        </div>

        {/* Chat History */}
        {messages.length > 0 && (
          <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="ml-2 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

