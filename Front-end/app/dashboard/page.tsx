'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, Upload, Search, Sparkles, MessageSquare, Copy, Check } from 'lucide-react';
import { ChatBar } from '@/components/ChatBar';
import { useAuth } from '@/components/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ResumeData {
  skills: string[];
  education: string[];
  experience: string[];
  summary: string;
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  matchScore: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentPlan, canUseFeature, getCurrentUsage, getLimit } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [showSubscriptionCards, setShowSubscriptionCards] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Simulate typing animation
  const simulateTyping = async (response: string) => {
    setIsTyping(true);
    let displayedText = '';
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      displayedText += words[i] + ' ';
      setMessages(prev => prev.map(msg => 
        msg.id === 'typing' 
          ? { ...msg, content: displayedText.trim() }
          : msg
      ));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Check if user can use AI chat feature
    if (!canUseFeature('ai_chats')) {
      setShowSubscriptionCards(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Add typing indicator
      const typingMessage: Message = {
        id: 'typing',
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, typingMessage]);

      // Send message to AI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: user?.id || 'user123',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Remove typing indicator and add real response
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!canUseFeature('resume_parsing')) {
      setShowSubscriptionCards(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResumeData(data);
        
        // Add success message to chat
        const successMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ Resume uploaded successfully! I found ${data.skills.length} skills, ${data.education.length} education items, and ${data.experience.length} experience entries.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error('Failed to parse resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while parsing your resume. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleJobMatching = async () => {
    if (!resumeData) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please upload your resume first to enable job matching.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    if (!canUseFeature('job_matching')) {
      setShowSubscriptionCards(true);
      return;
    }

    try {
      const response = await fetch('/api/job-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: resumeData.skills,
          experience: resumeData.experience,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setJobMatches(data.jobs);
        
        const successMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🎯 Found ${data.jobs.length} matching jobs based on your resume! Check the job matches below.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error('Failed to find job matches');
      }
    } catch (error) {
      console.error('Error matching jobs:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while finding job matches. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#18181b] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white">CareerForge AI</h1>
          <p className="text-gray-400 text-sm">
            Your AI-powered career assistant. Ask me anything about resumes, job matching, or career advice.
          </p>
        </div>
        
        {currentPlan && (
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{getCurrentUsage('ai_chats')}/{getLimit('ai_chats')} chats</span>
            <span className="px-2 py-1 bg-gray-800 rounded-full text-xs">
              {currentPlan.toUpperCase()} Plan
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">Welcome to CareerForge AI</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Your AI-powered career assistant. Ask me anything about resumes, job matching, or career advice.
                </p>
                
                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Resume Analysis</h3>
                        <p className="text-gray-400 text-sm">Upload and analyze your resume for ATS optimization</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-200 cursor-pointer"
                    onClick={handleJobMatching}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Job Matching</h3>
                        <p className="text-gray-400 text-sm">Find matching job opportunities based on your skills</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleResumeUpload(file);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-6 py-4 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-800/50 backdrop-blur-xl text-gray-100 border border-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.role === 'assistant' && (
                              <button
                                onClick={() => copyToClipboard(message.content)}
                                className="ml-4 text-gray-400 hover:text-white transition-colors"
                              >
                                <Copy size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                        </div>
                        <span className="text-gray-400 text-sm">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Resume Data Display */}
            {resumeData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-4">📄 Resume Analysis</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Skills ({resumeData.skills.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Education ({resumeData.education.length})</h4>
                    <div className="space-y-1">
                      {resumeData.education.slice(0, 3).map((edu, index) => (
                        <p key={index} className="text-gray-400 text-xs">{edu}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Experience ({resumeData.experience.length})</h4>
                    <div className="space-y-1">
                      {resumeData.experience.slice(0, 3).map((exp, index) => (
                        <p key={index} className="text-gray-400 text-xs">{exp}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Job Matches Display */}
            {jobMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Job Matches ({jobMatches.length})</h3>
                <div className="space-y-4">
                  {jobMatches.slice(0, 3).map((job) => (
                    <div key={job.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{job.title}</h4>
                          <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
                          <p className="text-green-400 text-sm">{job.salary}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-400">Match Score:</span>
                            <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                              {job.matchScore}%
                            </span>
                          </div>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat Bar */}
        <div className="border-t border-gray-800 p-4">
          <div className="max-w-4xl mx-auto">
            <ChatBar onSend={handleSendMessage} loading={isLoading} />
          </div>
        </div>
      </div>

      {/* Subscription Cards Modal */}
      {showSubscriptionCards && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSubscriptionCards(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Upgrade Your Plan</h2>
            <p className="text-gray-400 mb-6">
              Unlock unlimited access to all features and get more AI chats, resume analysis, and job matching.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
                <p className="text-2xl font-bold text-white mb-2">$0</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• 5 AI chats/month</li>
                  <li>• Basic features</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 border border-blue-500">
                <h3 className="text-lg font-semibold text-white mb-2">Plus</h3>
                <p className="text-2xl font-bold text-white mb-2">$19</p>
                <ul className="text-white text-sm space-y-1">
                  <li>• 100 AI chats/month</li>
                  <li>• Resume analysis</li>
                  <li>• Job matching</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
                <p className="text-2xl font-bold text-white mb-2">$49</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Unlimited usage</li>
                  <li>• All features</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSubscriptionCards(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
