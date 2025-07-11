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

interface ChatState {
  messages: Message[];
  freeMessageCount: number;
  userPlan: 'free' | 'plus' | 'pro';
  model: ModelType;
  templates: PromptTemplate[];
  setUserPlan: (plan: 'free' | 'plus' | 'pro') => void;
  setModel: (model: ModelType) => void;
  addMessage: (msg: Message) => void;
  resetChat: () => void;
  incrementMessageCount: () => void;
  setMessages: (msgs: Message[]) => void;
  addTemplate: (template: PromptTemplate) => void;
  removeTemplate: (name: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      freeMessageCount: 0,
      userPlan: 'free',
      model: 'gpt-3.5',
      templates: [],
      setUserPlan: (plan) => set({ userPlan: plan }),
      setModel: (model) => set({ model }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      resetChat: () => set({ messages: [], freeMessageCount: 0 }),
      incrementMessageCount: () =>
        set((state) => ({ freeMessageCount: state.freeMessageCount + 1 })),
      setMessages: (msgs) => set({ messages: msgs }),
      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
      removeTemplate: (name) =>
        set((state) => ({ templates: state.templates.filter((t) => t.name !== name) })),
    }),
    {
      name: 'chat-store',
    }
  )
);
