
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const [selectedTab, setSelectedTab] = useState<"personal" | "business">("personal");

  const personalPlans = [
    {
      name: "Free",
      price: 0,
      description: "Explore how AI can help you with everyday tasks",
      features: [
        "Access to GPT-4o mini and reasoning",
        "Standard voice mode",
        "Real-time data from the web with search",
        "Limited access to GPT-4o and o4-mini",
        "Limited access to file uploads, advanced data analysis, and image generation",
        "Use custom GPTs"
      ],
      buttonText: "Your current plan",
      buttonVariant: "secondary" as const,
      isCurrentPlan: true
    },
    {
      name: "Plus",
      price: 599,
      description: "Level up productivity and creativity with expanded access",
      features: [
        "Everything in Free",
        "Extended limits on messaging, file uploads, advanced data analysis, and image generation",
        "Standard and advanced voice mode",
        "Access to deep research, multiple reasoning models (o4-mini, o4-mini-high, and o3), and a research preview of GPT-4.5",
        "Create and use tasks, projects, and custom GPTs",
        "Limited access to Sora video generation",
        "Opportunities to test new features"
      ],
      buttonText: "Get Plus",
      buttonVariant: "default" as const,
      isPopular: true
    },
    {
      name: "Pro",
      price: 1399,
      description: "Get the best of OpenAI with the highest level of access",
      features: [
        "Everything in Plus",
        "Unlimited access to all reasoning models and GPT-4o",
        "Unlimited access to advanced voice",
        "Extended access to deep research, which conducts multi-step online research for complex tasks",
        "Access to research previews of GPT-4.5 and Operator",
        "Access to o3 pro mode, which uses more compute for the best answers to the hardest questions",
        "Extended access to Sora video generation"
      ],
      buttonText: "Get Pro",
      buttonVariant: "outline" as const
    }
  ];

  const businessPlan = {
    name: "Business",
    price: 1999,
    description: "Advanced AI capabilities for teams and organizations",
    features: [
      "Everything in Pro",
      "Team management and collaboration tools",
      "Advanced security and compliance",
      "Priority support",
      "Custom integrations",
      "Enterprise-grade analytics"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "default" as const
  };

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
                } transition-all hover:border-gray-600`}
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
            <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
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
