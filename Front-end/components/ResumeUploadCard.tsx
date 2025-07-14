'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, Sparkles, TrendingUp, Target } from 'lucide-react';
import { useResumeParser } from '@/lib/hooks';

interface ResumeAnalysisResult {
  skills: string[];
  experience: string;
  education: string;
  recommendations: string[];
}

interface ResumeUploadCardProps {
  onAnalysis: (result: ResumeAnalysisResult) => void;
}

const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({ onAnalysis }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showGetPlus, setShowGetPlus] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('resume_usage') || '0', 10);
    }
    return 0;
  });

  const FREE_LIMIT = 5;

  const resumeParser = useResumeParser();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.includes('word')) {
        setUploadedFile(file);
      }
    }
  };

  const handleAnalyze = async () => {
    if (usageCount >= FREE_LIMIT) {
      setShowGetPlus(true);
      return;
    }
    if (!uploadedFile) return;
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);
    try {
      await resumeParser.parseResume(uploadedFile);
      if (resumeParser.parsedData) {
        onAnalysis({
          skills: resumeParser.parsedData?.skills || [],
          experience: resumeParser.parsedData?.experience?.join(', ') || '',
          education: resumeParser.parsedData?.education || '',
          recommendations: resumeParser.parsedData?.recommendations || [],
        });
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('resume_usage', newCount.toString());
        if (newCount >= FREE_LIMIT) {
          setShowGetPlus(true);
        }
      }
    } catch (error) {
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-md group hover:shadow-xl transition-all duration-500 animate-fade-in">
      {showGetPlus && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Get Plus to Unlock More Analyses</h2>
            <p className="mb-4 text-gray-700">You have reached your free limit of {FREE_LIMIT} resume analyses. Upgrade to Plus for unlimited access and premium features!</p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition mb-2"
            >
              Upgrade to Plus
            </button>
            <button
              onClick={() => setShowGetPlus(false)}
              className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Resume Analysis
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Upload your resume for AI-powered analysis and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center animate-pulse-soft">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {uploadedFile ? uploadedFile.name : 'Drop your resume here'}
              </p>
              <p className="text-sm text-muted-foreground">
                {uploadedFile ? 'File ready for analysis' : 'or click to browse files'}
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
              >
                Choose File
              </Button>
            </label>
          </div>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <div>
              <p className="font-medium text-success-800 dark:text-success-200">
                File uploaded successfully
              </p>
              <p className="text-sm text-success-600 dark:text-success-400">{uploadedFile.name}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleAnalyze}
            disabled={!uploadedFile || isAnalyzing}
            className="w-full h-12 text-base font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isAnalyzing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="mx-auto w-8 h-8 bg-info-100 dark:bg-info-900/30 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-info-600 dark:text-info-400" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">ATS Score</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto w-8 h-8 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-warning-600 dark:text-warning-400" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Skills Match</p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-success-600 dark:text-success-400" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">AI Insights</p>
            </div>
          </div>
        </div>

        {resumeParser.error && (
          <div className="text-red-600 text-center text-sm mt-2">Failed to parse resume. Please try again.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUploadCard;

