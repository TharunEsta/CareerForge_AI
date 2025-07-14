'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function ToolsPage() {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const tools = [
    {
      id: 'resume-analyzer',
      name: 'Resume Analyzer',
      description: 'AI-powered resume analysis with skill extraction and improvement suggestions',
      icon: '📄',
      color: 'blue',
      features: ['Skill extraction', 'ATS optimization', 'Score analysis', 'Improvement tips'],
    },
    {
      id: 'job-matcher',
      name: 'Job Matcher',
      description: 'Match your resume with job descriptions and get compatibility scores',
      icon: '🎯',
      color: 'green',
      features: [
        'Compatibility scoring',
        'Skill gap analysis',
        'Keyword matching',
        'Interview prep',
      ],
    },
    {
      id: 'cover-letter-generator',
      name: 'Cover Letter Generator',
      description: 'Create personalized cover letters based on your resume and job requirements',
      icon: '📧',
      color: 'purple',
      features: ['Personalized content', 'Multiple formats', 'Industry-specific', 'A/B testing'],
    },
    {
      id: 'linkedin-optimizer',
      name: 'LinkedIn Optimizer',
      description: 'Optimize your LinkedIn profile for better visibility and networking',
      icon: '🔗',
      color: 'indigo',
      features: ['Keyword optimization', 'Profile scoring', 'Network suggestions', 'Content ideas'],
    },
    {
      id: 'interview-prepper',
      name: 'Interview Prepper',
      description: 'AI-powered interview preparation with common questions and answers',
      icon: '💼',
      color: 'orange',
      features: ['Question bank', 'Answer suggestions', 'Practice sessions', 'Feedback analysis'],
    },
    {
      id: 'salary-negotiator',
      name: 'Salary Negotiator',
      description: 'Get salary insights and negotiation strategies for your role and location',
      icon: '💰',
      color: 'yellow',
      features: ['Market research', 'Negotiation tips', 'Benefits analysis', 'Counter-offer help'],
    },
    {
      id: 'skill-gap-analyzer',
      name: 'Skill Gap Analyzer',
      description: 'Identify missing skills and get personalized learning recommendations',
      icon: '📚',
      color: 'teal',
      features: [
        'Gap identification',
        'Learning paths',
        'Resource recommendations',
        'Progress tracking',
      ],
    },
    {
      id: 'networking-assistant',
      name: 'Networking Assistant',
      description: 'AI-powered networking suggestions and conversation starters',
      icon: '🤝',
      color: 'pink',
      features: [
        'Connection suggestions',
        'Ice breakers',
        'Follow-up templates',
        'Event recommendations',
      ],
    },
  ];
  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
      green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700',
      yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-yellow-700',
      teal: 'bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700',
      pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700',
    };
    return colors[color] || colors.blue;
  };
  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    // Navigate to the appropriate tool page
    switch (toolId) {
      case 'resume-analyzer':
        router.push('/dashboard/resume');
        break;
      case 'job-matcher':
        router.push('/dashboard/job-matching');
        break;
      case 'cover-letter-generator':
        router.push('/dashboard/cover-letter');
        break;
      case 'linkedin-optimizer':
        router.push('/dashboard/linkedin-optimization');
        break;
      default:
        // For tools that don't have dedicated pages yet
        router.push(`/tools/${toolId}`);
        break;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Career Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered tools designed to accelerate your career
            growth. From resume optimization to interview preparation, we've got everything you need
            to succeed.
          </p>
        </div>
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${getColorClasses(tool.color)}`}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{tool.description}</p>
                <div className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className="w-1.5 h-1.5 bg-current rounded-full mr-2 opacity-60"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                  <span className="text-sm font-medium">Try Now →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Featured Tools Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Resume Analyzer</h3>
              <p className="text-gray-600 mb-4">
                Get instant feedback on your resume with AI-powered analysis and improvement
                suggestions.
              </p>
              <button
                onClick={() => router.push('/dashboard/resume')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Analyze Resume
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Job Matcher</h3>
              <p className="text-gray-600 mb-4">
                Match your skills with job requirements and get personalized compatibility scores.
              </p>
              <button
                onClick={() => router.push('/dashboard/job-matching')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Match Jobs
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Cover Letter Generator</h3>
              <p className="text-gray-600 mb-4">
                Create compelling cover letters tailored to specific job requirements and your
                experience.
              </p>
              <button
                onClick={() => router.push('/dashboard/cover-letter')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Resumes Analyzed</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-gray-600">Industries Supported</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">AI Assistance</div>
          </div>
        </div>
        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload & Analyze</h3>
              <p className="text-gray-600">
                Upload your resume or job description and let our AI analyze the content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Insights</h3>
              <p className="text-gray-600">
                Receive detailed analysis, scores, and personalized recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Take Action</h3>
              <p className="text-gray-600">
                Implement suggestions and watch your career opportunities grow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
