'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // For now, just do a simple login without API call
    if (email && password) {
      login({
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
      });
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black/70 rounded-xl shadow-lg p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-white">Sign In</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4 text-gray-400 text-sm">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-blue-400 hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
}
