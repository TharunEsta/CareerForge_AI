'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
export default function ShareConversationPage() {
  const params = useSearchParams();
  const encoded = params.get('c');
  let messages: { role: string; content: string }[] = [];
  let error = '';
  if (encoded) {
    try {
      messages = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
      error = 'Invalid or corrupted conversation link.';
  } else {
    error = 'No conversation found in link.';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Shared Conversation</h1>
        {error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
