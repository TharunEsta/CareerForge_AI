export interface SubscriptionType {
  plan: 'free' | 'premium' | 'enterprise';
  status?: string;
  nextBillingDate?: string;
}

export interface User {
  avatarUrl?: string;
  id: string;
  name: string;
  email: string;
  subscription?: SubscriptionType;
} 
