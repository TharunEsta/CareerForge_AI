"use client"

import React from 'react';
import VoiceAssistant from '@/components/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Brain, Globe, Zap } from 'lucide-react';

export default function VoiceAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Voice Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of AI communication with our multi-language voice assistant. 
            Speak naturally in any language and get intelligent responses.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Mic className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Voice Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Advanced speech recognition with real-time transcription
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Multi-Language</h3>
              <p className="text-sm text-muted-foreground">
                Support for 9+ languages including Hindi, Telugu, and more
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Smart Responses</h3>
              <p className="text-sm text-muted-foreground">
                Context-aware conversations with personalized assistance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-2">Real-time</h3>
              <p className="text-sm text-muted-foreground">
                Instant voice synthesis and natural conversation flow
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voice Assistant Component */}
        <div className="max-w-6xl mx-auto">
          <VoiceAssistant />
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Voice Commands</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Try saying:</Badge>
                      "Hello Pandu" or "Hello Gammy"
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Ask questions:</Badge>
                      "What's the weather like?"
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Get help:</Badge>
                      "Can you help me with my resume?"
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Language Support</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">🇺🇸 English</Badge>
                    <Badge variant="secondary">🇮🇳 Hindi</Badge>
                    <Badge variant="secondary">🇮🇳 Telugu</Badge>
                    <Badge variant="secondary">🇪🇸 Spanish</Badge>
                    <Badge variant="secondary">🇫🇷 French</Badge>
                    <Badge variant="secondary">🇩🇪 German</Badge>
                    <Badge variant="secondary">🇯🇵 Japanese</Badge>
                    <Badge variant="secondary">🇰🇷 Korean</Badge>
                    <Badge variant="secondary">🇨🇳 Chinese</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 