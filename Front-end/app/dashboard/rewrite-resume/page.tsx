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
      <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500">
        <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-lg border-r border-blue-100 shadow-xl py-10 px-6 z-10">
          <div className="flex items-center gap-3 mb-10">
            <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-10 w-10 drop-shadow" />
            <span className="font-extrabold text-2xl text-blue-700 tracking-tight">SkillSync AI</span>
            </div>
          <nav className="flex-1 space-y-3 text-lg">
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">🏠 Dashboard</a>
            <a href="/dashboard/resume" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">📄 Resume Analysis</a>
            <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-4 py-2 rounded-xl text-blue-700 bg-blue-100 font-semibold transition">✍️ Resume Rewriting</a>
            <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">📧 Cover Letter</a>
            <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">🔗 LinkedIn Optimization</a>
            <a href="/pricing" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">💳 Subscription Plans</a>
          </nav>
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 relative">
          <div className="w-full max-w-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-blue-100 animate-fade-in text-center">
            <h1 className="text-4xl font-extrabold mb-4 text-blue-800 drop-shadow">Upgrade Required</h1>
            <p className="mb-6 text-gray-700 text-lg">Resume rewriting is a <span className='font-bold text-blue-700'>premium</span> feature. Please upgrade your plan to access this feature.</p>
            <button className="bg-blue-700 text-white py-3 px-8 rounded-xl font-bold text-lg shadow hover:bg-blue-800 transition" onClick={() => router.push("/pricing")}>Upgrade Plan</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-lg border-r border-blue-100 shadow-xl py-10 px-6 z-10">
        <div className="flex items-center gap-3 mb-10">
          <img src="/placeholder-logo.svg" alt="SkillSync AI Logo" className="h-10 w-10 drop-shadow" />
          <span className="font-extrabold text-2xl text-blue-700 tracking-tight">SkillSync AI</span>
        </div>
        <nav className="flex-1 space-y-3 text-lg">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">🏠 Dashboard</a>
          <a href="/dashboard/resume" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-4 py-2 rounded-xl text-blue-700 bg-blue-100 font-semibold transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">📧 Cover Letter</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-semibold transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 relative">
        <div className="w-full max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow animate-fade-in">Resume Rewriting</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2 animate-fade-in delay-100">Upload your resume and job description to get a professionally rewritten, ATS-optimized resume.</p>
        </div>
        {/* Upload & Job Description Card */}
        <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-blue-100 animate-fade-in delay-200 mb-8 flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="block w-full text-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-lg file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="w-full rounded-xl border border-blue-200 bg-white/70 dark:bg-gray-800/70 px-4 py-3 text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          <button
            type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-6 py-3 font-bold text-lg shadow transition-all duration-200"
              disabled={isLoading || !selectedFile || !jobDescription.trim()}
          >
              {isLoading ? "Rewriting..." : "Rewrite Resume"}
          </button>
        </form>
          {error && <div className="mt-2 text-center text-red-700 bg-red-100 rounded-lg px-4 py-2">{error}</div>}
          {success && <div className="mt-2 text-center text-green-700 bg-green-100 rounded-lg px-4 py-2">{success}</div>}
      </div>
        {/* Rewritten Resume Card */}
        {rewrittenResume && (
          <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-blue-100 animate-fade-in delay-300 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Rewritten Resume</h2>
            <div className="text-left space-y-2">
              <div><span className="font-semibold">Name:</span> {rewrittenResume.name}</div>
              <div><span className="font-semibold">Email:</span> {rewrittenResume.email}</div>
              <div><span className="font-semibold">Phone:</span> {rewrittenResume.phone}</div>
              <div><span className="font-semibold">Headline:</span> {rewrittenResume.headline}</div>
              <div><span className="font-semibold">Summary:</span> {rewrittenResume.summary}</div>
              {rewrittenResume.skills && rewrittenResume.skills.length > 0 && (
                <div><span className="font-semibold">Skills:</span> <span className="inline-flex flex-wrap gap-2">{rewrittenResume.skills.map(skill => <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm font-medium">{skill}</span>)}</span></div>
              )}
              {rewrittenResume.experience && rewrittenResume.experience.length > 0 && (
                <div><span className="font-semibold">Experience:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {rewrittenResume.experience.map((exp, idx) => <li key={idx}><span className="font-semibold">{exp.role}</span> at {exp.company} ({exp.duration}): {exp.details}</li>)}
                  </ul>
                </div>
              )}
              {rewrittenResume.education && rewrittenResume.education.length > 0 && (
                <div><span className="font-semibold">Education:</span> {rewrittenResume.education.join(", ")}</div>
              )}
              {rewrittenResume.certifications && rewrittenResume.certifications.length > 0 && (
                <div><span className="font-semibold">Certifications:</span> {rewrittenResume.certifications.join(", ")}</div>
              )}
              <div><span className="font-semibold">ATS Score:</span> <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">{rewrittenResume.ats_score}</span></div>
            </div>
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
        `}</style>
      </main>
    </div>
  );
} 