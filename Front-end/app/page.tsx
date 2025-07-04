"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
  const [activeTab, setActiveTab] = useState("chat")
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
      formatScore: 80,
      contentScore: 85
    };
  };

  const rewriteResume = (originalResume: string, jobDescription: string): { newResume: string; changes: string[] } => {
    return {
      newResume: "Enhanced resume content...",
      changes: ["Added keywords", "Improved formatting", "Enhanced descriptions"]
    };
  };

  const handleFileUpload = async (file: File, type: "resume" | "job-description") => {
    setIsUploading(true);
    try {
      const content = await readFileContent(file);
      if (type === "resume") {
        setResumeContent(content);
        setUploadedResume(file);
      } else {
        setUploadedJobDescription(file);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    } finally {
      setIsUploading(false);
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
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    incrementMessageCount();

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message. I'm here to help with your career needs!",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const renderMessage = (message: Message) => {
    return <div>{message.content}</div>;
  };

  const handleShowResumeUpload = () => {
    const card = <ResumeUploadCard onAnalysis={(result) => console.log(result)} />;
    setChatCards(prev => [...prev, card]);
  };

  const handleShowResumeRewrite = () => {
    const card = <ResumeRewriteCard onRewrite={(result) => console.log(result)} />;
    setChatCards(prev => [...prev, card]);
  };

  const handleShowCoverLetter = () => {
    const card = <CoverLetterCard onGenerate={() => {}} />;
    setChatCards(prev => [...prev, card]);
  };

  const handleShowLinkedInOptimization = () => {
    const card = <LinkedInOptimizationCard onOptimize={() => {}} />;
    setChatCards(prev => [...prev, card]);
  };

  const handleShowJobMatch = () => {
    const card = <JobMatchCard onMatch={() => {}} />;
    setChatCards(prev => [...prev, card]);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Image src="/placeholder-logo.svg" alt="Logo" width={32} height={32} />
              <span className="font-bold">CareerForge.AI</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="space-y-2 p-4">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted">
                <FileText className="w-4 h-4 mr-2" />
                Resume Tools
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Search
              </button>
            </div>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">CareerForge.AI</h1>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl mx-auto p-4">
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleShowResumeUpload}>Resume Analysis</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleShowResumeRewrite}>Resume Rewrite</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleShowCoverLetter}>Cover Letter</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleShowLinkedInOptimization}>LinkedIn Optimization</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleShowJobMatch}>Job Match</button>
                </div>
                <div>
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={cn(
                      "flex gap-3 p-4 rounded-lg",
                      message.sender === "user"
                        ? "bg-muted"
                        : "bg-background border"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={message.sender === "user" ? "/user-avatar.png" : "/bot-avatar.png"}
                      />
                      <AvatarFallback>
                        {message.sender === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {message.sender === "user" ? "You" : "CareerForge.AI"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {renderMessage(message)}
                      </div>
                    </div>
                    </div>
                ))}
                </div>
              </div>
            </div>
          </main>

          {/* Input area */}
          <div className="sticky bottom-0 border-t bg-background p-4">
            <div className="container max-w-4xl">
              <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                <button
                  type="button"
                  aria-label="Start voice input"
                  className={`rounded-full p-2 border border-blue-200 dark:border-zinc-700 bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-zinc-700 transition-colors`}
                >
                  <Mic className={`h-6 w-6`} />
                </button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message or use the mic..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Voice Assistant Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                      <Mic className="w-6 h-6 text-white" />
        </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                        AI Voice Assistant
                      </h3>
                      <p className="text-purple-700 dark:text-purple-300">
                        Speak naturally in multiple languages with our intelligent voice assistant
                      </p>
      </div>
                  </div>
                  <Link href="/voice-assistant">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                      <Mic className="w-4 h-4 mr-2" />
                      Try Voice Assistant
                    </Button>
                  </Link>
                </div>
                
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="text-sm">9+ Languages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Smart Responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Real-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
      <button
        className="fixed bottom-8 right-8 z-50 bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-800 transition-all"
        onClick={() => setShowFeatureMenu(true)}
        aria-label="Open feature menu"
      >
        <Plus className="w-8 h-8" />
      </button>
      {showFeatureMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-8 bg-black/30" onClick={() => setShowFeatureMenu(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 w-72"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <button className="w-full py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition" onClick={handleShowResumeUpload}>Resume Upload</button>
            <button className="w-full py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition" onClick={handleShowResumeRewrite}>Resume Rewrite</button>
            <button className="w-full py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition" onClick={handleShowCoverLetter}>Cover Letter</button>
            <button className="w-full py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition" onClick={handleShowLinkedInOptimization}>LinkedIn Optimization</button>
            <button className="w-full py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition" onClick={handleShowJobMatch}>Job Match</button>
            <button className="w-full py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition" onClick={() => setShowFeatureMenu(false)}>Close</button>
          </div>
        </div>
      )}
      <button
        className="fixed bottom-8 left-8 z-50 bg-yellow-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-all"
        onClick={() => setShowFeedback(true)}
        aria-label="Give feedback"
      >
        <Star className="w-7 h-7" />
      </button>
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowFeedback(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {feedbackSubmitted ? (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="text-green-600"
                >
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="text-xl font-bold text-green-700">Thank you for your feedback!</div>
                <button className="mt-2 px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold" onClick={() => setShowFeedback(false)}>Close</button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={e => {
                  e.preventDefault();
                  setFeedbackSubmitted(true);
                  // TODO: send feedback to backend/analytics
                  setTimeout(() => setShowFeedback(false), 2000);
                }}
              >
                <h3 className="text-xl font-bold">How was your experience?</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedbackRating(rating)}
                      className={`p-2 rounded ${feedbackRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-6 h-6" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  className="p-3 border rounded-lg resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Submit Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeedback(false)}
                    className="py-2 px-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
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