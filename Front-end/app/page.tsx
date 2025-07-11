'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Plus,
  Settings,
  Crown,
  Mic,
  Upload,
  Trash2,
  Send,
  FileText,
  Briefcase,
  User,
  Bot,
  MessageSquare,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

// Animated Splash Screen Component
function SplashScreen({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          {/* CareerForge AI Logo */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">CF</span>
            </div>
            <h1 className="text-4xl font-bold text-white">CareerForge AI</h1>
            <p className="text-gray-400 mt-2">Initializing your AI career assistant...</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}

// Logo Component
function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white font-bold">CF</span>
    </div>
  );
}

export default function ChatInterface() {
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>(
    'connected'
  );
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Resume Review Help',
      lastMessage: 'Can you help me improve my resume?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '2',
      title: 'Job Search Strategy',
      lastMessage: 'What are the best job search strategies?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '3',
      title: 'Interview Preparation',
      lastMessage: 'Help me prepare for a technical interview',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    setConnectionStatus('connecting');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setConnectionStatus('connected');

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || 'I received your message! The AI service is working correctly.',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionStatus('error');

      let errorContent = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorContent = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorContent =
            'Unable to connect to the server. Please ensure the backend is running and try again.';
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setConnectionStatus('connected'), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    if (action === 'resume') {
      message =
        'I need help analyzing and improving my resume. Can you guide me through the process?';
    } else if (action === 'job-matching') {
      message =
        "I'm looking for job opportunities that match my skills and experience. How can you help me find the right roles?";
    }

    setInputValue(message);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-[#f0f6fc] overflow-hidden">
      <SplashScreen show={showSplash} />

      {/* Sidebar */}
      {(sidebarOpen || !isMobile) && (
        <div className="fixed md:relative z-40 w-80 h-full bg-[#161b22] border-r border-gray-800 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Logo size="md" />
                <div>
                  <h1 className="font-semibold text-lg">CareerForge AI</h1>
                  <p className="text-xs text-gray-400">Your AI Career Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Chats</h3>
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare size={16} className="mt-1 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{chat.title}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-800 space-y-3">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg transition-colors text-black font-medium">
              <Crown size={20} />
              <span>Get Plus</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#161b22]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-semibold text-lg">CareerForge AI</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : connectionStatus === 'connecting'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-400">
              {connectionStatus === 'connected'
                ? 'Connected'
                : connectionStatus === 'connecting'
                  ? 'Connecting...'
                  : 'Connection Error'}
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            /* Welcome State */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-2xl mx-auto text-center">
                <div className="space-y-6">
                  <div>
                    <Logo size="lg" />
                    <h1 className="text-4xl font-bold mt-4 mb-2">CareerForge AI</h1>
                    <p className="text-xl text-gray-400 mb-6">
                      Your AI-powered assistant for resumes, job matching, and career help.
                    </p>

                    {/* Warning Message */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
                      <p className="text-yellow-300 text-sm">
                        ⚠️ CareerForge AI is in beta. Don't share sensitive personal information.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                      onClick={() => handleQuickAction('resume')}
                      className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-4 transition-colors group"
                    >
                      <FileText size={24} className="text-blue-400" />
                      <div className="text-left">
                        <p className="font-medium">Resume Analysis</p>
                        <p className="text-sm text-gray-400">Improve your resume</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleQuickAction('job-matching')}
                      className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-lg px-6 py-4 transition-colors group"
                    >
                      <Briefcase size={24} className="text-green-400" />
                      <div className="text-left">
                        <p className="font-medium">Job Matching</p>
                        <p className="text-sm text-gray-400">Find perfect roles</p>
                      </div>
                    </button>
                  </div>

                  {/* Test Connection Button */}
                  <div className="mt-6">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/test');
                          const data = await response.json();
                          alert(
                            `Connection Test: ${data.status === 'success' ? '✅ Success!' : '❌ Failed'}\n${data.message}`
                          );
                        } catch (error) {
                          alert('❌ Connection failed: Unable to reach server');
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                    >
                      Test API Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div
                      className={`rounded-xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#161b22] border border-gray-700'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <Bot size={18} />
                    </div>
                    <div className="bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3">
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
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-[#161b22] border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#0d1117] border border-gray-700 rounded-xl p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask CareerForge AI anything about your career..."
                      className="w-full bg-transparent text-[#f0f6fc] placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-32"
                      rows={1}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Voice input"
                    >
                      <Mic size={20} />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Upload resume"
                    >
                      <Upload size={20} />
                    </button>
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Clear chat"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      title="Send message"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
