"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./dialog";
// import { useToast } from "./use-toast"; // Placeholder, implement custom toast below
import { useRef } from "react";
import { useToaster } from './toaster';

const PERSONAL_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "5 AI chats/month",
      "Basic resume analysis",
      "Community support",
      "Basic job matching",
    ],
    badge: null,
  },
  {
    id: "plus",
    name: "Plus",
    price: 499,
    features: [
      "Unlimited AI chats",
      "Advanced resume analysis",
      "Priority job matching",
      "Voice assistant",
      "LinkedIn optimization",
      "Priority support",
      "All features unlocked",
    ],
    badge: "POPULAR",
  },
  {
    id: "pro",
    name: "Pro",
    price: 899,
    features: [
      "All Plus features",
      "Custom integrations",
      "API access",
      "Dedicated support",
      "Custom branding",
      "Team management",
    ],
    badge: null,
  },
];

const BUSINESS_PLANS = [
  {
    id: "business",
    name: "Business",
    price: 1299,
    features: [
      "All Pro features",
      "Team management",
      "Admin dashboard",
      "Custom integrations",
      "Dedicated support",
      "API access",
    ],
    badge: null,
  },
];

const DISCOUNTS = {
  personal: 0.25, // 25% off
  business: 0.3, // 30% off
};

function formatPrice(price: number) {
  return `₹${price}`;
}

function getYearlyPrice(price: number, discount: number) {
  return Math.round(price * 12 * (1 - discount));
}

