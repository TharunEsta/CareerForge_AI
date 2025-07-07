"use client"

import React, { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Settings,
  MessageSquare,
  FileText,
  Briefcase,
  Menu,
  Plus,
  Zap,
  Star,
  Mic,
  Brain,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarNavItemIcon,
  SidebarNavItemText
} from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { Loader2, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import ResumeUploadCard from "@/components/ResumeUploadCard";
import ResumeRewriteCard from "@/components/ResumeRewriteCard";
import CoverLetterCard from "@/components/CoverLetterCard";
import LinkedInOptimizationCard from "@/components/LinkedInOptimizationCard";
import JobMatchCard from "@/components/JobMatchCard";
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import * as React from 'react';

// Types
type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?:
    | "text"
    | "card"
    | "resume-upload"
    | "job-match"
    | "ats-score"
    | "job-search"
    | "upgrade-prompt"
    | "resume-rewrite"
    | "changes-explanation"
    | "final-score"
  metadata?: any
}

type ChatSession = {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
}

type ATSAnalysis = {
  score: number
  matchedSkills: string[]
  unmatchedSkills: string[]
  suggestions: string[]
  keywordDensity: number
  formatScore: number
  contentScore: number
}

// Sample data
const sampleChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Resume Analysis",
    lastMessage: "Your ATS score is 85/100",
    timestamp: new Date(2023, 5, 15),
    messages: [],
  },
  {
    id: "2",
    title: "Job Search",
    lastMessage: "Found 5 matching positions",
    timestamp: new Date(2023, 5, 14),
    messages: [],
  },
  {
    id: "3",
    title: "Cover Letter",
    lastMessage: "Cover letter generated successfully",
    timestamp: new Date(2023, 5, 12),
    messages: [],
  },
]

const initialMessages: Message[] = []

// Create a new component that will be wrapped by both providers
function AppContent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = React.useState<string>("chat")
  const [messageCount, setMessageCount] = useState(0)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(sampleChatSessions)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { theme, setTheme } = useTheme()

  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [uploadedJobDescription, setUploadedJobDescription] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [resumeContent, setResumeContent] = useState<string>("")
  const [currentATSAnalysis, setCurrentATSAnalysis] = useState<ATSAnalysis | null>(null)
  const [isRewritingResume, setIsRewritingResume] = useState(false)

  const [mounted, setMounted] = useState(false)

  // Add state for chat cards
  const [chatCards, setChatCards] = useState<React.ReactNode[]>([]);

  const [showFeatureMenu, setShowFeatureMenu] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasFeatureAccess = (feature: string): boolean => {
    switch (feature) {
      case "ats-check":
        return true // All plans have this
      case "job-matching":
      case "resume-rewrite":
      case "cover-letter":
      case "unlimited-chat":
        return false // All plans have this
      case "advanced-search":
      case "salary-insights":
      case "interview-prep":
      case "linkedin-optimization":
      case "career-coaching":
        return false // All plans have this
      default:
        return false
    }
  }

  const getMessageLimit = (): number => {
    return 10 // Free plan limit
  }

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const analyzeATSCompatibility = (resumeText: string, jobText: string): ATSAnalysis => {
    // Simple ATS analysis logic
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const jobWords = jobText.toLowerCase().split(/\s+/);
    
    const commonWords = resumeWords.filter(word => jobWords.includes(word));
    const keywordDensity = commonWords.length / Math.max(resumeWords.length, 1);
    
    const matchedSkills = ["Python", "JavaScript", "React"];
    const unmatchedSkills = ["Docker", "Kubernetes"];
    
    return {
      score: Math.min(85, Math.floor(keywordDensity * 100)),
      matchedSkills,
      unmatchedSkills,
      suggestions: ["Add more keywords from job description", "Improve formatting"],
      keywordDensity,
      formatScore: 90,
      contentScore: 85
    };
  };

  const rewriteResume = (originalResume: string, jobDescription: string): { newResume: string; changes: string[] } => {
    // Simple resume rewriting logic
    const changes = ["Enhanced bullet points", "Added quantifiable achievements", "Improved keyword optimization"];
    return {
      newResume: originalResume + "\n\nEnhanced with AI optimization",
      changes
    };
  };

  const handleFileUpload = async (file: File, type: "resume" | "job-description") => {
    if (type === "resume") {
      setUploadedResume(file);
      const content = await readFileContent(file);
      setResumeContent(content);
    } else {
      setUploadedJobDescription(file);
    }
  };

  const incrementMessageCount = () => {
    setMessageCount(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    incrementMessageCount();

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help you with your career journey! How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const renderMessage = (message: Message) => {
    return (
      <div key={message.id} className={cn(
        "flex gap-3 p-4 rounded-lg",
        message.sender === "user" ? "justify-end" : "justify-start"
      )}>
        {message.sender === "ai" && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div className={cn(
          "max-w-[80%] rounded-lg p-3",
          message.sender === "user" 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        {message.sender === "user" && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  const handleShowResumeUpload = () => {
    setShowFeatureMenu(false);
    // Add resume upload logic
  };

  const handleShowResumeRewrite = () => {
    setShowFeatureMenu(false);
    // Add resume rewrite logic
  };

  const handleShowCoverLetter = () => {
    setShowFeatureMenu(false);
    // Add cover letter logic
  };

  const handleShowLinkedInOptimization = () => {
    setShowFeatureMenu(false);
    // Add LinkedIn optimization logic
  };

  const handleShowJobMatch = () => {
    setShowFeatureMenu(false);
    // Add job matching logic
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-primary-50/30">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex">
        <SidebarHeader />
        <SidebarNav>
          <SidebarNavItem>
            <SidebarNavItemIcon>
              <MessageSquare className="h-4 w-4" />
            </SidebarNavItemIcon>
            <SidebarNavItemText>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleTabChange("chat")}
              >
                Chat
              </Button>
            </SidebarNavItemText>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarNavItemIcon>
              <FileText className="h-4 w-4" />
            </SidebarNavItemIcon>
            <SidebarNavItemText>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleTabChange("resume")}
              >
                Resume
              </Button>
            </SidebarNavItemText>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarNavItemIcon>
              <Briefcase className="h-4 w-4" />
            </SidebarNavItemIcon>
            <SidebarNavItemText>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleTabChange("jobs")}
              >
                Job Match
              </Button>
            </SidebarNavItemText>
          </SidebarNavItem>
        </SidebarNav>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Logo size="md" />
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="jobs">Job Match</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto p-4">
              {activeTab === "chat" && (
                <div className="space-y-4">
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {messages.map(renderMessage)}
                    {isLoading && (
                      <div className="flex gap-3 p-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
              
              {activeTab === "resume" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <ResumeUploadCard onAnalysis={() => {}} />
                  <ResumeRewriteCard onRewrite={() => {}} />
                </div>
              )}
              
              {activeTab === "jobs" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <JobMatchCard onMatch={() => {}} />
                  <CoverLetterCard onGenerate={() => {}} />
                </div>
              )}
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppContent />
    </div>
  );
}
