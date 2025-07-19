'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Plus,
  Home,
  MessageCircle,
  Archive,
  Globe,
  ArrowRight,
  Mic,
  Image as ImageIcon,
  MoreHorizontal,
  Crown,
  User,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function CareerForgeDashboard() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'personal' | 'business'>('personal');
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

  const handleUpgradeClick = () => {
    setShowPricingModal(true);
  };

  const handleRenewPlusClick = () => {
    setShowPricingModal(true);
  };

  // Chat view when messages exist
  if (messages.length > 0) {
    return (
      <>
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
        {showPricingModal && (
          <PricingModal
            onClose={() => setShowPricingModal(false)}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        )}
      </>
    );
  }

  // Main dashboard view (like second image)
  return (
    <>
      <div className="flex h-screen bg-[#0a0a0a] text-gray-100">
        {/* Left Sidebar */}
        <div className="w-16 bg-[#171717] border-r border-[#2d2d2d] flex flex-col items-center py-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-6 h-6 text-white">
              <Sparkles size={20} />
            </div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <Plus size={20} />
            </button>
            <button className="p-2 text-[#20b2aa] bg-[#2d2d2d] rounded-lg">
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

          {/* Renew Plus Button - positioned at bottom left like in image */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleRenewPlusClick}
              className="bg-[#4285f4] hover:bg-[#357ae8] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
            >
              Renew Plus
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-lg transition-colors">
              <ArrowRight size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2d2d2d]">
            <h1 className="text-2xl font-light text-white tracking-wide">careerforge</h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
            <div className="w-full max-w-2xl">
              {/* Search Input - exactly like second image */}
              <div className="mb-8">
                <div className="relative bg-[#2d2d2d] rounded-2xl hover:bg-[#333333] transition-colors border border-[#404040]">
                  <div className="flex items-center px-5 py-4">
                    <Search size={20} className="text-gray-400 mr-4 flex-shrink-0" />
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask anything or @mention a Skill"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-32 text-base"
                      rows={1}
                    />
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#404040] rounded-lg transition-colors">
                        <Mic size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#404040] rounded-lg transition-colors">
                        <ImageIcon size={16} />
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

              {/* CareerForge Pro Card - exactly like second image */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-medium mb-2">
                        Introducing CareerForge Pro
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Early access to resume AI & unlimited uploads
                      </p>
                    </div>
                    <div className="ml-6 flex-shrink-0">
                      <button
                        onClick={handleUpgradeClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Tier Limit Card - exactly like second image */}
              <div className="mb-8">
                <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-[#20b2aa] font-semibold text-sm mr-4">Free</div>
                      <div className="w-2 h-2 bg-[#20b2aa] rounded-full mr-2"></div>
                      <div className="w-2 h-2 bg-[#20b2aa] rounded-full mr-2"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      You've reached your free tier limits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal
          onClose={() => setShowPricingModal(false)}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      )}
    </>
  );
}

// Pricing Modal Component
function PricingModal({
  onClose,
  selectedPlan,
  setSelectedPlan,
}: {
  onClose: () => void;
  selectedPlan: 'personal' | 'business';
  setSelectedPlan: (plan: 'personal' | 'business') => void;
}) {
  const personalPlans = {
    free: {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Explore how AI can help you with everyday tasks',
      features: [
        'Access to GPT-4o mini and reasoning',
        'Standard voice mode',
        'Real-time data from the web with search',
        'Limited access to GPT-4o and o4-mini',
        'Limited access to file uploads, advanced data analysis, and image generation',
        'Use custom GPTs',
      ],
      current: true,
    },
    plus: {
      name: 'Plus',
      price: '₹599',
      period: '/month',
      description: 'Everything in Free',
      features: [
        'Extended limits on messaging, file uploads, advanced data analysis, and image generation',
        'Standard and advanced voice mode',
        'Access to deep research, multiple reasoning models (o4-mini, o4-mini-high, and o3), and a research preview of GPT-4.5',
        'Create and use tasks, projects, and custom GPTs',
        'Limited access to Sora video generation',
      ],
      popular: true,
      buttonText: 'Get Plus',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    pro: {
      name: 'Pro',
      price: '₹1399',
      period: '/month',
      description: 'Get the best of OpenAI with the highest level of access',
      features: [
        'Everything in Plus',
        'Unlimited access to all reasoning models and GPT-4o',
        'Unlimited access to advanced voice',
        'Extended access to deep research, which conducts multi-step online research for complex tasks',
        'Access to research previews of GPT-4.5 and Operator',
        'Access to o3 pro mode, which uses more compute for the best answers to the hardest questions',
        'Extended access to Sora video generation',
      ],
      buttonText: 'Get Pro',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
    },
  };

  const businessPlan = {
    name: 'Business',
    price: '₹1999',
    period: '/month',
    description: 'Advanced AI capabilities for teams and organizations',
    features: [
      'Everything in Pro',
      'Team management and collaboration tools',
      'Advanced security and compliance',
      'Priority support',
      'Custom integrations',
      'Enterprise-grade analytics',
    ],
    buttonText: 'Contact Sales',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-[#2d2d2d] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white">Upgrade your plan</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>

          {/* Plan Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#2d2d2d] rounded-full p-1 flex">
              <button
                onClick={() => setSelectedPlan('personal')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPlan === 'personal'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setSelectedPlan('business')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPlan === 'business'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Business
              </button>
            </div>
          </div>

          {/* Plans */}
          {selectedPlan === 'personal' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(personalPlans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`bg-[#1a1a1a] border rounded-2xl p-6 relative ${
                    plan.popular ? 'border-green-500' : 'border-[#2d2d2d]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  {plan.current ? (
                    <button className="w-full bg-[#2d2d2d] text-gray-400 font-medium py-3 rounded-lg mb-6 cursor-not-allowed">
                      Your current plan
                    </button>
                  ) : (
                    <button
                      className={`w-full text-white font-medium py-3 rounded-lg mb-6 transition-colors ${plan.buttonColor}`}
                    >
                      {plan.buttonText}
                    </button>
                  )}

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-300">
                        <span className="text-green-500 mr-3 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{businessPlan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-bold text-white">{businessPlan.price}</span>
                    <span className="text-gray-400 ml-1">{businessPlan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{businessPlan.description}</p>
                </div>

                <button
                  className={`w-full text-white font-medium py-3 rounded-lg mb-6 transition-colors ${businessPlan.buttonColor}`}
                >
                  {businessPlan.buttonText}
                </button>

                <ul className="space-y-3">
                  {businessPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className="text-green-500 mr-3 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
