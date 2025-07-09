'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Download, Copy, CheckCircle } from 'lucide-react';

interface ResumeRewriteResult {
  originalText: string;
  rewrittenText: string;
  improvements: string[];
  score: number;
}

interface ResumeRewriteCardProps {
  onRewrite: (result: ResumeRewriteResult) => void;
}

const ResumeRewriteCard: React.FC<ResumeRewriteCardProps> = ({ onRewrite }) => {
  const [originalText, setOriginalText] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleRewrite = async () => {
    if (!originalText.trim()) return;

    setIsRewriting(true);

    // Simulate AI rewriting delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResult: ResumeRewriteResult = {
      originalText,
      rewrittenText: `Enhanced version of your resume with improved clarity, impact, and professional language. The AI has optimized your experience descriptions, strengthened action verbs, and highlighted key achievements with quantifiable results.`,
      improvements: [
        'Strengthened action verbs',
        'Added quantifiable achievements',
        'Improved clarity and readability',
        'Enhanced professional language',
      ],
      score: 85,
    };

    setRewrittenText(mockResult.rewrittenText);
    setShowResult(true);
    onRewrite(mockResult);
    setIsRewriting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
  };

  const handleDownload = () => {
    const blob = new Blob([rewrittenText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rewritten-resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Resume Rewrite
        </CardTitle>
        <CardDescription>
          AI-powered resume rewriting to enhance your professional impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Original Resume Text</label>
          <Textarea
            placeholder="Paste your resume text here..."
            value={originalText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setOriginalText(e.target.value)
            }
            className="min-h-[200px]"
          />
        </div>

        <Button
          onClick={handleRewrite}
          disabled={!originalText.trim() || isRewriting}
          className="w-full"
        >
          {isRewriting ? 'Rewriting...' : 'Rewrite Resume'}
        </Button>

        {showResult && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rewritten Version</label>
              <div className="p-4 bg-muted rounded-md min-h-[200px]">
                <p className="text-sm leading-relaxed">{rewrittenText}</p>
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
              AI Score: 85/100 - Significant improvements made
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeRewriteCard;
