"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LinkedInOptimizationPage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    headline: '',
    summary: '',
    experience: '',
    skills: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setOptimizationResults(null);
    setError('');
  };

  const handleOptimize = async () => {
    if (!profileData.headline && !profileData.summary) {
      setError('Please provide at least your headline or summary.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for LinkedIn optimization
      setTimeout(() => {
        const mockResults = {
          score: 78,
          improvements: [
            {
              category: 'Headline',
              current: 'Software Engineer at Tech Corp',
              suggested: 'Senior Software Engineer | Full-Stack Development | React & Node.js | AWS',
              reason: 'More specific and keyword-rich headline'
            },
            {
              category: 'Summary',
              current: 'Experienced software engineer with 5 years of experience.',
              suggested: 'Results-driven Senior Software Engineer with 5+ years of experience developing scalable web applications. Specialized in React, Node.js, and cloud technologies. Led development of 3+ enterprise applications serving 10,000+ users with 99.9% uptime. Passionate about clean code, agile methodologies, and mentoring junior developers.',
              reason: 'Added quantifiable achievements and specific technologies'
            },
            {
              category: 'Keywords',
              current: 'JavaScript, React, Node.js',
              suggested: 'JavaScript, React, Node.js, TypeScript, AWS, Docker, CI/CD, REST APIs, GraphQL, MongoDB, PostgreSQL, Agile, Scrum, Git, JIRA',
              reason: 'Expanded keyword list for better discoverability'
            }
          ],
          keywordAnalysis: {
            strong: ['JavaScript', 'React', 'Node.js', 'Full-Stack', 'Web Development'],
            missing: ['TypeScript', 'AWS', 'Docker', 'CI/CD', 'Agile'],
            suggested: ['Microservices', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL']
          },
          recommendations: [
            'Add specific metrics and quantifiable achievements to your experience descriptions',
            'Include industry-specific keywords that recruiters search for',
            'Optimize your profile for both human readers and ATS systems',
            'Add certifications and relevant courses to your education section',
            'Use action verbs and industry-standard terminology'
          ]
        };
        setOptimizationResults(mockResults);
        setIsLoading(false);
      }, 3000);
    } catch (err) {
      setError('Failed to optimize profile. Please try again.');
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
          <a href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📄 Resume Analysis</a>
          <a href="/dashboard/rewrite-resume" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">✍️ Resume Rewriting</a>
          <a href="/dashboard/cover-letter" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">📧 Cover Letter</a>
          <a href="/dashboard/job-matching" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🎯 Job Matching</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">LinkedIn Profile Optimizer</h1>
          
          {!optimizationResults ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Your LinkedIn Profile Information</h2>
                <p className="text-gray-600 mb-6">Get AI-powered suggestions to optimize your LinkedIn profile for better visibility and job opportunities.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                    <input
                      type="text"
                      value={profileData.headline}
                      onChange={(e) => handleInputChange('headline', e.target.value)}
                      placeholder="e.g., Software Engineer at Tech Corp"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary/About</label>
                    <textarea
                      value={profileData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      placeholder="Paste your LinkedIn summary here..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Descriptions</label>
                    <textarea
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Paste your work experience descriptions..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Keywords</label>
                    <textarea
                      value={profileData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="e.g., JavaScript, React, Node.js, AWS"
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Keywords (Optional)</label>
                    <input
                      type="text"
                      value={profileData.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                      placeholder="e.g., Senior Developer, Full Stack, Cloud"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleOptimize}
                    disabled={isLoading || (!profileData.headline && !profileData.summary)}
                    className={`px-8 py-3 rounded-lg font-semibold text-white ${
                      isLoading || (!profileData.headline && !profileData.summary)
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
                        Optimizing...
                      </div>
                    ) : (
                      'Optimize Profile'
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900 mr-4">Optimization Complete</h2>
                    <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-blue-800 font-medium">{optimizationResults.score}% Optimized</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOptimizationResults(null);
                      setProfileData({
                        headline: '',
                        summary: '',
                        experience: '',
                        skills: '',
                      });
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Optimize Another Profile
                  </button>
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Improvements</h3>
                <div className="space-y-6">
                  {optimizationResults.improvements.map((improvement: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {improvement.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Current</p>
                          <div className="bg-gray-50 p-3 rounded border">
                            <p className="text-sm text-gray-600">{improvement.current}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Suggested</p>
                          <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="text-sm text-gray-700">{improvement.suggested}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Why:</strong> {improvement.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Analysis */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2">✅ Strong Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {optimizationResults.keywordAnalysis.strong.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-red-700 mb-2">❌ Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {optimizationResults.keywordAnalysis.missing.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-blue-700 mb-2">💡 Suggested Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {optimizationResults.keywordAnalysis.suggested.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Recommendations</h3>
                <div className="space-y-3">
                  {optimizationResults.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-gray-700">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Copy Optimized Text
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Export to PDF
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
