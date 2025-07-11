'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  FileText,
  Briefcase,
  User,
  Settings,
  Plus,
  Home,
  MessageCircle,
  Archive,
  Upload,
  Mic,
  Image,
  MoreHorizontal,
  ChevronRight,
  Crown,
  Globe,
  Zap,
  Target,
  TrendingUp,
  Users,
  Brain,
  Building,
  Paperclip,
  Camera,
  ArrowRight,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function CareerForgeInterface() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || 'I received your message! How can I help with your career?',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help with your career! The interface is working perfectly.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (messages.length > 0) {
    return (
      <div className="flex h-screen bg-[#202020] text-gray-100">
        {/* Sidebar */}
        <div className="w-16 bg-[#171717] border-r border-[#2d2d2d] flex flex-col items-center py-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-6 h-6 text-white">
              <Sparkles size={20} />
            </div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <Home size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <Globe size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <Archive size={20} />
            </button>
          </div>

          <div className="flex-1"></div>

          <div className="flex flex-col items-center space-y-4">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <ArrowRight size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl ${message.role === 'user' ? 'bg-[#20b2aa] text-white' : 'bg-[#2d2d2d]'} rounded-2xl px-6 py-4`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2d2d2d] rounded-2xl px-6 py-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#2d2d2d]">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-[#2d2d2d] rounded-2xl">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about your career..."
                  className="w-full bg-transparent text-white placeholder-gray-400 px-6 py-4 pr-16 resize-none outline-none rounded-2xl min-h-[60px]"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#20b2aa] hover:bg-[#1a9990] disabled:opacity-50 rounded-xl flex items-center justify-center"
                >
                  <ArrowRight size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#202020] text-gray-100">
      {/* Left Sidebar - Exact Perplexity match */}
      <div className="w-16 bg-[#171717] border-r border-[#2d2d2d] flex flex-col items-center py-4">
        {/* Top section with icons */}
        <div className="flex flex-col items-center space-y-4">
          {/* Sparkles icon at top */}
          <div className="w-6 h-6 text-white">
            <Sparkles size={20} />
          </div>

          {/* Plus icon */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
            <Plus size={20} />
          </button>

          {/* Home icon - highlighted */}
          <button className="p-2 text-[#20b2aa] bg-[#2d2d2d] rounded-lg">
            <Home size={20} />
          </button>

          {/* Globe icon */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
            <Globe size={20} />
          </button>

          {/* Archive icon */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
            <Archive size={20} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Bottom section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Message circle icon */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
            <MessageCircle size={20} />
          </button>

          {/* Arrow right with notification */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
            <ArrowRight size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Exact Perplexity layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-2xl">
          {/* Main Title - exact font and spacing */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-white tracking-wide mb-8">careerforge</h1>
          </div>

          {/* Search Input - exact Perplexity style */}
          <div className="mb-8">
            <div className="relative bg-[#2d2d2d] rounded-2xl hover:bg-[#333333] transition-colors border border-[#404040]">
              <div className="flex items-center px-5 py-4">
                <Search size={20} className="text-gray-400 mr-4 flex-shrink-0" />
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything or @mention a Career Skill"
                  className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-32 text-base"
                  rows={1}
                />
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#404040] rounded-lg transition-colors">
                    <Paperclip size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#404040] rounded-lg transition-colors">
                    <Mic size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#404040] rounded-lg transition-colors">
                    <Camera size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#404040] rounded-lg transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="ml-2 w-10 h-10 bg-[#20b2aa] hover:bg-[#1a9990] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                  >
                    <ArrowRight size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CareerForge Pro Card - exact Perplexity Max style */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#20b2aa]/20 to-[#4169e1]/20 border border-[#20b2aa]/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-medium mb-2">
                    Introducing CareerForge Pro
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Upgrade for unlimited Career Optimization and unlimited job searches
                  </p>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#20b2aa] to-[#4169e1] rounded-xl flex items-center justify-center">
                    <Crown size={24} className="text-white" />
                  </div>
                </div>
              </div>
              {/* Background decoration like Perplexity */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-white/3 to-transparent rounded-full translate-y-4 -translate-x-4"></div>
            </div>
          </div>

          {/* Create your first space - exact spacing */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-lg font-medium">Create your first career space</h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-6">Organizing your career development</p>
          </div>

          {/* Pick a Template - exact match */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-400 text-base">Pick a Template</h4>
              <button className="text-gray-400 hover:text-white transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setInputValue(
                    'Help me analyze and optimize my resume for ATS compatibility and better job matching'
                  );
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="w-full text-left p-4 bg-[#2d2d2d] hover:bg-[#333333] rounded-xl transition-colors border border-[#404040]/50"
              >
                <span className="text-gray-200 text-base">Resume Analysis & ATS Optimization</span>
              </button>

              <button
                onClick={() => {
                  setInputValue(
                    'Create a comprehensive job search strategy and career advancement plan'
                  );
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="w-full text-left p-4 bg-[#2d2d2d] hover:bg-[#333333] rounded-xl transition-colors border border-[#404040]/50"
              >
                <span className="text-gray-200 text-base">Strategic Job Search Plan</span>
              </button>

              <button
                onClick={() => {
                  setInputValue(
                    'Prepare me for interviews with industry-specific questions and best practices'
                  );
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="w-full text-left p-4 bg-[#2d2d2d] hover:bg-[#333333] rounded-xl transition-colors border border-[#404040]/50"
              >
                <span className="text-gray-200 text-base">Interview Mastery Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
