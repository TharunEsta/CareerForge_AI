'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChatBar } from '@/components/ChatBar';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useChatStore } from '../context/ChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const resetChat = useChatStore((s) => s.resetChat);
  const freeMessageCount = useChatStore((s) => s.freeMessageCount);
  const incrementMessageCount = useChatStore((s) => s.incrementMessageCount);
  const userPlan = useChatStore((s) => s.userPlan);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle sending a message
  const handleSend = async (message: string, file?: File) => {
    if (!message && !file) return;
    if (userPlan === 'free' && freeMessageCount >= 10) {
      setShowUpgrade(true);
      return;
    }
    addMessage({ role: 'user', content: message });
    incrementMessageCount();
    setLoading(true);
    setTimeout(() => {
      addMessage({ role: 'ai', content: 'This is a simulated AI response.' });
      setLoading(false);
    }, 1500);
  };

  const handleShare = () => {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(messages))));
    const url = `${window.location.origin}/share?c=${encoded}`;
    setShareUrl(url);
    setShareModal(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/placeholder-logo.svg"
            alt="CareerForge AI Logo"
            className="h-8 w-8"
            width={32}
            height={32}
          />
          <span className="font-bold text-lg text-blue-700">CareerForge AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition"
          >
            🏠 Dashboard
          </a>
          <a
            href="/dashboard/resume"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            📄 Resume Analysis
          </a>
          <a
            href="/dashboard/rewrite-resume"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            ✍️ Resume Rewriting
          </a>
          <a
            href="/dashboard/cover-letter"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            📧 Cover Letter
          </a>
          <a
            href="/dashboard/job-matching"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🎯 Job Matching
          </a>
          <a
            href="/dashboard/linkedin-optimization"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🔗 LinkedIn Optimization
          </a>
          <a
            href="/tools"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🛠️ AI Tools
          </a>
          <a
            href="/voice-assistant"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🎤 Voice Assistant
          </a>
          <a
            href="/agent"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🤖 AI Agent
          </a>
          <a
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            💳 Subscription Plans
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8 pb-32">
        <div className="max-w-2xl mx-auto flex flex-col h-[70vh] bg-white/80 rounded-xl shadow-lg overflow-hidden relative">
          {/* Share Conversation Button */}
          <div className="flex justify-end p-2">
            <button
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow"
              onClick={handleShare}
            >
              <Copy size={16} /> Share Conversation
            </button>
          </div>
          {/* Chat message list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>{msg.content}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-900 flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        {/* ChatBar pinned to bottom */}
        <ChatBar onSend={handleSend} loading={loading || showUpgrade} />
        <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
        {/* Share Modal */}
        {shareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full flex flex-col items-center">
              <h3 className="text-lg font-bold mb-2">Shareable Conversation Link</h3>
              <input
                className="w-full p-2 border rounded mb-4 text-gray-700 bg-gray-100"
                value={shareUrl}
                readOnly
                onFocus={e => e.target.select()}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={() => {navigator.clipboard.writeText(shareUrl)}}
              >Copy Link</button>
              <button
                className="text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => setShareModal(false)}
              >Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
