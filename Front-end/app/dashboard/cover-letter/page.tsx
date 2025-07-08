"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import dynamic from "next/dynamic";

// Prevent SSR for this page since it uses useAuth
const CoverLetterPage = () => {
  const router = useRouter();
  const [userPlan, setUserPlan] = useState("free");
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage on client side
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUserPlan(data.plan || "free"))
        .catch(() => setUserPlan("free"));
    }
  }, [router]);

  if (userPlan === "free") {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
          <div className="flex items-center gap-2 mb-8">
            <img src="/placeholder-logo.svg" alt="CareerForge AI Logo" className="h-8 w-8" />
            <span className="font-bold text-lg text-blue-700">CareerForge AI</span>
          </div>
          <nav className="flex-1 space-y-2">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🏠 Dashboard</a>
            <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📄 Resume Analysis</a>
            <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">✍️ Resume Rewriting</a>
            <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">📧 Cover Letter</a>
            <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
            <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
          </nav>
        </aside>
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in text-center">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">Upgrade Required</h1>
            <p className="mb-6 text-gray-700">Cover letter generation is a premium feature. Please upgrade your plan to access this feature.</p>
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => router.push("/pricing")}>Upgrade Plan</button>
          </div>
        </main>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCoverLetter(null);
    // Placeholder: Replace with actual API call
    setTimeout(() => {
      setCoverLetter("Dear Hiring Manager,\n\nThis is your AI-generated cover letter based on your resume and job description!\n\nBest regards,\nCareerForge AI");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <img src="/placeholder-logo.svg" alt="CareerForge AI Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-blue-700">CareerForge AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🏠 Dashboard</a>
          <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">📧 Cover Letter</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">AI Cover Letter Generator</h1>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full p-2 border rounded-md min-h-[120px]"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF or DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isLoading}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={isLoading || !jobDescription || !selectedFile}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading || !jobDescription || !selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isLoading ? "Generating..." : "Generate Cover Letter"}
            </button>
          </form>
          {coverLetter && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 whitespace-pre-line text-gray-800">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">Generated Cover Letter</h2>
              <pre>{coverLetter}</pre>
            </div>
          )}
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
};

// Export with dynamic import to prevent SSR
export default dynamic(() => Promise.resolve(CoverLetterPage), { ssr: false }); 
