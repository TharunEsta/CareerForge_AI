'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MatchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    experience: '',
    salary: '',
    remote: false,
    fullTime: true,
  });
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      type: 'Full-time',
      remote: true,
      experience: '5+ years',
      description: 'We are looking for a Senior Software Engineer to join our team...',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Startup Inc',
      location: 'New York, NY',
      salary: '$90k - $130k',
      type: 'Full-time',
      remote: false,
      experience: '3+ years',
      description: 'Join our fast-growing startup as a Full Stack Developer...',
      skills: ['JavaScript', 'Python', 'Django', 'React'],
      posted: '1 day ago',
    },
    {
      id: 3,
      title: 'Frontend Engineer',
      company: 'Big Tech',
      location: 'Seattle, WA',
      salary: '$110k - $160k',
      type: 'Full-time',
      remote: true,
      experience: '4+ years',
      description: 'Build amazing user experiences with cutting-edge technologies...',
      skills: ['React', 'Vue.js', 'TypeScript', 'CSS'],
      posted: '3 days ago',
    },
  ]);
  const FREE_LIMIT = 5;
  const [showGetPlus, setShowGetPlus] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('match_usage') || '0', 10);
    }
    return 0;
  });

  const handleFilterChange = (filter: string, value: string | boolean) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  const handleJobClick = (jobId: number) => {
    if (usageCount >= FREE_LIMIT) {
      setShowGetPlus(true);
      return;
    }
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('match_usage', newCount.toString());
    if (newCount >= FREE_LIMIT) {
      setShowGetPlus(true);
    }
    router.push(`/dashboard/job-matching?job=${jobId}`);
  };

  return (
    <div>
      {showGetPlus && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Get Plus to Unlock More Matches</h2>
            <p className="mb-4 text-gray-700">You have reached your free limit of {FREE_LIMIT} job matches. Upgrade to Plus for unlimited access and premium features!</p>
            <button
              onClick={() => router.push('/pricing')}
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
            Job Matching
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect job that matches your skills and career goals. Our AI-powered matching
            system helps you discover opportunities tailored to your profile.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, company, or keywords..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Location</option>
                <option value="remote">Remote</option>
                <option value="san-francisco">San Francisco</option>
                <option value="new-york">New York</option>
                <option value="seattle">Seattle</option>
                <option value="austin">Austin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                value={selectedFilters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Experience</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead/Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <select
                value={selectedFilters.salary}
                onChange={(e) => handleFilterChange('salary', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Salary</option>
                <option value="50k-80k">$50k - $80k</option>
                <option value="80k-120k">$80k - $120k</option>
                <option value="120k-180k">$120k - $180k</option>
                <option value="180k+">$180k+</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.remote}
                onChange={(e) => handleFilterChange('remote', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Remote Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.fullTime}
                onChange={(e) => handleFilterChange('fullTime', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Full-time Only</span>
            </label>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => handleJobClick(job.id)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-lg text-blue-600 font-medium">{job.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      {job.salary}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                        />
                      </svg>
                      {job.experience}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500">{job.posted}</span>
                  <div className="flex items-center gap-2 mt-2">
                    {job.remote && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Remote
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
