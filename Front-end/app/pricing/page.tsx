"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function PricingPage() {
  const { token } = useAuth();
  const [userPlan, setUserPlan] = useState("free");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUserPlan(data.plan || "free"))
        .catch(() => setUserPlan("free"));
    }
  }, [token]);
  const handleUpgrade = async (plan: string) => {
    if (!token) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/upgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    });
    if (res.ok) {
      setUserPlan(plan);
      setSuccess(`🎉 Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Enjoy your new features.`);
      setTimeout(() => setSuccess(""), 4000);
    }
  };
  const plans = [
    {
      name: "Free",
      price: "$0/mo",
      features: [
        "Basic resume analysis",
        "Limited job matching",
        "Community support",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Basic",
      price: "$15/mo",
      features: [
        "Advanced resume analysis",
        "Job matching",
        "Cover letter generator",
        "Email support",
      ],
      cta: "Upgrade to Basic",
      highlight: false,
    },
    {
      name: "Premium",
      price: "$45/mo",
      features: [
        "All Basic features",
        "Unlimited resume rewrites",
        "LinkedIn optimization",
        "Priority support",
      ],
      cta: "Upgrade to Premium",
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-lg border-r border-blue-100 shadow-xl py-10 px-6 z-10">
        <div className="flex items-center gap-3 mb-10">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-10 w-10 drop-shadow" />
          <span className="font-extrabold text-2xl text-blue-700 tracking-tight">SkillSync AI</span>
        </div>
        <nav className="flex-1 space-y-3 text-lg">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition"><span>🏠</span>Dashboard</a>
          <a href="/dashboard/resume" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition"><span>📄</span>Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition"><span>✍️</span>Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition"><span>📧</span>Cover Letter</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition"><span>🔗</span>LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-4 py-2 rounded-xl text-blue-700 bg-blue-100 font-semibold transition"><span>💳</span>Subscription Plans</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 relative">
        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow animate-fade-in">Choose Your Plan</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2 animate-fade-in delay-100">Unlock the full power of SkillSync AI. Upgrade for advanced features and priority support.</p>
        </div>
        {/* Plans Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in delay-200">
          {plans.map((plan) => {
            const isCurrent = userPlan === plan.name.toLowerCase();
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col items-center bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border-2 transition-transform duration-300 hover:scale-105 ${plan.highlight ? "border-blue-700 ring-4 ring-blue-200" : "border-gray-200"} ${isCurrent ? "outline outline-4 outline-green-400" : ""}`}
                style={plan.highlight ? { boxShadow: '0 8px 32px 0 rgba(34, 139, 230, 0.18)' } : {}}
              >
                {plan.highlight && <div className="absolute -top-4 right-6 bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow">Most Popular</div>}
                {isCurrent && <div className="absolute -top-4 left-6 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow animate-bounce">Your Plan</div>}
                <h2 className={`text-2xl font-extrabold mb-2 ${plan.highlight ? "text-blue-800" : "text-gray-800"}`}>{plan.name}</h2>
                <div className="text-4xl font-extrabold mb-4 text-blue-700 drop-shadow">{plan.price}</div>
                <ul className="mb-8 space-y-3 text-gray-700 w-full">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-lg">
                      <span className="text-blue-500 text-xl">✔️</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-bold text-lg shadow transition-all duration-200 ${plan.highlight ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"} ${isCurrent ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={() => handleUpgrade(plan.name.toLowerCase())}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
        {/* Success Message */}
        {success && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-8 py-4 rounded-2xl shadow-lg text-lg font-semibold flex items-center gap-3 animate-fade-in z-50">
            <span>✅</span> {success}
          </div>
        )}
        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: none; }
          }
          @media (max-width: 768px) {
            .shadow-2xl { box-shadow: 0 4px 24px 0 rgba(34,139,230,0.10); }
          }
        `}</style>
      </main>
    </div>
  );
} 