import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending' | 'unknown'>('loading');
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    let interval: NodeJS.Timeout;
    const fetchStatus = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/payment/status?payment_id=${encodeURIComponent(paymentId)}`);
        const data = await res.json();
        setDetails(data);
        if (data.status === 'success' || data.status === 'paid') {
          setStatus('success');
        } else if (data.status === 'failed') {
          setStatus('failed');
        } else if (data.status === 'pending' || data.status === 'created') {
          setStatus('pending');
        } else {
          setStatus('unknown');
        }
      } catch (e: any) {
        setError(e.message || 'Error fetching payment status');
        setStatus('unknown');
      }
    };
    fetchStatus();
    interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [paymentId]);

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      {!paymentId && <div className="text-red-500">No payment_id provided in URL.</div>}
      {paymentId && (
        <>
          <div className="mb-4">
            <span className="font-semibold">Payment ID:</span> {paymentId}
          </div>
          {status === 'loading' && <div className="text-blue-600">Checking payment status...</div>}
          {status === 'pending' && <div className="text-yellow-600">Payment is pending. Please wait...</div>}
          {status === 'success' && <div className="text-green-600 font-semibold">Payment successful!</div>}
          {status === 'failed' && <div className="text-red-600 font-semibold">Payment failed.</div>}
          {status === 'unknown' && <div className="text-gray-600">Status unknown.</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {details && (
            <pre className="bg-gray-100 p-2 mt-4 rounded text-xs overflow-x-auto max-h-64">{JSON.stringify(details, null, 2)}</pre>
          )}
        </>
      )}
    </div>
  );
} 