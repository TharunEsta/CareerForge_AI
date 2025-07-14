import React, { useState } from 'react';
const endpoints = [
  {
    label: 'Create Payment',
    path: '/api/payment/create',
    method: 'POST',
    body: {
      amount: 1000,
      currency: 'INR',
      user_id: 'demo-user',
      user_email: 'demo@example.com',
      user_name: 'Demo User',
      description: 'Test payment',
      plan_id: 'basic',
      billing_cycle: 'monthly',
      payment_method: 'upi',
    },
  },
  { label: 'Get Subscription Plans', path: '/api/subscription/plans', method: 'GET' },
  { label: 'Get All Skills', path: '/api/skills-jobs/skills', method: 'GET' },
  {
    label: 'Skill Analysis',
    path: '/api/skills-jobs/skill-analysis',
    method: 'POST',
    body: {
      skill_name: 'Python',
      category: 'programming_languages',
      proficiency_level: 'intermediate',
    },
  },
  {
    label: 'Job Match',
    path: '/api/skills-jobs/job-match',
    method: 'POST',
    body: {
      resume_skills: ['Python', 'React', 'AWS'],
      job_description: 'Senior Python Developer needed for cloud applications',
      match_criteria: ['skills', 'experience'],
    },
  },
  {
    label: 'Market Analysis',
    path: '/api/skills-jobs/market-analysis',
    method: 'POST',
    body: { skills: ['Python', 'React', 'AWS'], location: 'United States', timeframe: '6months' },
  },
  {
    label: 'Skill Recommendations',
    path: '/api/skills-jobs/skill-recommendations',
    method: 'POST',
    body: {
      current_skills: ['Python', 'JavaScript'],
      target_role: 'Senior Full Stack Developer',
      experience_level: 'mid',
    },
  },
  { label: 'Popular Skills', path: '/api/skills-jobs/popular-skills', method: 'GET' },
  {
    label: 'Realtime Skills Analysis',
    path: '/api/realtime/skills-analysis',
    method: 'POST',
    body: {
      text: 'I have experience with Python, React, and AWS',
      job_description: 'Looking for a Python developer with cloud experience',
      analysis_type: 'comprehensive',
    },
  },
  {
    label: 'Realtime Job Matching',
    path: '/api/realtime/job-matching',
    method: 'POST',
    body: {
      resume_text: 'Experienced Python developer with 5 years in web development',
      job_description: 'Senior Python Developer needed for cloud-based applications',
      match_criteria: ['skills', 'experience', 'education'],
    },
  },
  {
    label: 'Realtime Resume Optimization',
    path: '/api/realtime/resume-optimization',
    method: 'POST',
    body: {
      resume_data: {
        name: 'John Doe',
        skills: ['Python', 'React', 'AWS'],
        experience: [{ role: 'Developer', company: 'Tech Corp' }],
      },
      job_description: 'Senior Python Developer position',
      optimization_type: 'ats',
    },
  },
  {
    label: 'Realtime Comprehensive Analysis',
    path: '/api/realtime/comprehensive-analysis',
    method: 'POST',
    body: {
      content: 'Python developer with React and AWS experience',
      analysis_type: 'full_career_analysis',
      user_id: 'user123',
    },
  },
  { label: 'Realtime Status', path: '/api/realtime/status', method: 'GET' },
  { label: 'Health', path: '/health', method: 'GET' },
  { label: 'Skills-Jobs Health', path: '/api/skills-jobs/health', method: 'GET' },
  { label: 'Realtime Health', path: '/api/realtime/health', method: 'GET' },
];
export default function DemoApiPage() {
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<any>(null);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzeFile, setAnalyzeFile] = useState<File | null>(null);
  const callEndpoint = async (ep: (typeof endpoints)[0]) => {
    setLoading((l) => ({ ...l, [ep.label]: true }));
    setResults((r) => ({ ...r, [ep.label]: null }));
    try {
      let res;
      if (ep.method === 'GET') {
        res = await fetch(ep.path);
      } else {
        res = await fetch(ep.path, {
          method: ep.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ep.body),
        });
      const data = await res.json();
      setResults((r) => ({ ...r, [ep.label]: data }));
    } catch (e: any) {
      setResults((r) => ({ ...r, [ep.label]: e.message || 'Error' }));
    } finally {
      setLoading((l) => ({ ...l, [ep.label]: false }));
  };
  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setResumeResult(null);
    const formData = new FormData();
    formData.append('file', resumeFile);
    const res = await fetch('/api/resume/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResumeResult(data);
  };
  const handleAnalyzeResume = async () => {
    if (!analyzeFile) return;
    setAnalyzeResult(null);
    const formData = new FormData();
    formData.append('file', analyzeFile);
    formData.append('job_description', 'Senior Python Developer needed for cloud applications');
    const res = await fetch('/api/analyze-resume', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setAnalyzeResult(data);
  };
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Demo API Endpoints</h1>
      {endpoints.map((ep) => (
        <div key={ep.label} className="mb-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={() => callEndpoint(ep)}
            disabled={loading[ep.label]}
          >
            {loading[ep.label] ? 'Loading...' : ep.label}
          </button>
          {results[ep.label] && (
            <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-x-auto max-h-64">
              {JSON.stringify(results[ep.label], null, 2)}
            </pre>
          )}
        </div>
      ))}
      <div className="mb-6">
        <h2 className="font-semibold">Resume Upload</h2>
        <input type="file" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
        <button
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleResumeUpload}
          disabled={!resumeFile}
        >
          Upload
        </button>
        {resumeResult && (
          <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-x-auto max-h-64">
            {JSON.stringify(resumeResult, null, 2)}
          </pre>
        )}
      </div>
      <div className="mb-6">
        <h2 className="font-semibold">Analyze Resume</h2>
        <input type="file" onChange={(e) => setAnalyzeFile(e.target.files?.[0] || null)} />
        <button
          className="ml-2 px-4 py-2 bg-purple-600 text-white rounded"
          onClick={handleAnalyzeResume}
          disabled={!analyzeFile}
        >
          Analyze
        </button>
        {analyzeResult && (
          <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-x-auto max-h-64">
            {JSON.stringify(analyzeResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
