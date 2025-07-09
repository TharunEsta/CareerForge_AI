'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Globe, Check, Lock } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  description: string;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price_monthly: 9.99,
    price_yearly: 99,
    description: 'Great for individual job seekers',
  },
  {
    id: 'pro',
    name: 'Pro',
    price_monthly: 24.99,
    price_yearly: 249,
    description: 'Perfect for serious career development',
  },
  {
    id: 'growth',
    name: 'Growth',
    price_monthly: 49.99,
    price_yearly: 499,
    description: 'For power users and small teams',
  },
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  const getPrice = () =>
    billingCycle === 'monthly' ? selectedPlan.price_monthly : selectedPlan.price_yearly;
  const getCurrency = () => 'USD';
  const getSavings = () => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = selectedPlan.price_monthly * 12;
      return Math.round(((monthlyTotal - selectedPlan.price_yearly) / monthlyTotal) * 100);
    }
    return 0;
  };

  const handlePayPalPayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');
    try {
      // Call backend to create PayPal payment
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          billing_cycle: billingCycle,
          payment_method: 'paypal',
          user_country: 'US', // or detect
          user_email: 'user@example.com', // get from auth
          user_id: 'user123', // get from auth
        }),
      });
      const data = await res.json();
      if (data && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setPaymentStatus('failed');
      }
    } catch (err) {
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Secure Payment
            </CardTitle>
            <CardDescription>
              Subscribe to unlock all features. Your payment is secure and encrypted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Selection */}
            <div>
              <label htmlFor="plan">Choose Plan</label>
              <select
                value={selectedPlan.id}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedPlan(PLANS.find((p) => p.id === e.target.value) || PLANS[0])
                }
              >
                <option value={selectedPlan.id}>{selectedPlan.name}</option>
                {PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Billing Cycle Toggle */}
            <div>
              <label>Billing Cycle</label>
              <input
                type="radio"
                name="billingCycle"
                value="monthly"
                checked={billingCycle === 'monthly'}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setBillingCycle(e.target.value as 'monthly' | 'yearly')
                }
              />
              <label htmlFor="monthly">Monthly</label>
              <input
                type="radio"
                name="billingCycle"
                value="yearly"
                checked={billingCycle === 'yearly'}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setBillingCycle(e.target.value as 'monthly' | 'yearly')
                }
              />
              <label htmlFor="yearly">
                Yearly {getSavings() > 0 && <Badge className="ml-2">Save {getSavings()}%</Badge>}
              </label>
            </div>

            {/* Plan Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{selectedPlan.name} Plan</span>
                <span className="font-semibold">
                  {getCurrency()} {getPrice()}/{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingCycle === 'yearly' && getSavings() > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Savings</span>
                  <Badge variant="secondary" className="text-green-600">
                    Save {getSavings()}%
                  </Badge>
                </div>
              )}
            </div>

            {/* PayPal Payment Button */}
            <div className="mt-6">
              <Button
                onClick={handlePayPalPayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay with PayPal
                  </>
                )}
              </Button>
            </div>

            {/* Payment Status */}
            {paymentStatus === 'success' && (
              <div className="text-green-600 text-center font-semibold mt-4">
                Payment successful! Thank you for subscribing.
              </div>
            )}
            {paymentStatus === 'processing' && (
              <div className="text-blue-600 text-center font-semibold mt-4">
                Processing your payment...
              </div>
            )}
          </CardContent>
        </Card>
        {/* Supported Payment Methods */}
        <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground text-sm">
          <span>Supported:</span>
          <CreditCard className="h-5 w-5" />
          <Globe className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
