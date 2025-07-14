import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface Message {
  role: 'user' | 'ai';
  content: string;
export type ModelType = 'gpt-3.5' | 'gpt-4' | 'dalle';
export interface PromptTemplate {
  name: string;
  prompt: string;
export interface ChatState {
  messages: Message[];
  freeMessageCount: number;
  incrementMessageCount: () => void;
  userPlan: 'free' | 'plus' | 'pro';
  model: ModelType;
  templates: PromptTemplate[];
  setUserPlan: (plan: 'free' | 'plus' | 'pro') => void;
  setModel: (model: ModelType) => void;
  addMessage: (msg: Message) => void;
  resetChat: () => void;
  addTemplate: (template: PromptTemplate) => void;
  removeTemplate: (name: string) => void;
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
      resetChat: () => set({ messages: [] }),
      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
      removeTemplate: (name) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.name !== name),
        })),
      incrementMessageCount: () =>
        set((state) => ({
          freeMessageCount: state.freeMessageCount + 1,
        })),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        freeMessageCount: state.freeMessageCount,
        userPlan: state.userPlan,
        model: state.model,
        templates: state.templates,
      }),
  )
);
