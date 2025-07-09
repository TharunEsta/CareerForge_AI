<<<<<<< Updated upstream
import React, { useState } from "react";
import { useAuth } from "@/components/AuthContext";

=======
"use client";

"use client";

"use client";

import React from 'react';
>>>>>>> Stashed changes
export default function SignupPage() {
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const result = await register(email, password, name);
    if (!result) {
      setError("Registration failed. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black/70 rounded-xl shadow-lg p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">Registration successful! You can now <a href="/login" className="underline">sign in</a>.</div>}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="mt-4 text-gray-400 text-sm">
        Already have an account? <a href="/login" className="text-blue-400 hover:underline">Sign in</a>
      </div>
    </div>
  );
}
