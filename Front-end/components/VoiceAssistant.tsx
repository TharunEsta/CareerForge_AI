"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

// Type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language?: string;
  isVoice?: boolean;
}

interface VoiceAssistantProps {
  onMessage?: (message: string) => void;
  className?: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onMessage, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [assistantName, setAssistantName] = useState('Pandu');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  ];

  const assistantNames = [
    { name: 'Pandu', personality: 'Friendly and helpful' },
    { name: 'Gammy', personality: 'Wise and caring' },
    { name: 'Alex', personality: 'Professional and efficient' },
    { name: 'Siri', personality: 'Smart and witty' },
    { name: 'Echo', personality: 'Energetic and enthusiastic' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectAssistantName = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    for (const assistant of assistantNames) {
      if (lowerText.includes(assistant.name.toLowerCase())) {
        return assistant.name;
      }
    }
    return null;
  };

  const getGreetingResponse = (language: string, assistantName: string): string => {
    const greetings = {
      en: `Hello! I'm ${assistantName}. How can I help you today?`,
      hi: `नमस्ते! मैं ${assistantName} हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
      te: `నమస్కారం! నేను ${assistantName}. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?`,
      es: `¡Hola! Soy ${assistantName}. ¿Cómo puedo ayudarte hoy?`,
      fr: `Bonjour! Je suis ${assistantName}. Comment puis-je vous aider aujourd'hui?`,
      de: `Hallo! Ich bin ${assistantName}. Wie kann ich Ihnen heute helfen?`,
      ja: `こんにちは！私は${assistantName}です。今日はどのようにお手伝いできますか？`,
      ko: `안녕하세요! 저는 ${assistantName}입니다. 오늘 어떻게 도와드릴까요?`,
      zh: `你好！我是${assistantName}。今天我能为您做些什么？`,
    };
    return greetings[language as keyof typeof greetings] || greetings.en;
  };

  const processUserInput = async (input: string) => {
    const detectedName = detectAssistantName(input);
    if (detectedName) {
      setAssistantName(detectedName);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage,
      isVoice: isListening,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getGreetingResponse(currentLanguage, assistantName);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        language: currentLanguage,
        isVoice: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Speak the response
      speakText(response, currentLanguage);
    }, 1000);
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = currentLanguage;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        processUserInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      // Stop recognition if it's running
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      processUserInput(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {assistantName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{assistantName}</h2>
              <p className="text-sm text-muted-foreground">AI Voice Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="px-3 py-1 text-sm border rounded-md bg-background"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSpeaking(!isSpeaking)}
              disabled={!isSpeaking}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    {assistantName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-slate-800 border'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.isVoice && (
                    <Badge variant="secondary" className="text-xs">
                      Voice
                    </Badge>
                  )}
                </div>
              </div>

              {message.sender === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  {assistantName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-slate-800 border px-4 py-2 rounded-lg">
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
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type a message or say "Hello ${assistantName}"...`}
              className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
          </div>
          
          <button
            type="button"
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            onClick={isListening ? stopListening : startListening}
            className="rounded-full p-2 border border-blue-200 dark:border-zinc-700 bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <motion.span
              animate={isListening ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0 0 #2563eb55", "0 0 0 8px #2563eb22", "0 0 0 0 #2563eb00"] } : { scale: 1, boxShadow: "none" }}
              transition={{ duration: 1, repeat: isListening ? Infinity : 0, ease: "easeInOut" }}
              className="inline-flex"
            >
              <Mic className={`h-6 w-6 ${isListening ? "text-blue-600" : ""}`} />
            </motion.span>
          </button>
          
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 flex items-center gap-2"
            >
              <span className="text-blue-600 font-semibold animate-pulse">Listening...</span>
              {/* Simple animated waveform */}
              <motion.span
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="w-6 h-4 bg-blue-300 rounded"
                style={{ display: "inline-block", transformOrigin: "bottom" }}
              />
              <motion.span
                animate={{ scaleY: [1, 2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                className="w-2 h-3 bg-blue-400 rounded"
                style={{ display: "inline-block", transformOrigin: "bottom" }}
              />
              <motion.span
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
                className="w-1 h-2 bg-blue-500 rounded"
                style={{ display: "inline-block", transformOrigin: "bottom" }}
              />
            </motion.div>
          )}
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            size="icon"
            className="w-10 h-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Language: {languages.find(l => l.code === currentLanguage)?.name}</span>
            <span>Assistant: {assistantName}</span>
          </div>
          <div className="flex items-center space-x-2">
            {isListening && <Badge variant="destructive">Listening...</Badge>}
            {isSpeaking && <Badge variant="secondary">Speaking...</Badge>}
            {isTyping && <Badge variant="outline">Typing...</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant; 