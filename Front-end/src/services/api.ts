// API Service for CareerForge AI Frontend
// Handles all communication with the backend API

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://careerforge.info/api';

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  plan: 'free' | 'plus' | 'pro' | 'business';
  usage: {
    ai_chats: number;
    resume_parsing: number;
    job_matching: number;
  };
  limits: {
    ai_chats: number;
    resume_parsing: number;
    job_matching: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: Record<string, number>;
  popular: boolean;
  monthly_price: number;
  yearly_price: number;
}

export interface ResumeData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: any[];
  location: string | null;
  education: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  user_id: string;
  user_email: string;
  user_name: string;
  description: string;
  plan_id: string;
  payment_method: string;
}

// API Service Class
class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('careerforge_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('careerforge_token', data.access_token);
    return data;
  }

  async signup(email: string, password: string, fullName: string): Promise<User> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('full_name', fullName);

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('careerforge_token');
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/get_user_info');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('email', email);

    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Password reset request failed');
    }

    return response.json();
  }

  // Resume Processing
  async uploadResume(file: File): Promise<{ message: string; resume_data: ResumeData }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Resume upload failed');
    }

    return response.json();
  }

  async getParsedResume(): Promise<ResumeData> {
    return this.request<ResumeData>('/resume/parsed');
  }

  async analyzeResume(file: File, jobDescription?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Resume analysis failed');
    }

    return response.json();
  }

  async matchResume(file: File, jobDescription: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    const response = await fetch(`${API_BASE_URL}/match_resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Resume matching failed');
    }

    return response.json();
  }

  // AI Chat
  async chatWithResume(prompt: string, resumeText?: string): Promise<any> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (resumeText) {
      formData.append('resume_text', resumeText);
    }

    const response = await fetch(`${API_BASE_URL}/chat_with_resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Chat failed');
    }

    return response.json();
  }

  async gptChat(messages: ChatMessage[]): Promise<any> {
    return this.request('/gpt-chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  }

  // Cover Letter
  async rewriteCoverLetter(
    resumeData: ResumeData,
    jobDescription: string,
    originalCoverLetter?: string
  ): Promise<any> {
    return this.request('/cover-letter-rewrite', {
      method: 'POST',
      body: JSON.stringify({
        resume_data: resumeData,
        job_description: jobDescription,
        original_cover_letter: originalCoverLetter,
      }),
    });
  }

  // Subscription & Payments
  async getSubscriptionPlans(): Promise<{ plans: SubscriptionPlan[] }> {
    return this.request('/subscription/plans');
  }

  async getSubscriptionPlan(planId: string): Promise<{ plan: SubscriptionPlan }> {
    return this.request(`/subscription/plans/${planId}`);
  }

  async upgradeSubscription(
    planId: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    paymentMethod: string = 'UPI'
  ): Promise<any> {
    return this.request('/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({
        plan_id: planId,
        billing_cycle: billingCycle,
        payment_method: paymentMethod,
      }),
    });
  }

  async getUserSubscription(userId: string): Promise<any> {
    return this.request(`/subscription/user/${userId}`);
  }

  async cancelSubscription(userId: string): Promise<any> {
    return this.request('/subscription/cancel', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Payment Processing
  async createPayment(paymentRequest: PaymentRequest): Promise<any> {
    return this.request('/payment/create', {
      method: 'POST',
      body: JSON.stringify(paymentRequest),
    });
  }

  async verifyPayment(paymentId: string, signature: string, orderId: string): Promise<any> {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify({
        payment_id: paymentId,
        signature,
        order_id: orderId,
      }),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    return this.request(`/payment/status/${paymentId}`);
  }

  async getPaymentMethods(): Promise<any> {
    return this.request('/payment/methods');
  }

  // Usage Tracking
  async trackUsage(userId: string, feature: string, userPlan: string = 'free'): Promise<any> {
    return this.request('/usage/track', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        feature,
        user_plan: userPlan,
      }),
    });
  }

  async checkUsage(userId: string, feature: string, userPlan: string = 'free'): Promise<any> {
    return this.request(`/usage/check/${userId}/${feature}?user_plan=${userPlan}`);
  }

  async getUsageSummary(userId: string, userPlan: string = 'free'): Promise<any> {
    return this.request(`/usage/summary/${userId}?user_plan=${userPlan}`);
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService; 