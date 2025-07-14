<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/logo';
=======
'use client';
import * as React from 'react';
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mic,
  LogOut,
  MessageSquare,
  Home,
  Briefcase,
  CreditCard,
  Settings,
  HelpCircle,
  Send,
  FileText,
  Upload,
  Menu,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
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
  Zap,
  MessageSquare,
  FileText,
  Search,
  Mic,
  Upload,
  Sparkles,
  Shield,
  Globe,
  Clock,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/components/AuthContext';
import { CommandPalette } from '@/components/CommandPalette';
import WaveformVisualizer from '@/components/ui/WaveformVisualizer';
=======
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6


interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

<<<<<<< HEAD

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface UserSubscription {
  plan: string;
  status: string;
  nextBillingDate: string;
}

interface UsageSummary {
  ai_chats: { used: number; limit: number };
  resume_parsing: { used: number; limit: number };
  job_matching: { used: number; limit: number };
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    plans,
    userSubscription,
    currentPlan,
    loading,
    usageSummary,
    error,
    canUseFeature: subscriptionCanUseFeature,
    clearError,
  } = useSubscription();


function TypingAnimation() {
  return (
    <div className="flex items-center gap-1 mt-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
      <span className="ml-2 text-xs text-gray-400">Thinking...</span>
    </div>
  );
}

const userAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';
const assistantAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=ai';

