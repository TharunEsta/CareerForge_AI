'use client';

import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import Link from 'next/link';

function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white font-bold">CF</span>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist. Let's get you back to your AI career assistant.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <MessageSquare size={20} />
            <span>Back to Chat</span>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>CareerForge AI - Your AI-powered career assistant</p>
        </div>
      </div>
    </div>
  );
}
