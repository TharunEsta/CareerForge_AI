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

type SubscriptionPlan = "free" | "basic" | "premium"

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

// Subscription plans
const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    features: ["Basic ATS Resume Checking", "7 messages per session", "Basic resume analysis", "ATS score calculation"],
    limitations: [
      "No job description matching",
      "No resume rewriting",
      "No cover letter generation",
      "Limited chat messages",
    ],
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: "$15",
    period: "per month",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    popular: true,
    features: [
      "Everything in Free",
      "Job Description Matching",
      "Matched & Unmatched Skills Analysis",
      "Resume Rewriting for Better ATS",
      "Cover Letter Generation",
      "Unlimited Chat Messages",
      "Priority Support",
    ],
    limitations: ["No advanced job search", "No salary insights", "No interview preparation"],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$39",
    period: "for 3 months",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    features: [
      "Everything in Basic",
      "Advanced Job Search & Matching",
      "Salary Insights & Negotiation Tips",
      "Interview Preparation & Questions",
      "LinkedIn Profile Optimization",
      "Career Path Recommendations",
      "Industry-Specific Resume Templates",
      "Personal Career Coach Chat",
      "Resume Tracking & Analytics",
      "Multiple Resume Versions",
      "Company Research & Insights",
      "Networking Recommendations",
    ],
    limitations: [],
  },
]

