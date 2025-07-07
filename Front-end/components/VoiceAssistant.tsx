/// <reference lib="dom" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, StopCircle, Send, Download, Smartphone, MicOff, Volume2, Share2, Settings, Paperclip, Globe, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

// Multilingual support configuration
const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', voice: 'en-US' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', voice: 'en-GB' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', voice: 'es-ES' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', voice: 'de-DE' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹', voice: 'it-IT' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷', voice: 'pt-BR' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵', voice: 'ja-JP' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷', voice: 'ko-KR' },
  { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳', voice: 'zh-CN' },
  { code: 'zh-TW', name: '中文 (繁體)', flag: '🇹🇼', voice: 'zh-TW' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦', voice: 'ar-SA' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺', voice: 'ru-RU' },
  { code: 'nl-NL', name: 'Nederlands', flag: '🇳🇱', voice: 'nl-NL' },
  { code: 'sv-SE', name: 'Svenska', flag: '🇸🇪', voice: 'sv-SE' },
  { code: 'da-DK', name: 'Dansk', flag: '🇩🇰', voice: 'da-DK' },
  { code: 'no-NO', name: 'Norsk', flag: '🇳🇴', voice: 'no-NO' },
  { code: 'fi-FI', name: 'Suomi', flag: '🇫🇮', voice: 'fi-FI' },
  { code: 'pl-PL', name: 'Polski', flag: '🇵🇱', voice: 'pl-PL' },
  { code: 'tr-TR', name: 'Türkçe', flag: '🇹🇷', voice: 'tr-TR' },
  { code: 'he-IL', name: 'עברית', flag: '🇮🇱', voice: 'he-IL' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭', voice: 'th-TH' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳', voice: 'vi-VN' },
  { code: 'id-ID', name: 'Bahasa Indonesia', flag: '🇮🇩', voice: 'id-ID' },
  { code: 'ms-MY', name: 'Bahasa Melayu', flag: '🇲🇾', voice: 'ms-MY' },
  { code: 'fil-PH', name: 'Filipino', flag: '🇵🇭', voice: 'fil-PH' }
];

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

const VoiceAssistant: React.FC = () => {
  const [assistantName, setAssistantName] = useState<string>("Voice Assistant");
  const [nameInput, setNameInput] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your multilingual AI career assistant. I can help you in multiple languages with resume analysis, job matching, interview preparation, and much more. What would you like to know?',
      timestamp: new Date(),
      language: 'en-US'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assistant name and language preferences from localStorage
  useEffect(() => {
    const savedName = typeof window !== "undefined" ? localStorage.getItem("assistantName") : null;
    const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("selectedLanguage") : null;
    const savedVoice = typeof window !== "undefined" ? localStorage.getItem("selectedVoice") : null;
    
    if (savedName) setAssistantName(savedName);
    if (savedLanguage) setSelectedLanguage(savedLanguage);
    if (savedVoice) setSelectedVoice(savedVoice);
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

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Auto-select voice for current language
        const currentLang = selectedLanguage.split('-')[0];
        const matchingVoice = voices.find(voice => 
          voice.lang.startsWith(currentLang) && voice.default
        );
        if (matchingVoice && !selectedVoice) {
          setSelectedVoice(matchingVoice.name);
        }
      }
    };

    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedLanguage, selectedVoice]);

  // Speech recognition setup with language support
  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
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
  }, [selectedLanguage]);

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
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsLoading(true);

    try {
      // Call AI API with language context
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          language: selectedLanguage,
          autoTranslate 
        }),
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
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response in selected language
      speakText(data.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        language: selectedLanguage
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
      
      // Set voice if available
      if (selectedVoice) {
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
      }
      
      // Set language and speech properties
      utterance.lang = selectedLanguage;
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      
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

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem("selectedLanguage", languageCode);
    
    // Update recognition language
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageCode;
    }
    
    // Auto-select voice for new language
    const currentLang = languageCode.split('-')[0];
    const matchingVoice = availableVoices.find(voice => 
      voice.lang.startsWith(currentLang) && voice.default
    );
    if (matchingVoice) {
      setSelectedVoice(matchingVoice.name);
      localStorage.setItem("selectedVoice", matchingVoice.name);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem("selectedVoice", voiceName);
  };

  const handleSend = async () => {
    // Replace with your backend endpoint
    const res = await fetch("/api/voice-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: transcript,
        language: selectedLanguage,
        autoTranslate 
      })
    });
    const data = await res.json();
    setResponse(data.reply || "No response");
    if (isSpeechSynthesisSupported) {
      const utter = new window.SpeechSynthesisUtterance(data.reply);
      utter.lang = selectedLanguage;
      if (selectedVoice) {
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) utter.voice = voice;
      }
      utter.rate = speechRate;
      utter.pitch = speechPitch;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-transcript.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setInstallPrompt(null);
      });
    }
  };

  const handleNameSave = () => {
    if (nameInput.trim()) {
      setAssistantName(nameInput);
      localStorage.setItem("assistantName", nameInput);
      setNameInput("");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CareerForge AI Voice Assistant",
          text: "Check out this amazing AI career assistant!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        handleUserMessage(`I've uploaded a file: ${file.name}. Please analyze it.`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assistantName}</h1>
              <p className="text-gray-600">Multilingual AI Career Assistant</p>
            </div>
          </div>
          
          {/* Language and Settings */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Languages className="w-5 h-5" />
                    <span>Select Language</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <Button
                      key={language.code}
                      variant={selectedLanguage === language.code ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Voice Settings */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Voice Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Voice Selection */}
                  <div>
                    <label className="text-sm font-medium">Voice</label>
                    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices
                          .filter(voice => voice.lang.startsWith(selectedLanguage.split('-')[0]))
                          .map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Speech Rate */}
                  <div>
                    <label className="text-sm font-medium">Speech Rate</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{speechRate}x</span>
                  </div>

                  {/* Speech Pitch */}
                  <div>
                    <label className="text-sm font-medium">Speech Pitch</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{speechPitch}x</span>
                  </div>

                  {/* Auto Translate Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoTranslate"
                      checked={autoTranslate}
                      onChange={(e) => setAutoTranslate(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="autoTranslate" className="text-sm">
                      Auto-translate responses
                    </label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Install PWA Button */}
            {installPrompt && (
              <Button onClick={handleInstall} variant="outline" size="sm">
                <Smartphone className="w-4 h-4 mr-2" />
                Install App
              </Button>
            )}
          </div>
        </div>

        {/* Main Chat Interface */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Voice Chat</span>
              {currentLanguage && (
                <Badge variant="secondary" className="ml-2">
                  {currentLanguage.flag} {currentLanguage.name}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Speak naturally in your preferred language. I'll understand and respond accordingly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                      {message.language && (
                        <span className="ml-2">
                          {SUPPORTED_LANGUAGES.find(lang => lang.code === message.language)?.flag}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleListening}
                disabled={!isSpeechRecognitionSupported}
                className={`flex-1 ${
                  isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              
              <Button onClick={handleSend} disabled={!transcript.trim()}>
                <Send className="w-4 h-4" />
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Transcript:</p>
                <p className="text-sm font-medium">{transcript}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Transcript
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
