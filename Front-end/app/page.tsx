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
        content:
          "I'm here to help with your career! While the backend connects, feel free to explore the interface.",
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
        <div className="w-16 bg-[#171717] border-r border-[#2a2a2a] flex flex-col items-center py-6 space-y-8">
          <div className="w-6 h-6 text-white">
            <Sparkles size={24} />
          </div>

          <div className="space-y-6">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <Home size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <Globe size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <Archive size={20} />
            </button>
          </div>

          <div className="flex-1"></div>

          <div className="space-y-6">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <ChevronRight size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl ${message.role === 'user' ? 'bg-[#20b2aa] text-white' : 'bg-[#2a2a2a] border border-[#3a3a3a]'} rounded-3xl px-8 py-6`}
                >
                  <p className="whitespace-pre-wrap text-lg leading-relaxed">{message.content}</p>
                  <p className="text-sm opacity-70 mt-3">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-3xl px-8 py-6">
                  <div className="flex space-x-2">
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

          {/* Input Area */}
          <div className="p-8 border-t border-[#2a2a2a]">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-[#2a2a2a] border border-[#3a3a3a] rounded-3xl">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about your career..."
                  className="w-full bg-transparent text-gray-100 placeholder-gray-400 px-8 py-6 pr-20 resize-none outline-none rounded-3xl min-h-[70px] max-h-40 text-lg"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#20b2aa] hover:bg-[#1a9990] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={20} className="text-white" />
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
      {/* Sidebar - Exact Perplexity Style */}
      <div className="w-16 bg-[#171717] border-r border-[#2a2a2a] flex flex-col items-center py-6 space-y-8">
        {/* Top Logo */}
        <div className="w-6 h-6 text-white">
          <Sparkles size={24} />
        </div>

        {/* Navigation Icons */}
        <div className="space-y-6">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <Plus size={20} />
          </button>
          <button className="p-2 text-[#20b2aa] bg-[#2a2a2a] rounded-lg">
            <Home size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <Globe size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <Archive size={20} />
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Bottom Icons */}
        <div className="space-y-6">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <MessageCircle size={20} />
          </button>
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <ChevronRight size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content - Exact Perplexity Layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-2xl space-y-12">
          {/* Main Title */}
          <div className="text-center">
            <h1 className="text-5xl font-light text-white tracking-wide">careerforge</h1>
          </div>

          {/* Search Input - Exact Perplexity Style */}
          <div className="relative">
            <div className="relative bg-[#2a2a2a] border border-[#3a3a3a] rounded-3xl hover:border-[#4a4a4a] transition-colors">
              <div className="flex items-center px-8 py-6">
                <Search size={24} className="text-gray-400 mr-6" />
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything or @mention a Career Skill"
                  className="flex-1 bg-transparent text-gray-100 text-lg placeholder-gray-400 resize-none outline-none min-h-[28px] max-h-40 leading-relaxed"
                  rows={1}
                />
                <div className="flex items-center space-x-3 ml-6">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-xl transition-colors">
                    <Mic size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-xl transition-colors">
                    <Upload size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-xl transition-colors">
                    <Image size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-xl transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="ml-3 w-12 h-12 bg-[#20b2aa] hover:bg-[#1a9990] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Career Pro Card - Perplexity Max Style */}
          <div className="relative">
            <div className="bg-gradient-to-r from-[#20b2aa]/20 to-[#4169e1]/20 border border-[#20b2aa]/30 rounded-3xl p-8 overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-white text-xl font-medium mb-2">
                    Introducing CareerForge Pro
                  </h3>
                  <p className="text-gray-300 text-lg">
                    Upgrade for unlimited Career and unlimited job searches
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-[#20b2aa] to-[#4169e1] rounded-2xl flex items-center justify-center">
                  <Crown size={32} className="text-white" />
                </div>
              </div>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-white to-transparent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Career Space Creation */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-xl font-medium">Create your first career space</h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed">
              Organizing your career development
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setInputValue(
                    'Help me create a comprehensive resume analysis and optimization plan'
                  );
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="flex items-center space-x-4 p-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-2xl transition-colors text-left"
              >
                <FileText size={24} className="text-[#20b2aa] flex-shrink-0" />
                <span className="text-gray-200 text-lg font-medium">Resume Analysis</span>
              </button>

              <button
                onClick={() => {
                  setInputValue(
                    'I need help finding job opportunities that match my skills and experience'
                  );
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="flex items-center space-x-4 p-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-2xl transition-colors text-left"
              >
                <Briefcase size={24} className="text-[#4169e1] flex-shrink-0" />
                <span className="text-gray-200 text-lg font-medium">Job Matching</span>
              </button>

              <button
                onClick={() => {
                  setInputValue('Help me prepare for technical and behavioral interviews');
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="flex items-center space-x-4 p-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-2xl transition-colors text-left"
              >
                <Target size={24} className="text-[#ff6b6b] flex-shrink-0" />
                <span className="text-gray-200 text-lg font-medium">Interview Prep</span>
              </button>

              <button
                onClick={() => {
                  setInputValue(
                    'I want to develop my skills and advance my career. What should I focus on?'
                  );
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="flex items-center space-x-4 p-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-2xl transition-colors text-left"
              >
                <TrendingUp size={24} className="text-[#ffd93d] flex-shrink-0" />
                <span className="text-gray-200 text-lg font-medium">Skill Development</span>
              </button>
            </div>

            {/* Pick a Template Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-gray-400 text-lg">Pick a Template</h4>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setInputValue('Create a professional resume review checklist for my industry');
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  className="w-full text-left p-5 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-xl transition-colors"
                >
                  <span className="text-gray-200 text-lg">Resume Review & ATS Optimization</span>
                </button>

                <button
                  onClick={() => {
                    setInputValue(
                      'Help me create a strategic job search plan for the next 90 days'
                    );
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  className="w-full text-left p-5 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-xl transition-colors"
                >
                  <span className="text-gray-200 text-lg">Strategic Job Search Plan</span>
                </button>

                <button
                  onClick={() => {
                    setInputValue(
                      'Create a comprehensive interview preparation guide for my target role'
                    );
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  className="w-full text-left p-5 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-[#4a4a4a] rounded-xl transition-colors"
                >
                  <span className="text-gray-200 text-lg">Interview Mastery Guide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
