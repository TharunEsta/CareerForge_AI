"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, StopCircle, Send, Download, Smartphone } from "lucide-react";

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

const VoiceAssistant: React.FC = () => {
  const [assistantName, setAssistantName] = useState<string>("Voice Assistant");
  const [nameInput, setNameInput] = useState<string>("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

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
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript((prev: string) => prev + event.results[i][0].transcript + " ");
        } else {
          interim += event.results[i][0].transcript;
        }
      }
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
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
    if (installPrompt) {
      installPrompt.prompt();
    }
  };

  const handleNameSave = () => {
    setAssistantName(nameInput || "Voice Assistant");
    if (typeof window !== "undefined") {
      localStorage.setItem("assistantName", nameInput || "Voice Assistant");
    }
    setNameInput("");
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
          <Button onClick={startListening} disabled={listening || !isSpeechRecognitionSupported} variant="default">
            <Mic className="h-4 w-4 mr-1" /> Start
          </Button>
          <Button onClick={stopListening} disabled={!listening} variant="destructive">
            <StopCircle className="h-4 w-4 mr-1" /> Stop
          </Button>
          <Button onClick={handleSend} disabled={!transcript.trim()} variant="secondary">
            <Send className="h-4 w-4 mr-1" /> Send
          </Button>
          <Button onClick={handleDownload} disabled={!transcript.trim()} variant="outline">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          {installPrompt && (
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
