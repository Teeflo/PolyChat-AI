import type { Message } from '../types/index';

const STORAGE_KEY = 'polychat-messages';

export const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
};

export const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // Essayer de parser, si ça échoue, les données sont corrompues
      const parsed = JSON.parse(stored);
      // Vérifier si c'est bien un tableau
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Si rien n'est stocké, ou si les données sont corrompues/invalides
    localStorage.removeItem(STORAGE_KEY); // Nettoyer les données invalides
    return [];
  } catch (error) {
    console.error('Failed to load or parse messages from localStorage:', error);
    // En cas d'erreur de parsing, nettoyer le stockage
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};