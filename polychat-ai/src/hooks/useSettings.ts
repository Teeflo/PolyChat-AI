import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types/index';

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  selectedModel: 'meta-llama/Llama-3.1-8b-instruct',
  theme: 'light',
};

interface SettingsStore extends Settings {
  isSettingsOpen: boolean;
  setApiKey: (apiKey: string) => void;
  setSelectedModel: (model: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
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
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      toggleSettings: () => set({ isSettingsOpen: !get().isSettingsOpen }),
      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'polychat-settings',
    }
  )
);