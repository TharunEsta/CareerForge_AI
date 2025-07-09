'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    resumeCount: 3,
    jobMatches: 12,
    coverLetters: 5,
    lastActivity: '2 hours ago',
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'resume', action: 'Resume analyzed', time: '2 hours ago', status: 'completed' },
    {
      id: 2,
      type: 'job-match',
      action: 'Job match analyzed',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'cover-letter',
      action: 'Cover letter generated',
      time: '3 days ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'linkedin',
      action: 'LinkedIn profile optimized',
      time: '1 week ago',
      status: 'completed',
    },
  ]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/placeholder-logo.svg"
            alt="CareerForge AI Logo"
            className="h-8 w-8"
            width={32}
            height={32}
          />
          <span className="font-bold text-lg text-blue-700">CareerForge AI</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-100 font-medium transition"
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
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
            href="/tools"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🛠️ AI Tools
          </a>
          <a
            href="/voice-assistant"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🎤 Voice Assistant
          </a>
          <a
            href="/agent"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 font-medium transition"
          >
            🤖 AI Agent
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your career tools today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resumes</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.resumeCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.jobMatches}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cover Letters</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.coverLetters}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Activity</p>
                  <p className="text-lg font-semibold text-gray-900">{userStats.lastActivity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/resume')}
                  className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Analyze Resume</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => router.push('/dashboard/job-matching')}
                  className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Match Job</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => router.push('/dashboard/cover-letter')}
                  className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Generate Cover Letter</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => router.push('/voice-assistant')}
                  className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Voice Assistant</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Smart Resume Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">
                  AI-powered resume parsing and skill extraction
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Job Matching</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Intelligent job-resume matching with skill analysis
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">AI Writing Assistant</h3>
                </div>
                <p className="text-sm text-gray-600">Generate cover letters and optimize content</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
