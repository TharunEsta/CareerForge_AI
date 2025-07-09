"use client";

"use client";

"use client";

import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { ArrowRight, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

export const Hero: React.FC<HeroProps> = ({
  title = 'AI-Powered Career Forge',
  subtitle = 'Transform Your Career',
  description = 'Leverage cutting-edge AI to optimize your resume, match with perfect jobs, and accelerate your career growth with intelligent insights and personalized recommendations.',
  primaryAction,
  secondaryAction,
  features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes through Applicant Tracking Systems',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Smart Matching',
      description: 'AI-powered job matching based on your skills and experience',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'AI Insights',
      description: 'Get personalized recommendations to improve your profile',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Analysis',
      description: 'Real-time feedback and optimization suggestions',
    },
  ],
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="relative container-modern section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by Advanced AI
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>

              <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                {subtitle}
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryAction && (
                <Button
                  onClick={primaryAction.onClick}
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow text-white font-semibold group"
                >
                  {primaryAction.label}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}

              {secondaryAction && (
                <Button
                  onClick={secondaryAction.onClick}
                  variant="outline"
                  size="lg"
                  className="border-2 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">95%</div>
                <div className="text-sm text-muted-foreground">ATS Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10k+</div>
                <div className="text-sm text-muted-foreground">Jobs Matched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-scale-in">
            <Card className="card-glass p-8">
              <CardContent className="p-0 space-y-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Resume Analysis</h3>
                  <p className="text-muted-foreground">
                    Upload your resume to get started with AI-powered optimization
                  </p>
                </div>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// CSS for grid pattern
const gridPatternCSS = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

// Add the CSS to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gridPatternCSS;
  document.head.appendChild(style);
}
