"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

interface RazorpayPaymentProps {
  plan: Plan;
  userEmail: string;
  userName: string;
  billingCycle?: 'monthly' | 'yearly';
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm',
    icon: <Smartphone className="w-5 h-5" />
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Credit/Debit Cards',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    id: 'net_banking',
    name: 'Net Banking',
    description: 'All Major Banks',
    icon: <Building2 className="w-5 h-5" />
  },
  {
    id: 'wallet',
    name: 'Wallet',
    description: 'Paytm, PhonePe Wallet',
    icon: <Wallet className="w-5 h-5" />
  }
];

export default function RazorpayPayment({ plan, userEmail, userName, billingCycle = 'monthly', onSuccess, onError }: RazorpayPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [isLoading, setIsLoading] = useState(false);

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 10; // 2 months free for yearly
  };

  const getDisplayPrice = () => {
    if (plan.id === 'free') return 0;
    return billingCycle === 'yearly' ? getYearlyPrice(plan.price) : plan.price;
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getDisplayPrice(),
          currency: 'INR',
          user_id: 'user123', // Replace with actual user ID
          user_email: userEmail,
          user_name: userName,
          description: `CareerForge AI - ${plan.name} (${billingCycle})`,
          plan_id: plan.id,
          billing_cycle: billingCycle,
          payment_method: selectedMethod
        }),
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        // Redirect to Razorpay payment page
        window.location.href = data.payment_url;
      } else {
        onError(data.error_message || 'Payment creation failed');
      }
    } catch (error) {
      onError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Complete Payment</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            {getDisplayPrice()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Billing: {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
            {billingCycle === 'yearly' && plan.id !== 'free' && (
              <span className="text-green-600 ml-2">(Save 17%)</span>
            )}
          </div>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-medium mb-3">Select Payment Method</h4>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {method.icon}
                  <div className="text-left">
                    <div className="font-medium text-sm">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Pay ₹{getDisplayPrice()}
            </div>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center">
          🔒 Your payment is secure and encrypted
        </div>
      </CardContent>
    </Card>
  );
} 
