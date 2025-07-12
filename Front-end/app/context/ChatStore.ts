import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export type ModelType = 'gpt-3.5' | 'gpt-4' | 'dalle';

interface PromptTemplate {
  name: string;
  prompt: string;
}

// Define ChatState type
export interface ChatState {
  messages: Message[];
  freeMessageCount: number;
  userPlan: 'free' | 'plus' | 'pro';
  model: ModelType;
  templates: PromptTemplate[];
  setUserPlan: (plan: 'free' | 'plus' | 'pro') => void;
  setModel: (model: ModelType) => void;
  addMessage: (msg: Message) => void;
  resetChat: () => void;
  addTemplate: (template: PromptTemplate) => void;
  removeTemplate: (name: string) => void;
}

// Create Zustand store with persist middleware
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      freeMessageCount: 0,
      userPlan: 'free',
      model: 'gpt-3.5',
      templates: [],
      setUserPlan: (plan: 'free' | 'plus' | 'pro') => set({ userPlan: plan }),
      setModel: (model: ModelType) => set({ model }),
      addMessage: (msg: Message) => set((state: ChatState) => ({ messages: [...state.messages, msg] })),
      resetChat: () => set({ messages: [] }),
      addTemplate: (template: PromptTemplate) => set((state: ChatState) => ({ templates: [...state.templates, template] })),
      removeTemplate: (name: string) => set((state: ChatState) => ({ templates: state.templates.filter(t => t.name !== name) })),
    }),
    {
      name: 'chat-storage',
      partialize: (state: ChatState) => ({
        messages: state.messages,
        freeMessageCount: state.freeMessageCount,
        userPlan: state.userPlan,
        model: state.model,
        templates: state.templates,
      }),
    }
  )
); 