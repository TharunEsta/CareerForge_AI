import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp?: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export type ModelType = 'gpt-3.5' | 'gpt-4' | 'dalle';

export interface PromptTemplate {
  name: string;
  prompt: string;
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  userPlan: 'free' | 'plus' | 'pro';
  model: ModelType;
  templates: PromptTemplate[];
  setUserPlan: (plan: 'free' | 'plus' | 'pro') => void;
  setModel: (model: ModelType) => void;
  createChat: () => void;
  switchChat: (id: string) => void;
  deleteChat: (id: string) => void;
  addMessageToChat: (chatId: string, msg: Message) => void;
  resetChat: () => void;
  addTemplate: (template: PromptTemplate) => void;
  removeTemplate: (name: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [
        {
          id: 'chat-1',
          title: 'New Chat',
          messages: [],
        },
      ],
      activeChatId: 'chat-1',
      userPlan: 'free',
      model: 'gpt-3.5',
      templates: [],
      setUserPlan: (plan) => set({ userPlan: plan }),
      setModel: (model) => set({ model }),
      createChat: () => {
        const newId = 'chat-' + Date.now();
        set((state) => ({
          chats: [
            { id: newId, title: 'New Chat', messages: [] },
            ...state.chats,
          ],
          activeChatId: newId,
        }));
      },
      switchChat: (id) => set({ activeChatId: id }),
      deleteChat: (id) => set((state) => {
        const filtered = state.chats.filter((c) => c.id !== id);
        let newActive = state.activeChatId;
        if (state.activeChatId === id) {
          newActive = filtered.length > 0 ? filtered[0].id : null;
        }
        return { chats: filtered, activeChatId: newActive };
      }),
      addMessageToChat: (chatId, msg) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, msg],
                title: chat.messages.length === 0 && msg.content ? msg.content.substring(0, 20) : chat.title,
              }
            : chat
        ),
      })),
      resetChat: () => set((state) => {
        if (!state.activeChatId) return {};
        return {
          chats: state.chats.map((chat) =>
            chat.id === state.activeChatId ? { ...chat, messages: [] } : chat
          ),
        };
      }),
      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
      removeTemplate: (name) => set((state) => ({ templates: state.templates.filter((t) => t.name !== name) })),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        userPlan: state.userPlan,
        model: state.model,
        templates: state.templates,
      }),
    }
  )
); 
