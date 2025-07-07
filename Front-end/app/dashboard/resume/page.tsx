"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResumePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    setAnalysisResults(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a resume file.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for resume analysis
      setTimeout(() => {
        const mockResults = {
          personalInfo: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA'
          },
          skills: [
            { name: 'JavaScript', level: 'Expert', category: 'Programming' },
            { name: 'React', level: 'Advanced', category: 'Frontend' },
            { name: 'Node.js', level: 'Advanced', category: 'Backend' },
            { name: 'Python', level: 'Intermediate', category: 'Programming' },
            { name: 'AWS', level: 'Intermediate', category: 'Cloud' }
          ],
          experience: [
            {
              title: 'Senior Software Engineer',
              company: 'Tech Corp',
              duration: '2020 - Present',
              description: 'Led development of scalable web applications using React and Node.js'
            },
            {
              title: 'Software Engineer',
              company: 'Startup Inc',
              duration: '2018 - 2020',
              description: 'Developed full-stack applications and implemented CI/CD pipelines'
            }
          ],
          education: [
            {
              degree: 'Bachelor of Science in Computer Science',
              school: 'University of Technology',
              year: '2018'
            }
          ],
          summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.',
          score: 85
        };
        setAnalysisResults(mockResults);
        setIsLoading(false);
      }, 3000);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
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
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🏠 Dashboard</a>
          <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📧 Cover Letter</a>
          <a href="/dashboard/job-matching" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🎯 Job Matching</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">Resume Analysis</h1>
          
          {!analysisResults ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Resume</h2>
                <p className="text-gray-600">Get detailed insights about your resume with AI-powered analysis</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">Choose a file</p>
                    <p className="text-sm text-gray-500">PDF, DOCX, or TXT files supported</p>
                  </label>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 font-medium">{selectedFile.name}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !selectedFile}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white ${
                    isLoading || !selectedFile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Resume Score</h2>
                  <button
                    onClick={() => {
                      setAnalysisResults(null);
                      setSelectedFile(null);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Analyze Another Resume
                  </button>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                    <span className="text-3xl font-bold text-blue-600">{analysisResults.score}%</span>
                  </div>
                  <p className="text-gray-600">Overall resume effectiveness score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-20 text-sm font-medium text-gray-500">Name:</span>
                      <span className="text-gray-900">{analysisResults.personalInfo.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-sm font-medium text-gray-500">Email:</span>
                      <span className="text-gray-900">{analysisResults.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-sm font-medium text-gray-500">Phone:</span>
                      <span className="text-gray-900">{analysisResults.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-sm font-medium text-gray-500">Location:</span>
                      <span className="text-gray-900">{analysisResults.personalInfo.location}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Analysis</h3>
                  <div className="space-y-3">
                    {analysisResults.skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({skill.category})</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          skill.level === 'Expert' ? 'bg-red-100 text-red-800' :
                          skill.level === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {analysisResults.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <span className="text-sm text-gray-500">{exp.duration}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-3">
                  {analysisResults.education.map((edu: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.school}</p>
                      </div>
                      <span className="text-sm text-gray-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">{analysisResults.summary}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
