"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Loader2, Volume2 } from "lucide-react";

const VoiceAssistant: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Start voice recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendToAI(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  // Send transcript to AI chat API
  const sendToAI = async (text: string) => {
    setLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setAiResponse(data.response || "No response");
      speak(data.response);
    } catch (err) {
      setAiResponse("Error getting AI response");
    } finally {
      setLoading(false);
    }
  };

  // Text-to-speech for AI response
  const speak = (text: string) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      <div className="text-center text-lg text-gray-700 mb-4">
        Voice Assistant
      </div>
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <Button
          onClick={startListening}
          disabled={listening || loading}
          className="w-full flex items-center justify-center"
        >
          {listening ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mic className="w-4 h-4 mr-2" />
          )}
          {listening ? "Listening..." : "Start Speaking"}
        </Button>
        {transcript && (
          <div className="w-full bg-gray-100 rounded p-2 text-gray-800 text-sm">
            <strong>You said:</strong> {transcript}
          </div>
        )}
        {loading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Getting AI response...
          </div>
        )}
        {aiResponse && (
          <div className="w-full bg-blue-50 rounded p-2 text-blue-900 text-sm flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span><strong>AI:</strong> {aiResponse}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
