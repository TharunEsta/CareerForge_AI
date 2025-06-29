"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";

import { useRouter } from "next/navigation";

interface ParsedResume {
  full_name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: { company: string }[];
  location?: string;
}

export default function ResumePage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [isLoadingParsed, setIsLoadingParsed] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchParsedResume = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/parsed`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          setError("Your session has expired. Please log in again.");
          logout();
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (data.message === "No resume uploaded yet") {
            setParsedResume(null);
            setError("No resume uploaded yet. Please upload your resume.");
          } else {
            setParsedResume(data);
            setError(null);
          }
        } else {
          let errorData: Record<string, string> = {};
          try {
            const text = await res.text();
            errorData = text ? JSON.parse(text) : {};
          } catch (e) {
            errorData = {};
          }
          console.error("Error fetching parsed resume:", errorData);
          setError(errorData.detail || errorData.message || "Failed to fetch resume data");
        }
      } catch (err) {
        console.error("Error fetching parsed resume:", err);
        setError("Failed to connect to the server. Please make sure the backend server is running.");
      } finally {
        setIsLoadingParsed(false);
      }
    };

    fetchParsedResume();
  }, [token, router, logout]);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !token) {
      setError("Please log in to upload a resume");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/upload`, {
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

      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = {};
      }
      
      if (!res.ok) {
        throw new Error(data.detail || "Failed to upload resume");
      }

      setSuccess("Resume uploaded successfully!");
      setSelectedFile(null);
      
      // Refresh parsed resume data
      const parsedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/parsed`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (parsedRes.ok) {
        const parsedData = await parsedRes.json();
        setParsedResume(parsedData);
      } else {
        const errorData = await parsedRes.json();
        console.error("Error fetching parsed resume:", errorData);
        setError(errorData.detail || errorData.message || "Failed to fetch resume data");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to the server. Please make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please log in to access this feature.
              </p>
            </div>
          </div>
        </div>
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
          <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📧 Cover Letter</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Resume Management</h1>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            <form onSubmit={handleUpload} className="space-y-4">
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
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-500 text-sm">{success}</div>}
              <button
                type="submit"
                disabled={!selectedFile || isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${!selectedFile || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isLoading ? "Uploading..." : "Upload Resume"}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
            {isLoadingParsed ? (
              <p className="text-gray-600">Loading resume data...</p>
            ) : parsedResume ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900">Personal Information</h3>
                  <div className="mt-2 space-y-1">
                    {parsedResume.full_name && <p>Name: {parsedResume.full_name}</p>}
                    {parsedResume.email && <p>Email: {parsedResume.email}</p>}
                    {parsedResume.phone && <p>Phone: {parsedResume.phone}</p>}
                    {parsedResume.location && <p>Location: {parsedResume.location}</p>}
                  </div>
                </div>

                {parsedResume.skills.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parsedResume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {parsedResume.experience.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900">Experience</h3>
                    <div className="mt-2 space-y-2">
                      {parsedResume.experience.map((exp, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">No resume uploaded yet.</p>
            )}
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
      </main>
    </div>
  );
} 