"use client";

import React, { useState, useEffect } from 'react';
import { UploadButton } from '@/components/UploadButton';
import { AskButton } from '@/components/AskButton';
import { UsageCounter } from '@/components/UsageCounter';
import { useUserStore, initializeDemoUser } from '@/store/useUserStore';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, AlertCircle } from 'lucide-react';

export default function DemoSubscriptionPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string}>>([]);
  
  const { user, canUpload, canAsk } = useUserStore();

  // Initialize demo user
  useEffect(() => {
    initializeDemoUser();
  }, []);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploaded file: ${file.name}`
    }]);
  };

  const handleAsk = (questionText: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: questionText
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `AI response to: "${questionText}" (This is a mock response)`
      }
    ]);
    setQuestion('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Subscription Gating Demo
          </h1>
          <p className="text-gray-300 mb-6">
            Test the upload and ask functionality with subscription limits
          </p>
          
          {/* Usage Counter */}
          <div className="flex justify-center mb-6">
            <UsageCounter />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                File Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <UploadButton 
                  onFileUpload={handleFileUpload}
                  className="flex-1"
                />
                {!canUpload() && (
                  <Badge variant="destructive" className="bg-red-600">
                    <AlertCircle size={14} className="mr-1" />
                    Limit Reached
                  </Badge>
                )}
              </div>
              
              {uploadedFile && (
                <div className="p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    ✅ {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)}KB)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ask Section */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} />
                Ask AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about your uploaded file..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <div className="flex items-center gap-4">
                  <AskButton 
                    onAsk={handleAsk}
                    question={question}
                    className="flex-1"
                  />
                  {!canAsk() && (
                    <Badge variant="destructive" className="bg-red-600">
                      <AlertCircle size={14} className="mr-1" />
                      No Credits
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        {messages.length > 0 && (
          <Card className="mt-8 bg-white/5 backdrop-blur-sm border-white/10 text-white">
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'bg-purple-600/20 border border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {message.type === 'user' ? 'You' : 'AI'}
                      </Badge>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 bg-white/5 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Try uploading files - free tier has limited uploads</p>
            <p>2. Ask questions - free tier has limited AI interactions</p>
            <p>3. When limits are reached, upgrade modals will appear</p>
            <p>4. Pro users have unlimited access</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
