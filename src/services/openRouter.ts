import type { Message } from '../types/index';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const fetchAIResponse = async (
  messages: Message[],
  apiKey: string,
  model: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    // Préparer les messages pour l'API en excluant les propriétés spécifiques à l'interface
    const apiMessages = messages.map(({ id, timestamp, modelId, ...message }) => message);
    
    // Ajouter le system prompt au début si fourni et pas vide
    if (systemPrompt && systemPrompt.trim()) {
      apiMessages.unshift({
        role: 'system',
        content: systemPrompt.trim()
      });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PolyChat AI',
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch AI response: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching AI response');
  }
};

// Streaming support: yields partial text chunks as they arrive
export async function streamAIResponse(
  messages: Message[],
  apiKey: string,
  model: string,
  onChunk: (delta: string) => void,
  systemPrompt?: string,
  abortController?: AbortController
): Promise<string> {
  const apiMessages = messages.map(({ id, timestamp, modelId, ...message }) => message);
  if (systemPrompt && systemPrompt.trim()) apiMessages.unshift({ role: 'system', content: systemPrompt.trim() });
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PolyChat AI',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ model, messages: apiMessages, stream: true }),
      signal: abortController?.signal
    });
  } catch {
    return fetchAIResponse(messages, apiKey, model, systemPrompt);
  }
  if (!response.ok || !response.body) {
    return fetchAIResponse(messages, apiKey, model, systemPrompt);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';
  while (true) {
    let result;
    try {
      result = await reader.read();
    } catch (e:any) {
      if (abortController?.signal.aborted) break;
      throw e;
    }
    const { value, done } = result;
    if (done) break;
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\n\n/);
      buffer = parts.pop() || '';
      for (const block of parts) {
        const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            if (payload === '[DONE]') { buffer=''; break; }
            try {
              const json = JSON.parse(payload);
              const delta: string | undefined = json.choices?.[0]?.delta?.content;
              if (delta) { full += delta; onChunk(delta); }
            } catch {
              full += payload; onChunk(payload);
            }
        }
      }
    }
  }
  return full;
}

// Interface pour les modèles OpenRouter
interface OpenRouterModel {
  id: string;
  name: string;
  created: number;
  description?: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    image?: string;
    request?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens?: number;
    is_moderated: boolean;
  };
}

// Récupérer les modèles trending de la page d'accueil OpenRouter
export const getTopWeeklyModels = async (): Promise<Array<{id: string, name: string, desc: string, emoji: string}>> => {
  try {
    // Récupérer la page d'accueil d'OpenRouter pour obtenir les Featured Models
    const homepageResponse = await fetch('https://openrouter.ai/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!homepageResponse.ok) {
      throw new Error('Failed to fetch OpenRouter homepage');
    }

    const homepageText = await homepageResponse.text();
    
    // Extraire les modèles trending de la page d'accueil
    const featuredModels = [];
    
    // Patterns pour extraire les modèles depuis le HTML
    const modelPatterns = [
      { 
        regex: /Gemini\s+2\.5\s+Pro/i,
        id: 'google/gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        desc: 'Modèle trending #1',
        emoji: '🔥'
      },
      {
        regex: /GPT-5\s+Chat/i,
        id: 'openai/gpt-5-chat',
        name: 'GPT-5 Chat',
        desc: 'Nouveau modèle OpenAI',
        emoji: '✨'
      },
      {
        regex: /Claude\s+Sonnet\s+4/i,
        id: 'anthropic/claude-sonnet-4',
        name: 'Claude Sonnet 4',
        desc: 'Modèle Anthropic avancé',
        emoji: '🧠'
      }
    ];

    // Vérifier quels modèles sont présents sur la page d'accueil
    for (const pattern of modelPatterns) {
      if (pattern.regex.test(homepageText)) {
        featuredModels.push({
          id: pattern.id,
          name: pattern.name,
          desc: pattern.desc,
          emoji: pattern.emoji
        });
      }
    }

    // Si on trouve des modèles featured, les retourner
    if (featuredModels.length > 0) {
      return featuredModels.slice(0, 3); // Prendre les 3 premiers
    }

    // Sinon, récupérer depuis l'API models comme fallback
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models API');
    }

    const data = await response.json();
    const models: OpenRouterModel[] = data.data || [];

    // Chercher les modèles trending dans la liste API
    const trendingIds = [
      'google/gemini-2.5-pro',
      'openai/gpt-5-chat', 
      'anthropic/claude-sonnet-4'
    ];

    const result = [];
    for (const trendingId of trendingIds) {
      const found = models.find(model => 
        model.id === trendingId || 
        model.id.includes(trendingId.split('/')[1])
      );
      
      if (found) {
        const modelInfo = modelPatterns.find(p => p.id === trendingId);
        result.push({
          id: found.id,
          name: modelInfo?.name || found.name,
          desc: modelInfo?.desc || 'Modèle populaire',
          emoji: modelInfo?.emoji || '🤖'
        });
      }
    }

    return result.length > 0 ? result : featuredModels;

  } catch (error) {
    console.error('Error fetching trending models from OpenRouter:', error);
    
    // Fallback vers les derniers modèles connus de la page d'accueil
    return [
      { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Modèle trending #1', emoji: '🔥' },
      { id: 'openai/gpt-5-chat', name: 'GPT-5 Chat', desc: 'Nouveau modèle OpenAI', emoji: '✨' },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', desc: 'Modèle Anthropic avancé', emoji: '🧠' }
    ];
  }
};