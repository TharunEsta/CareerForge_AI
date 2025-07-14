"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToaster } from "@/components/ui/toaster";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toaster = useToaster();
  const paymentId = searchParams.get("payment_id");
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending" | "unknown">("loading");
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  // Poll payment status
  useEffect(() => {
    if (!paymentId) return;
    let interval: NodeJS.Timeout;
    const fetchStatus = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/payment/status?payment_id=${encodeURIComponent(paymentId)}`);
        const data = await res.json();
        setDetails(data);
        if (data.status === "success" || data.status === "paid") {
          setStatus("success");
        } else if (data.status === "failed") {
          setStatus("failed");
        } else if (data.status === "pending" || data.status === "created") {
          setStatus("pending");
        } else {
          setStatus("unknown");
        }
      } catch (e: any) {
        setError(e.message || "Error fetching payment status");
        setStatus("unknown");
      }
    };
    fetchStatus();
    interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [paymentId]);

  // On success, fetch and sync user plan
  useEffect(() => {
    if (status !== "success" || !details?.user_id) return;
    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/subscription/user/${encodeURIComponent(details.user_id)}`);
        const data = await res.json();
        if (data.success && data.subscription) {
          setPlan(data.subscription.plan_id);
          // Update localStorage or context
          if (typeof window !== "undefined") {
            const user = JSON.parse(localStorage.getItem("careerforge-user") || "null");
            if (user) {
              user.plan = data.subscription.plan_id;
              localStorage.setItem("careerforge-user", JSON.stringify(user));
            }
          }
          toaster.showToast(`Subscription upgraded to ${data.subscription.plan_id}!`, "success");
        }
      } catch (e: any) {
        toaster.showToast("Failed to sync plan after payment", "error");
      }
    };
    fetchPlan();
  }, [status, details, toaster]);

  // Accessibility: focus on status message
  const statusRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.focus();
    }
  }, [status]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18181b] text-white px-4">
      <div
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="w-full max-w-md rounded-xl shadow-xl bg-[#23242a] p-8 flex flex-col items-center text-center"
      >
        {status === "loading" && <div className="text-lg font-semibold">Checking payment status...</div>}
        {status === "pending" && <div className="text-lg font-semibold text-yellow-400">Payment Pending</div>}
        {status === "success" && (
          <>
            <div className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</div>
            <div className="mb-2">Thank you for upgrading your subscription.</div>
            {plan && <div className="mb-2">Your new plan: <span className="font-semibold text-blue-400">{plan}</span></div>}
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="text-2xl font-bold text-red-500 mb-2">Payment Failed</div>
            <div className="mb-2">Your payment could not be processed. Please try again or contact support.</div>
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold shadow"
              onClick={() => router.push("/pricing")}
            >
              Try Again
            </button>
          </>
        )}
        {status === "unknown" && (
          <>
            <div className="text-lg font-semibold text-gray-400">Unable to determine payment status.</div>
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold shadow"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        )}
        {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
      </div>
    </div>
  );
} 