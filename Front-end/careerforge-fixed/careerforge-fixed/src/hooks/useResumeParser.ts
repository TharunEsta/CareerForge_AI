import { useState } from 'react';
interface ParsedResumeData {
  skills: string[];
  experience: string[];
  education: string[];
  recommendations: string[];
export function useResumeParser() {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const parseResume = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to parse resume.');
      const data = await response.json();
      const formattedData: ParsedResumeData = {
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || [],
        recommendations: data.recommendations || [],
      };
      setParsedData(formattedData);
    } catch (err: any) {
      console.error('Parse error:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
  };
  return { parsedData, parseResume, error, isLoading };
