"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

interface LinkedInProfile {
  headline: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    location: string;
    achievements: string[];
  }>;
  skills: Array<{
    name: string;
    endorsements: number;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
  }>;
  certifications: Array<{
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiration_date: string;
    credential_id: string;
  }>;
  recommendations: Array<{
    type: string;
    template: string;
  }>;
  completeness_score: number;
}

interface RewrittenResume {
  name: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    details: string;
  }>;
  education: string[];
  certifications: string[];
  ats_score: number;
}

export default function RewriteResumePage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState<RewrittenResume | null>(null);
  const [linkedinProfile, setLinkedinProfile] = useState<LinkedInProfile | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'linkedin'>('resume');
  const [userPlan, setUserPlan] = useState("free");

  useEffect(() => {
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
  }, [token, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB");
        setSelectedFile(null);
        return;
      }
      if (!file.type.match(/^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/)) {
        setError("Only PDF and DOCX files are allowed");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !token || !jobDescription.trim()) {
      setError("Please provide both a resume and a job description");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setRewrittenResume(null);
    setLinkedinProfile(null);
    setMatchScore(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("job_description", jobDescription);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match_resume`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to rewrite resume");
      }

      const data = await res.json();
      setRewrittenResume(data.rewritten_resume);
      setLinkedinProfile(data.linkedin_profile);
      setMatchScore(data.ats_score);
      setSuccess("Resume analysis complete!");
    } catch (err) {
      console.error("Rewrite error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to the server. Please make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userPlan === "free") {
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
            <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">✍️ Resume Rewriting</a>
            <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📧 Cover Letter</a>
            <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
            <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
          </nav>
        </aside>
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in text-center">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">Upgrade Required</h1>
            <p className="mb-6 text-gray-700">Resume rewriting is a premium feature. Please upgrade your plan to access this feature.</p>
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => router.push("/pricing")}>Upgrade Plan</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar placeholder for consistency, can be replaced with a component */}
      <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-blue-700">SkillSync AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🏠 Dashboard</a>
          <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📧 Cover Letter</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Resume Rewriter & LinkedIn Optimizer</h1>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Resume and Job Description</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume (PDF or DOCX, max 5MB)</label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full p-2 border rounded-md min-h-[120px]"
                  disabled={isLoading}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
              <button
                type="submit"
                disabled={!selectedFile || isLoading || !jobDescription.trim()}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${!selectedFile || isLoading || !jobDescription.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isLoading ? "Uploading..." : "Rewrite Resume"}
              </button>
            </form>
          </div>
          {/* Optionally show rewritten resume and LinkedIn info here */}
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