'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Briefcase, Target, Star, ExternalLink } from 'lucide-react';
interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
interface JobMatchResult {
  resumeText: string;
  jobDescription: string;
  matches: JobMatch[];
  topSkills: string[];
  recommendations: string[];
interface JobMatchCardProps {
  onMatch: (result: JobMatchResult) => void;
const JobMatchCard: React.FC<JobMatchCardProps> = ({ onMatch }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [showResult, setShowResult] = useState(false);
  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setIsMatching(true);
    // Simulate AI matching delay
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const mockMatches: JobMatch[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        matchScore: 95,
        salary: '$150,000 - $200,000',
        description: 'Join our team to build scalable applications using modern technologies.',
        requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
        benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work'],
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'Microsoft',
        location: 'Seattle, WA',
        matchScore: 88,
        salary: '$130,000 - $180,000',
        description: 'Develop cloud-native applications using Azure technologies.',
        requirements: ['C#', '.NET', 'Azure', '3+ years experience'],
        benefits: ['Comprehensive benefits', 'Stock options', 'Professional development'],
      },
      {
        id: '3',
        title: 'Frontend Engineer',
        company: 'Netflix',
        location: 'Los Gatos, CA',
        matchScore: 82,
        salary: '$140,000 - $190,000',
        description: 'Build user interfaces for millions of users worldwide.',
        requirements: ['React', 'JavaScript', 'CSS', '4+ years experience'],
        benefits: ['Unlimited PTO', 'Health benefits', 'Stock options'],
      },
    ];
    const mockResult: JobMatchResult = {
      resumeText,
      jobDescription,
      matches: mockMatches,
      topSkills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Python'],
      recommendations: [
        'Highlight your React experience more prominently',
        'Add specific project metrics to your resume',
        'Include cloud platform experience if any',
      ],
    };
    setMatches(mockMatches);
    setShowResult(true);
    onMatch(mockResult);
    setIsMatching(false);
  };
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Matching Engine
        </CardTitle>
        <CardDescription>
          AI-powered job matching based on your resume and target positions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Resume</label>
            <Textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setResumeText(e.target.value)
              className="min-h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Job Description</label>
            <Textarea
              placeholder="Paste the job description you're interested in..."
              value={jobDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setJobDescription(e.target.value)
              className="min-h-[200px]"
            />
          </div>
        </div>
        <Button
          onClick={handleMatch}
          disabled={!resumeText.trim() || !jobDescription.trim() || isMatching}
          className="w-full"
        >
          {isMatching ? 'Finding Matches...' : 'Find Job Matches'}
        </Button>
        {showResult && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matches.map((job) => (
                <Card key={job.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="text-sm">{job.company}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{job.matchScore}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="text-sm font-medium text-green-600">{job.salary}</div>
                    <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-600">Key Requirements:</div>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Job
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Your Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'JavaScript', 'Python'].map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Recommendations</h4>
                <ul className="text-sm space-y-2">
                  {[
                    'Highlight your React experience more prominently',
                    'Add specific project metrics to your resume',
                    'Include cloud platform experience if any',
                  ].map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default JobMatchCard;