=======
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AppPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSubscriptionCards, setShowSubscriptionCards] = React.useState(false);

  // Mock usage data for now
  const mockUsage = {
    ai_chats: { used: 5, limit: 10 },
    resume_parsing: { used: 2, limit: 5 },
    job_matching: { used: 1, limit: 3 }
  const [showChat, setShowChat] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const router = useRouter();

  const hasVoiceSubscription = subscriptionCanUseFeature('ai_chats');


  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setShowChat(true);

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          userId: 'user123',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${content}". How can I help you with your career goals?`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
=======
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date()
        }
      ]);
    } finally {
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const checkFeatureAccess = (feature: 'ai_chats' | 'resume_parsing' | 'job_matching') => {
    if (!subscriptionCanUseFeature(feature)) {
      setShowSubWarning(true);
      return false;
  const handleFeatureClick = async (feature: string) => {
    switch (feature) {
      case 'resume_parsing':
        break;
      case 'job_matching':
        break;
      case 'voice_assistant':
        break;
      default:
        break;

    }
    return true;
  };


  const features = [
    {
      id: 'ai_chats',
      title: 'AI Career Chat',
      description: 'Get personalized career advice and guidance',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600',
      usage: mockUsage.ai_chats
    },
    {
      id: 'resume_parsing',
      title: 'Resume Analysis',
      description: 'Upload and analyze your resume for improvements',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-green-500 to-teal-600',
      usage: mockUsage.resume_parsing
    },
    {
      id: 'job_matching',
      title: 'Job Matching',
      description: 'Find jobs that match your skills and experience',
      icon: <Search className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      usage: mockUsage.job_matching
    }
  ];

  const stats = [
    {
      label: 'AI Chats Used',
      value: `${mockUsage.ai_chats.used}/${mockUsage.ai_chats.limit}`,
      icon: <MessageSquare className="w-4 h-4" />,
      color: 'text-blue-500'
    },
    {
      label: 'Resume Analysis',
      value: `${mockUsage.resume_parsing.used}/${mockUsage.resume_parsing.limit}`,
      icon: <FileText className="w-4 h-4" />,
      color: 'text-green-500'
    },
    {
      label: 'Job Matches',
      value: `${mockUsage.job_matching.used}/${mockUsage.job_matching.limit}`,
      icon: <Search className="w-4 h-4" />,
      color: 'text-orange-500'
    }
  ];
  React.useEffect(() => {
<<<<<<< HEAD
    // Redirect to dashboard after a brief delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);


  React.useEffect(() => {
=======
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function groupMessages(msgs: typeof messages) {
    const groups: { role: 'user' | 'assistant'; messages: { text: string; timestamp: Date }[] }[] = [];
    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      if (groups.length === 0 || groups[groups.length - 1].role !== msg.role) {
        groups.push({ role: msg.role, messages: [{ text: msg.content, timestamp: msg.timestamp }] });
      } else {
        groups[groups.length - 1].messages.push({ text: msg.content, timestamp: msg.timestamp });
      }
    }
    return groups;
  }

  const grouped = groupMessages(messages);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CF</span>
              </div>
              <h1 className="text-xl font-semibold">CareerForge AI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowVoice(true)}
                disabled={!hasVoiceSubscription}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Mic className="w-4 h-4" />
                <span>Voice Assistant</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
=======
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-white shadow-lg backdrop-blur-sm border border-gray-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static left-0 top-0 z-50 flex flex-col h-screen bg-black/90 border-r border-gray-800 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } w-64`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Transform Your Career with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get personalized career advice, optimize your resume, and find the perfect job matches with our AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowSubscriptionCards(true)}
              className="px-8 py-3 rounded-lg border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-colors"
            >
              View Plans
        {/* Navigation */}
=======
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
        <nav className="flex-1 p-4 space-y-2">
          <a href="/" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </a>
          <a href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Briefcase className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="/pricing" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <CreditCard className="w-5 h-5" />
            <span>Pricing</span>
          </a>
          <a href="/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
          <a href="/help" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">U</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">User</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Usage</span>
                <span className="text-gray-300">{feature.usage.used}/{feature.usage.limit}</span>
              </div>
            </motion.div>
          ))}
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-lg sm:text-xl font-semibold text-white">CareerForge AI</h1>
        </div>
<<<<<<< HEAD

        {/* Usage Stats */}
        <div className="bg-gray-800 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Usage</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-white font-semibold">{stat.value}</p>
=======
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${messages.length > 0 ? '' : 'flex items-center justify-center'}`}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 max-w-md px-4">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to CareerForge AI</h2>
                <p className="text-sm sm:text-base text-gray-500 mb-6">
                  Your AI-powered career assistant. Ask me anything about resumes, job matching, or career advice.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleFeatureClick('resume_parsing')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-blue-400" />
                    <h3 className="font-medium text-white text-sm sm:text-base">Resume Analysis</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Upload and analyze your resume</p>
                  </button>
                  <button 
                    onClick={() => handleFeatureClick('job_matching')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-green-400" />
                    <h3 className="font-medium text-white text-sm sm:text-base">Job Matching</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Find matching job opportunities</p>
                  </button>
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-gray-800 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6">AI Career Assistant</h2>
          
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  {message.content}
            ) : (
              grouped.map((group, i) => (
                <div
                  key={i}
                  className={`flex ${group.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85vw] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                      group.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {group.messages.map((msg, j) => (
                      <div key={j} className="text-sm sm:text-base">{msg.text}</div>
                    ))}
                    <span className="text-xs text-gray-500 mt-1 ml-1">{formatTime(group.messages[group.messages.length - 1].timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
<<<<<<< HEAD
                <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>AI is thinking...</span>
=======
                <div className="bg-gray-800 text-gray-100 px-3 sm:px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-sm sm:text-base">Thinking...</span>
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
<<<<<<< HEAD

          {/* Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your career..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <AnimatePresence>
          {showSubscriptionCards && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSubscriptionCards(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Choose Your Plan</h2>
                  <button
                    onClick={() => setShowSubscriptionCards(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`bg-gray-800 rounded-xl p-6 border-2 ${
                        plan.popular
                          ? 'border-blue-500 bg-gray-800/50'
                          : 'border-gray-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-4xl font-bold mb-6">
                        ${plan.price}
                        <span className="text-lg text-gray-400">/month</span>
                      </p>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          setShowSubscriptionCards(false);
                        }}
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
=======
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
          {/* Feature Icons */}
          {messages.length > 0 && (
            <div className="flex justify-center space-x-2 sm:space-x-4 p-4 border-t border-gray-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeatureClick('resume_parsing')}
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Resume
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeatureClick('job_matching')}
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Jobs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeatureClick('voice_assistant')}
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Voice
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Upload
              </Button>
            </div>
          )}
<<<<<<< HEAD
        </AnimatePresence>

        {/* Subscription Warning */}
        <AnimatePresence>
          {showSubWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSubWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
=======
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={messages.length === 0 ? "Start a conversation..." : "Ask CareerForge AI anything..."}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4"
              >
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Upgrade Required</h3>
                  <p className="text-gray-400 mb-6">
                    This feature requires a premium subscription. Upgrade to access all features.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowSubWarning(false)}
                      className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowSubWarning(false);
                        setShowSubscriptionCards(true);
                      }}
                      className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CommandPalette />
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
