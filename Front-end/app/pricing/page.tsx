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
      setSuccess(`Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`);
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
      price: "$9/mo",
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
      price: "$29/mo",
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
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-blue-700">SkillSync AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🏠 Dashboard</a>
          <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📧 Cover Letter</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Subscription Plans</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={plan.name}
                className={`flex flex-col items-center bg-white rounded-xl shadow p-6 border-2 ${plan.highlight ? "border-blue-600" : "border-gray-200"}`}
              >
                <h2 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-blue-700" : "text-gray-800"}`}>{plan.name}</h2>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <ul className="mb-6 space-y-2 text-gray-700">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-blue-500">✔️</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 px-4 rounded-md font-semibold transition ${plan.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                  onClick={() => handleUpgrade(plan.name.toLowerCase())}
                  disabled={userPlan === plan.name.toLowerCase()}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          {success && <div className="mt-4 text-center text-green-700">{success}</div>}
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
      </main>
    </div>
  );
} 