"use client";

import React, { useState } from 'react';

const AdminDashboard = () => {
  const [apiKey, setApiKey] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    setAnalytics(null);
    try {
      const res = await fetch('/admin/analytics', {
        headers: {
          'X-API-KEY': apiKey,
        },
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnalytics(data);
      }
    } catch (err) {
      setError('Failed to fetch analytics.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Analytics Dashboard</h1>
      <div className="mb-4">
        <label className="block mb-2 font-medium">API Key</label>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter admin API key"
        />
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={fetchAnalytics}
        disabled={loading || !apiKey}
      >
        {loading ? 'Loading...' : 'Fetch Analytics'}
      </button>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {analytics && (
        <div className="mt-8 bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Stats</h2>
          <ul className="space-y-2">
            <li><strong>Users:</strong> {analytics.user_count}</li>
            <li><strong>Resumes Parsed:</strong> {analytics.resumes_parsed}</li>
            <li><strong>Jobs Matched:</strong> {analytics.jobs_matched}</li>
            <li><strong>Chats:</strong> {analytics.chats}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 