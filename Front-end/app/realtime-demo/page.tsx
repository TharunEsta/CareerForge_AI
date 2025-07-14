import React, { useState } from 'react';
import { useRealtimeWebSocket, RealtimeMessage } from '@/components/hooks/useRealtimeWebSocket';

export default function RealtimeDemoPage() {
  const [userId, setUserId] = useState('demo-user');
  const [input, setInput] = useState('');
  const [type, setType] = useState<'skills_analysis' | 'job_matching' | 'resume_optimization' | 'comprehensive_analysis'>('skills_analysis');
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const { connected, lastMessage, sendMessage } = useRealtimeWebSocket(userId);

  React.useEffect(() => {
    if (lastMessage) {
      setMessages(msgs => [...msgs, lastMessage]);
    }
  }, [lastMessage]);

  const handleSend = () => {
    let data: any = {};
    if (type === 'skills_analysis') {
      data = { text: input, job_description: 'Looking for a Python developer', analysis_type: 'comprehensive' };
    } else if (type === 'job_matching') {
      data = { skills: input.split(','), job_description: 'Senior Python Developer position' };
    } else if (type === 'resume_optimization') {
      data = { resume_data: { name: 'John Doe', skills: input.split(','), experience: [{ role: 'Developer', company: 'Tech Corp' }] }, job_description: 'Python Developer role', optimization_type: 'ats' };
    } else if (type === 'comprehensive_analysis') {
      data = { content: input, analysis_type: 'full_career_analysis' };
    }
    sendMessage({ type, data, user_id: userId });
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Real-Time WebSocket Demo</h1>
      <div className="mb-4">
        <label className="block font-semibold mb-1">User ID:</label>
        <input value={userId} onChange={e => setUserId(e.target.value)} className="border px-2 py-1 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Type:</label>
        <select value={type} onChange={e => setType(e.target.value as any)} className="border px-2 py-1 rounded w-full">
          <option value="skills_analysis">Skills Analysis</option>
          <option value="job_matching">Job Matching</option>
          <option value="resume_optimization">Resume Optimization</option>
          <option value="comprehensive_analysis">Comprehensive Analysis</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Input (comma separated for skills):</label>
        <input value={input} onChange={e => setInput(e.target.value)} className="border px-2 py-1 rounded w-full" />
      </div>
      <button onClick={handleSend} disabled={!connected} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4">
        {connected ? 'Send' : 'Connect first'}
      </button>
      <div className="mb-2 text-sm">WebSocket status: {connected ? <span className="text-green-600">Connected</span> : <span className="text-red-600">Disconnected</span>}</div>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Messages:</h2>
        <div className="bg-gray-100 p-2 rounded text-xs max-h-64 overflow-y-auto">
          {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
          {messages.map((msg, i) => (
            <pre key={i} className="mb-2">{JSON.stringify(msg, null, 2)}</pre>
          ))}
        </div>
      </div>
    </div>
  );
} 
