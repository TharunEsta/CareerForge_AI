'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="mb-8">
          {/* CareerForge AI Logo */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CF</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">CareerForge AI</h1>
          <p className="text-xl text-gray-400 mb-6">
            Your AI-powered assistant for resumes, job matching, and career help.
          </p>

          {/* Warning Message */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
            <p className="text-yellow-300 text-sm">
              ⚠️ CareerForge AI is in beta. Don't share sensitive personal information.
            </p>
          </div>
        </div>

        {/* Simple Input */}
        <div className="space-y-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask CareerForge AI anything..."
            className="w-full px-4 py-3 bg-[#161b22] border border-gray-700 rounded-lg text-[#f0f6fc] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            onClick={() => alert('Button clicked! Page is working.')}
          >
            Test Button
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If you can see this, the page is loading correctly!</p>
        </div>
      </div>
    </div>
  );
}