// Create a new component that will be wrapped by both providers
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [activeSidebarItem, setActiveSidebarItem] = useState("new-chat")
  const [activeTab, setActiveTab] = useState("current")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(sampleChatSessions)
  const [messageCount, setMessageCount] = useState(0)
  const [userPlan, setUserPlan] = useState<SubscriptionPlan>("free")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Move the useTheme hook here, inside the ThemeProvider
  const { theme, setTheme } = useTheme()

  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [uploadedJobDescription, setUploadedJobDescription] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false)
  const [resumeContent, setResumeContent] = useState<string>("")
  const [jobDescriptionContent, setJobDescriptionContent] = useState<string>("")
  const [currentATSAnalysis, setCurrentATSAnalysis] = useState<ATSAnalysis | null>(null)
  const [isRewritingResume, setIsRewritingResume] = useState(false)

  const [mounted, setMounted] = useState(false)

  // Ensure theme is only accessed after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user has access to feature based on plan
  const hasFeatureAccess = (feature: string): boolean => {
    switch (feature) {
      case "ats-check":
        return true // All plans have this
      case "job-matching":
      case "resume-rewrite":
      case "cover-letter":
      case "unlimited-chat":
        return userPlan === "basic" || userPlan === "premium"
      case "advanced-search":
      case "salary-insights":
      case "interview-prep":
      case "linkedin-optimization":
      case "career-coaching":
        return userPlan === "premium"
      default:
        return userPlan === "premium"
    }
  }

  // Get message limit based on plan
  const getMessageLimit = (): number => {
    switch (userPlan) {
      case "free":
        return 7
      case "basic":
      case "premium":
        return Number.POSITIVE_INFINITY
      default:
        return 7
    }
  }

  // Simulate file reading
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate file reading with realistic content
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

  // Analyze ATS compatibility
  const analyzeATSCompatibility = (resumeText: string, jobText: string): ATSAnalysis => {
    const resumeWords = resumeText.toLowerCase().split(/\s+/)
    const jobWords = jobText.toLowerCase().split(/\s+/)

    // Extract skills from job description
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

    // Extract skills from resume
    const resumeSkills = ["javascript", "html", "css", "react", "node.js", "git"]

    const matchedSkills = jobSkills.filter((skill) => resumeWords.some((word) => word.includes(skill.toLowerCase())))

    const unmatchedSkills = jobSkills.filter((skill) => !resumeWords.some((word) => word.includes(skill.toLowerCase())))

    // Calculate scores
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

  // Rewrite resume for better ATS score
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

  // Handle file upload
  const handleFileUpload = async (file: File, type: "resume" | "job-description") => {
    if (!file.type.includes("pdf") && !file.type.includes("doc") && !file.type.includes("txt")) {
      alert("Please upload a PDF, DOC, or TXT file")
      return
    }

    setIsUploading(true)

    if (type === "resume") {
      setUploadedResume(file)

      // Add upload message
      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: `Uploading resume: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, uploadMessage])

      // Read file content
      const content = await readFileContent(file)
      setResumeContent(content)

      // Simulate upload process
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
        setShowSubscriptionPlans(true)
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

      // Read file content
      const content = await readFileContent(file)
      setJobDescriptionContent(content)

      // Perform ATS analysis
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

        // Add the welcome message after ATS analysis
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

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]

      // Determine file type based on what's already uploaded
      if (!uploadedResume) {
        handleFileUpload(file, "resume")
      } else if (!uploadedJobDescription) {
        handleFileUpload(file, "job-description")
      }
    }
  }

  // Increment message count and check limits
  const incrementMessageCount = () => {
    const newCount = messageCount + 1
    setMessageCount(newCount)

    const limit = getMessageLimit()
    if (userPlan === "free" && newCount >= limit) {
      setShowUpgradePrompt(true)
    }
  }

  // Handle subscription
  const handleSubscription = (planId: SubscriptionPlan) => {
    setUserPlan(planId)
    setShowSubscriptionPlans(false)
    setShowUpgradePrompt(false)
    setMessageCount(0)

    // Add success message
    const plan = subscriptionPlans.find((p) => p.id === planId)
    if (plan && planId !== "free") {
      const successMessage: Message = {
        id: Date.now().toString(),
        content: `🎉 Welcome to ${plan.name}! You now have access to all the features in your plan. Your chat limit has been reset and you can enjoy unlimited conversations!`,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, successMessage])
    }
  }

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  // Handle message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Check message limit
    const limit = getMessageLimit()
    if (userPlan === "free" && messageCount >= limit) {
      setShowUpgradePrompt(true)
      return
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    incrementMessageCount()

    // Simulate AI response
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

  // Handle sidebar item click
  const handleSidebarItemClick = (id: string) => {
    setActiveSidebarItem(id)
    setIsMobileMenuOpen(false)
  }

  // Handle tab change
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

  // Create new chat
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

  // Render message based on type
  const renderMessage = (message: Message) => {
    return <p>{message.content}</p>
  }

  // Subscription plans modal
  const SubscriptionPlansModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
          <CardDescription>Unlock powerful features to accelerate your career growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative transition-all duration-200 hover:shadow-lg",
                    plan.borderColor,
                    plan.popular && "ring-2 ring-blue-500 scale-105",
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <div className={cn("mx-auto p-3 rounded-full w-fit", plan.bgColor)}>
                      <Icon className={cn("h-6 w-6", plan.color)} />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700">✅ Included Features:</h4>
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-700">❌ Not Included:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      className={cn(
                        "w-full",
                        plan.popular && "bg-blue-600 hover:bg-blue-700",
                        userPlan === plan.id && "bg-green-600 hover:bg-green-700",
                      )}
                      onClick={() => handleSubscription(plan.id as SubscriptionPlan)}
                      disabled={userPlan === plan.id}
                    >
                      {userPlan === plan.id
                        ? "Current Plan"
                        : plan.id === "free"
                          ? "Continue with Free"
                          : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setShowSubscriptionPlans(false)}>
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Upgrade prompt modal
  const UpgradePrompt = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>
            You've reached your free message limit (7 messages). Upgrade to continue with unlimited conversations and
            advanced features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Free Plan</span>
              <span className="text-muted-foreground">7 messages</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Basic Plan</span>
              <span>Unlimited + Advanced Features</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowUpgradePrompt(false)}>
              Maybe Later
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowUpgradePrompt(false)
                setShowSubscriptionPlans(true)
              }}
            >
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">CareerForgr.ai</h1>
            <p className="mt-2 text-muted-foreground">Your AI-powered career assistant</p>
          </div>

          <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/80">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">Welcome Back</h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogin}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogin}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                  </svg>
                  Continue with Facebook
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Email"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Password"
                    />
                  </div>
                  <Button className="w-full" onClick={handleLogin}>
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {showUpgradePrompt && <UpgradePrompt />}
        {showSubscriptionPlans && <SubscriptionPlansModal />}

        {/* Mobile menu button */}
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-background rounded-md p-2 shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <Sidebar
          className={cn(
            "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="font-bold text-lg">CareerForgr.ai</div>
            </div>
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarContent>
            <div className="px-3 py-2">
              <Button variant="outline" className="w-full justify-start gap-2 mb-2" onClick={createNewChat}>
                <Plus size={16} />
                New Chat
              </Button>
            </div>

            <SidebarMenu>
              {sidebarItems.slice(1).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleSidebarItemClick(item.id)}
                    isActive={activeSidebarItem === item.id}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            {userPlan === "free" && (
              <div className="mb-2 px-3 py-2 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Messages used</span>
                  <Badge variant={messageCount >= 5 ? "destructive" : "secondary"} className="text-xs">
                    {messageCount}/7
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={cn("h-1.5 rounded-full", messageCount >= 5 ? "bg-destructive" : "bg-primary")}
                    style={{ width: `${(messageCount / 7) * 100}%` }}
                  ></div>
                </div>
                {messageCount >= 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs h-7"
                    onClick={() => setShowSubscriptionPlans(true)}
                  >
                    <CreditCard className="mr-1 h-3 w-3" /> Upgrade Plan
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">User</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        userPlan === "premium" && "bg-purple-100 text-purple-700",
                        userPlan === "basic" && "bg-blue-100 text-blue-700",
                      )}
                    >
                      {userPlan === "free" ? "Free" : userPlan === "basic" ? "Basic" : "Premium"}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSubscriptionPlans(true)}>
                    <CreditCard className="mr-2 h-4 w-4" /> Subscription
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

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (theme === "dark") {
                    setTheme("light")
                  } else if (theme === "light") {
                    setTheme("dark")
                  } else {
                    // If system, toggle to opposite of current system preference
                    const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches
                    setTheme(isDarkSystem ? "light" : "dark")
                  }
                }}
                disabled={!mounted}
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Sun size={18} />
                  ) : (
                    <Moon size={18} />
                  )
                ) : (
                  <div className="w-[18px] h-[18px]" /> // Placeholder to prevent layout shift
                )}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col w-full md:ml-64">
          {/* Top bar with tabs */}
          <header className="border-b">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="flex items-center justify-between px-4 md:px-6 h-14">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  {chatSessions.slice(0, 3).map((session) => (
                    <TabsTrigger key={session.id} value={session.id} className="truncate">
                      {session.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex">
                    <Settings size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden md:flex"
                    onClick={() => {
                      if (theme === "dark") {
                        setTheme("light")
                      } else if (theme === "light") {
                        setTheme("dark")
                      } else {
                        // If system, toggle to opposite of current system preference
                        const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches
                        setTheme(isDarkSystem ? "light" : "dark")
                      }
                    }}
                    disabled={!mounted}
                  >
                    {mounted ? (
                      theme === "dark" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )
                    ) : (
                      <div className="w-[18px] h-[18px]" /> // Placeholder to prevent layout shift
                    )}
                  </Button>

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
                      <DropdownMenuItem onClick={() => setShowSubscriptionPlans(true)}>
                        <CreditCard className="mr-2 h-4 w-4" /> Subscription
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
            </Tabs>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Chat messages */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Show uploaded files */}
                {(uploadedResume || uploadedJobDescription) && (
                  <div className="flex gap-2 mb-4">
                    {uploadedResume && (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{uploadedResume.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedResume(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {uploadedJobDescription && (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{uploadedJobDescription.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedJobDescription(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-4 py-3",
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {renderMessage(message)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="border-t p-4 md:p-6">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        userPlan === "free" && messageCount >= 7
                          ? "Upgrade to continue chatting..."
                          : "Message CareerForgr.ai..."
                      }
                      className="w-full rounded-md border border-input bg-background px-4 py-2 pr-20 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      disabled={isUploading || (userPlan === "free" && messageCount >= 7)}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7"
                      disabled={isUploading}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Plus size={16} />
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileInputChange}
                    />
                  </div>
                  <Button type="submit" disabled={isUploading || (userPlan === "free" && messageCount >= 7)}>
                    {isUploading ? "Processing..." : "Send"}
                  </Button>
                </form>

                {userPlan === "free" && messageCount >= 5 && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <span className="text-destructive">
                      {messageCount >= 7 ? "Message limit reached" : `${7 - messageCount} messages remaining`}
                    </span>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => setShowSubscriptionPlans(true)}
                    >
                      View Plans
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Main component that wraps everything with providers
export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => res.json())
      .then((data) => setApiData(data.message))
      .catch((err) => setError("API Error: " + err.message));
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">FastAPI + Next.js Test</h1>
      {apiData && <p className="mt-4 text-green-600">✅ {apiData}</p>}
      {error && <p className="mt-4 text-red-600">❌ {error}</p>}
    </div>
  );
}