import { create } from 'zustand';
import type { Message, ChatSession, ConversationTemplate, QuickAction, MessageContent } from '../types/index';
import { saveChatHistory, loadChatHistory } from '../services/localStorage';
import { streamAIResponse, isImageGenerationModel, getImageGenerationError, generateImageReliable } from '../services/openRouter';
import { getRelevantContext } from '../services/ragService'; // Ajout du RAG Service
import { useSettings } from './useSettings';
import { useUsageStats } from './useUsageStats';
import { notify } from '../utils/notify';

// Helper function to get text content from message
const getMessageText = (content: string | MessageContent[]): string => {
  if (typeof content === 'string') {
    return content;
  }
  // For MessageContent[], extract text from text type content
  return content
    .filter(item => item.type === 'text')
    .map(item => item.text || '')
    .join(' ');
};

// Helper function to detect if message is requesting image generation
const detectImageGenerationRequest = (content: string): boolean => {
  const imageKeywords = [
    'génér', 'génére', 'générer', 'génères', 'génère', 'générez',
    'créer', 'crée', 'crées', 'créez', 'créé', 'créée', 'créés', 'créées',
    'dessin', 'dessine', 'dessines', 'dessinez',
    'image', 'photo', 'illustration', 'artwork', 'picture',
    'affiche', 'montre', 'représente', 'représenter'
  ];

  const lowerContent = content.toLowerCase();
  return imageKeywords.some(keyword => lowerContent.includes(keyword));
};

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
  setWindowCount: (count: number) => void; // Définir le nombre de fenêtres actives
  setSessionModel: (sessionId: string, modelId: string) => void; // Assigner un modèle à une fenêtre "pending"
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
    const savedSessions = loadChatHistory();
    set({
      allSessions: savedSessions,
    });

    // Always create a new temporary session on load
    const { selectedModel } = useSettings.getState();
    const newTemporarySession = createNewTemporarySession(selectedModel);

    set({
      activeSessions: [newTemporarySession],
      currentSessionId: newTemporarySession.id,
      selectedModels: [newTemporarySession.modelId],
    });

    // Helper function to create a new temporary session
    function createNewTemporarySession(modelId: string | undefined): ChatSession {
      const id = `session-${Date.now()}`;
      const model = modelId || 'default'; // Fallback if no model is selected yet
      return {
        id,
        modelId: model,
        modelName: model,
        messages: [],
        isLoading: false,
        error: null,
        isTemporary: true, // Mark as temporary
      };
    }

    // Subscribe to default model changes for new temporary sessions
    useSettings.subscribe((state) => {
      const currentActiveSession = get().activeSessions[0];
      if (currentActiveSession && currentActiveSession.isTemporary && state.selectedModel && currentActiveSession.modelId === 'default') {
        // If the temporary session is still using the 'default' modelId, update it
        const updatedTemporarySession = {
          ...currentActiveSession,
          modelId: state.selectedModel,
          modelName: state.selectedModel,
        };
        set({
          activeSessions: [updatedTemporarySession],
          selectedModels: [state.selectedModel],
        });
      }
    });

    // Subscribe to default model changes for existing sessions (original logic)
    useSettings.subscribe((state, prevState) => {
      const { selectedModels, activeSessions } = get();
      if (state.selectedModel !== prevState?.selectedModel &&
          state.selectedModel &&
          selectedModels.length === 1 &&
          activeSessions.length === 1 &&
          !activeSessions[0].isTemporary) { // Only update if not a temporary session

        const currentSession = activeSessions[0];
        const newSession: ChatSession = {
          ...currentSession,
          id: `session-${Date.now()}`, // Create new ID to ensure re-render if needed
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
  
  
  setWindowCount: (count: number) => {
    const target = Math.min(3, Math.max(1, count));
    const { activeSessions } = get();
    let sessions = [...activeSessions];
    if (target > sessions.length) {
      const toAdd = target - sessions.length;
      for (let i = 0; i < toAdd; i++) {
        const pid = `pending-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
        const pendingSession: ChatSession = {
          id: pid,
          modelId: pid,
          modelName: 'Sélectionner…',
          messages: [],
          isLoading: false,
          error: null
        };
        sessions.push(pendingSession);
      }
      set(state => ({
        allSessions: [...state.allSessions, ...sessions.slice(activeSessions.length)],
        activeSessions: sessions,
        selectedModels: sessions.map(s => s.modelId)
      }));
    } else if (target < sessions.length) {
      const newSessions = sessions.slice(0, target);
      set({
        activeSessions: newSessions,
        selectedModels: newSessions.map(s => s.modelId)
      });
    }
  },
  setSessionModel: (sessionId: string, modelId: string) => {
    const { activeSessions, allSessions, selectedModels } = get();
    if (selectedModels.includes(modelId)) {
      // If model is already active, we might want to switch to that existing session
      // For now, we'll just update the current pending session
    }
    const updatedActive = activeSessions.map(s => s.id === sessionId ? { ...s, modelId, modelName: modelId, isTemporary: false } : s);
    const updatedAll = allSessions.map(s => s.id === sessionId ? { ...s, modelId, modelName: modelId, isTemporary: false } : s);
    const updatedSelected = selectedModels.map(id => (activeSessions.find(s => s.id===sessionId)?.modelId === id ? modelId : id));
    set({ activeSessions: updatedActive, allSessions: updatedAll, selectedModels: updatedActive.map(s=>s.modelId) || updatedSelected });
  },
  
  removeModel: (modelId: string) => {
    const { activeSessions, selectedModels } = get();
    
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
    const runnableSessions = activeSessions.filter(s => !s.modelId.startsWith('pending-'));
    if (runnableSessions.length === 0) return;

    const { apiKey, systemPrompt, tone, ragEnabled } = useSettings.getState();
    const stats = useUsageStats.getState();

    if (!apiKey) {
      const updatedSessions = activeSessions.map(session => ({
        ...session,
        error: 'API key is missing. Please set your API key in the settings.',
        isLoading: false
      }));
      set({ activeSessions: updatedSessions, isAnyLoading: false });
      return;
    }

    // Vérifier si le message demande la génération d'une image
    const isImageRequest = detectImageGenerationRequest(content);
    if (isImageRequest) {
      // Vérifier que tous les modèles actifs peuvent générer des images
      const incompatibleModels = runnableSessions.filter(session =>
        !isImageGenerationModel(session.modelId)
      );

      if (incompatibleModels.length > 0) {
        const errorMessage = getImageGenerationError(incompatibleModels[0].modelId);

        const updatedSessions = activeSessions.map(session => {
          if (incompatibleModels.some(s => s.id === session.id)) {
            return {
              ...session,
              error: errorMessage,
              isLoading: false
            };
          }
          return session;
        });

        set({ activeSessions: updatedSessions, isAnyLoading: false });
        return;
      }
    }

    const userMessage = createMessage('user', content);

    // Promote temporary sessions to permanent ones on first message
    const sessionsToProcess = runnableSessions.map(session => {
      if (session.isTemporary) {
        const promotedSession = { ...session, isTemporary: false };
        // Add to allSessions if not already there
        set(state => ({
          allSessions: state.allSessions.some(s => s.id === promotedSession.id)
            ? state.allSessions
            : [...state.allSessions, promotedSession]
        }));
        try { stats.recordNewConversation(promotedSession.modelId); } catch {}
        return promotedSession;
      }
      return session;
    });

    const updatedSessions = sessionsToProcess.map(session => ({
      ...session,
      messages: [...session.messages, userMessage],
      isLoading: true,
      error: null
    }));

    set({
      activeSessions: updatedSessions,
      isAnyLoading: true
    });

    try { stats.recordUserMessage(updatedSessions.map(s => s.modelId)); } catch {}

    const promises = updatedSessions.map(async (session) => {
      const tonePrefix = tone && tone !== 'neutre' ? `[Ton: ${tone}] ` : '';
      const effectiveSystem = systemPrompt && systemPrompt.trim()
        ? `${tonePrefix}${systemPrompt.trim()}`
        : (tonePrefix ? `${tonePrefix}Tu es un assistant IA utile.` : undefined);
      
      let contextMessages = session.messages;
      if (ragEnabled) {
        try {
          const relevantHistory = await getRelevantContext(content, session.messages.slice(0, -1));
          const lastUserMessage = session.messages[session.messages.length - 1];
          contextMessages = [...relevantHistory, lastUserMessage];
        } catch (e) {
          console.error("RAG Error:", e);
        }
      }

      const start = performance.now();
      const placeholderId = `stream-${Date.now()}-${session.modelId}`;
      const placeholderMessage = {
        id: placeholderId,
        role: 'assistant' as const,
        content: '…',
        timestamp: new Date(),
        modelId: session.modelId,
        streaming: true
      };
      const ac = new AbortController();

      set(state => ({
        activeSessions: state.activeSessions.map(s => 
          s.id === session.id 
            ? { ...s, messages: [...s.messages, placeholderMessage] } 
            : s
        ),
        allSessions: state.allSessions.map(s => 
          s.id === session.id 
            ? { ...s, messages: [...s.messages, placeholderMessage] } 
            : s
        ),
        abortControllers: { ...state.abortControllers, [session.id]: ac }
      }));

      try {
        const isImageRequest = detectImageGenerationRequest(getMessageText(userMessage.content));

        if (isImageRequest && isImageGenerationModel(session.modelId)) {
          // Utiliser generateImageReliable pour une génération d'image garantie
          console.log('🎯 Image generation request detected, using reliable generation...');

          try {
            const responseContent = await generateImageReliable(
              getMessageText(userMessage.content),
              apiKey,
              session.modelId,
              {
                maxRetries: 3,
                size: '1024x1024',
                quality: 'hd'
              }
            );

            set(state => ({
              activeSessions: state.activeSessions.map(s => s.id === session.id ? {
                ...s,
                messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: responseContent, streaming: false } : m)
              } : s),
              allSessions: state.allSessions.map(s => s.id === session.id ? {
                ...s,
                messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: responseContent, streaming: false } : m)
              } : s)
            }));

            const end = performance.now();
            try { useUsageStats.getState().recordAssistantResponse(session.modelId, Math.round(end - start)); } catch {}

            const current = get().activeSessions.find(s => s.id === session.id);
            if (!current) return session;

            return {
              ...current,
              isLoading: false,
              error: null
            };

          } catch (error) {
            console.error('🚨 Image generation failed completely:', error);

            // Créer une réponse d'erreur informative
            const errorContent: MessageContent[] = [
              {
                type: 'text',
                text: `❌ Erreur critique lors de la génération d'image

Le système a essayé tous les modèles disponibles et mécanismes de secours, mais la génération d'image a échoué.

**Détails de l'erreur:**
${error instanceof Error ? error.message : 'Erreur inconnue'}

**Actions recommandées:**
• Vérifiez votre connexion internet
• Vérifiez que votre clé API OpenRouter est valide
• Essayez avec un prompt plus simple
• Contactez le support technique si le problème persiste

**Le système garantit normalement la génération d'images grâce à:**
• Retry automatique avec backoff exponentiel
• Fallback vers plusieurs modèles alternatifs
• Validation de clé API avant chaque tentative
• Mécanismes de secours intégrés

Prompt original: "${getMessageText(userMessage.content)}"`
              }
            ];

            set(state => ({
              activeSessions: state.activeSessions.map(s => s.id === session.id ? {
                ...s,
                messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: errorContent, streaming: false } : m)
              } : s),
              allSessions: state.allSessions.map(s => s.id === session.id ? {
                ...s,
                messages: s.messages.map(m => m.id === placeholderId ? { ...m, content: errorContent, streaming: false } : m)
              } : s)
            }));

            const current = get().activeSessions.find(s => s.id === session.id);
            return {
              ...(current || session),
              isLoading: false,
              error: error instanceof Error ? error.message : 'Erreur de génération d\'image'
            };
          }

        } else {
          // Utiliser streamAIResponse pour les réponses textuelles normales
          await streamAIResponse(contextMessages, apiKey, session.modelId, (delta) => {
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
          
          const current = get().activeSessions.find(s => s.id === session.id);
          if (!current) return session;

          return {
            ...current,
            messages: current.messages.map(m => m.id === placeholderId ? { ...m, streaming: false } : m),
            isLoading: false,
            error: null
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
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

        const current = get().activeSessions.find(s => s.id === session.id);
        return {
          ...(current || session),
          isLoading: false,
          error: errorMessage
        };
      }
    });

    try {
      const resolvedSessions = await Promise.all(promises);

      const currentAllSessions = get().allSessions;
      const updatedAllSessions = currentAllSessions.map(session => {
        const updatedSession = resolvedSessions.find(s => s.id === session.id);
        return updatedSession || session;
      });

      set({
        activeSessions: resolvedSessions,
        allSessions: updatedAllSessions,
        isAnyLoading: false
      });
      const { notificationsEnabled } = useSettings.getState();
      if (notificationsEnabled) {
        try {
          // Vérifier si des images ont été générées
          const hasImages = resolvedSessions.some(session => {
            const lastMessage = session.messages[session.messages.length - 1];
            if (!lastMessage || lastMessage.role !== 'assistant') return false;

            const messageText = getMessageText(lastMessage.content);
            return messageText.includes('![Image générée]') ||
                   messageText.includes('https://') && /\.(png|jpg|jpeg|webp|gif)/i.test(messageText);
          });

          const count = resolvedSessions.length;
          const message = hasImages
            ? '🎨 Image(s) générée(s) prête(s)!'
            : count > 1
              ? `Réponses prêtes pour ${count} modèles`
              : 'Réponse prête';

          notify('PolyChat AI', message);
        } catch {}
      }
    } catch (error) {
      set({ isAnyLoading: false });
    }
  },

  clearAllChats: () => {
    const { selectedModels, currentSessionId, allSessions } = get();
    if (currentSessionId) {
      const clearedSession = {
        id: currentSessionId,
        modelId: selectedModels[0] || 'default',
        modelName: selectedModels[0] || 'default',
        messages: [],
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
    const { apiKey, systemPrompt, ragEnabled } = useSettings.getState();

    if (!apiKey) {
      return;
    }

    const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;

    const session = activeSessions[sessionIndex];
    const messageIndex = session.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const message = session.messages[messageIndex];
    if (message.role !== 'assistant') return;

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
      const conversationHistory = session.messages.slice(0, messageIndex);
      const lastUserMessage = conversationHistory.filter(m => m.role === 'user').pop();

      if (!lastUserMessage) {
        // Cannot regenerate without a preceding user message
        set(state => ({
          activeSessions: state.activeSessions.map(s => s.id === sessionId ? { ...s, isLoading: false, error: "Impossible de régénérer sans message utilisateur précédent." } : s),
          isAnyLoading: false
        }));
        return;
      }

      // RAG Integration
      let contextMessages = conversationHistory;
      if (ragEnabled) {
          try {
              const lastUserMessageText = getMessageText(lastUserMessage.content);
              contextMessages = await getRelevantContext(lastUserMessageText, conversationHistory);
          } catch (e) {
              console.error("RAG Error:", e);
          }
      }
      
      const { tone } = useSettings.getState();
      const tonePrefix = tone && tone !== 'neutre' ? `[Ton: ${tone}] ` : '';
      const effectiveSystem = systemPrompt && systemPrompt.trim()
        ? `${tonePrefix}${systemPrompt.trim()}`
        : (tonePrefix ? `${tonePrefix}Tu es un assistant IA utile.` : undefined);

      const start = performance.now();
      const placeholderMessage = { ...createMessage('assistant', '…', session.modelId), streaming: true };
      regenPlaceholderId = placeholderMessage.id;
      const msgsWithoutOld = [...conversationHistory.filter(m => m.id !== messageId), placeholderMessage];
      const ac = new AbortController();

      set(state => ({
        activeSessions: state.activeSessions.map(s => 
          s.id === sessionId 
            ? { ...s, messages: msgsWithoutOld } 
            : s
        ),
        allSessions: state.allSessions.map(s => 
          s.id === sessionId 
            ? { ...s, messages: msgsWithoutOld } 
            : s
        ),
        abortControllers: { ...state.abortControllers, [session.id]: ac }
      }));
      
      const isImageRequest = detectImageGenerationRequest(getMessageText(lastUserMessage.content));

      if (isImageRequest && isImageGenerationModel(session.modelId)) {
        console.log('🎯 Regenerating image with reliable generation...');

        try {
          const responseContent = await generateImageReliable(
            getMessageText(lastUserMessage.content),
            apiKey,
            session.modelId,
            {
              maxRetries: 3,
              size: '1024x1024',
              quality: 'hd'
            }
          );

          set(state => ({
            activeSessions: state.activeSessions.map(s => s.id === sessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === regenPlaceholderId ? { ...m, content: responseContent, streaming: false } : m)
            } : s),
            allSessions: state.allSessions.map(s => s.id === sessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === regenPlaceholderId ? { ...m, content: responseContent, streaming: false } : m)
            } : s)
          }));
        } catch (error) {
          console.error('🚨 Image regeneration failed:', error);

          const errorContent: MessageContent[] = [
            {
              type: 'text',
              text: `❌ Erreur lors de la régénération d'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}

Le système a essayé plusieurs modèles et méthodes, mais la régénération a échoué.`
            }
          ];

          set(state => ({
            activeSessions: state.activeSessions.map(s => s.id === sessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === regenPlaceholderId ? { ...m, content: errorContent, streaming: false } : m)
            } : s),
            allSessions: state.allSessions.map(s => s.id === sessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === regenPlaceholderId ? { ...m, content: errorContent, streaming: false } : m)
            } : s)
          }));
        }
      } else {
        await streamAIResponse(contextMessages, apiKey, session.modelId, (delta)=>{
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
      }
      
      const end = performance.now();
      try { useUsageStats.getState().recordAssistantResponse(session.modelId, Math.round(end - start)); } catch {}
      const regenId = placeholderMessage.id;
      const finalUpdateSession = (s: ChatSession) => s.id === sessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === regenId ? { ...m, streaming: false } : m),
        isLoading: false,
        error: null
      } : s;

      set(state => ({
        activeSessions: state.activeSessions.map(finalUpdateSession),
        allSessions: state.allSessions.map(finalUpdateSession),
        isAnyLoading: false
      }));

      const { notificationsEnabled } = useSettings.getState();
      if (notificationsEnabled) {
        try { notify('PolyChat AI', 'Réponse régénérée prête'); } catch {}
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la régénération';
      const regenIdErr = regenPlaceholderId;
      const errorUpdateSession = (s: ChatSession) => s.id === sessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === regenIdErr ? { ...m, streaming: false, content: `Erreur: ${errorMessage}` } : m),
        isLoading: false,
        error: errorMessage
      } : s;

      set(state => ({
        activeSessions: state.activeSessions.map(errorUpdateSession),
        allSessions: state.allSessions.map(errorUpdateSession),
        isAnyLoading: false
      }));
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
      messageContent = `Please ${action.action} this:

${selectedText}`;
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
  }
}));

// S'abonner aux changements pour sauvegarder automatiquement
useChat.subscribe((state) => {
  // Filtrer les sessions vides avant sauvegarde pour éviter la pollution des données
  const nonEmptySessions = state.allSessions.filter(session => {
    return session.messages.some(message => {
      const textContent = getMessageText(message.content);
      return textContent && textContent.trim().length > 0;
    });
  });
  saveChatHistory(nonEmptySessions);
});