export default function SubscriptionUpgradeModal({ currentPlan = "free" }: { currentPlan?: string }) {
  const [selectedTab, setSelectedTab] = useState<"personal" | "business">("personal");
  const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const toaster = useToaster();
  const [userPlan, setUserPlan] = useState<string>(currentPlan);
  const [usage, setUsage] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);

  // Fetch user plan and usage on mount
  useEffect(() => {
    let userId = "anonymous";
    if (typeof window !== "undefined") {
      try {
        const user = JSON.parse(localStorage.getItem("careerforge-user") || "null");
        if (user) {
          userId = user.id || userId;
        }
      } catch {}
    }
    if (userId && userId !== "anonymous") {
      fetch(`/api/subscription/user/${encodeURIComponent(userId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.subscription) {
            setUserPlan(data.subscription.plan_id);
            setUsage(data.subscription.current_usage);
            setLimits(data.subscription.limits);
          }
        });
    }
  }, []);

  const plans = selectedTab === "personal" ? PERSONAL_PLANS : BUSINESS_PLANS;
  const discount = selectedTab === "personal" ? DISCOUNTS.personal : DISCOUNTS.business;

  const handleGetPlan = (plan: any) => {
    setPendingPlan(plan);
    setShowConfirm(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!pendingPlan) return;
    setShowConfirm(false);
    toaster.showToast(
      `You're about to upgrade to ${pendingPlan.name} for ` +
        (billingType === "monthly"
          ? formatPrice(pendingPlan.price) + "/month"
          : formatPrice(getYearlyPrice(pendingPlan.price, discount)) + "/year"),
      "info"
    );
    setSelectedPlan(pendingPlan.id);
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:
            billingType === "monthly"
              ? pendingPlan.price
              : getYearlyPrice(pendingPlan.price, discount),
          currency: "INR",
          user_id: userId,
          user_email: userEmail,
          user_name: userName,
          description: `CareerForge AI - ${pendingPlan.name} (${billingType})`,
          plan_id: pendingPlan.id,
          billing_cycle: billingType,
          payment_method: paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success && data.payment_url) {
        toaster.showToast('Redirecting to payment...', 'success');
        window.location.href = data.payment_url;
      } else {
        toaster.showToast(data.error || data.message || "Payment creation failed", 'error');
      }
    } catch (e: any) {
      toaster.showToast(e.message || "Network error", 'error');
    } finally {
      setLoading(false);
      setPendingPlan(null);
    }
  };

  return (
    <div className="w-full bg-[#18181b] text-white rounded-xl shadow-2xl p-0">
      <div className="px-6 pt-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold mb-2">Upgrade your plan</h2>
        <div className="flex items-center gap-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger
              value="personal"
              className={selectedTab === "personal" ? "bg-[#23242a] text-white" : ""}
              onClick={() => setSelectedTab("personal")}
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className={selectedTab === "business" ? "bg-[#23242a] text-white" : ""}
              onClick={() => setSelectedTab("business")}
            >
              Business
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center ml-4">
            <span className="text-xs mr-2">Monthly</span>
            {/* Custom Switch */}
            <button
              className={`w-12 h-6 rounded-full bg-gray-700 relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1 ${
                billingType === "yearly" ? "bg-blue-600" : ""
              }`}
              onClick={() => setBillingType(billingType === "monthly" ? "yearly" : "monthly")}
              aria-label="Toggle billing type"
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  billingType === "yearly" ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className="text-xs ml-2">Yearly</span>
            {billingType === "yearly" && (
              <span className="ml-2 text-xs text-green-400 font-semibold">
                {selectedTab === "personal" ? "25% off" : "30% off"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 pt-4">
        {/* Usage and limits display */}
        {usage && limits && (
          <div className="mb-6 bg-[#18181b] border border-gray-800 rounded-lg p-4 text-sm text-gray-300">
            <div className="font-semibold mb-2 text-white">Your Current Usage</div>
            <ul className="space-y-1">
              {Object.keys(limits).map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="capitalize">{feature.replace(/_/g, ' ')}:</span>
                  <span className="font-bold text-blue-400">{usage[feature] ?? 0}</span>
                  <span className="text-gray-400">/ {limits[feature] === -1 ? 'Unlimited' : limits[feature]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isActive = selectedPlan === plan.id;
            const isCurrent = currentPlan === plan.id;
            const price =
              billingType === "monthly"
                ? plan.price
                : getYearlyPrice(plan.price, discount);
            return (
              <Card
                key={plan.id}
                className={`bg-[#23242a] text-white border-2 transition-all duration-200 rounded-xl shadow-lg flex flex-col justify-between ${
                  isActive ? "border-blue-500 shadow-xl" : "border-gray-800"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {plan.name}
                    {plan.badge && (
                      <Badge className="ml-2 bg-blue-600 text-white">{plan.badge}</Badge>
                    )}
                  </CardTitle>
                  {isCurrent && (
                    <span className="text-xs text-green-400 font-semibold ml-2">Your current plan</span>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-2 pb-0">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(price)}
                    </span>
                    <span className="text-sm text-gray-400 font-medium mb-1">
                      /{billingType === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2 list-none pl-0 mb-4">
                    {plan.features.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">✓</span>
                        <span>{feature}</span>
                        {/* Highlight new features for upgrade */}
                        {userPlan !== plan.id &&
                          !PERSONAL_PLANS.find((p) => p.id === userPlan)?.features.includes(feature) && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-blue-700 text-xs text-white">New</span>
                          )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  {isCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Your current plan
                    </Button>
                  ) : (
                    <Button
                      variant={isActive ? "gradient" : "outline"}
                      className="w-full"
                      onClick={() => handleGetPlan(plan)}
                      disabled={loading}
                    >
                      {loading && selectedPlan === plan.id ? "Processing..." : "Get Plan"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <span>{toastMsg}</span>
          <Button size="sm" variant="secondary" onClick={() => setShowToast(false)}>
            Close
          </Button>
        </div>
      )}
      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <span>{error}</span>
          <Button size="sm" variant="secondary" onClick={() => setError(null)}>
            Close
          </Button>
        </div>
      )}
      {/* Confirmation Modal */}
      {showConfirm && pendingPlan && (
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="max-w-md w-full bg-[#23242a] text-white rounded-xl shadow-2xl border border-gray-800 animate-fade-in">
            <DialogTitle className="text-xl font-bold mb-2">Confirm Upgrade</DialogTitle>
            <div className="mb-4">
              Are you sure you want to upgrade to <span className="font-semibold text-blue-400">{pendingPlan.name}</span> for <span className="font-semibold text-blue-400">{billingType === "monthly" ? formatPrice(pendingPlan.price) + "/month" : formatPrice(getYearlyPrice(pendingPlan.price, discount)) + "/year"}</span>?
            </div>
            <div className="mb-4">
              <span className="block mb-2 font-semibold">Select Payment Method:</span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment-method" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")}/>
                  <span>UPI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment-method" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")}/>
                  <span>Card</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment-method" value="net_banking" checked={paymentMethod === "net_banking"} onChange={() => setPaymentMethod("net_banking")}/>
                  <span>Net Banking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment-method" value="wallet" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")}/>
                  <span>Wallet</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleConfirmUpgrade} loading={loading}>
                Confirm & Pay
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 