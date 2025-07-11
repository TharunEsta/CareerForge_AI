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

  const quickActions = [
    { icon: FileText, label: 'Resume Analysis', color: 'text-blue-400' },
    { icon: Briefcase, label: 'Job Matching', color: 'text-green-400' },
    { icon: User, label: 'Interview Prep', color: 'text-purple-400' },
    { icon: Sparkles, label: 'Career Advice', color: 'text-yellow-400' },
  ];

  if (messages.length > 0) {
    return (
      <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
        {/* Sidebar */}
        <div className="w-16 bg-[#1a1a1a] border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>

          <div className="space-y-4">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Home size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Archive size={20} />
            </button>
          </div>

          <div className="flex-1"></div>

          <div className="space-y-4">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <User size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] border border-gray-800'} rounded-2xl px-6 py-4`}
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
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl px-6 py-4">
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

          {/* Input Area */}
          <div className="p-6 border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-[#1a1a1a] border border-gray-700 rounded-2xl">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about your career..."
                  className="w-full bg-transparent text-gray-100 placeholder-gray-400 px-6 py-4 pr-16 resize-none outline-none rounded-2xl min-h-[60px] max-h-32"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-[#1a1a1a] border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        {/* Logo */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">CF</span>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
          <button className="p-2 text-blue-400 bg-gray-800 rounded-lg">
            <Home size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <MessageCircle size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Archive size={20} />
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Bottom Navigation */}
        <div className="space-y-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <User size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Main Title */}
          <div className="text-center">
            <h1 className="text-4xl font-light text-white mb-2">careerforge</h1>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="relative bg-[#1a1a1a] border border-gray-700 rounded-2xl hover:border-gray-600 transition-colors">
              <div className="flex items-center px-6 py-4">
                <Search size={20} className="text-gray-400 mr-4" />
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about your career or @mention a skill"
                  className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-32"
                  rows={1}
                />
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <Mic size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <Upload size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <Image size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="ml-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Career Features Card */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Introducing CareerForge Pro</h3>
                <p className="text-gray-400 text-sm">
                  AI-powered career optimization and unlimited job matching
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Crown size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Create your first career plan</h3>
              <button className="text-gray-400 hover:text-white">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(`Help me with ${action.label.toLowerCase()}`);
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  className="flex items-center space-x-3 p-4 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-xl transition-colors text-left"
                >
                  <action.icon size={20} className={action.color} />
                  <span className="text-gray-300 font-medium">{action.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-400 text-sm">Pick a Template</h4>
                <button className="text-gray-400 hover:text-white">
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-300 text-sm">📄 Resume Review & Optimization</span>
                </button>
                <button className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-300 text-sm">🎯 Job Search Strategy</span>
                </button>
                <button className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 rounded-lg transition-colors">
                  <span className="text-gray-300 text-sm">💼 Interview Preparation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
