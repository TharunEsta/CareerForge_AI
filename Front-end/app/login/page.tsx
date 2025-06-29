"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const doLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", form.username);
      formData.append("password", form.password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      // ✅ Store access token
      localStorage.setItem("token", data.access_token);

      // ✅ Optional: store user info
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 tracking-tight">Sign in to SkillSync AI</h2>
          <p className="text-gray-500 mt-1 text-sm">Your AI-powered career assistant</p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            name="username"
            placeholder="Email"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            disabled={isLoading}
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            disabled={isLoading}
            autoComplete="current-password"
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            onClick={doLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition duration-200 shadow-sm"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>
        <div className="mt-6 text-center space-y-2 text-sm">
          <p>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
