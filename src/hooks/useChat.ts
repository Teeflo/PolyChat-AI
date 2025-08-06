import { create } from 'zustand';
import type { Message, ChatSession } from '../types/index';
import { saveMessages } from '../services/localStorage';
import { fetchAIResponse } from '../services/openRouter';
import { useSettings } from './useSettings';

interface ChatStore {
  activeSessions: ChatSession[];
  selectedModels: string[]; // Max 3 modèles
  isAnyLoading: boolean;
  addModel: (modelId: string) => void;
  removeModel: (modelId: string) => void;
  sendMessageToAll: (content: string) => Promise<void>;
  regenerateMessage: (sessionId: string, messageId: string) => Promise<void>;
  deleteMessage: (sessionId: string, messageId: string) => void;
  clearAllChats: () => void;
  initializeChat: () => void;
}

const createMessage = (role: 'user' | 'assistant', content: string, modelId?: string): Message => ({
  id: Math.random().toString(36).substring(2, 9),
  role,
  content,
  timestamp: new Date(),
  modelId,
});

const createWelcomeMessage = (modelId: string): Message => ({
  id: `welcome-${modelId}`,
  role: 'assistant',
  content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
  timestamp: new Date(),
  modelId,
});

export const useChat = create<ChatStore>((set, get) => ({
  activeSessions: [],
  selectedModels: [],
  isAnyLoading: false,
  
  initializeChat: () => {
    // Initialiser avec le modèle par défaut
    const { selectedModel } = useSettings.getState();
    if (selectedModel) {
      const defaultSession: ChatSession = {
        id: selectedModel,
        modelId: selectedModel,
        modelName: selectedModel,
        messages: [createWelcomeMessage(selectedModel)],
        isLoading: false,
        error: null,
      };
      set({ 
        activeSessions: [defaultSession],
        selectedModels: [selectedModel]
      });
    }
  },
  
  addModel: (modelId: string) => {
    const { activeSessions, selectedModels } = get();
    
    // Vérifier si le modèle n'est pas déjà actif et qu'on n'a pas atteint la limite de 3
    if (!selectedModels.includes(modelId) && selectedModels.length < 3) {
      const newSession: ChatSession = {
        id: modelId,
        modelId,
        modelName: modelId, // Utiliser l'ID pour la cohérence
        messages: [createWelcomeMessage(modelId)],
        isLoading: false,
        error: null,
      };
      
      set({
        activeSessions: [...activeSessions, newSession],
        selectedModels: [...selectedModels, modelId]
      });
    }
  },
  
  removeModel: (modelId: string) => {
    const { activeSessions, selectedModels } = get();
    
    // Ne pas permettre de supprimer si c'est le seul modèle actif
    if (selectedModels.length > 1) {
      set({
        activeSessions: activeSessions.filter(session => session.modelId !== modelId),
        selectedModels: selectedModels.filter(id => id !== modelId)
      });
    }
  },
  
  sendMessageToAll: async (content: string) => {
    if (!content.trim()) return;
    
    const { activeSessions } = get();
    const { apiKey } = useSettings.getState();
    
    if (!apiKey) {
      // Mettre à jour toutes les sessions avec l'erreur
      const updatedSessions = activeSessions.map(session => ({
        ...session,
        error: 'API key is missing. Please set your API key in the settings.',
        isLoading: false
      }));
      set({ activeSessions: updatedSessions, isAnyLoading: false });
      return;
    }
    
    // Ajouter le message utilisateur à toutes les sessions
    const userMessage = createMessage('user', content);
    const updatedSessions = activeSessions.map(session => ({
      ...session,
      messages: [...session.messages, userMessage],
      isLoading: true,
      error: null
    }));
    
    set({ 
      activeSessions: updatedSessions,
      isAnyLoading: true
    });
    
    // Envoyer les requêtes en parallèle pour tous les modèles
    const promises = updatedSessions.map(async (session) => {
      try {
        const aiResponse = await fetchAIResponse(session.messages, apiKey, session.modelId);
        const aiMessage = createMessage('assistant', aiResponse, session.modelId);
        return {
          ...session,
          messages: [...session.messages, aiMessage],
          isLoading: false,
          error: null
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {
          ...session,
          isLoading: false,
          error: errorMessage
        };
      }
    });
    
    try {
      const resolvedSessions = await Promise.all(promises);
      set({ 
        activeSessions: resolvedSessions,
        isAnyLoading: false
      });
      
      // Sauvegarder dans le localStorage (on peut sauvegarder la première session comme référence)
      if (resolvedSessions.length > 0) {
        saveMessages(resolvedSessions[0].messages);
      }
    } catch (error) {
      set({ isAnyLoading: false });
    }
  },
  
  clearAllChats: () => {
    const { selectedModels } = get();
    const clearedSessions = selectedModels.map(modelId => ({
      id: modelId,
      modelId,
      modelName: modelId,
      messages: [createWelcomeMessage(modelId)],
      isLoading: false,
      error: null,
    }));
    
    set({ activeSessions: clearedSessions });
    
    if (clearedSessions.length > 0) {
      saveMessages(clearedSessions[0].messages);
    }
  },

  regenerateMessage: async (sessionId: string, messageId: string) => {
    const { activeSessions } = get();
    const { apiKey } = useSettings.getState();

    if (!apiKey) {
      return;
    }

    // Trouver la session et le message
    const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;

    const session = activeSessions[sessionIndex];
    const messageIndex = session.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Ne régénérer que les messages de l'assistant
    const message = session.messages[messageIndex];
    if (message.role !== 'assistant') return;

    // Marquer la session comme en chargement
    const updatedSessions = [...activeSessions];
    updatedSessions[sessionIndex] = {
      ...session,
      isLoading: true,
      error: null
    };
    set({ activeSessions: updatedSessions, isAnyLoading: true });

    try {
      // Récupérer les messages jusqu'au message à régénérer (sans l'inclure)
      const conversationHistory = session.messages.slice(0, messageIndex);
      
      // Faire appel à l'API
      const aiResponse = await fetchAIResponse(conversationHistory, apiKey, session.modelId);
      
      // Remplacer le message régénéré
      const newMessage = createMessage('assistant', aiResponse, session.modelId);
      const newMessages = [
        ...conversationHistory,
        newMessage,
        ...session.messages.slice(messageIndex + 1)
      ];

      updatedSessions[sessionIndex] = {
        ...session,
        messages: newMessages,
        isLoading: false,
        error: null
      };

      set({ activeSessions: updatedSessions, isAnyLoading: false });
      saveMessages(newMessages);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la régénération';
      
      updatedSessions[sessionIndex] = {
        ...session,
        isLoading: false,
        error: errorMessage
      };

      set({ activeSessions: updatedSessions, isAnyLoading: false });
    }
  },

  deleteMessage: (sessionId: string, messageId: string) => {
    const { activeSessions } = get();
    
    const updatedSessions = activeSessions.map(session => {
      if (session.id === sessionId) {
        const filteredMessages = session.messages.filter(m => m.id !== messageId);
        
        // S'assurer qu'il reste au moins le message d'accueil
        const finalMessages = filteredMessages.length === 0 
          ? [createWelcomeMessage(session.modelId)]
          : filteredMessages;

        return {
          ...session,
          messages: finalMessages
        };
      }
      return session;
    });

    set({ activeSessions: updatedSessions });
    
    // Sauvegarder les messages de la première session comme référence
    if (updatedSessions.length > 0) {
      saveMessages(updatedSessions[0].messages);
    }
  }
}));