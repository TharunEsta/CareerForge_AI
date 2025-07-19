import React, { useState, useEffect } from "react";
import { User, Library, Plus, Search, Mic, MessageSquare, BarChart3, Sparkles, AlertTriangle, Upload, Download, Settings, LogOut } from "lucide-react";
import apiService, { User as UserType, SubscriptionPlan, ResumeData } from "./services/api";

// Placeholder Button component
const Button = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors ${className}`.trim()}
  >
    {children}
  </button>
);

// Placeholder Input component
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`border border-gray-300 rounded px-3 py-2 w-full ${props.className || ''}`.trim()}
  />
);

// Placeholder Avatar component
const Avatar = () => (
  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
    <User className="w-5 h-5 text-white" />
  </div>
);

// Placeholder Card component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`rounded-lg shadow-lg p-6 bg-white bg-opacity-10 border border-gray-700 ${className || ''}`.trim()}>
    {children}
  </div>
);

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`https://careerforge.info${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          ...(isLogin ? {} : { name: name })
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (isLogin) {
          localStorage.setItem('token', data.access_token || data.token);
          window.location.reload();
        } else {
          // For signup, show OTP input
          setShowOtp(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('https://careerforge.info/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token || data.token);
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      window.location.href = 'https://careerforge.info/api/auth/google';
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#10121A] px-2">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">careerforge</h1>
          <p className="text-gray-400 text-lg">AI-driven career tools for professionals</p>
        </div>
        <div className="w-full max-w-md bg-[#181B23] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Verify OTP</h2>
          <p className="text-gray-400 text-center mb-6">Enter the OTP sent to your email</p>
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">OTP</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-[#23263A] text-white border border-[#23263A] focus:border-blue-500 focus:outline-none"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <div className="text-center mt-4 text-gray-400">
            <button className="text-blue-400 hover:underline" onClick={() => setShowOtp(false)}>
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#10121A] px-2">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">careerforge</h1>
        <p className="text-gray-400 text-lg">AI-driven career tools for professionals</p>
      </div>
      <div className="w-full max-w-md bg-[#181B23] rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {isLogin ? "Sign in to your account" : "Sign up to get started"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded bg-[#23263A] text-white border border-[#23263A] focus:border-blue-500 focus:outline-none"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
              </span>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 rounded bg-[#23263A] text-white border border-[#23263A] focus:border-blue-500 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="10" x="5" y="7" rx="2"/><path d="M12 11v2"/><path d="M7 7V5a5 5 0 0 1 10 0v2"/></svg>
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 rounded bg-[#23263A] text-white border border-[#23263A] focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M2 12C3.8 7.6 7.6 4 12 4s8.2 3.6 10 8c-1.8 4.4-5.6 8-10 8s-8.2-3.6-10-8z"/></svg>
              </span>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors"
            disabled={loading}
          >
            {loading ? (isLogin ? "Signing in..." : "Signing up...") : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-[#23263A]" />
          <span className="mx-4 text-gray-500 text-sm">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-[#23263A]" />
        </div>
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#23263A] hover:bg-[#23263A]/80 text-white font-semibold border border-[#23263A] mb-2"
        >
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3c-7.7 0-14.2 4.4-17.7 10.7z"/><path fill="#FBBC05" d="M24 43c5.7 0 10.5-1.9 14-5.1l-6.5-5.3C29.8 36 26.1 37 24 37c-5.7 0-10.6-3.8-12.3-9.1l-6.6 5.1C9.8 40.2 16.3 43 24 43z"/><path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-4.3 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3c-7.7 0-14.2 4.4-17.7 10.7z"/></g></svg>
          Continue with Google
        </button>
        <div className="text-center mt-4 text-gray-400">
          {isLogin ? (
            <>Don't have an account?{' '}
              <button className="text-blue-400 hover:underline" onClick={() => setIsLogin(false)}>Sign Up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button className="text-blue-400 hover:underline" onClick={() => setIsLogin(true)}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [showPricing, setShowPricing] = useState(false);
  const [pricingTab, setPricingTab] = useState<'personal' | 'business'>('personal');
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://careerforge.info/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentInput
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response || data.message }]);
      } else {
        setError("Chat failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('https://careerforge.info/api/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('Resume uploaded successfully!');
      } else {
        setError("File upload failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://careerforge.info/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_id: planId
        })
      });
      
      if (response.ok) {
        alert('Subscription upgraded successfully!');
        setShowPricing(false);
      } else {
        setError("Upgrade failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-white flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col items-center py-4 space-y-6">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <button
          onClick={triggerFileUpload}
          className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
          title="Upload Resume"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <div className="flex-1"></div>
        <button
          onClick={() => setShowPricing(true)}
          className="w-12 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          Renew Plus
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1A1D23]">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center cursor-pointer">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </div>
            <h1 className="text-2xl font-bold">careerforge</h1>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
          {/* Search Input */}
          <div className="w-full max-w-3xl space-y-6">
            <div className="relative">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask anything or @mention a Skill"
                className="w-full h-14 bg-gray-800 border border-gray-700 rounded-2xl pl-12 pr-32 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
                disabled={loading}
              />
              <svg className="absolute left-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <button 
                  onClick={triggerFileUpload}
                  className="w-8 h-8 bg-transparent hover:bg-gray-700 rounded flex items-center justify-center transition-colors"
                  title="Upload Resume"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 19v3"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <rect x="9" y="2" width="6" height="13" rx="3"></rect>
                  </svg>
                </button>
                <button className="w-8 h-8 bg-transparent hover:bg-gray-700 rounded flex items-center justify-center transition-colors">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button 
                  onClick={handleChatSubmit}
                  disabled={loading || !chatInput.trim()}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center transition-colors disabled:opacity-50"
                  title="Send Message"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="w-full max-w-3xl space-y-4">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-900/20 ml-8' : 'bg-gray-800 mr-8'
                }`}>
                  <p className="text-sm text-gray-400 mb-1">
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </p>
                  <p className="text-white">{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="w-full max-w-3xl p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Promotional Banner */}
          <div className="w-full max-w-3xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                    <path d="M20 3v4"></path>
                    <path d="M22 5h-4"></path>
                    <path d="M4 17v2"></path>
                    <path d="M5 18H3"></path>
                  </svg>
                  <h3 className="text-xl font-semibold">Introducing CareerForge Pro</h3>
                </div>
                <p className="text-gray-300">Early access to resume AI & unlimited uploads</p>
              </div>
              <button 
                onClick={() => setShowPricing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>

          {/* Free Tier Info */}
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-medium text-cyan-400">Free</h4>
                <div className="w-16 h-1 bg-cyan-400 rounded-full"></div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-gray-300">You've reached your free tier limits</p>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upgrade your plan</h2>
              <button
                onClick={() => setShowPricing(false)}
                className="bg-transparent hover:bg-gray-700 p-2 rounded"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8">
              <button
                onClick={() => setPricingTab('personal')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  pricingTab === 'personal' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setPricingTab('business')}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  pricingTab === 'business' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                Business
              </button>
            </div>

            {/* Personal Plans */}
            {pricingTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <div className="text-3xl font-bold mb-4">
                    ₹0
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 mb-6">Explore how AI can help you with everyday tasks</p>
                  <button className="w-full bg-gray-700 text-white py-2 rounded-lg mb-4">
                    Your current plan
                  </button>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Access to GPT-4o mini and reasoning</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Standard voice mode</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Real-time data from the web with search</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold mb-2">Plus</h3>
                  <div className="text-3xl font-bold mb-4">
                    ₹599
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 mb-6">Level up productivity and creativity with expanded access</p>
                  <button 
                    onClick={() => handleUpgrade('plus')}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mb-4 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Get Plus"}
                  </button>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Extended limits on messaging</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Advanced voice mode</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <div className="text-3xl font-bold mb-4">
                    ₹1399
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 mb-6">Get the best of OpenAI with the highest level of access</p>
                  <button 
                    onClick={() => handleUpgrade('pro')}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-100 text-black py-2 rounded-lg mb-4 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Get Pro"}
                  </button>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Everything in Plus</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Unlimited access to all models</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      <span>Advanced research capabilities</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Business Plan */}
            {pricingTab === 'business' && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2 text-gray-300">Business</h3>
                <div className="text-3xl font-bold mb-4">
                  ₹1999
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">Advanced AI capabilities for teams and organizations</p>
                <div className="text-center mb-6">
                  <button 
                    onClick={() => handleUpgrade('business')}
                    disabled={loading}
                    className="text-blue-400 hover:underline disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Contact Sales"}
                  </button>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    <span>Team management and collaboration tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    <span>Advanced security and compliance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    <span>Enterprise-grade analytics</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      // For demo purposes, show dashboard after a brief delay
      const timer = setTimeout(() => {
        setIsLoggedIn(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isLoggedIn) {
    return <AuthPage />;
  }

  return <Dashboard />;
};

export default App; 