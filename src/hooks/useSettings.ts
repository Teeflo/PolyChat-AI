import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types/index';

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  selectedModel: '', // Aucun modèle par défaut - l'utilisateur choisit
  theme: 'dark', // Thème sombre par défaut pour le design moderne
  systemPrompt: '', // Instruction système vide par défaut
};

interface SettingsStore extends Settings {
  isSettingsOpen: boolean;
  setApiKey: (apiKey: string) => void;
  setSelectedModel: (model: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSystemPrompt: (systemPrompt: string) => void;
  toggleTheme: () => void;
  toggleSettings: () => void;
  closeSettings: () => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      isSettingsOpen: false,
      setApiKey: (apiKey) => set({ apiKey }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setTheme: (theme) => set({ theme }),
      setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      toggleSettings: () => set({ isSettingsOpen: !get().isSettingsOpen }),
      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'polychat-settings',
    }
  )
);