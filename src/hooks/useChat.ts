import { create } from 'zustand';
import type { Message, ChatSession, ConversationTemplate, QuickAction } from '../types/index';
import { saveChatHistory, loadChatHistory } from '../services/localStorage';
import { streamAIResponse } from '../services/openRouter';
import { useSettings } from './useSettings';
import { useUsageStats } from './useUsageStats';
import { notify } from '../utils/notify';

interface ChatStore {
  activeSessions: ChatSession[];
  allSessions: ChatSession[]; // Toutes les sessions sauvegardées
  currentSessionId: string | null; // Session actuellement active
  selectedModels: string[]; // Max 3 modèles
  isAnyLoading: boolean;
  abortControllers: Record<string, AbortController>; // par session
  streamingProgress: Record<string, { chars: number; start: number; lastUpdate: number }>;
  pendingTemplate: ConversationTemplate | null; // Template en attente d'édition
  addModel: (modelId: string) => void;
  removeModel: (modelId: string) => void;
  sendMessageToAll: (content: string) => Promise<void>;
  regenerateMessage: (sessionId: string, messageId: string) => Promise<void>;
  deleteMessage: (sessionId: string, messageId: string) => void;
  clearAllChats: () => void;
  initializeChat: () => void;
  setActiveSession: (sessionId: string) => void;
  createNewSession: () => void;
  deleteSession: (sessionId: string) => void;
  stopStreaming: (sessionId?: string) => void;
  // New template and quick action methods
  applyTemplate: (template: ConversationTemplate) => void;
  prepareTemplate: (template: ConversationTemplate) => void; // Nouvelle fonction
  executeQuickAction: (action: QuickAction, selectedText?: string) => void;
}

const createMessage = (role: 'user' | 'assistant', content: string, modelId?: string): Message => ({
  id: Math.random().toString(36).substring(2, 9),
  role,
  content,
  timestamp: new Date(),
  modelId,
});

