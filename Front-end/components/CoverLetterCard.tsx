'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileText, Download, Copy, CheckCircle } from 'lucide-react';

interface CoverLetterResult {
  jobTitle: string;
  companyName: string;
  coverLetter: string;
  score: number;
  suggestions: string[];
}

interface CoverLetterCardProps {
  onGenerate: (result: CoverLetterResult) => void;
}

const CoverLetterCard: React.FC<CoverLetterCardProps> = ({ onGenerate }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !companyName.trim() || !jobDescription.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const mockResult: CoverLetterResult = {
      jobTitle,
      companyName,
      coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

My experience includes developing scalable applications, collaborating with cross-functional teams, and delivering high-quality software solutions. I am particularly drawn to ${companyName}'s mission and believe my skills in modern technologies would be valuable to your organization.

I am confident that my technical expertise, problem-solving abilities, and collaborative approach would make me a valuable addition to your team. I look forward to discussing how I can contribute to ${companyName}'s continued success.

Thank you for considering my application.

Best regards,
[Your Name]`,
      score: 92,
      suggestions: [
        'Customize the opening paragraph',
        'Add specific achievements',
        'Mention relevant projects',
      ],
    };

    setCoverLetter(mockResult.coverLetter);
    setShowResult(true);
    onGenerate(mockResult);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companyName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cover Letter Generator
        </CardTitle>
        <CardDescription>
          AI-powered cover letter generation tailored to your target position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input
              placeholder="e.g., Senior Software Engineer"
              value={jobTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              placeholder="e.g., Google, Microsoft"
              value={companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description</label>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setJobDescription(e.target.value)
            }
            className="min-h-[150px]"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={
            !jobTitle.trim() || !companyName.trim() || !jobDescription.trim() || isGenerating
          }
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
        </Button>

        {showResult && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated Cover Letter</label>
              <div className="p-4 bg-muted rounded-md min-h-[300px]">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {coverLetter}
                </pre>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              AI Score: 92/100 - Excellent match for the position
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoverLetterCard;

