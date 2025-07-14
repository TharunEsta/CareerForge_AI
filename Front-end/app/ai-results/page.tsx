"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Settings,
  HelpCircle,
  User,
  Plus,
  BookOpen,
  MessageSquare,
  Mic,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

const resumeText = `// Insert rewritten resume text here\nExperience:\n- Software Engineer at AI Corp\n- Built scalable AI-powered platforms...\n...`;
const coverLetterText = `// Insert generated cover letter text here\nDear Hiring Manager,\nI'm excited to apply for the Software Engineer position at AI Corp...\n...`;

const chatHistory = [
  { id: 1, title: "Resume Review" },
  { id: 2, title: "Job Search" },
  { id: 3, title: "Interview Prep" },
  { id: 4, title: "Cover Letter" },
];

export default function AIResultsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState<{ resume: boolean; cover: boolean }>({ resume: false, cover: false });

  const handleCopy = (text: string, type: "resume" | "cover") => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    toast({ title: "Copied!", description: type === "resume" ? "Resume copied to clipboard." : "Cover letter copied to clipboard." });
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-16 py-4 flex flex-col justify-between items-center border-r bg-background">
        {/* Top: Logo and icons */}
        <div className="flex flex-col items-center">
          {/* Logo (microsized) */}
          <div className="w-8 h-8 mb-4 flex items-center justify-center">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          {/* Main icons */}
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center mb-4 hover:bg-muted transition" title="New Chat">
            <Plus className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center mb-4 hover:bg-muted transition" title="Library">
            <BookOpen className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-muted transition" title="Messages">
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
        {/* Chat History */}
        <div className="flex flex-col items-center w-full mt-6">
          <div className="text-xs text-muted-foreground mb-2 px-2">HISTORY</div>
          <div className="flex flex-col gap-2 max-h-32 overflow-y-auto custom-scrollbar px-2 w-full">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="h-10 w-10 p-0 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition"
                title={chat.title}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
        {/* Bottom: Renew Plus, Settings, Help, Theme Toggle */}
        <div className="mt-auto flex flex-col items-center space-y-4">
          <button className="text-xs text-primary font-semibold hover:underline" title="Upgrade to Plus">
            Renew Plus
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-muted transition" title="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-muted transition" title="Help">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            className="h-10 w-10 p-0 rounded-full flex items-center justify-center hover:bg-muted transition"
            title="Toggle Theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 flex items-center justify-end px-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/account")}>Account</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/help")}>Help</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/logout")}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto p-6 space-y-8">
          <h1 className="text-2xl font-semibold mb-2">AI Results</h1>

          {/* Rewritten Resume */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Rewritten Resume</h2>
            <div className="relative bg-muted text-muted-foreground rounded-lg p-4 overflow-auto max-h-[400px] border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 text-xs px-2 py-1 rounded"
                      onClick={() => handleCopy(resumeText, "resume")}
                    >
                      {copied.resume ? "Copied!" : "Copy"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy resume</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {resumeText}
              </pre>
            </div>
          </section>

          {/* Cover Letter */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Cover Letter</h2>
            <div className="relative bg-muted text-muted-foreground rounded-lg p-4 overflow-auto max-h-[400px] border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 text-xs px-2 py-1 rounded"
                      onClick={() => handleCopy(coverLetterText, "cover")}
                    >
                      {copied.cover ? "Copied!" : "Copy"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy cover letter</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {coverLetterText}
              </pre>
            </div>
          </section>
        </main>

        {/* Chat Bar (Bottom Input) */}
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2 rounded-xl bg-muted h-16 px-4">
            <input
              className="flex-1 py-3 px-4 text-base rounded-xl bg-transparent outline-none border-none"
              placeholder="Ask anything or @mention a Skill"
              type="text"
            />
            <Button size="icon" className="h-10 w-10 p-0 rounded-full ml-2">
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 