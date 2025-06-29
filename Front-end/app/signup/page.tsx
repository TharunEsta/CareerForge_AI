"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL;
        setApiUrl(url || "Not set");
        const res = await fetch(`${url}/`, { method: "GET", headers: { "Accept": "application/json" } });
        if (res.ok) setServerStatus("online");
        else setServerStatus("offline");
      } catch (err) {
        setServerStatus("offline");
      }
    };
    checkServer();
  }, []);

  const signup = async () => {
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/signup`;
      const res = await fetch(url, { method: "POST", headers: { "Accept": "application/json" }, body: formData });
      if (!res.ok) {
        const err = await res.json();
        const detail = err.detail ?? "Signup failed";
        throw new Error(Array.isArray(detail) ? JSON.stringify(detail) : detail);
      }
      router.push("/login");
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setError(`Cannot connect to the server at ${apiUrl}. Please make sure the backend is running at http://127.0.0.1:8000`);
      } else {
        setError(err.message || "Unknown signup error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 tracking-tight">Create your SkillSync AI account</h2>
          <p className="text-gray-500 mt-1 text-sm">Sign up to unlock your AI-powered career tools</p>
        </div>
        <div className="mb-4 space-y-2 text-sm">
          <div className="p-2 bg-gray-100 rounded text-center">
            <p>API URL: {apiUrl}</p>
            <p>Server Status: {serverStatus === "checking" ? "Checking..." : serverStatus === "online" ? "✅ Online" : "❌ Offline"}</p>
          </div>
        </div>
        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            type="text"
            placeholder="Full Name"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            disabled={isLoading}
            autoComplete="name"
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={isLoading}
            autoComplete="email"
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition duration-200 shadow-sm"
            onClick={signup}
            disabled={isLoading || serverStatus !== "online"}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">Log In</a>
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
