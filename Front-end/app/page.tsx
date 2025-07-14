// Required dependencies for this page:
// - react
// - lucide-react
// - @types/react (for TypeScript projects)
// - zustand
// Make sure your tsconfig.json has "jsx": "react-jsx" or "react".

"use client";

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
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
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
    </div>
  );
}

