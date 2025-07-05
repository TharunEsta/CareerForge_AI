"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUploading(false);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult: ResumeAnalysisResult = {
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
      experience: '5+ years in software development',
      education: 'Bachelor\'s in Computer Science',
      recommendations: [
        'Add more specific metrics and achievements',
        'Include relevant certifications',
        'Highlight leadership experience'
      ]
    };
    
    onAnalysis(mockResult);
    setIsAnalyzing(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Analysis
        </CardTitle>
        <CardDescription>
          Upload your resume for AI-powered analysis and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            {uploadedFile ? uploadedFile.name : 'Drop your resume here or click to browse'}
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <Button variant="outline" className="cursor-pointer">
              Choose File
            </Button>
          </label>
        </div>

        {uploadedFile && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            File uploaded successfully
          </div>
        )}

        <Button 
          onClick={handleAnalyze}
          disabled={!uploadedFile || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUploadCard;
