export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelId?: string; // Ajout pour identifier quel modèle a généré la réponse
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
}

export interface Settings {
  apiKey: string;
  selectedModel: string;
  theme: 'light' | 'dark';
}

export interface ChatSession {
  id: string;
  modelId: string;
  modelName: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}