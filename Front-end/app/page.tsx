// Required dependencies for this page:
// - react
// - lucide-react
// - @types/react (for TypeScript projects)
// - zustand
// Make sure your tsconfig.json has "jsx": "react-jsx" or "react".

"use client";

<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/ui/sidebar";
import { useUserStore, initializeDemoUser } from "@/store/useUserStore";
import { UsageCounter } from "@/components/UsageCounter";
import {
  Search,
  RotateCcw,
  Lightbulb,
  Globe,
  Link,
  Mic,
  Crown,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProBanner, setShowProBanner] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { user, canAsk } = useUserStore();

  useEffect(() => {
    initializeDemoUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !canAsk()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
=======
import React, { useState, useRef } from "react";
import {
  Search,
  Lightbulb,
  Globe,
  Upload,
  Paperclip,
  Mic,
  Plus,
  BookOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useChatStore, Message } from "./context/ChatStore";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const createChat = useChatStore((state) => state.createChat);
  const switchChat = useChatStore((state) => state.switchChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const addMessageToChat = useChatStore((state) => state.addMessageToChat);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSend = () => {
    if (!inputValue.trim() || !activeChatId) return;
    const msg: Message = {
>>>>>>> 9117cff66fcf78b57107298458fb766e7cdbce31
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
<<<<<<< HEAD

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "AI response here",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomize = () => {
    const prompts = [
      "Help me optimize my resume for software engineering roles",
      "What skills should I highlight for a data scientist position?",
      "How can I improve my LinkedIn profile for networking?",
      "Create a cover letter for a product manager role",
      "What are the best practices for job interviews?",
    ];
    setInputValue(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const handleTips = () => {
    setInputValue("Show me career tips and best practices");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="min-h-screen bg-[#0f0f0f] text-white">
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-white mb-8 tracking-wide"
              >
                careerforge
              </motion.h1>

              <div className="w-full max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <form onSubmit={handleSubmit} className="relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask anything or @mention a Skill"
                      className="w-full h-14 bg-white/5 border-white/20 text-white placeholder-gray-400 rounded-xl pl-12 pr-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={!canAsk()}
                    />

                    {/* Left-side buttons */}
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                        <Search size={16} />
                      </motion.button>
                      <motion.button type="button" onClick={handleRandomize} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                        <RotateCcw size={16} />
                      </motion.button>
                      <motion.button type="button" onClick={handleTips} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                        <Lightbulb size={16} />
                      </motion.button>
                    </div>

                    {/* Right-side buttons */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                        <Globe size={16} />
                      </motion.button>
                      <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                        <Link size={16} />
                      </motion.button>
                      <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-6 h-6 text-gray-400 hover:text-white transition-colors">
                        <Mic size={16} />
                      </motion.button>
                      <motion.button type="submit" disabled={!inputValue.trim() || !canAsk()} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-8 h-8 bg-[#00C2FF] rounded-lg flex items-center justify-center hover:bg-[#00C2FF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Sparkles size={16} className="text-white" />
                      </motion.button>
                    </div>
                  </form>
                </motion.div>

                {/* Pro Banner */}
                <AnimatePresence>
                  {showProBanner && user?.plan === "free" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-6">
                      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">Introducing CareerForge Pro</h3>
                            <p className="text-gray-300 text-sm">Early access to resume AI & unlimited uploads</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                              <Crown size={20} className="text-white" />
                            </div>
                            <Button onClick={() => router.push("/pricing")} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                              Upgrade
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Usage Counter */}
                <div className="mt-6 flex justify-center">
                  <UsageCounter />
                </div>
              </div>
            </div>

            {/* Chat History */}
            {messages.length > 0 && (
              <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${message.role === "user" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-white/10 text-white border border-white/20"}`}>
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                          <span className="ml-2 text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
=======
    addMessageToChat(activeChatId, msg);
    setInputValue("");
    // Simulate AI response (replace with real API call)
    setIsTyping(true);
    setTimeout(() => {
      addMessageToChat(activeChatId, {
        role: "ai",
        content: "AI response to: " + msg.content,
        timestamp: new Date(),
      });
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full p-0">
      {/* Sidebar */}
      <aside className={`w-16 py-4 flex flex-col justify-between items-center bg-[#15161a] border-r border-[#23242a] transition-all duration-200 relative`}> 
        {/* Collapse/Expand Button */}
        <button
          className="absolute -right-3 top-4 h-8 w-8 flex items-center justify-center rounded-full bg-[#23242a] border border-[#23242a] hover:bg-[#23242a]/80 transition z-10 p-0"
          onClick={() => setSidebarCollapsed((c) => !c)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        <div className="flex flex-col items-center space-y-4 w-full">
          <button
            className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-[#23242a] transition"
            title="New Chat"
            onClick={createChat}
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-[#23242a] transition"
            title="Library"
            onClick={() => router.push("/library")}
          >
            <BookOpen className="h-5 w-5" />
          </button>
          <button
            className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-[#23242a] transition"
            title="Search"
            onClick={() => router.push("/search")}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        <div className={`mt-8 w-full px-0 ${sidebarCollapsed ? "hidden" : ""}`}>
          <div className="text-xs text-[#6b6b6b] mb-2 tracking-wide px-4">CHATS</div>
          <div className="flex flex-col gap-4 max-h-40 overflow-y-auto custom-scrollbar pr-1 px-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div key={chat.id} className="relative group flex items-center">
                  <button
                    className={`h-10 w-10 p-0 rounded-full flex items-center justify-center transition ${chat.id === activeChatId ? "bg-[#23242a] border border-[#00c2ff]" : "hover:bg-[#23242a]"}`}
                    title={chat.title || "Chat"}
                    onClick={() => switchChat(chat.id)}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  {/* Delete button, show on hover */}
                  {chats.length > 1 && (
                    <button
                      className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[#6b6b6b] hover:text-red-500 h-8 w-8 p-0 flex items-center justify-center"
                      title="Delete Chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-[#6b6b6b] text-center py-2">No chats yet</div>
            )}
          </div>
        </div>
        <div className="mt-auto flex flex-col items-center space-y-4 w-full pb-0">
          <button
            className="text-xs text-[#00c2ff] font-semibold hover:underline mb-2"
            onClick={() => router.push("/pricing")}
            title="Upgrade to Plus"
          >
            Renew Plus
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Topbar */}
        <div className="h-14 px-4 flex items-center justify-end border-b">
          {user && user.avatarUrl ? (
            <button
              className="h-8 w-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => router.push("/account")}
              title="Account"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>
          ) : (
            <button
              className="h-8 w-8 rounded-full flex items-center justify-center bg-[#23242a] text-white"
              onClick={() => router.push("/account")}
              title="Account"
            >
              <UserIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        {/* Main Content Area */}
        <main className="flex-1 p-4 flex flex-col overflow-y-auto space-y-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-white tracking-tight text-center select-none">
            careerforge
          </h1>

          {/* Chat Title */}
          <div className="w-full max-w-xl text-left mb-2 px-2">
            <span className="text-lg font-semibold text-white">
              {activeChat ? (activeChat.title || "New Chat") : "No Chat Selected"}
            </span>
          </div>

          {/* Chat Messages */}
          <div className="w-full max-w-xl flex-1 bg-[#18191d] rounded-2xl px-6 py-4 mb-6 border border-[#23242a] overflow-y-auto min-h-[200px]">
            {activeChat && activeChat.messages.length > 0 ? (
              activeChat.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`max-w-xs px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/10 text-white border border-white/20'}`}>
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#6b6b6b] text-center py-2">No messages yet</div>
            )}
            {/* Typing Dots */}
            {isTyping && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 bg-[#3a8bfd] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                <span className="w-3 h-3 bg-[#3a8bfd] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-3 h-3 bg-[#3a8bfd] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              </div>
            )}
          </div>

          {/* Promo Card */}
          <div className="w-full max-w-xl bg-gradient-to-r from-[#3a1c71]/80 to-[#d76d77]/80 rounded-2xl px-8 py-5 flex items-center justify-between mb-6 shadow-lg border border-[#23242a]">
            <div>
              <div className="text-xl font-semibold text-white mb-1">
                Introducing CareerForge Pro
              </div>
              <div className="text-sm text-[#b0b0b0]">
                Early access to resume AI & unlimited uploads
              </div>
            </div>
            <button className="ml-8 px-6 py-2 rounded-xl bg-gradient-to-r from-[#7f53ac] to-[#647dee] text-white font-bold shadow-[0_0_10px_2px_#7f53ac80] hover:from-[#5f3c8a] hover:to-[#4b5fc0] transition text-lg">
              Upgrade
            </button>
          </div>

          {/* Free Tier Usage Card */}
          <div className="w-full max-w-xl bg-[#18191d] rounded-2xl px-8 py-5 flex flex-col mb-10 border border-[#23242a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold text-white">Free</span>
              <span className="text-base text-[#b0b0b0]">You've reached your free tier limits</span>
            </div>
            <div className="w-full h-1 bg-[#23242a] rounded-full overflow-hidden">
              <div className="h-1 bg-[#00c2ff] w-1/4 rounded-full transition-all"></div>
            </div>
          </div>
        </main>
        {/* Chat Bar (Sticky Bottom) */}
        <div className="sticky bottom-0 bg-[#18191d] w-full border-t p-4 flex items-center gap-2 h-16 z-10">
          <input
            ref={inputRef}
            className="flex-1 py-3 px-4 text-base rounded-xl bg-transparent outline-none border-none"
            placeholder="Ask anything or @mention a Skill"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            disabled={!activeChatId}
          />
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#15161a] hover:bg-[#23242a] transition" title="Search">
            <Search className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#15161a] hover:bg-[#23242a] transition" title="Tips">
            <Lightbulb className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#15161a] hover:bg-[#23242a] transition" title="Globe">
            <Globe className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#15161a] hover:bg-[#23242a] transition" title="Upload">
            <Upload className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#15161a] hover:bg-[#23242a] transition" title="Attach">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#15161a] hover:bg-[#23242a] transition" title="Mic">
            <Mic className="h-5 w-5" />
          </button>
          {/* Glowing blue voice input button */}
          <button
            className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-[#00c2ff] shadow-[0_0_10px_2px_#00c2ff80] hover:bg-[#00a6d6] transition"
            onClick={handleSend}
            disabled={!inputValue.trim() || !activeChatId}
            title="Send"
          >
            <Mic className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
>>>>>>> 9117cff66fcf78b57107298458fb766e7cdbce31
    </div>
  );
}
