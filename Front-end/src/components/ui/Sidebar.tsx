"use client";
import React, { useState } from "react";
import { Menu, Plus, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [chats, setChats] = useState<string[]>(["Welcome to CareerForge AI"]);

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        exit={{ x: -200 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`h-screen bg-black/90 border-r border-gray-800 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"} p-4 z-40`}
      >
        <button
          className="mb-6 p-2 rounded hover:bg-gray-800 text-white flex items-center justify-center"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={22} />
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
          onClick={() => setChats([`New Chat ${chats.length + 1}`, ...chats])}
        >
          <Plus size={18} />
          {!collapsed && <span>New Chat</span>}
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map((chat, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition">
              <MessageSquare size={16} />
              {!collapsed && <span className="truncate">{chat}</span>}
            </div>
          ))}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
} 