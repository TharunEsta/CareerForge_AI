import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  credits: number;
  uploadCount: number;
  maxUploads: number;
  maxCredits: number;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  updateCredits: (credits: number) => void;
  incrementUploadCount: () => void;
  resetUsage: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  canUpload: () => boolean;
  canAsk: () => boolean;
  remainingUploads: () => number;
  remainingCredits: () => number;
  usagePercentage: () => number;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user: User) => set({ user }),
      
      updateCredits: (credits: number) => set((state) => ({
        user: state.user ? { ...state.user, credits } : null
      })),
      
      incrementUploadCount: () => set((state) => ({
        user: state.user ? { ...state.user, uploadCount: state.user.uploadCount + 1 } : null
      })),
      
      resetUsage: () => set((state) => ({
        user: state.user ? { 
          ...state.user, 
          uploadCount: 0, 
          credits: state.user.maxCredits 
        } : null
      })),
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      setError: (error: string | null) => set({ error }),

      // Computed values
      canUpload: () => {
        const { user } = get();
        if (!user) return false;
        return user.plan === 'pro' || user.uploadCount < user.maxUploads;
      },

      canAsk: () => {
        const { user } = get();
        if (!user) return false;
        return user.plan === 'pro' || user.credits > 0;
      },

      remainingUploads: () => {
        const { user } = get();
        if (!user) return 0;
        return Math.max(0, user.maxUploads - user.uploadCount);
      },

      remainingCredits: () => {
        const { user } = get();
        if (!user) return 0;
        return Math.max(0, user.credits);
      },

      usagePercentage: () => {
        const { user } = get();
        if (!user) return 0;
        if (user.plan === 'pro') return 0;
        return (user.uploadCount / user.maxUploads) * 100;
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Initialize default user for demo
export const initializeDemoUser = () => {
  const store = useUserStore.getState();
  if (!store.user) {
    store.setUser({
      id: '1',
      email: 'user@example.com',
      plan: 'free',
      credits: 50,
      uploadCount: 0,
      maxUploads: 5,
      maxCredits: 50,
    });
  }
}; 
