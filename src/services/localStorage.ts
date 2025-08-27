import type { Message, ChatSession, MessageContent } from '../types/index';

const MESSAGES_STORAGE_KEY = 'polychat-messages';
const HISTORY_STORAGE_KEY = 'polychat_history';

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

export const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
};

export const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (stored) {
      // Essayer de parser, si ça échoue, les données sont corrompues
      const parsed = JSON.parse(stored);
      // Vérifier si c'est bien un tableau
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Si rien n'est stocké, ou si les données sont corrompues/invalides
    localStorage.removeItem(MESSAGES_STORAGE_KEY); // Nettoyer les données invalides
    return [];
  } catch (error) {
    console.error('Failed to load or parse messages from localStorage:', error);
    // En cas d'erreur de parsing, nettoyer le stockage
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    return [];
  }
};

export const saveChatHistory = (sessions: ChatSession[]) => {
  try {
    // Filter out empty conversations to avoid data pollution
    const filteredSessions = sessions.filter(session => {
      // Keep sessions that have at least one non-empty message
      return session.messages.some(message => {
        const textContent = getMessageText(message.content);
        return textContent && textContent.trim().length > 0;
      });
    });

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredSessions));
  } catch (error) {
    console.error('Failed to save chat history to localStorage:', error);
  }
};

export const loadChatHistory = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Convertir les timestamps string en objets Date
        return parsed.map(session => ({
          ...session,
          messages: session.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    }
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Failed to load or parse chat history from localStorage:', error);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  }
};