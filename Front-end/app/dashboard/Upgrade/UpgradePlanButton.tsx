'use client';

import { useState } from 'react';

export default function UpgradePlanButton() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('pro');
  const [message, setMessage] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upgrade_plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ plan }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Successfully upgraded to "${plan}" plan.`);
      } else {
        setMessage(`❌ Upgrade failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl max-w-md bg-white dark:bg-zinc-900 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
      <select
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      >
        <option value="pro">Pro</option>
        <option value="premium">Premium</option>
      </select>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Upgrading...' : 'Upgrade Plan'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
