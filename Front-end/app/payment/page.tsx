"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, CreditCard, Paypal, Shield, Lock, Globe, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  gateway: string;
  description: string;
}

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  description: string;
}

interface PaymentResponse {
  payment_id: string;
  status: string;
  gateway: string;
  amount: number;
  currency: string;
  payment_url?: string;
  transaction_id?: string;
  error_message?: string;
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [userCountry, setUserCountry] = useState<string>('US');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const { toast } = useToast();

  // Mock payment methods - replace with actual API call
  const mockPaymentMethods: PaymentMethod[] = [
    { id: 'credit_card', name: 'Credit Card', gateway: 'stripe', description: 'Visa, Mastercard, American Express' },
    { id: 'paypal', name: 'PayPal', gateway: 'paypal', description: 'Pay with your PayPal account' },
    { id: 'bank_transfer', name: 'Bank Transfer', gateway: 'bank', description: 'Direct bank transfer' }
  ];

  // Mock plans - replace with actual API call
  const mockPlans = {
    free: { id: 'free', name: 'Free', price_monthly: 0, price_yearly: 0, description: 'Perfect for trying out CareerForge AI' },
    starter: { id: 'starter', name: 'Starter', price_monthly: 9.99, price_yearly: 99, description: 'Great for individual job seekers' },
    pro: { id: 'pro', name: 'Pro', price_monthly: 24.99, price_yearly: 249, description: 'Perfect for serious career development' },
    growth: { id: 'growth', name: 'Growth', price_monthly: 49.99, price_yearly: 499, description: 'For power users and small teams' }
  };

  useEffect(() => {
    initializePaymentPage();
  }, []);

  const initializePaymentPage = async () => {
    try {
      // Get plan from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const planId = urlParams.get('plan') || 'starter';
      
      // Set selected plan
      const plan = mockPlans[planId as keyof typeof mockPlans] || mockPlans.starter;
      setSelectedPlan(plan);

      // Set payment methods
      setPaymentMethods(mockPaymentMethods);
      if (mockPaymentMethods.length > 0) {
        setSelectedPaymentMethod(mockPaymentMethods[0].id);
      }

      // Detect user country
      await detectUserCountry();
    } catch (error) {
      console.error('Error initializing payment page:', error);
      toast({
        title: "Error",
        description: "Failed to load payment options",
        variant: "destructive"
      });
    }
  };

  const detectUserCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setUserCountry(data.country_code || 'US');
    } catch (error) {
      console.log('Using default country: US');
      setUserCountry('US');
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a plan and payment method",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      toast({
        title: "Payment Successful",
        description: "Your subscription has been activated!",
      });
      setPaymentStatus('success');

      // Redirect to dashboard after successful payment
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing your payment",
        variant: "destructive"
      });
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'paypal':
        return <Paypal className="h-5 w-5" />;
      case 'bank_transfer':
        return <Globe className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPrice = (): number => {
    if (!selectedPlan) return 0;
    return billingCycle === 'monthly' ? selectedPlan.price_monthly : selectedPlan.price_yearly;
  };

  const getAmount = (): number => {
    return getPrice();
  };

  const getCurrency = () => {
    return userCountry === 'IN' ? 'INR' : 'USD';
  };

  const getSavingsPercentage = () => {
    if (!selectedPlan || billingCycle === 'monthly') return 0;
    const monthlyTotal = selectedPlan.price_monthly * 12;
    const yearlyPrice = selectedPlan.price_yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  };

  function renderPaymentUI() {
    if (!selectedPlan) {
      return (
        <div className="text-center text-sm text-muted-foreground">
          Please select a plan to continue.
        </div>
      );
    }

    return (
      <div>
        {/* Payment form UI here */}
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your plan details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Subscription
          </h1>
          <p className="text-lg text-gray-600">
            Choose your payment method and complete your subscription to CareerForge AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Secure Payment
              </CardTitle>
              <CardDescription>
                Your payment information is encrypted and secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Plan Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{selectedPlan.name} Plan</span>
                  <span className="font-semibold">
                    {getCurrency()} {getAmount()}/{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && getSavingsPercentage() > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Savings</span>
                    <Badge variant="secondary" className="text-green-600">
                      Save {getSavingsPercentage()}%
                    </Badge>
                  </div>
                )}
              </div>

              {/* Billing Cycle Toggle */}
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <RadioGroup value={billingCycle} onValueChange={(value: 'monthly' | 'yearly') => setBillingCycle(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">Yearly (Save {getSavingsPercentage()}%)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(method.id)}
                          {method.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={userCountry} onValueChange={setUserCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Button */}
              <Button 
                onClick={handlePayment}
                disabled={loading || !selectedPaymentMethod}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Pay {getCurrency()} {getAmount()}
                  </div>
                )}
              </Button>

              {/* Security Notice */}
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <Lock className="h-4 w-4 mt-0.5" />
                <p>
                  Your payment is secured with bank-level encryption. We never store your payment details.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <div className="space-y-6">
            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedPlan.name} Plan</CardTitle>
                <CardDescription>{selectedPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI-powered job matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Resume analysis and optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Skill recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Market trends and insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Payment Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">SSL encrypted transactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Secure payment gateways</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">30-day money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Supported Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center gap-2 text-sm">
                      {getPaymentMethodIcon(method.id)}
                      {method.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 