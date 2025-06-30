"use client"

import type React from "react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import MatchResume from "@/components/MatchResume";
import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  MessageSquare,
  FileText,
  Briefcase,
  Menu,
  X,
  CreditCard,
  Plus,
  Check,
  Crown,
  Zap,
  Star,
  Mic,
  Brain,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import ImportedAppContent from "@/components/AppContent";
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { Loader2, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

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

const sidebarItems = [
  { icon: MessageSquare, label: "New Chat", id: "new-chat" },
  { icon: FileText, label: "Resume Tools", id: "resume-tools" },
  { icon: Briefcase, label: "Job Search", id: "job-search" },
  { icon: Settings, label: "Settings", id: "settings" },
]

// Create a new component that will be wrapped by both providers
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [messageCount, setMessageCount] = useState(0)
  const [activeSidebarItem, setActiveSidebarItem] = useState("new-chat")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(sampleChatSessions)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { theme, setTheme } = useTheme()

  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [uploadedJobDescription, setUploadedJobDescription] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [resumeContent, setResumeContent] = useState<string>("")
  const [jobDescriptionContent, setJobDescriptionContent] = useState<string>("")
  const [currentATSAnalysis, setCurrentATSAnalysis] = useState<ATSAnalysis | null>(null)
  const [isRewritingResume, setIsRewritingResume] = useState(false)

  const [mounted, setMounted] = useState(false)

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
    return Number.POSITIVE_INFINITY
  }

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (file.name.toLowerCase().includes("resume") || file.type.includes("pdf")) {
          resolve(`John Doe
Software Developer
Email: john.doe@email.com | Phone: (555) 123-4567

EXPERIENCE
Software Developer at TechCorp (2020-2023)
- Developed web applications using JavaScript and React
- Worked with databases and APIs
- Collaborated with team members on projects
- Fixed bugs and improved performance

Junior Developer at StartupXYZ (2018-2020)
- Built websites using HTML, CSS, JavaScript
- Learned new technologies
- Participated in code reviews

EDUCATION
Bachelor of Computer Science
University of Technology (2014-2018)

SKILLS
JavaScript, HTML, CSS, React, Node.js, Git, Problem Solving`)
        } else {
          resolve(`Senior Frontend Developer Position

We are looking for an experienced Senior Frontend Developer to join our dynamic team.

REQUIREMENTS:
- 5+ years of experience in frontend development
- Expert knowledge of JavaScript, TypeScript, React, Next.js
- Experience with modern CSS frameworks (Tailwind CSS, Styled Components)
- Proficiency in state management (Redux, Zustand)
- Experience with testing frameworks (Jest, Cypress)
- Knowledge of build tools (Webpack, Vite)
- Understanding of responsive design and cross-browser compatibility
- Experience with version control (Git)
- Strong problem-solving skills
- Excellent communication skills
- Experience with Agile/Scrum methodologies

PREFERRED:
- Experience with Node.js and backend technologies
- Knowledge of cloud platforms (AWS, Vercel, Netlify)
- Experience with GraphQL
- Understanding of SEO best practices
- Experience with performance optimization
- Knowledge of accessibility standards (WCAG)

RESPONSIBILITIES:
- Develop and maintain high-quality frontend applications
- Collaborate with designers and backend developers
- Write clean, maintainable, and well-documented code
- Participate in code reviews and technical discussions
- Mentor junior developers
- Stay up-to-date with latest frontend technologies`)
        }
      }, 1000)
    })
  }

  const analyzeATSCompatibility = (resumeText: string, jobText: string): ATSAnalysis => {
    const resumeWords = resumeText.toLowerCase().split(/\s+/)
    const jobWords = jobText.toLowerCase().split(/\s+/)

    const jobSkills = [
      "javascript",
      "typescript",
      "react",
      "next.js",
      "css",
      "html",
      "tailwind",
      "redux",
      "zustand",
      "jest",
      "cypress",
      "webpack",
      "vite",
      "git",
      "node.js",
      "aws",
      "graphql",
      "seo",
      "wcag",
    ]

    const resumeSkills = ["javascript", "html", "css", "react", "node.js", "git"]

    const matchedSkills = jobSkills.filter((skill) => resumeWords.some((word) => word.includes(skill.toLowerCase())))

    const unmatchedSkills = jobSkills.filter((skill) => !resumeWords.some((word) => word.includes(skill.toLowerCase())))

    const skillMatchPercentage = (matchedSkills.length / jobSkills.length) * 100
    const keywordDensity = 65 // Simulated
    const formatScore = 75 // Simulated
    const contentScore = 70 // Simulated

    const overallScore = Math.round(
      skillMatchPercentage * 0.4 + keywordDensity * 0.3 + formatScore * 0.15 + contentScore * 0.15,
    )

    return {
      score: overallScore,
      matchedSkills,
      unmatchedSkills: unmatchedSkills.slice(0, 8), // Limit for display
      suggestions: [
        "Add more industry-specific keywords from the job description",
        "Quantify your achievements with specific metrics and numbers",
        "Include missing technical skills: TypeScript, Next.js, Redux",
        "Use action verbs to start each bullet point",
        "Add relevant certifications or training",
        "Include years of experience for each technology",
      ],
      keywordDensity,
      formatScore,
      contentScore,
    }
  }

  const rewriteResume = (originalResume: string, jobDescription: string): { newResume: string; changes: string[] } => {
    const changes = [
      "Added quantified achievements with specific metrics",
      "Incorporated missing keywords: TypeScript, Next.js, Redux, Testing",
      "Restructured experience section with stronger action verbs",
      "Added relevant technical skills section",
      "Improved formatting for better ATS parsing",
      "Enhanced job titles and company descriptions",
      "Added years of experience for each technology",
      "Included performance metrics and impact statements",
    ]

    const newResume = `John Doe
Senior Frontend Developer
Email: john.doe@email.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Frontend Developer with 5+ years of expertise in JavaScript, TypeScript, React, and Next.js. Proven track record of delivering high-performance web applications that increased user engagement by 40% and reduced load times by 60%.

TECHNICAL SKILLS
• Frontend: JavaScript, TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS
• State Management: Redux, Zustand, Context API
• Testing: Jest, Cypress, React Testing Library
• Build Tools: Webpack, Vite, Babel
• Version Control: Git, GitHub, GitLab
• Cloud Platforms: AWS, Vercel, Netlify
• Other: Node.js, GraphQL, SEO Optimization, WCAG Accessibility

PROFESSIONAL EXPERIENCE

Senior Frontend Developer | TechCorp | 2020-2023
• Architected and developed 15+ responsive web applications using React and TypeScript, serving 100K+ daily active users
• Implemented state management solutions with Redux, reducing application load time by 45%
• Collaborated with cross-functional teams of 8+ members using Agile/Scrum methodologies
• Mentored 3 junior developers, improving team productivity by 30%
• Optimized application performance, achieving 95+ Lighthouse scores
• Integrated GraphQL APIs, reducing data fetching overhead by 35%

Frontend Developer | StartupXYZ | 2018-2020
• Built 10+ modern web applications using JavaScript, React, and Next.js
• Implemented responsive designs with CSS3 and Tailwind CSS, ensuring cross-browser compatibility
• Developed comprehensive test suites using Jest and Cypress, achieving 90% code coverage
• Participated in code reviews and technical discussions, maintaining high code quality standards
• Utilized Git for version control and collaborated on projects with distributed teams

EDUCATION
Bachelor of Computer Science | University of Technology | 2014-2018
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Web Development

ACHIEVEMENTS
• Increased application performance by 60% through code optimization and best practices
• Led migration from legacy JavaScript to TypeScript, reducing bugs by 40%
• Implemented accessibility standards (WCAG 2.1), ensuring compliance for all applications`

    return { newResume, changes }
  }

  const handleFileUpload = async (file: File, type: "resume" | "job-description") => {
    if (!file.type.includes("pdf") && !file.type.includes("doc") && !file.type.includes("txt")) {
      alert("Please upload a PDF, DOC, or TXT file")
      return
    }

    setIsUploading(true)

    if (type === "resume") {
      setUploadedResume(file)

      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: `Uploading resume: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, uploadMessage])

      const content = await readFileContent(file)
      setResumeContent(content)

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: hasFeatureAccess("job-matching")
            ? "Resume uploaded successfully! Now upload a job description to check your ATS score and skill matching."
            : "Resume uploaded successfully! I can analyze your ATS score. For job description matching and advanced features, consider upgrading your plan.",
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }

        setMessages((prev) => [...prev, aiResponse])
        setIsUploading(false)
        incrementMessageCount()
      }, 2000)
    } else {
      if (!hasFeatureAccess("job-matching")) {
        const restrictedMessage: Message = {
          id: Date.now().toString(),
          content:
            "Job description matching is available in Basic and Premium plans. Please upgrade to access this feature.",
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, restrictedMessage])
        setIsUploading(false)
        return
      }

      setUploadedJobDescription(file)

      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: `Uploading job description: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, uploadMessage])

      const content = await readFileContent(file)
      setJobDescriptionContent(content)

      setTimeout(() => {
        const analysis = analyzeATSCompatibility(resumeContent, content)
        setCurrentATSAnalysis(analysis)

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Analysis complete! Your ATS score is ${analysis.score}/100`,
          sender: "ai",
          timestamp: new Date(),
          type: "ats-score",
          metadata: analysis,
        }

        setMessages((prev) => [...prev, aiResponse])

        setTimeout(() => {
          const welcomeMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: hasFeatureAccess("resume-rewrite")
              ? "I can help you rewrite your resume to improve your ATS score and better match the job requirements. Would you like me to start optimizing your resume?"
              : "Your ATS analysis is complete! Resume rewriting is available in Basic and Premium plans. Would you like to upgrade for these features?",
            sender: "ai",
            timestamp: new Date(),
            type: "text",
          }
          setMessages((prev) => [...prev, welcomeMessage])
        }, 1000)

        setIsUploading(false)
        incrementMessageCount()
      }, 3000)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]

      if (!uploadedResume) {
        handleFileUpload(file, "resume")
      } else if (!uploadedJobDescription) {
        handleFileUpload(file, "job-description")
      }
    }
  }

  const incrementMessageCount = () => {
    const newCount = messageCount + 1
    setMessageCount(newCount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const limit = getMessageLimit()
    if (messageCount >= limit) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    incrementMessageCount()

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${currentInput}". How can I help you with your career today?`,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, aiResponse])
      incrementMessageCount()
    }, 1000)
  }

  const handleSidebarItemClick = (id: string) => {
    setActiveSidebarItem(id)
    setIsMobileMenuOpen(false)
  }

  const handleTabChange = (sessionId: string) => {
    if (sessionId === "current") {
      setActiveTab("current")
    } else {
      const session = chatSessions.find((s) => s.id === sessionId)
      if (session) {
        setActiveTab(sessionId)
        setMessages(session.messages.length > 0 ? session.messages : initialMessages)
      }
    }
  }

  const createNewChat = () => {
    setActiveTab("current")
    setMessages([])
    setMessageCount(0)
    setUploadedResume(null)
    setUploadedJobDescription(null)
    setResumeContent("")
    setJobDescriptionContent("")
    setCurrentATSAnalysis(null)
    setIsRewritingResume(false)
  }

  const renderMessage = (message: Message) => {
    return <p>{message.content}</p>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          className={cn(
            "fixed inset-y-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
            !showSidebar && "-translate-x-full"
          )}
        >
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setShowSidebar(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold">CareerForge.AI</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Tools</h2>
                <div className="grid gap-2">
                  <Button
                    variant={activeTab === "chat" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                  <Button
                    variant={activeTab === "resume" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("resume")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Resume Analysis
                  </Button>
                  <Button
                    variant={activeTab === "jobs" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("jobs")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Job Matching
                  </Button>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background">
            <div className="container flex h-14 items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowSidebar(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button variant="ghost" className="h-8 gap-2 px-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">User</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl py-6">
              <div className="space-y-4">
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
          </main>

          {/* Input area */}
          <div className="sticky bottom-0 border-t bg-background p-4">
            <div className="container max-w-4xl">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
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
      </div>
    </SidebarProvider>
  )
}

// Main component that wraps everything with providers
export default function Home() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </button>
          <span className="font-bold text-xl text-blue-600 tracking-tight">SkillSync AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle theme"
            className="rounded-full p-2 hover:bg-blue-100 dark:hover:bg-zinc-800 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
          </button>
          <div className="relative">
            <button className="rounded-full p-2 hover:bg-blue-100 dark:hover:bg-zinc-800 transition-colors">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </button>
            {/* User menu dropdown can go here */}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 border-r shadow-lg z-40 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-in-out`}> 
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <span className="font-bold text-lg text-blue-600">SkillSync</span>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <LogOut className="h-5 w-5 text-blue-600" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Home</Link>
            <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Dashboard</Link>
            <Link href="/resume" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Resume Tools</Link>
            <Link href="/job_match" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Job Match</Link>
            <Link href="/rewrite-resume" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Resume Rewrite</Link>
            <Link href="/cover-letter" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Cover Letter</Link>
            <Link href="/linkedin-optimization" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">LinkedIn Optimization</Link>
            <Link href="/voice-assistant" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Voice Assistant</Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-zinc-700 font-medium transition-colors">Pricing</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-60 transition-all duration-200 bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            {/* Chat UI */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 mb-8 border border-blue-100 dark:border-zinc-800 transition-colors">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 dark:text-blue-200">AI Career Assistant</h2>
              {/* Chat messages and input go here (reuse your chat logic) */}
              <AppContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}