"use client";
import React, { useRef, useState, useEffect } from "react";
import { PromptSuggestions } from "./ui/PromptSuggestions";
import { MessageBubble } from "./ui/MessageBubble";
import { Loader2, RefreshCw, Sparkles, Globe, Paperclip, Mic, AudioLines, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useChat } from '@/lib/hooks';

interface Message { role: "user" | "ai"; content: string; }

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [suggested, setSuggested] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const FREE_TIER_LIMIT = 15;
  const [freeCount, setFreeCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const router = useRouter();
  const chatMutation = useChat();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Simulate streaming AI response
  function streamAIResponse(text: string, onUpdate: (chunk: string) => void, onDone: () => void) {
    let i = 0;
    function stream() {
      if (i < text.length) {
        onUpdate(text.slice(0, i + 1));
        i++;
        setTimeout(stream, 20); // typing speed
      } else {
        onDone();
      }
    }
    stream();
  }

  const handleSend = async (prompt?: string) => {
    const content = prompt || input.trim();
    if (!content) return;
    if (freeCount >= FREE_TIER_LIMIT) {
      setShowUpgrade(true);
      return;
    }
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages as Message[]);
    setInput("");
    setFreeCount((c) => c + 1);
    setThinking(true);
    chatMutation.mutate(
      { messages: newMessages },
      {
        onSuccess: (data: any) => {
          setMessages((msgs) => [...msgs, { role: "ai", content: data.response }]);
          setThinking(false);
        },
        onError: (err: any) => {
          setMessages((msgs) => [...msgs, { role: "ai", content: "Sorry, something went wrong. Please try again." }]);
          setThinking(false);
        },
      }
    );
  };

  const handleRegenerate = () => {
    if (messages.length === 0) return;
    setThinking(true);
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { role: "ai", content: "Regenerated AI response." }]);
      setThinking(false);
    }, 1500);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Responsive/floating chat bar logic
  const isEmpty = messages.length === 0 && !thinking;

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-background">
      <div className={`flex-1 w-full flex flex-col items-center justify-${isEmpty ? "center" : "end"} transition-all duration-300 pt-8 pb-0 md:pb-8`}> 
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-end">
          {/* Message list */}
          <div className={`flex-1 overflow-y-auto px-2 md:px-0 space-y-4 ${isEmpty ? "hidden" : "block"}`} style={{ minHeight: isEmpty ? 0 : 200 }}>
            <PromptSuggestions onSelect={handleSend} />
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <MessageBubble
                    role={msg.role}
                    content={msg.content}
                    onCopy={() => handleCopy(msg.content)}
                    showCopy={msg.role === "ai"}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-900 flex items-center gap-2 animate-pulse">
                  <TypingIndicator />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            {chatMutation.isError && (
              <div className="w-full max-w-2xl mx-auto mb-2 text-red-600 text-center text-sm">Failed to get AI response. Please try again.</div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Warning bar for free tier exhausted */}
          {freeCount >= FREE_TIER_LIMIT && (
            <div className="w-full max-w-2xl mx-auto mb-4 flex items-center justify-between bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-2 text-sm shadow">
              <span>If you need to continue</span>
              <button
                className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-4 rounded transition"
                onClick={() => router.push('/pricing')}
              >
                Get Plus
              </button>
            </div>
          )}
          {/* Floating/centered chat bar */}
          <motion.div
            className={`w-full flex flex-col items-center transition-all duration-300 ${isEmpty ? "justify-center min-h-[60vh]" : "justify-end"}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="w-full max-w-2xl bg-card/90 border border-gray-200 rounded-2xl shadow-xl px-2 py-4 flex flex-col gap-2 md:gap-4 mx-auto">
              {/* Perplexity-style button row */}
              <div className="flex items-center gap-2 mb-2">
                <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label="Search"><Search size={20} /></button>
                <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label="Rephrase"><RefreshCw size={20} /></button>
                <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label="Prompt Suggestions"><Sparkles size={20} /></button>
                <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label="Language"><Globe size={20} /></button>
                <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label="Attach File"><Paperclip size={20} /></button>
                <button className="p-2 rounded-lg hover:bg-gray-200 transition" aria-label="Mic"><Mic size={20} /></button>
                <button
                  className="ml-auto p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                  onClick={() => handleSend()}
                  disabled={loading || thinking || !input.trim()}
                  aria-label="Send"
                >
                  <AudioLines size={22} />
                </button>
              </div>
              {/* Input field */}
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  className="flex-1 bg-transparent text-foreground px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ask anything or @mention a Space"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  disabled={loading || thinking}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
} 