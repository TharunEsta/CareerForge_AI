import { useState } from "react";
import { Mic, MessageSquare, BarChart3, Search, Library, Plus, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PricingModal } from "@/components/PricingModal";
import { LoadingDots } from "@/components/LoadingDots";
import Login from "./Login";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: handle file upload logic here
      alert(`Selected file: ${file.name}`);
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        <Button variant="ghost" size="sm" className="w-10 h-10 hover:bg-gray-800 transition-colors">
          <Library className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="sm" className="w-10 h-10 hover:bg-gray-800 transition-colors">
          <Plus className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="sm" className="w-10 h-10 hover:bg-gray-800 transition-colors">
          <Search className="w-5 h-5" />
        </Button>
        
        <div className="flex-1" />
        
        <Button 
          onClick={() => setShowPricing(true)}
          className="w-12 h-8 bg-blue-600 hover:bg-blue-700 text-xs font-medium transition-colors"
          size="sm"
        >
          Renew Plus
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold tracking-tight">careerforge</h1>
          </div>
          
          <Avatar className="w-10 h-10 ring-2 ring-gray-700">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
          {/* Chat Input Section */}
          <div className="w-full max-w-3xl space-y-6">
            <div className="relative">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything or @mention a Skill"
                className="w-full h-14 bg-gray-900 border-gray-700 rounded-2xl pl-12 pr-32 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
              />
              <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
              
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                {/* Upload Button */}
                <label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <Button size="sm" variant="ghost" className="w-8 h-8 hover:bg-gray-800" asChild>
                    <span><Plus className="w-4 h-4" /></span>
                  </Button>
                </label>
                <Button size="sm" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="w-8 h-8 hover:bg-gray-800">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </Button>
              </div>
            </div>
          </div>

          {/* CareerForge Pro Banner */}
          <Card className="w-full max-w-3xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-semibold">Introducing CareerForge Pro</h3>
                  </div>
                  <p className="text-gray-300">Early access to resume AI & unlimited uploads</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 transition-colors">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Meter */}
          <Card className="w-full max-w-3xl bg-gray-900 border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-cyan-400">Free</h4>
                  <div className="w-16 h-1 bg-cyan-400 rounded-full" />
                </div>
                <div className="text-right space-y-1">
                  <p className="text-gray-300">You've reached your free tier limits</p>
                  <LoadingDots />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </div>
  );
};

export default Index;
