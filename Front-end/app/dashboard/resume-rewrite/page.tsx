"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResumeRewritePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rewriteOptions, setRewriteOptions] = useState({
    style: 'professional',
    focus: 'achievements',
    length: 'standard',
    targetRole: '',
    industry: 'technology'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    setRewrittenResume(null);
    setError('');
  };

  const handleOptionChange = (option: string, value: string) => {
    setRewriteOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleRewrite = async () => {
    if (!selectedFile) {
      setError('Please select a resume file.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for resume rewriting
      setTimeout(() => {
        const mockResults = {
          originalText: `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | San Francisco, CA

EXPERIENCE
Software Engineer, Tech Corp (2020-Present)
- Developed web applications using React and Node.js
- Worked on database design and API development
- Collaborated with cross-functional teams

Software Engineer, Startup Inc (2018-2020)
- Built full-stack applications
- Implemented CI/CD pipelines
- Participated in code reviews

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2018

SKILLS
JavaScript, React, Node.js, Python, AWS`,

          rewrittenText: `John Doe
Senior Software Engineer
john.doe@email.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven software engineer with 5+ years of experience developing scalable web applications and implementing robust technical solutions. Proven track record of delivering high-impact projects while collaborating with cross-functional teams to achieve business objectives.

PROFESSIONAL EXPERIENCE
Senior Software Engineer | Tech Corp | 2020 - Present
• Led development of 3+ enterprise web applications using React and Node.js, resulting in 40% improved user engagement
• Designed and implemented RESTful APIs serving 10,000+ daily requests with 99.9% uptime
• Collaborated with product managers and designers to translate business requirements into technical solutions
• Mentored 3 junior developers and established coding standards that improved team productivity by 25%

Software Engineer | Startup Inc | 2018 - 2020
• Developed full-stack applications using modern JavaScript frameworks, contributing to 50% faster development cycles
• Implemented CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes
• Participated in code reviews and technical discussions, ensuring code quality and knowledge sharing
• Contributed to agile development processes and sprint planning sessions

EDUCATION
Bachelor of Science in Computer Science
University of Technology | Graduated 2018

TECHNICAL SKILLS
Programming Languages: JavaScript (Expert), Python (Intermediate), TypeScript (Advanced)
Frontend: React, Redux, HTML5, CSS3, Responsive Design
Backend: Node.js, Express.js, RESTful APIs, GraphQL
Databases: MongoDB, PostgreSQL, Redis
Cloud & DevOps: AWS, Docker, CI/CD, Git
Tools & Methodologies: Agile, Scrum, JIRA, Postman`,

          improvements: [
            'Enhanced professional summary with quantifiable achievements',
            'Added specific metrics and results to experience descriptions',
            'Improved action verbs and technical terminology',
            'Organized skills into clear categories',
            'Added quantifiable impact statements'
          ],
          score: 92,
          suggestions: [
            'Consider adding certifications relevant to your target role',
            'Include specific project examples with measurable outcomes',
            'Add a brief section about your career objectives',
            'Highlight any leadership or mentoring experience'
          ]
        };
        setRewrittenResume(mockResults);
        setIsLoading(false);
      }, 4000);
    } catch (err) {
      setError('Failed to rewrite resume. Please try again.');
      setIsLoading(false);
    }
  };

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
          <a href="/dashboard/job-matching" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🎯 Job Matching</a>
          <a href="/dashboard/linkedin-optimization" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">🔗 LinkedIn Optimization</a>
          <a href="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition">💳 Subscription Plans</a>
        </nav>
      </aside>
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">AI Resume Rewriter</h1>
          
          {!rewrittenResume ? (
            <div className="space-y-6">
              {/* File Upload */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Resume</h2>
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
              </div>

              {/* Rewrite Options */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customize Your Rewrite</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
                    <select
                      value={rewriteOptions.style}
                      onChange={(e) => handleOptionChange('style', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                      <option value="executive">Executive</option>
                      <option value="technical">Technical</option>
                      <option value="modern">Modern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
                    <select
                      value={rewriteOptions.focus}
                      onChange={(e) => handleOptionChange('focus', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="achievements">Achievements & Results</option>
                      <option value="skills">Technical Skills</option>
                      <option value="leadership">Leadership</option>
                      <option value="innovation">Innovation</option>
                      <option value="growth">Career Growth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                    <select
                      value={rewriteOptions.length}
                      onChange={(e) => handleOptionChange('length', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="concise">Concise (1 page)</option>
                      <option value="standard">Standard (1-2 pages)</option>
                      <option value="detailed">Detailed (2+ pages)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Role (Optional)</label>
                    <input
                      type="text"
                      value={rewriteOptions.targetRole}
                      onChange={(e) => handleOptionChange('targetRole', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={rewriteOptions.industry}
                      onChange={(e) => handleOptionChange('industry', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="marketing">Marketing</option>
                      <option value="consulting">Consulting</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rewrite Button */}
              <div className="text-center">
                <button
                  onClick={handleRewrite}
                  disabled={isLoading || !selectedFile}
                  className={`px-8 py-3 rounded-lg font-semibold text-white ${
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
                      Rewriting...
                    </div>
                  ) : (
                    'Rewrite Resume'
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score and Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900 mr-4">Rewrite Complete</h2>
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-green-800 font-medium">{rewrittenResume.score}% Improved</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRewrittenResume(null);
                      setSelectedFile(null);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Rewrite Another Resume
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Resume */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Resume</h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{rewrittenResume.originalText}</pre>
                  </div>
                </div>

                {/* Rewritten Resume */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Enhanced Resume</h3>
                  <div className="bg-blue-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{rewrittenResume.rewrittenText}</pre>
                  </div>
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Improvements Made</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewrittenResume.improvements.map((improvement: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Suggestions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Suggestions</h3>
                <div className="space-y-3">
                  {rewrittenResume.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Options */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Download PDF
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Download DOCX
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    Download TXT
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    Copy to Clipboard
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
