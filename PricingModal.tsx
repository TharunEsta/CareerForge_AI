import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import RazorpayPayment from "./RazorpayPayment";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user_id?: string;
  user_email?: string;
  user_name?: string;
}

const PricingModal = ({ open, onOpenChange, user_id, user_email, user_name }: PricingModalProps) => {
  const [selectedTab, setSelectedTab] = useState<"personal" | "business">("personal");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const personalPlans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Basic career tools to get started",
      features: [
        "3 Resume Analysis per month",
        "Basic AI chat (5 per month)",
        "Community support",
        "Basic job matching (3 per month)"
      ],
      buttonText: "Your current plan",
      buttonVariant: "secondary" as const,
      isCurrentPlan: true
    },
    {
      id: "plus",
      name: "Plus",
      price: 599,
      description: "Advanced career optimization tools",
      features: [
        "Resume Analysis + Rewriting (45 times)",
        "Cover Letter Generation with Job Description (45 times)",
        "Job Matching (50 times per month)",
        "Image Generation",
        "Daily News Updates",
        "Voice Assistant",
        "Advanced AI chat (100 per month)",
        "Email support"
      ],
      buttonText: "Get Plus",
      buttonVariant: "default" as const,
      isPopular: true
    },
    {
      id: "pro",
      name: "Pro",
      price: 1399,
      description: "Complete career optimization suite",
      features: [
        "Everything in Plus",
        "Unlimited Resume Analysis",
        "Unlimited Resume Rewriting",
        "Unlimited Cover Letter Generation",
        "Unlimited Job Matching",
        "Unlimited Image Generation",
        "Unlimited AI Chats",
        "Advanced Voice Assistant",
        "Priority support",
        "All features unlocked"
      ],
      buttonText: "Get Pro",
      buttonVariant: "outline" as const
    }
  ];

  const businessPlan = {
    id: "business",
    name: "Business",
    price: 1999,
    description: "Enterprise-grade career optimization for teams",
    features: [
      "Everything in Pro",
      "Team Management",
      "Advanced Security & Compliance",
      "Priority Support",
      "Custom Integrations",
      "Enterprise Analytics",
      "All features unlimited"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "default" as const
  };

  const handlePlanSelect = (plan: any) => {
    if (plan.isCurrentPlan) return;
    
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    setShowPayment(false);
    onOpenChange(false);
    // You can add success notification or redirect logic here
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
    // You can add error notification logic here
  };

  if (showPayment && selectedPlan) {
    return (
      <RazorpayPayment
        amount={selectedPlan.price}
        currency="INR"
        user_id={user_id || "anonymous"}
        user_email={user_email || "user@example.com"}
        user_name={user_name || "User"}
        description={`CareerForge AI - ${selectedPlan.name} Plan`}
        plan_id={selectedPlan.id}
        billing_cycle="monthly"
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onClose={() => setShowPayment(false)}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Upgrade your plan</DialogTitle>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-full p-1 flex">
            <Button
              variant={selectedTab === "personal" ? "default" : "ghost"}
              onClick={() => setSelectedTab("personal")}
              className="rounded-full px-6"
            >
              Personal
            </Button>
            <Button
              variant={selectedTab === "business" ? "default" : "ghost"}
              onClick={() => setSelectedTab("business")}
              className="rounded-full px-6"
            >
              Business
            </Button>
          </div>
        </div>

        {selectedTab === "personal" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.isPopular
                    ? "bg-gradient-to-b from-green-900/20 to-gray-900 border-green-500"
                    : "bg-gray-900 border-gray-700"
                } transition-all hover:border-gray-600 cursor-pointer`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      POPULAR
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full mb-6 ${
                      plan.isPopular ? "bg-green-600 hover:bg-green-700" : ""
                    } ${plan.isCurrentPlan ? "bg-gray-600" : ""}`}
                    disabled={plan.isCurrentPlan}
                  >
                    {plan.buttonText}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <Card 
              className="bg-gray-900 border-gray-700 max-w-md w-full cursor-pointer"
              onClick={() => handlePlanSelect(businessPlan)}
            >
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{businessPlan.name}</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold">₹{businessPlan.price}</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm">{businessPlan.description}</p>
                </div>

                <Button variant="default" className="w-full mb-6">
                  {businessPlan.buttonText}
                </Button>

                <div className="space-y-3">
                  {businessPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { PricingModal };
