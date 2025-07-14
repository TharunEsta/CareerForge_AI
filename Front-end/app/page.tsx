'use client';
import * as React from 'react';
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


interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

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
            </div>
          </div>
        </div>
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
                <div className="bg-gray-800 text-gray-100 px-3 sm:px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-sm sm:text-base">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
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
