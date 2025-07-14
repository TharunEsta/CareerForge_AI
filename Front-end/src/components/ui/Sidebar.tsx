"use client";
import React, { useState } from "react";
import { Menu, Plus, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  // Collapsed by default
  const [collapsed, setCollapsed] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);
  const [chats, setChats] = useState<string[]>(["Welcome to CareerForge AI"]);

  // Mobile: show floating menu button
  return (
    <>
      {/* Floating menu button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-black/80 text-white shadow-lg"
        onClick={() => setOpenMobile(true)}
        aria-label="Open sidebar"
        style={{ display: openMobile ? 'none' : undefined }}
      >
        <Menu size={24} />
      </button>
      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            className="fixed inset-0 z-50 flex md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpenMobile(false)}
            />
            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative h-full w-64 bg-black/90 border-r border-gray-800 flex flex-col p-4 z-50"
            >
              <button
                className="mb-6 p-2 rounded hover:bg-gray-800 text-white flex items-center justify-center"
                onClick={() => setOpenMobile(false)}
                aria-label="Close sidebar"
              >
                <X size={22} />
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                onClick={() => setChats([`New Chat ${chats.length + 1}`, ...chats])}
              >
                <Plus size={18} />
                <span>New Chat</span>
              </button>
              <div className="flex-1 overflow-y-auto space-y-2">
                {chats.map((chat, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition">
                    <MessageSquare size={16} />
                    <span className="truncate">{chat}</span>
                  </div>
                ))}
              </div>
              {/* Free Tier Section */}
              <div className="mt-8">
                <div className="text-xs text-gray-400 mb-2">FREE Tier</div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">Continue</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          exit={{ x: -200 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`h-screen bg-black/90 border-r border-gray-800 flex-col transition-all duration-300 w-16 md:w-64 p-4 z-40 hidden md:flex`}
        >
          <button
            className="mb-6 p-2 rounded hover:bg-gray-800 text-white flex items-center justify-center"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={22} />
          </button>
          {!collapsed && (
            <>
              <button
                className="flex items-center gap-2 px-3 py-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                onClick={() => setChats([`New Chat ${chats.length + 1}`, ...chats])}
              >
                <Plus size={18} />
                <span>New Chat</span>
              </button>
              <div className="flex-1 overflow-y-auto space-y-2">
                {chats.map((chat, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-white cursor-pointer hover:bg-gray-700 transition">
                    <MessageSquare size={16} />
                    <span className="truncate">{chat}</span>
                  </div>
                ))}
              </div>
              {/* Free Tier Section */}
              <div className="mt-8">
                <div className="text-xs text-gray-400 mb-2">FREE Tier</div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">Continue</button>
              </div>
            </>
          )}
        </motion.aside>
      </AnimatePresence>
    </>
  );
} 
