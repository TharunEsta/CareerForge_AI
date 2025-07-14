export interface SubscriptionType {
  plan: 'free' | 'premium' | 'enterprise';
  status?: string;
  nextBillingDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  subscription?: SubscriptionType;
} 
