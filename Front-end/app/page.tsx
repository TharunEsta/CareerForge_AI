'use client';
import * as React from 'react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Mic,
  Plus,
  User,
  LogOut,
  Upload,
  MessageSquare,
  Home,
  Globe,
  Layers,
  ArrowUpRight,
  Download,
  Star,
  Settings,
  Send,
  FileText,
  Briefcase,
  CreditCard,
  HelpCircle,
  Sparkles,
  Search,
  Shuffle,
  Lightbulb,
  Paperclip,
  Waveform,
} from 'lucide-react';
import { motion } from 'framer-motion';
import VoiceAssistant from '@/components/VoiceAssistant';
import { useAuth } from '@/components/AuthContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import WaveformVisualizer from '@/components/ui/WaveformVisualizer';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

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

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AppPage() {
  const { user, logout } = useAuth();
  const [showVoice, setShowVoice] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  
  const router = useRouter();

  const handleVoiceClick = () => {
    setShowVoice(true);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowChat(true);

    try {
      // Send message to AI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: 'user123', // Replace with actual user ID
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
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const handleFeatureClick = async (feature: string) => {
    // Handle different features
    switch (feature) {
      case 'resume_parsing':
        // Handle resume upload
        break;
      case 'job_matching':
        // Handle job matching
        break;
      case 'voice_assistant':
        // Handle voice assistant
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    // Redirect to dashboard after a brief delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  React.useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInput('Hello, how are you today?');
    }, 2000);
  };

  // Group consecutive messages from the same sender
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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      {/* Vercel-style Sidebar */}
      <div className="w-64 bg-black/90 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="text-white font-semibold text-lg">CareerForge</span>
          </div>
        </div>

        {/* Navigation */}
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

        {/* User Info */}
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-white">CareerForge AI</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${messages.length > 0 ? '' : 'flex items-center justify-center'}`}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 max-w-md">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-semibold mb-2">Welcome to CareerForge AI</h2>
                <p className="text-gray-500 mb-6">
                  Your AI-powered career assistant. Ask me anything about resumes, job matching, or career advice.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleFeatureClick('resume_parsing')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <FileText className="w-6 h-6 mb-2 text-blue-400" />
                    <h3 className="font-medium text-white">Resume Analysis</h3>
                    <p className="text-sm text-gray-400">Upload and analyze your resume</p>
                  </button>
                  <button 
                    onClick={() => handleFeatureClick('job_matching')}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <Briefcase className="w-6 h-6 mb-2 text-green-400" />
                    <h3 className="font-medium text-white">Job Matching</h3>
                    <p className="text-sm text-gray-400">Find matching job opportunities</p>
                  </button>
                </div>
              </div>
            ) : (
              grouped.map((group, i) => (
                <div
                  key={i}
                  className={`flex ${group.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      group.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {group.messages.map((msg, j) => (
                      <div key={j}>{msg.text}</div>
                    ))}
                    <span className="text-xs text-gray-500 mt-1 ml-1">{formatTime(group.messages[group.messages.length - 1].timestamp)}</span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feature Icons */}
          {messages.length > 0 && (
            <div className="flex justify-center space-x-4 p-4 border-t border-gray-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeatureClick('resume_parsing')}
                className="text-gray-400 hover:text-white"
              >
                <FileText className="w-5 h-5 mr-2" />
                Resume
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeatureClick('job_matching')}
                className="text-gray-400 hover:text-white"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Jobs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeatureClick('voice_assistant')}
                className="text-gray-400 hover:text-white"
              >
                <Mic className="w-5 h-5 mr-2" />
                Voice
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </Button>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={messages.length === 0 ? "Start a conversation..." : "Ask CareerForge AI anything..."}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
