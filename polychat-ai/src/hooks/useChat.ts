import { create } from 'zustand';
import type { Message } from '../types/index';
import { loadMessages, saveMessages } from '../services/localStorage';
import { fetchAIResponse } from '../services/openRouter';
import { useSettings } from './useSettings';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  initializeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const createMessage = (role: 'user' | 'assistant', content: string): Message => ({
  id: Math.random().toString(36).substring(2, 9),
  role,
  content,
  timestamp: new Date(),
});

export const useChat = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  initializeChat: () => {
    const storedMessages = loadMessages();
    if (storedMessages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(),
      };
      set({ messages: [welcomeMessage] });
      saveMessages([welcomeMessage]);
    } else {
      set({ messages: storedMessages });
    }
  },
  
  sendMessage: async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage = createMessage('user', content);
    const { messages } = get();
    const newMessages = [...messages, userMessage];
    
    set({ 
      messages: newMessages,
      isLoading: true,
      error: null
    });
    
    saveMessages(newMessages);
    
    try {
      const { apiKey, selectedModel } = useSettings.getState();
      if (!apiKey) {
        throw new Error('API key is missing. Please set your API key in the settings.');
      }
      
      const aiResponse = await fetchAIResponse(newMessages, apiKey, selectedModel);
      const aiMessage = createMessage('assistant', aiResponse);
      const finalMessages = [...newMessages, aiMessage];
      
      set({ 
        messages: finalMessages,
        isLoading: false
      });
      
      saveMessages(finalMessages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ 
        error: errorMessage,
        isLoading: false
      });
    }
  },
  
  clearChat: () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    };
    set({ messages: [welcomeMessage] });
    saveMessages([welcomeMessage]);
  }
}));