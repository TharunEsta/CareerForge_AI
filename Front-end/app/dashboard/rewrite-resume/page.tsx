"use client";
import { useState } from "react";
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Resume Rewriter & LinkedIn Optimizer</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Resume and Job Description</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resume (PDF or DOCX, max 5MB)
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full p-2 border rounded-md min-h-[200px]"
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm">{success}</div>
          )}
          
          <button
            type="submit"
            disabled={!selectedFile || !jobDescription.trim() || isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${!selectedFile || !jobDescription.trim() || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isLoading ? "Processing..." : "Analyze and Rewrite Resume"}
          </button>
        </form>
      </div>

      {matchScore !== null && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('resume')}
                className={`${
                  activeTab === 'resume'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Resume Analysis
              </button>
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`${
                  activeTab === 'linkedin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                LinkedIn Optimization
              </button>
            </nav>
          </div>

          {/* ATS Score */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900">ATS Score</h3>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${matchScore}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{matchScore}% ATS compatibility</p>
            </div>
          </div>

          {/* Resume Analysis Tab */}
          {activeTab === 'resume' && rewrittenResume && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900">Rewritten Resume</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{rewrittenResume.name}</h4>
                      <p>{rewrittenResume.email} | {rewrittenResume.phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Professional Summary</h4>
                      <p className="whitespace-pre-wrap">{rewrittenResume.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {rewrittenResume.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Experience</h4>
                      {rewrittenResume.experience.map((exp, index) => (
                        <div key={index} className="mt-2">
                          <p className="font-medium">{exp.role}</p>
                          <p>{exp.company} | {exp.duration}</p>
                          <p className="whitespace-pre-wrap">{exp.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Optimization Tab */}
          {activeTab === 'linkedin' && linkedinProfile && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900">LinkedIn Profile Optimization</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Profile Completeness</h4>
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{ width: `${linkedinProfile.completeness_score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {linkedinProfile.completeness_score}% profile completeness
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium">Headline</h4>
                      <p>{linkedinProfile.headline}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Summary</h4>
                      <p className="whitespace-pre-wrap">{linkedinProfile.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Experience</h4>
                      {linkedinProfile.experience.map((exp, index) => (
                        <div key={index} className="mt-2">
                          <p className="font-medium">{exp.title}</p>
                          <p>{exp.company} | {exp.duration}</p>
                          <p className="whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-medium">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {linkedinProfile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Recommendation Templates</h4>
                      {linkedinProfile.recommendations.map((rec, index) => (
                        <div key={index} className="mt-2">
                          <p className="font-medium">{rec.type}</p>
                          <p className="italic">{rec.template}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 