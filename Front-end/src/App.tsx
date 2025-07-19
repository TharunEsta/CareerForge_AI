import React, { useState, useEffect } from "react";
import { User, Library, Plus, Search, Mic, MessageSquare, BarChart3, Sparkles, AlertTriangle, Upload, Download, Settings, LogOut } from "lucide-react";
import apiService, { User as UserType, SubscriptionPlan, ResumeData } from "./services/api";

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

// Login Component
const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await apiService.login(email, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      <Card className="w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to CareerForge</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        } catch (err) {
          // Token is invalid, clear it
          apiService.logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  // Load subscription plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await apiService.getSubscriptionPlans();
        setSubscriptionPlans(response.plans);
      } catch (err) {
        console.error("Failed to load subscription plans:", err);
      }
    };
    
    if (isLoggedIn) {
      loadPlans();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setResumeData(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await apiService.uploadResume(file);
      setResumeData(result.resume_data);
      // Track usage
      if (user) {
        await apiService.trackUsage(user.id, 'resume_parsing', user.plan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resume upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiService.chatWithResume(chatInput, resumeData ? JSON.stringify(resumeData) : undefined);
      console.log("Chat response:", response);
      setChatInput("");
      
      // Track usage
      if (user) {
        await apiService.trackUsage(user.id, 'ai_chats', user.plan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiService.upgradeSubscription(planId);
      console.log("Upgrade response:", response);
      setShowPricing(false);
      
      // Refresh user data
      if (user) {
        const updatedUser = await apiService.getCurrentUser();
        setUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upgrade failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleResumeUpload(file);
      }
    };
    input.click();
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  const isFreeTier = user?.plan === "free";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        <Button className="w-10 h-10 bg-transparent hover:bg-gray-800" title="Dashboard">
          <Library className="w-5 h-5" />
        </Button>
        <Button 
          className="w-10 h-10 bg-transparent hover:bg-gray-800" 
          title="Upload Resume"
          onClick={handleFileUpload}
        >
          <Upload className="w-5 h-5" />
        </Button>
        <Button className="w-10 h-10 bg-transparent hover:bg-gray-800" title="Search Jobs">
          <Search className="w-5 h-5" />
        </Button>
        <div className="flex-1" />
        <Button
          onClick={() => setShowPricing(true)}
          className="w-12 h-8 bg-blue-600 hover:bg-blue-700 text-xs font-medium"
          title="Upgrade Plan"
        >
          {isFreeTier ? "Upgrade" : "Manage"}
        </Button>
        <Button
          onClick={handleLogout}
          className="w-10 h-10 bg-transparent hover:bg-gray-800"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold tracking-tight">careerforge</h1>
            {user && !isFreeTier && (
              <span className="px-2 py-1 bg-green-600 text-xs font-medium rounded-full">
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-400">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            <Avatar />
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-900/50 border border-red-700 rounded text-red-300">
            {error}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
          {/* Chat Input Section */}
          <div className="w-full max-w-3xl space-y-6">
            <div className="relative">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask anything or @mention a Skill"
                className="h-14 bg-gray-900 border-gray-700 rounded-2xl pl-12 pr-32 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
                disabled={isLoading}
              />
              <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <Button 
                  className="w-8 h-8 bg-transparent hover:bg-gray-800"
                  onClick={handleFileUpload}
                  title="Upload Resume"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button className="w-8 h-8 bg-transparent hover:bg-gray-800" title="Voice Input">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  className="w-8 h-8 bg-transparent hover:bg-gray-800"
                  onClick={handleChatSubmit}
                  disabled={isLoading || !chatInput.trim()}
                  title="Send Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button className="w-8 h-8 bg-transparent hover:bg-gray-800" title="Analytics">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resume Data Display */}
          {resumeData && (
            <Card className="w-full max-w-3xl bg-blue-900/20 border-blue-700/50">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-blue-400">Resume Data</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Name:</strong> {resumeData.full_name || 'Not found'}
                  </div>
                  <div>
                    <strong>Email:</strong> {resumeData.email || 'Not found'}
                  </div>
                  <div>
                    <strong>Phone:</strong> {resumeData.phone || 'Not found'}
                  </div>
                  <div>
                    <strong>Location:</strong> {resumeData.location || 'Not found'}
                  </div>
                </div>
                {resumeData.skills.length > 0 && (
                  <div>
                    <strong>Skills:</strong> {resumeData.skills.join(', ')}
                  </div>
                )}
              </div>
            </Card>
          )}

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
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setShowPricing(true)}
                  >
                    Upgrade
                  </Button>
                </div>
              </Card>
              
              {user && (
                <Card className="w-full max-w-3xl bg-gray-900 border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-medium text-cyan-400">Free</h4>
                      <div className="w-16 h-1 bg-cyan-400 rounded-full" />
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-gray-300">Usage: {user.usage.ai_chats}/{user.limits.ai_chats} AI chats</p>
                      <p className="text-xs text-gray-400">Resume parsing: {user.usage.resume_parsing}/{user.limits.resume_parsing}</p>
                    </div>
                  </div>
                </Card>
              )}
              
              <Card className="w-full max-w-3xl bg-yellow-900/20 border-yellow-700/50">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-medium text-yellow-400">Free Tier Limits</h4>
                    <p className="text-gray-300 text-sm">
                      You're on the free plan. Upgrade to unlock unlimited resume analysis, cover letter generation, and more features.
                    </p>
                  </div>
                  <Button 
                    className="bg-yellow-600 hover:bg-yellow-700 ml-auto"
                    onClick={() => setShowPricing(true)}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Subscribed User Welcome Message */}
          {!isFreeTier && user && (
            <Card className="w-full max-w-3xl bg-green-900/20 border-green-700/50">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-green-400" />
                <div className="space-y-1">
                  <h4 className="text-lg font-medium text-green-400">Welcome to CareerForge {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}!</h4>
                  <p className="text-gray-300 text-sm">
                    You have access to all {user.plan} features. Enjoy unlimited resume analysis, cover letter generation, and more!
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-center">Processing...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <Button 
                onClick={() => setShowPricing(false)}
                className="bg-transparent hover:bg-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`${plan.popular ? 'border-purple-500 bg-purple-900/20' : ''}`}>
                  {plan.popular && (
                    <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full w-fit mb-2">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-4">
                    ₹{plan.monthly_price}
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Choose Plan"}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 