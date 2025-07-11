'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">CareerForge AI</h1>
        <p className="text-lg text-gray-300 mb-8">Preview is working! ✅</p>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
          Welcome to your AI Career Assistant
        </div>
        <div className="mt-8 text-sm text-gray-400">
          If you can see this message, the preview environment is functioning correctly.
        </div>
      </div>
    </div>
  );
}
