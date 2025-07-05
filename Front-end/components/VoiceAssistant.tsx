"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, StopCircle, Send, Download, Smartphone, MicOff, Volume2, Share2, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const isSpeechRecognitionSupported = typeof window !== "undefined" && (
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
);

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
};

const isSpeechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const [assistantName, setAssistantName] = useState<string>("Voice Assistant");
  const [nameInput, setNameInput] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI career assistant. I can help you with resume analysis, job matching, interview preparation, weather updates, news summaries, and much more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load assistant name from localStorage
  useEffect(() => {
    const savedName = typeof window !== "undefined" ? localStorage.getItem("assistantName") : null;
    if (savedName) setAssistantName(savedName);
  }, []);

  // PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) {
        setTranscript(interim);
        handleUserMessage(interim);
      }
    };
    recognitionRef.current = recognition;
  }, []);

  // Speech synthesis setup
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsLoading(true);

    try {
      // Call AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response
      speakText(data.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthesisRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const handleSend = async () => {
    // Replace with your backend endpoint
    const res = await fetch("/api/voice-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: transcript })
    });
    const data = await res.json();
    setResponse(data.reply || "No response");
    if (isSpeechSynthesisSupported) {
      const utter = new window.SpeechSynthesisUtterance(data.reply);
      window.speechSynthesis.speak(utter);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInstall = () => {
    // Trigger PWA install
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Install CareerForge AI', {
          body: 'Tap to install the app on your device',
          icon: '/placeholder-logo.png',
          badge: '/placeholder-logo.png',
          actions: [
            {
              action: 'install',
              title: 'Install'
            }
          ]
        });
      });
    }
    setShowInstallPrompt(false);
  };

  const handleNameSave = () => {
    setAssistantName(nameInput || "Voice Assistant");
    if (typeof window !== "undefined") {
      localStorage.setItem("assistantName", nameInput || "Voice Assistant");
    }
    setNameInput("");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CareerForge AI',
          text: 'Check out this amazing AI career assistant!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-blue-600" />
          {assistantName}
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-2">
            <span>Talk to your AI assistant. Works on desktop and mobile. Install as an app for best experience!</span>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                className="border rounded px-2 py-1 text-sm"
                placeholder="Set assistant name..."
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                maxLength={32}
              />
              <Button onClick={handleNameSave} size="sm" variant="secondary" disabled={!nameInput.trim()}>
                Save Name
              </Button>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={toggleListening} disabled={isLoading} variant="default">
            <Mic className="h-4 w-4 mr-1" />
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={handleSend} disabled={!transcript.trim()} variant="secondary">
            <Send className="h-4 w-4 mr-1" /> Send
          </Button>
          <Button onClick={handleDownload} disabled={!transcript.trim()} variant="outline">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          {showInstallPrompt && (
            <Button onClick={handleInstall} variant="secondary">
              <Smartphone className="h-4 w-4 mr-1" /> Install
            </Button>
          )}
        </div>
        <div className="bg-gray-100 rounded p-3 min-h-[60px] text-gray-800">
          <strong>Transcript:</strong>
          <div className="whitespace-pre-wrap text-sm mt-1">{transcript || <span className="text-gray-400">(No input yet)</span>}</div>
        </div>
        {response && (
          <div className="bg-blue-50 rounded p-3 min-h-[40px] text-blue-900">
            <strong>AI Response:</strong>
            <div className="whitespace-pre-wrap text-sm mt-1">{response}</div>
          </div>
        )}
        {!isSpeechRecognitionSupported && (
          <div className="text-red-600 text-sm">Speech recognition is not supported in this browser.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
