"use client";

import React, { useState } from 'react';
import { Home, Globe, Layers, User, ArrowLeftRight, Download, Plus, ChevronLeft, ChevronRight, IndianRupee } from 'lucide-react';

const sidebarItems = [
  { icon: <Home size={22} />, label: 'Home' },
  { icon: <Globe size={22} />, label: 'Discover' },
  { icon: <Layers size={22} />, label: 'Spaces' },
  { icon: <User size={22} />, label: 'Account' },
  { icon: <ArrowLeftRight size={22} />, label: 'Upgrade' },
  { icon: <Download size={22} />, label: 'Install' },
  { icon: <IndianRupee size={22} />, label: 'Pricing', isPricing: true },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`h-screen bg-[#18181b] text-white flex flex-col transition-all duration-300 border-r border-gray-800 ${
      collapsed ? 'w-16' : 'w-64'
    } fixed left-0 top-0 z-40 flex`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <span className="font-bold text-xl tracking-wide flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 2L20.09 11.26L30 12.27L22 19.14L24.18 29.02L16 23.77L7.82 29.02L10 19.14L2 12.27L11.91 11.26L16 2Z" fill="#fff"/></svg>
          {!collapsed && <span>Perplexity</span>}
        </span>
        <button onClick={() => setCollapsed(c => !c)} className="ml-2 p-1 rounded hover:bg-gray-700 transition">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {sidebarItems.map((item, idx) => (
          <button key={item.label} className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition-all ${collapsed ? 'justify-center' : ''} ${idx === 0 ? 'bg-gray-800' : ''}`}>
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
        <button className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all mt-4 ${collapsed ? 'justify-center' : ''}`}>
          <Plus size={22} />
          {!collapsed && <span>New</span>}
        </button>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-8 h-8 rounded-full" />
          {!collapsed && <span className="text-sm">Account</span>}
        </div>
      </div>
    </aside>
  );
}


