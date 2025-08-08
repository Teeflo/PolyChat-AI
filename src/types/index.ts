export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
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
  systemPrompt: string; // Nouveau champ pour l'instruction système
}

export interface ChatSession {
  id: string;
  modelId: string;
  modelName: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// New types for conversation templates and quick actions
export interface ConversationTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  systemPrompt: string;
  userMessage: string;
  tags: string[];
  isCustom: boolean;
  modelSpecific?: string[]; // Models this template works best with
  icon?: string;
  color?: string;
}

export type TemplateCategory = 
  | 'programming' 
  | 'writing' 
  | 'analysis' 
  | 'creative' 
  | 'learning' 
  | 'business' 
  | 'personal';

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: QuickActionType;
  description: string;
  requiresSelection: boolean;
  modelSpecific?: string[]; // Models this action works best with
  systemPrompt?: string;
  userMessageTemplate?: string;
}

export type QuickActionType = 
  | 'explain' 
  | 'optimize' 
  | 'debug' 
  | 'comment' 
  | 'translate' 
  | 'summarize' 
  | 'review' 
  | 'improve' 
  | 'simplify' 
  | 'expand';

export interface TemplateCategoryInfo {
  id: TemplateCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}