"use client";
import React, { useRef, useState, useEffect } from "react";
import { PromptSuggestions } from "./ui/PromptSuggestions";
import { MessageBubble } from "./ui/MessageBubble";
import { Loader2, RefreshCw, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message { role: "user" | "ai"; content: string; }

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [suggested, setSuggested] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = async (prompt?: string) => {
    const content = prompt || input.trim();
    if (!content) return;
    setMessages((msgs) => [...msgs, { role: "user", content }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { role: "ai", content: "This is a simulated AI response." }]);
      setThinking(false);
    }, 1500);
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

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh] bg-card rounded-2xl shadow-xl relative overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <Loader2 className="animate-spin" size={20} />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Floating Input */}
      <div className="absolute bottom-0 left-0 w-full bg-background/90 border-t border-border p-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-transparent text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          disabled={loading || thinking}
        />
        <button
          className="p-2 rounded-full bg-primary hover:bg-primary/80 text-white transition disabled:opacity-50"
          onClick={() => handleSend()}
          disabled={loading || thinking || !input.trim()}
        >
          <Loader2 size={22} className={loading ? "animate-spin" : "hidden"} />
          <span className={loading ? "hidden" : "block"}>→</span>
        </button>
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition ml-2"
          onClick={handleRegenerate}
          disabled={messages.length === 0 || thinking}
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
} 