export const useChat = create<ChatStore>((set, get) => ({
  activeSessions: [],
  allSessions: [],
  currentSessionId: null,
  selectedModels: [],
  isAnyLoading: false,
  abortControllers: {},
  streamingProgress: {},
  pendingTemplate: null,
  
  initializeChat: () => {
    // Charger l'historique depuis localStorage
    const savedSessions = loadChatHistory();
    
    if (savedSessions.length > 0) {
      // Utiliser la première session comme active par défaut
      const firstSession = savedSessions[0];
      set({
        allSessions: savedSessions,
        activeSessions: [firstSession],
        currentSessionId: firstSession.id,
        selectedModels: [firstSession.modelId]
      });
    } else {
      // Initialiser avec le modèle par défaut si déjà connu, sinon attendre qu'il soit défini
      const { selectedModel } = useSettings.getState();
      if (selectedModel) {
        const modelId = selectedModel;
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          modelId,
            modelName: modelId,
            messages: [], // Pas de message de bienvenue automatique
            isLoading: false,
            error: null
        };
        set({
          allSessions: [newSession],
          activeSessions: [newSession],
          currentSessionId: newSession.id,
          selectedModels: [modelId]
        });
        try { useUsageStats.getState().recordNewConversation(modelId); } catch {}
      } else {
        // Surveiller l'arrivée du modèle sélectionné automatiquement
        const unsubscribe = useSettings.subscribe((state) => {
          if (get().activeSessions.length === 0 && state.selectedModel) {
            const modelId = state.selectedModel;
            const newSession: ChatSession = {
              id: `session-${Date.now()}`,
              modelId,
              modelName: modelId,
              messages: [], // Pas de message de bienvenue automatique
              isLoading: false,
              error: null
            };
            set({
              allSessions: [newSession],
              activeSessions: [newSession],
              currentSessionId: newSession.id,
              selectedModels: [modelId]
            });
            try { useUsageStats.getState().recordNewConversation(modelId); } catch {}
            unsubscribe();
          }
        });
      }
    }

    // Surveiller les changements du modèle par défaut pour synchroniser le chat
    useSettings.subscribe((state, prevState) => {
      const { selectedModels, activeSessions } = get();
      
      // Si le modèle par défaut change et qu'on a une seule session active
      if (state.selectedModel !== prevState?.selectedModel && 
          state.selectedModel && 
          selectedModels.length === 1 && 
          activeSessions.length === 1) {
        
        // Remplacer le modèle actuel par le nouveau modèle par défaut
        const currentSession = activeSessions[0];
        const newSession: ChatSession = {
          ...currentSession,
          id: `session-${Date.now()}`,
          modelId: state.selectedModel,
          modelName: state.selectedModel,
        };
        
        set({
          activeSessions: [newSession],
          allSessions: get().allSessions.map(s => s.id === currentSession.id ? newSession : s),
          currentSessionId: newSession.id,
          selectedModels: [state.selectedModel]
        });
        
        console.log('🔄 Modèle par défaut changé, session mise à jour :', state.selectedModel);
      }
    });
  },
  
  addModel: (modelId: string) => {
    const { activeSessions, selectedModels, allSessions } = get();
    
    // Vérifier si le modèle n'est pas déjà actif et qu'on n'a pas atteint la limite de 3
    if (!selectedModels.includes(modelId) && selectedModels.length < 3) {
      const newSession: ChatSession = {
        id: `${modelId}-${Date.now()}`,
        modelId,
        modelName: modelId,
        messages: [], // Pas de message de bienvenue automatique
        isLoading: false,
        error: null,
      };
      
      // Ajouter à la fois dans activeSessions et allSessions
      const updatedAllSessions = [...allSessions];
      if (!updatedAllSessions.find(s => s.id === newSession.id)) {
        updatedAllSessions.push(newSession);
      }
      
      set({
        activeSessions: [...activeSessions, newSession],
        allSessions: updatedAllSessions,
        selectedModels: [...selectedModels, modelId]
      });
  try { useUsageStats.getState().recordNewConversation(modelId); } catch {}
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
    
  const { activeSessions, allSessions } = get();
  const { apiKey, systemPrompt, tone } = useSettings.getState();
  const stats = useUsageStats.getState();
    
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
    
  // Ajouter le message utilisateur à toutes les sessions actives
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
    
    // Statistiques: enregistrer le message utilisateur
    try { stats.recordUserMessage(updatedSessions.map(s => s.modelId)); } catch {}

    // Envoyer les requêtes en parallèle pour tous les modèles
    const promises = updatedSessions.map(async (session) => {
      const tonePrefix = tone && tone !== 'neutre' ? `[Ton: ${tone}] ` : '';
      const effectiveSystem = systemPrompt && systemPrompt.trim()
        ? `${tonePrefix}${systemPrompt.trim()}`
        : (tonePrefix ? `${tonePrefix}Tu es un assistant IA utile.` : undefined);
      const start = performance.now();
      // Create placeholder assistant message first for streaming UI
      let placeholderId = `stream-${Date.now()}-${session.modelId}`;
      const placeholderMessage = {
        id: placeholderId,
        role: 'assistant' as const,
        content: '…',
        timestamp: new Date(),
        modelId: session.modelId,
        streaming: true
      };
      // Create abort controller per session
      const ac = new AbortController();
      set(state => ({ abortControllers: { ...state.abortControllers, [session.id]: ac } }));
      // Insert placeholder immediately
      set(state => ({
        activeSessions: state.activeSessions.map(s => s.id === session.id ? { ...s, messages: [...s.messages, placeholderMessage] } : s),
        allSessions: state.allSessions.map(s => s.id === session.id ? { ...s, messages: [...s.messages, placeholderMessage] } : s)
      }));
      try {
        await streamAIResponse(session.messages, apiKey, session.modelId, (delta) => {
          const now = performance.now();
          set(state => ({
            activeSessions: state.activeSessions.map(s => s.id === session.id ? {
              ...s,
              messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: m.content === '…' ? delta : m.content + delta } : m)
            } : s),
            allSessions: state.allSessions.map(s => s.id === session.id ? {
              ...s,
              messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: m.content === '…' ? delta : m.content + delta } : m)
            } : s),
            streamingProgress: {
              ...state.streamingProgress,
              [session.id]: state.streamingProgress[session.id]
                ? { ...state.streamingProgress[session.id], chars: (state.streamingProgress[session.id].chars + delta.length), lastUpdate: now }
                : { chars: delta.length, start: now, lastUpdate: now }
            }
          }));
  }, effectiveSystem, get().abortControllers[session.id]);
        const end = performance.now();
        try { useUsageStats.getState().recordAssistantResponse(session.modelId, Math.round(end - start)); } catch {}
        // Fetch current streamed messages from store to keep progressive content
        const current = get().activeSessions.find(s => s.id === session.id) || session;
        return {
          ...session,
          messages: current.messages.map(m => m.id === placeholderId ? { ...m, streaming: false } : m),
          isLoading: false,
          error: null
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        // Replace placeholder with error message
        set(state => ({
          activeSessions: state.activeSessions.map(s => s.id === session.id ? {
            ...s,
            messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: `Erreur: ${errorMessage}`, streaming: false } : m)
          } : s),
          allSessions: state.allSessions.map(s => s.id === session.id ? {
            ...s,
            messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: `Erreur: ${errorMessage}`, streaming: false } : m)
          } : s)
        }));
        return {
          ...session,
          isLoading: false,
          error: errorMessage
        };
      }
    });
    
  try {
  const resolvedSessions = await Promise.all(promises);
      
      // Mettre à jour allSessions avec les nouvelles conversations
      const updatedAllSessions = allSessions.map(session => {
        const updatedSession = resolvedSessions.find(s => s.id === session.id);
        return updatedSession || session;
      });
      
      set({ 
        activeSessions: resolvedSessions,
        allSessions: updatedAllSessions,
        isAnyLoading: false
      });
      // Notifications
      const { notificationsEnabled } = useSettings.getState();
      if (notificationsEnabled) {
        try {
          const count = resolvedSessions.length;
          notify('PolyChat AI', count > 1 ? `Réponses prêtes pour ${count} modèles` : 'Réponse prête');
        } catch {}
      }
      
    } catch (error) {
      set({ isAnyLoading: false });
    }
  },
  
  clearAllChats: () => {
    const { selectedModels, currentSessionId, allSessions } = get();
    
    if (currentSessionId) {
      // Nettoyer uniquement la session active
      const clearedSession = {
        id: currentSessionId,
        modelId: selectedModels[0] || 'default',
        modelName: selectedModels[0] || 'default',
        messages: [], // Pas de message de bienvenue automatique
        isLoading: false,
        error: null,
      };
      
      const updatedAllSessions = allSessions.map(session => 
        session.id === currentSessionId ? clearedSession : session
      );
      
      set({ 
        activeSessions: [clearedSession],
        allSessions: updatedAllSessions
      });
    }
  },

  regenerateMessage: async (sessionId: string, messageId: string) => {
    const { activeSessions, allSessions } = get();
    const { apiKey, systemPrompt } = useSettings.getState();

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
    const updateSession = (s: ChatSession) => s.id === sessionId ? {
      ...s,
      isLoading: true,
      error: null
    } : s;

    const updatedActiveSessions = activeSessions.map(updateSession);
    const updatedAllSessions = allSessions.map(updateSession);
    
    set({ 
      activeSessions: updatedActiveSessions,
      allSessions: updatedAllSessions,
      isAnyLoading: true
    });

  let regenPlaceholderId: string | null = null;
  try {
      // Récupérer les messages jusqu'au message à régénérer (sans l'inclure)
      const conversationHistory = session.messages.slice(0, messageIndex);
      
      // Faire appel à l'API
      const { tone } = useSettings.getState();
      const tonePrefix = tone && tone !== 'neutre' ? `[Ton: ${tone}] ` : '';
      const effectiveSystem = systemPrompt && systemPrompt.trim()
        ? `${tonePrefix}${systemPrompt.trim()}`
        : (tonePrefix ? `${tonePrefix}Tu es un assistant IA utile.` : undefined);
      const start = performance.now();
      // Streaming regenerate
  const placeholderMessage = { ...createMessage('assistant', '…', session.modelId), streaming: true };
  regenPlaceholderId = placeholderMessage.id;
      const msgsWithoutOld = [
        ...conversationHistory,
        placeholderMessage,
        ...session.messages.slice(messageIndex + 1)
      ];
      set(state => ({
        activeSessions: state.activeSessions.map(s => s.id===session.id ? { ...s, messages: msgsWithoutOld } : s),
        allSessions: state.allSessions.map(s => s.id===session.id ? { ...s, messages: msgsWithoutOld } : s)
      }));
  const ac = new AbortController();
  set(state => ({ abortControllers: { ...state.abortControllers, [session.id]: ac } }));
      await streamAIResponse(conversationHistory, apiKey, session.modelId, (delta)=>{
        const now = performance.now();
        set(state => ({
          activeSessions: state.activeSessions.map(s => s.id===session.id ? {
            ...s,
            messages: s.messages.map(m => m.id===placeholderMessage.id ? { ...m, content: m.content === '…' ? delta : m.content + delta } : m)
          } : s),
          allSessions: state.allSessions.map(s => s.id===session.id ? {
            ...s,
            messages: s.messages.map(m => m.id===placeholderMessage.id ? { ...m, content: m.content === '…' ? delta : m.content + delta } : m)
          } : s),
          streamingProgress: {
            ...state.streamingProgress,
            [session.id]: state.streamingProgress[session.id]
              ? { ...state.streamingProgress[session.id], chars: (state.streamingProgress[session.id].chars + delta.length), lastUpdate: now }
              : { chars: delta.length, start: now, lastUpdate: now }
          }
        }));
  }, effectiveSystem, ac);
      const end = performance.now();
      try { useUsageStats.getState().recordAssistantResponse(session.modelId, Math.round(end - start)); } catch {}
          const regenId = placeholderMessage.id;
          const finalUpdateSession = (s: ChatSession) => s.id === sessionId ? {
            ...s,
            messages: s.messages.map(m => m.id === regenId ? { ...m, streaming: false } : m),
            isLoading: false,
            error: null
          } : s;

      const finalActiveSessions = activeSessions.map(finalUpdateSession);
      const finalAllSessions = allSessions.map(finalUpdateSession);

      set({ 
        activeSessions: finalActiveSessions,
        allSessions: finalAllSessions,
        isAnyLoading: false
      });
      const { notificationsEnabled } = useSettings.getState();
      if (notificationsEnabled) {
        try { notify('PolyChat AI', 'Réponse régénérée prête'); } catch {}
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la régénération';
      
  const regenIdErr = regenPlaceholderId;
      const errorUpdateSession = (s: ChatSession) => s.id === sessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === regenIdErr ? { ...m, streaming: false } : m),
        isLoading: false,
        error: errorMessage
      } : s;

      const errorActiveSessions = activeSessions.map(errorUpdateSession);
      const errorAllSessions = allSessions.map(errorUpdateSession);

      set({ 
        activeSessions: errorActiveSessions,
        allSessions: errorAllSessions,
        isAnyLoading: false
      });
    }
  },

  deleteMessage: (sessionId: string, messageId: string) => {
    const { activeSessions, allSessions } = get();
    
    const updateSession = (session: ChatSession) => {
      if (session.id === sessionId) {
        const filteredMessages = session.messages.filter(m => m.id !== messageId);
        
        // Si tous les messages sont supprimés, laisser la session vide
        const finalMessages = filteredMessages;

        return {
          ...session,
          messages: finalMessages
        };
      }
      return session;
    };

    const updatedActiveSessions = activeSessions.map(updateSession);
    const updatedAllSessions = allSessions.map(updateSession);

    set({ 
      activeSessions: updatedActiveSessions,
      allSessions: updatedAllSessions
    });
  },

  setActiveSession: (sessionId: string) => {
    const { allSessions } = get();
    const session = allSessions.find(s => s.id === sessionId);
    if (session) {
      set({
        activeSessions: [session],
        currentSessionId: sessionId,
        selectedModels: [session.modelId]
      });
    }
  },

  createNewSession: () => {
    const { selectedModel } = useSettings.getState();
    const { allSessions } = get();
    
    if (selectedModel) {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        modelId: selectedModel,
        modelName: selectedModel,
        messages: [], // Pas de message de bienvenue automatique
        isLoading: false,
        error: null,
      };
      
      set(() => ({
        allSessions: [...allSessions, newSession],
        activeSessions: [newSession],
        currentSessionId: newSession.id,
        selectedModels: [selectedModel]
      }));
  try { useUsageStats.getState().recordNewConversation(selectedModel); } catch {}
    }
  },

  deleteSession: (sessionId: string) => {
    const { allSessions, currentSessionId } = get();
    
    const updatedSessions = allSessions.filter(s => s.id !== sessionId);
    
    // Si on supprime la session active, activer la première session disponible
    const newCurrentSessionId = currentSessionId === sessionId 
      ? (updatedSessions.length > 0 ? updatedSessions[0].id : null)
      : currentSessionId;
    
    const newActiveSession = newCurrentSessionId 
      ? updatedSessions.find(s => s.id === newCurrentSessionId)
      : null;
    
    set({
      allSessions: updatedSessions,
      activeSessions: newActiveSession ? [newActiveSession] : [],
      currentSessionId: newCurrentSessionId,
      selectedModels: newActiveSession ? [newActiveSession.modelId] : []
    });
  },

  // Template and Quick Action methods
  prepareTemplate: (template: ConversationTemplate) => {
    // Simplement stocker le template pour que l'input puisse l'utiliser
    set({ pendingTemplate: template });
  },

  applyTemplate: (template: ConversationTemplate) => {
    const { activeSessions, allSessions } = get();
    const { apiKey } = useSettings.getState();
    
    if (!apiKey) {
      console.error('API key is missing');
      return;
    }

    // Update system prompt for all active sessions
    const updatedSessions = activeSessions.map(session => ({
      ...session,
      messages: [
        // Add system message with template system prompt
        {
          id: `system-${Date.now()}`,
          role: 'system' as const,
          content: template.systemPrompt,
          timestamp: new Date(),
          modelId: session.modelId
        },
        // Add user message with template content
        {
          id: `user-${Date.now()}`,
          role: 'user' as const,
          content: template.userMessage,
          timestamp: new Date(),
          modelId: session.modelId
        }
      ],
      isLoading: false,
      error: null
    }));

    // Update allSessions as well
    const updatedAllSessions = allSessions.map(session => {
      const updatedSession = updatedSessions.find(s => s.id === session.id);
      return updatedSession || session;
    });

    set({
      activeSessions: updatedSessions,
      allSessions: updatedAllSessions
    });

    // Automatically send the template message
    get().sendMessageToAll(template.userMessage);
  },

  executeQuickAction: (action: QuickAction, selectedText?: string) => {
    const { activeSessions, allSessions } = get();
    const { apiKey } = useSettings.getState();
    
    if (!apiKey) {
      console.error('API key is missing');
      return;
    }

    if (action.requiresSelection && (!selectedText || selectedText.trim().length === 0)) {
      console.error('Quick action requires selected text');
      return;
    }

    // Prepare the message content
    let messageContent = '';
    if (action.userMessageTemplate && selectedText) {
      messageContent = action.userMessageTemplate.replace('{selectedText}', selectedText);
    } else if (selectedText) {
      messageContent = `Please ${action.action} this:\n\n${selectedText}`;
    } else {
      messageContent = `Please ${action.action}`;
    }

    // Update system prompt if provided
    const updatedSessions = activeSessions.map(session => {
      const updatedMessages = [...session.messages];
      
      // Add system message if action has a system prompt
      if (action.systemPrompt) {
        updatedMessages.unshift({
          id: `system-${Date.now()}`,
          role: 'system' as const,
          content: action.systemPrompt,
          timestamp: new Date(),
          modelId: session.modelId
        });
      }

      return {
        ...session,
        messages: updatedMessages,
        isLoading: false,
        error: null
      };
    });

    // Update allSessions as well
    const updatedAllSessions = allSessions.map(session => {
      const updatedSession = updatedSessions.find(s => s.id === session.id);
      return updatedSession || session;
    });

    set({
      activeSessions: updatedSessions,
      allSessions: updatedAllSessions
    });

    // Send the quick action message
    get().sendMessageToAll(messageContent);
  }
  ,
  stopStreaming: (sessionId?: string) => {
    const { abortControllers } = get();
    if (sessionId) {
      const ac = abortControllers[sessionId];
      if (ac) ac.abort();
    } else {
      Object.values(abortControllers).forEach(ac => ac.abort());
    }
  set(() => ({ abortControllers: {}, streamingProgress: {} }));
  }
}));

// S'abonner aux changements pour sauvegarder automatiquement
useChat.subscribe((state) => {
  // Sauvegarder toutes les sessions dans localStorage
  saveChatHistory(state.allSessions);
});