"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠", premium: false },
  { href: "/dashboard/resume", label: "Resume Analysis", icon: "📄", premium: false },
  { href: "/dashboard/rewrite-resume", label: "Resume Rewriting", icon: "✍️", premium: true },
  { href: "/dashboard/cover-letter", label: "Cover Letter", icon: "📧", premium: true },
  { href: "/dashboard/linkedin-optimization", label: "LinkedIn Optimization", icon: "🔗", premium: true },
  { href: "/pricing", label: "Subscription Plans", icon: "💳", premium: false },
];

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState("free");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
      // Fetch user plan
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUserPlan(data.plan || "free"))
        .catch(() => setUserPlan("free"));
    }
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-blue-700">SkillSync AI</span>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-semibold">Plan:</span> <span className={userPlan === "premium" ? "text-blue-700" : userPlan === "basic" ? "text-blue-500" : "text-gray-700"}>{userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</span>
        </div>
        {userPlan === "free" && (
          <button
            className="mb-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => router.push("/pricing")}
          >
            Upgrade Plan
          </button>
        )}
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${link.premium && userPlan === "free" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"}`}
              tabIndex={link.premium && userPlan === "free" ? -1 : 0}
              aria-disabled={link.premium && userPlan === "free"}
              onClick={e => {
                if (link.premium && userPlan === "free") {
                  e.preventDefault();
                  router.push("/pricing");
                }
              }}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
              {link.premium && userPlan === "free" && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Premium</span>}
            </Link>
          ))}
        </nav>
        <button
          className="mt-8 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold transition"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <span className="text-2xl mb-2">📄</span>
            <h2 className="text-xl font-semibold mb-1">Resume Analysis</h2>
            <p className="text-gray-600 mb-2">Get detailed feedback on your resume's strengths and areas for improvement.</p>
            <Link href="/dashboard/resume" className="text-blue-600 hover:underline font-medium">Go to Resume Analysis →</Link>
          </div>
          <div className={`bg-white rounded-xl shadow p-6 flex flex-col items-start ${userPlan === "free" ? "opacity-60 pointer-events-none" : ""}`}>
            <span className="text-2xl mb-2">✍️</span>
            <h2 className="text-xl font-semibold mb-1">Resume Rewriting</h2>
            <p className="text-gray-600 mb-2">Get a professionally rewritten resume optimized for ATS systems.</p>
            <Link href="/dashboard/rewrite-resume" className="text-blue-600 hover:underline font-medium">Go to Resume Rewriting →</Link>
            {userPlan === "free" && <span className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Premium</span>}
          </div>
          <div className={`bg-white rounded-xl shadow p-6 flex flex-col items-start ${userPlan === "free" ? "opacity-60 pointer-events-none" : ""}`}>
            <span className="text-2xl mb-2">📧</span>
            <h2 className="text-xl font-semibold mb-1">Cover Letter</h2>
            <p className="text-gray-600 mb-2">Generate a tailored cover letter based on your job description.</p>
            <Link href="/dashboard/cover-letter" className="text-blue-600 hover:underline font-medium">Go to Cover Letter →</Link>
            {userPlan === "free" && <span className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Premium</span>}
          </div>
          <div className={`bg-white rounded-xl shadow p-6 flex flex-col items-start ${userPlan === "free" ? "opacity-60 pointer-events-none" : ""}`}>
            <span className="text-2xl mb-2">🔗</span>
            <h2 className="text-xl font-semibold mb-1">LinkedIn Optimization</h2>
            <p className="text-gray-600 mb-2">Optimize your LinkedIn profile for better job opportunities.</p>
            <Link href="/dashboard/linkedin-optimization" className="text-blue-600 hover:underline font-medium">Go to LinkedIn Optimization →</Link>
            {userPlan === "free" && <span className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Premium</span>}
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
            <span className="text-2xl mb-2">💳</span>
            <h2 className="text-xl font-semibold mb-1">Subscription Plans</h2>
            <p className="text-gray-600 mb-2">Upgrade to unlock premium features and unlimited access.</p>
            <Link href="/pricing" className="text-blue-600 hover:underline font-medium">View Plans →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
