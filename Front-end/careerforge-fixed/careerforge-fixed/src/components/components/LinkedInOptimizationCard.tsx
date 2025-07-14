'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Linkedin, TrendingUp, Copy, CheckCircle } from 'lucide-react';
interface LinkedInOptimizationResult {
  currentProfile: string;
  optimizedProfile: string;
  improvements: string[];
  score: number;
  keywords: string[];
interface LinkedInOptimizationCardProps {
  onOptimize: (result: LinkedInOptimizationResult) => void;
const LinkedInOptimizationCard: React.FC<LinkedInOptimizationCardProps> = ({ onOptimize }) => {
  const [currentProfile, setCurrentProfile] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedProfile, setOptimizedProfile] = useState('');
  const [showResult, setShowResult] = useState(false);
  const handleOptimize = async () => {
    if (!currentProfile.trim() || !targetRole.trim()) return;
    setIsOptimizing(true);
    // Simulate AI optimization delay
    await new Promise((resolve) => setTimeout(resolve, 3500));
    const mockResult: LinkedInOptimizationResult = {
      currentProfile,
      optimizedProfile: `Results-driven Software Engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions that drive business growth and user engagement.
Key Achievements:
• Led development of microservices architecture serving 1M+ users
• Reduced application load time by 60% through optimization
• Mentored 3 junior developers and established coding standards
• Implemented CI/CD pipelines reducing deployment time by 80%
Technical Skills: React, TypeScript, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, MongoDB
Passionate about clean code, agile methodologies, and staying current with emerging technologies. Open to new opportunities in software engineering and technical leadership roles.`,
      improvements: [
        'Added quantifiable achievements',
        'Incorporated industry keywords',
        'Enhanced professional summary',
        'Structured skills section',
      ],
      score: 88,
      keywords: ['software engineer', 'full-stack', 'react', 'node.js', 'aws', 'microservices'],
    };
    setOptimizedProfile(mockResult.optimizedProfile);
    setShowResult(true);
    onOptimize(mockResult);
    setIsOptimizing(false);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedProfile);
  };
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="h-5 w-5" />
          LinkedIn Profile Optimizer
        </CardTitle>
        <CardDescription>
          AI-powered LinkedIn profile optimization for better visibility and networking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Role</label>
          <Input
            placeholder="e.g., Senior Software Engineer, Product Manager"
            value={targetRole}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetRole(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Current LinkedIn Profile</label>
          <Textarea
            placeholder="Paste your current LinkedIn profile text here..."
            value={currentProfile}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCurrentProfile(e.target.value)
            className="min-h-[200px]"
          />
        </div>
        <Button
          onClick={handleOptimize}
          disabled={!currentProfile.trim() || !targetRole.trim() || isOptimizing}
          className="w-full"
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Profile'}
        </Button>
        {showResult && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimized Profile</label>
              <div className="p-4 bg-muted rounded-md min-h-[300px]">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {optimizedProfile}
                </pre>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Improvements</label>
                <ul className="text-sm space-y-1">
                  {[
                    'Added quantifiable achievements',
                    'Incorporated industry keywords',
                    'Enhanced professional summary',
                    'Structured skills section',
                  ].map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Keywords</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    'software engineer',
                    'full-stack',
                    'react',
                    'node.js',
                    'aws',
                    'microservices',
                  ].map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              Optimization Score: 88/100 - High visibility potential
            </div>
            <Button variant="outline" onClick={handleCopy} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Optimized Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default LinkedInOptimizationCard;
