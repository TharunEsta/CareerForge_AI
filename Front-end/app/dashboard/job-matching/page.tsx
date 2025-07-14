'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobMatchingPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleMatch = async () => {
    if (!jobDescription || !resumeContent) {
      setError('Please provide both job description and resume content.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for job matching
      setTimeout(() => {
        const mockResults = {
          matchScore: 85,
          matchedSkills: ['JavaScript', 'React', 'Node.js'],
          missingSkills: ['Docker', 'Kubernetes'],
          suggestions: [
            'Add Docker experience to your resume',
            'Include Kubernetes knowledge',
            'Highlight cloud platform experience',
          ],
        };
        setMatchResults(mockResults);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to analyze job match. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <img src="/placeholder-logo.svg" alt="CareerForge AI Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-blue-700">CareerForge AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🏠 Dashboard
          </a>
          <a
            href="/dashboard/resume"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            📄 Resume Analysis
          </a>
          <a
            href="/dashboard/rewrite-resume"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            ✍️ Resume Rewriting
          </a>
          <a
            href="/dashboard/cover-letter"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            📧 Cover Letter
          </a>
          <a
            href="/dashboard/job-matching"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition"
          >
            🎯 Job Matching
          </a>
          <a
            href="/dashboard/linkedin-optimization"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🔗 LinkedIn Optimization
          </a>
          <a
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            💳 Subscription Plans
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">Job Matching Analysis</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Description Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                placeholder="Paste the job description here..."
                className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none"
              />
            </div>

            {/* Resume Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Resume Upload</h2>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleResumeUpload}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {resumeContent && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">Resume content loaded successfully</p>
                </div>
              )}
            </div>
          </div>

          {/* Match Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleMatch}
              disabled={isLoading || !jobDescription || !resumeContent}
              className={`px-8 py-3 rounded-lg font-semibold text-white ${
                isLoading || !jobDescription || !resumeContent
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Job Match'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Results Display */}
          {matchResults && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Match Analysis Results</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{matchResults.matchScore}%</div>
                  <div className="text-sm text-gray-600">Match Score</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {matchResults.matchedSkills.length}
                  </div>
                  <div className="text-sm text-gray-600">Matched Skills</div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {matchResults.missingSkills.length}
                  </div>
                  <div className="text-sm text-gray-600">Missing Skills</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">✅ Matched Skills</h3>
                  <ul className="space-y-2">
                    {matchResults.matchedSkills.map((skill: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-700">❌ Missing Skills</h3>
                  <ul className="space-y-2">
                    {matchResults.missingSkills.map((skill: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-700">
                  💡 Suggestions for Improvement
                </h3>
                <ul className="space-y-2">
                  {matchResults.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

