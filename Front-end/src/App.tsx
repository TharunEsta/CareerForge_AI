import React, { useState } from "react";
import { User, Library, Plus, Search, Mic, MessageSquare, BarChart3, Sparkles, AlertTriangle } from "lucide-react";

// Placeholder Button component
const Button = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors ${className}`.trim()}
  >
    {children}
  </button>
);

// Placeholder Input component
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`border border-gray-300 rounded px-3 py-2 w-full ${props.className || ''}`.trim()}
  />
);

// Placeholder Avatar component
const Avatar = () => (
  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
    <User className="w-5 h-5 text-white" />
  </div>
);

// Placeholder Card component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`rounded-lg shadow-lg p-6 bg-white bg-opacity-10 border border-gray-700 ${className || ''}`.trim()}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [userPlan, setUserPlan] = useState("free"); // free, plus, pro, business

  const isFreeTier = userPlan === "free";

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <Button onClick={() => setIsLoggedIn(true)}>Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        <Button className="w-10 h-10 bg-transparent hover:bg-gray-800"><Library className="w-5 h-5" /></Button>
        <Button className="w-10 h-10 bg-transparent hover:bg-gray-800"><Plus className="w-5 h-5" /></Button>
        <Button className="w-10 h-10 bg-transparent hover:bg-gray-800"><Search className="w-5 h-5" /></Button>
        <div className="flex-1" />
        <Button
          onClick={() => setShowPricing(true)}
          className="w-12 h-8 bg-blue-600 hover:bg-blue-700 text-xs font-medium"
        >
          {isFreeTier ? "Upgrade" : "Manage"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold tracking-tight">careerforge</h1>
            {!isFreeTier && (
              <span className="px-2 py-1 bg-green-600 text-xs font-medium rounded-full">
                {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
              </span>
            )}
          </div>
          <Avatar />
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
                className="h-14 bg-gray-900 border-gray-700 rounded-2xl pl-12 pr-32 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
              />
              <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <Button className="w-8 h-8 bg-transparent hover:bg-gray-800"><Plus className="w-4 h-4" /></Button>
                <Button className="w-8 h-8 bg-transparent hover:bg-gray-800"><Mic className="w-4 h-4" /></Button>
                <Button className="w-8 h-8 bg-transparent hover:bg-gray-800"><MessageSquare className="w-4 h-4" /></Button>
                <Button className="w-8 h-8 bg-transparent hover:bg-gray-800"><BarChart3 className="w-4 h-4 text-blue-400" /></Button>
              </div>
            </div>
          </div>

          {/* Free Tier Warnings - Only show for free users */}
          {isFreeTier && (
            <>
              <Card className="w-full max-w-3xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h3 className="text-xl font-semibold">Introducing CareerForge Pro</h3>
                    </div>
                    <p className="text-gray-300">Early access to resume AI & unlimited uploads</p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">Upgrade</Button>
                </div>
              </Card>
              <Card className="w-full max-w-3xl bg-gray-900 border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-lg font-medium text-cyan-400">Free</h4>
                    <div className="w-16 h-1 bg-cyan-400 rounded-full" />
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-gray-300">You've reached your free tier limits</p>
                    <span className="text-xs text-gray-400">Loading...</span>
                  </div>
                </div>
              </Card>
              <Card className="w-full max-w-3xl bg-yellow-900/20 border-yellow-700/50">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-medium text-yellow-400">Free Tier Limits</h4>
                    <p className="text-gray-300 text-sm">
                      You're on the free plan. Upgrade to unlock unlimited resume analysis, cover letter generation, and more features.
                    </p>
                  </div>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 ml-auto" size="sm">
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Subscribed User Welcome Message */}
          {!isFreeTier && (
            <Card className="w-full max-w-3xl bg-green-900/20 border-green-700/50">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-green-400" />
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-green-400">Welcome to CareerForge {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}!</h4>
                  <p className="text-gray-300 text-sm">
                    You have access to all {userPlan} features. Enjoy unlimited resume analysis, cover letter generation, and more!
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default App; 