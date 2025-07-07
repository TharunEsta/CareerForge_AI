"use client";
import * as React from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mic, Plus, User, LogOut, Upload, MessageSquare, Home, Globe, Layers, ArrowUpRight, Download, Star, Settings } from "lucide-react";
import { motion } from "framer-motion";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useAuth } from "@/components/AuthContext";

export default function AppPage() {
  const { user, logout } = useAuth();
  const [showVoice, setShowVoice] = React.useState(false);
  const [showSubWarning, setShowSubWarning] = React.useState(false);

  // TODO: Replace with real subscription check
  const hasVoiceSubscription = user?.subscription?.plan === "premium" || user?.subscription?.plan === "enterprise";

  const handleVoiceClick = () => {
    if (!hasVoiceSubscription) {
      setShowSubWarning(true);
    } else {
      setShowVoice(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181A20] text-white">
      {/* Sidebar */}
      <aside className="flex flex-col items-center w-20 py-6 bg-[#1A1C23] border-r border-[#23242A] gap-4">
        <div className="mb-8">
          <Logo size="lg" variant="icon-only" />
        </div>
        <nav className="flex flex-col gap-4 flex-1">
          <Button variant="ghost" size="icon" className="text-white/80 hover:bg-[#23242A]" aria-label="Home">
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:bg-[#23242A]" aria-label="Discover">
            <Globe className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/80 hover:bg-[#23242A]" aria-label="Spaces">
            <Layers className="h-6 w-6" />
          </Button>
        </nav>
        <Button variant="secondary" size="icon" className="bg-[#23242A] text-white mb-8 shadow-lg hover:bg-[#23242A]/80" aria-label="Add Resume">
          <Plus className="h-7 w-7" />
        </Button>
        <div className="flex flex-col gap-2 w-full items-center mt-auto mb-2">
          <Button variant="ghost" size="icon" className="text-white/80 hover:bg-[#23242A]" aria-label="Account">
            <Avatar>
              <AvatarImage src={user?.avatarUrl || "/placeholder-user.jpg"} alt={user?.name || "U"} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-[#23242A]" aria-label="Upgrade">
            <Star className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-green-400 hover:bg-[#23242A]" aria-label="Install">
            <Download className="h-6 w-6" />
          </Button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8 tracking-tight">CareerForge AI</h1>
          <div className="rounded-2xl bg-[#23242A] border border-[#23242A] shadow-xl p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold text-white/90">Ask anything about your career, resume, or job search</span>
            </div>
            <div className="flex items-center gap-2 bg-[#181A20] rounded-xl px-4 py-3">
              <input
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-lg"
                placeholder="Ask anything or @mention a tool..."
              />
              <Button variant="ghost" size="icon" className="text-blue-400" aria-label="Send">
                <ArrowUpRight className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70" aria-label="Upload Resume">
                <Upload className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-cyan-400" aria-label="Voice Assistant" onClick={handleVoiceClick}>
                <Mic className="h-6 w-6" />
              </Button>
            </div>
            {/* TODO: Add chat history, AI responses, etc. here */}
          </div>
          {/* Voice Assistant Modal */}
          {showVoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-[#23242A] rounded-2xl p-8 shadow-2xl max-w-lg w-full">
                <VoiceAssistant />
                <Button className="mt-4 w-full" onClick={() => setShowVoice(false)}>Close</Button>
              </div>
            </div>
          )}
          {/* Subscription Warning Modal */}
          {showSubWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-[#23242A] rounded-2xl p-8 shadow-2xl max-w-md w-full flex flex-col items-center">
                <Mic className="h-10 w-10 text-cyan-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Voice Assistant Requires Subscription</h2>
                <p className="text-white/80 mb-6 text-center">Subscribe to unlock the AI voice assistant and get the most out of CareerForge AI.</p>
                <Button className="w-full mb-2" variant="default">Upgrade Now</Button>
                <Button className="w-full" variant="ghost" onClick={() => setShowSubWarning(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 