"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const FREE_LIMIT = 5;

export default function JobMatchPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [showGetPlus, setShowGetPlus] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('job_match_usage') || '0', 10);
    }
    return 0;
  });

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
    if (usageCount >= FREE_LIMIT) {
      setShowGetPlus(true);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // Simulate API call for job matching
      setTimeout(() => {
        const mockResults = {
          matchScore: 85,
          matchedSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
          missingSkills: ['Docker', 'Kubernetes', 'AWS'],
          suggestions: [
            'Add Docker experience to your resume',
            'Include Kubernetes knowledge',
            'Highlight cloud platform experience',
            'Consider adding microservices experience',
            'Include CI/CD pipeline experience'
          ],
          jobDetails: {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            salary: '$120k - $180k',
            requirements: [
              '5+ years of software development experience',
              'Strong knowledge of JavaScript and React',
              'Experience with Node.js and TypeScript',
              'Familiarity with cloud platforms (AWS preferred)',
              'Experience with Docker and containerization',
              'Knowledge of CI/CD pipelines'
            ]
          },
          recommendations: [
            'Your React and JavaScript skills are highly valued',
            'Consider highlighting your project management experience',
            'Add specific metrics and achievements to your resume',
            'Include any cloud platform experience you may have'
          ]
        };
        setMatchResults(mockResults);
        setIsLoading(false);
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('job_match_usage', newCount.toString());
        if (newCount >= FREE_LIMIT) {
          setShowGetPlus(true);
        }
      }, 3000);
    } catch (err) {
      setError('Failed to analyze job match. Please try again.');
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Redirect to pricing/upgrade page
    router.push('/pricing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showGetPlus && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Get Plus to Unlock More Analyses</h2>
            <p className="mb-4 text-gray-700">You have reached your free limit of {FREE_LIMIT} job match analyses. Upgrade to Plus for unlimited access and premium features!</p>
            <button
              onClick={handleUpgrade}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition mb-2"
            >
              Upgrade to Plus
            </button>
            <button
              onClick={() => setShowGetPlus(false)}
              className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Job Match Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare your resume with job descriptions and get detailed insights on your match score, 
            skill gaps, and personalized recommendations to improve your application.
          </p>
        </div>

        {!matchResults ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Description Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <textarea
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  placeholder="Paste the job description here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Resume Upload Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume Upload</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleResumeUpload}
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

                {resumeContent && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 font-medium">Resume content loaded successfully</span>
                    </div>
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
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Job Match'
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Score Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Match Analysis Results</h2>
                <button
                  onClick={() => setMatchResults(null)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Analyze Another Job
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{matchResults.matchScore}%</div>
                  <div className="text-sm text-gray-600">Match Score</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{matchResults.matchedSkills.length}</div>
                  <div className="text-sm text-gray-600">Matched Skills</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{matchResults.missingSkills.length}</div>
                  <div className="text-sm text-gray-600">Missing Skills</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Details */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Position:</span>
                    <span className="ml-2 text-gray-900">{matchResults.jobDetails.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Company:</span>
                    <span className="ml-2 text-gray-900">{matchResults.jobDetails.company}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-900">{matchResults.jobDetails.location}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Salary:</span>
                    <span className="ml-2 text-gray-900">{matchResults.jobDetails.salary}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {matchResults.jobDetails.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Analysis</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-green-700 mb-2">✅ Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResults.matchedSkills.map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-2">❌ Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResults.missingSkills.map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Improvement Suggestions:</h4>
                  <ul className="space-y-2">
                    {matchResults.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Career Advice:</h4>
                  <ul className="space-y-2">
                    {matchResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Apply for This Job
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Update Resume
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  Generate Cover Letter
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Save Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
