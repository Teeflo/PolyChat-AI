

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const fetchAIResponse = async (
  messages: { content: string, role: string }[],
  apiKey: string,
  model: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    // Préparer les messages pour l'API en excluant les propriétés spécifiques à l'interface
    const apiMessages = messages.map(({ content, role }) => ({ content, role }));
    
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
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;

      // Provide more specific error messages for common issues
      if (response.status === 401) {
        throw new Error('API key is invalid or expired. Please check your OpenRouter API key.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Your API key may not have the required permissions.');
      } else if (response.status === 404) {
        throw new Error('User not found. Please verify your OpenRouter account and API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to fetch AI response: ${e.message}`);
    }
    throw new Error('An unknown error occurred while fetching AI response');
  }
};

// Streaming support: yields partial text chunks as they arrive
export async function streamAIResponse(
  messages: { content: string, role: string }[],
  apiKey: string,
  model: string,
  onChunk: (chunk: { content?: string; images?: any[] }) => void,
  systemPrompt?: string,
  abortController?: AbortController
): Promise<string> {
  const apiMessages = messages.map(({ content, role }) => ({ content, role }));
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
      body: JSON.stringify({ model, messages: apiMessages, stream: true, modalities: ["image", "text"] }),
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
    } catch (e: any) {
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
            console.log('API Response Payload:', payload);
            if (!payload) continue;
            if (payload === '[DONE]') { buffer=''; break; }
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta;
              if (delta) {
                const chunk: { content?: string; images?: any[] } = {};
                if (delta.content) {
                  full += delta.content;
                  chunk.content = delta.content;
                }
                if (delta.images) {
                    // Pass the full image objects, not just URLs
                    chunk.images = delta.images;
                }
                if (chunk.content || chunk.images) {
                    onChunk(chunk);
                }
              }
            } catch {
              full += payload;
              onChunk({ content: payload });
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

  } catch (e) {
    console.error('Error fetching trending models from OpenRouter:', e);
    
    // Fallback vers les derniers modèles connus de la page d'accueil
    return [
      { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Modèle trending #1', emoji: '🔥' },
      { id: 'openai/gpt-5-chat', name: 'GPT-5 Chat', desc: 'Nouveau modèle OpenAI', emoji: '✨' },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', desc: 'Modèle Anthropic avancé', emoji: '🧠' }
    ];
  }
};

// Image generation functions
export const generateImageReliable = async (
  prompt: string,
  apiKey: string,
  model: string = 'stability-ai/sdxl'
): Promise<string> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PolyChat AI',
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: '1024x1024'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Image generation error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0]?.url || '';
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to generate image: ${e.message}`);
    }
    throw new Error('An unknown error occurred while generating image');
  }
};

export const getImageModels = async (): Promise<Array<{id: string, name: string}>> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    const models: OpenRouterModel[] = data.data || [];

    // Filter for image generation models
    return models
      .filter(model => model.architecture?.modality?.includes('image'))
      .map(model => ({
        id: model.id,
        name: model.name
      }));
  } catch (e) {
    console.error('Error fetching image models:', e);
    return [];
  }
};

export const testImageModels = async (apiKey: string): Promise<boolean> => {
  try {
    const models = await getImageModels();
    if (models.length === 0) return false;

    // Test with a simple prompt using multimodal for compatible models
    const modelId = models[0].id;
    const useMultimodal = modelId.includes('gemini') || modelId.includes('gpt-4o');
    await generateImage('test image', apiKey, modelId, useMultimodal);
    return true;
  } catch (e) {
    console.error('Error testing image models:', e);
    return false;
  }
};

export const listAllModels = async (): Promise<OpenRouterModel[]> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    return data.data || [];
  } catch (e) {
    console.error('Error fetching all models:', e);
    return [];
  }
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (e) {
    console.error('Error validating API key:', e);
    return false;
  }
};

// Diagnostic function to help users troubleshoot API key issues
export const diagnoseApiKey = async (apiKey?: string): Promise<{valid: boolean, message: string, suggestions: string[]}> => {
  const result = {
    valid: false,
    message: '',
    suggestions: [] as string[]
  };

  // Check if API key is provided
  if (!apiKey || apiKey.trim() === '') {
    result.message = 'Aucune clé API fournie';
    result.suggestions = [
      'Allez dans les paramètres (icône ⚙️)',
      'Cliquez sur "Clé API OpenRouter"',
      'Entrez votre clé API OpenRouter',
      'Votre clé doit commencer par "sk-or-v1-"'
    ];
    return result;
  }

  // Check API key format
  if (!apiKey.startsWith('sk-or-v1-')) {
    result.message = 'Format de clé API invalide';
    result.suggestions = [
      'Votre clé API doit commencer par "sk-or-v1-"',
      'Vérifiez que vous avez copié la clé complète depuis OpenRouter',
      'Créez une nouvelle clé API sur https://openrouter.ai/keys si nécessaire'
    ];
    return result;
  }

  // Test the API key
  try {
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      result.valid = true;
      result.message = 'Clé API valide';
      result.suggestions = ['Votre configuration est correcte !'];
    } else {
      result.message = 'Clé API rejetée par OpenRouter';
      result.suggestions = [
        'Vérifiez que votre clé API n\'a pas expiré',
        'Assurez-vous que votre compte OpenRouter est actif',
        'Vérifiez que vous avez des crédits disponibles',
        'Créez une nouvelle clé API si nécessaire'
      ];
    }
  } catch {
    result.message = 'Erreur lors de la validation de la clé API';
    result.suggestions = [
      'Vérifiez votre connexion internet',
      'Réessayez dans quelques minutes',
      'Contactez le support OpenRouter si le problème persiste'
    ];
  }

  return result;
};

// Multimodal image generation using chat completions API
export const generateMultimodalImage = async (
  prompt: string,
  apiKey: string,
  model: string = 'google/gemini-2.5-flash-image-preview:free'
): Promise<string> => {
  try {
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
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ],
        max_tokens: 4096
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Multimodal image generation error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse multimodal response to extract image URL
    if (typeof content === 'string') {
      // Try to extract URL from text response
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif)/i);
      if (urlMatch) {
        return urlMatch[0];
      }
    } else if (Array.isArray(content)) {
      // Handle array response (multimodal content parts)
      for (const part of content) {
        if (part.type === 'image_url' && part.image_url?.url) {
          return part.image_url.url;
        }
      }
    }

    throw new Error('No image URL found in multimodal response');
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to generate multimodal image: ${e.message}`);
    }
    throw new Error('An unknown error occurred while generating multimodal image');
  }
};

// Unified image generation function that chooses the appropriate method
export const generateImage = async (
  prompt: string,
  apiKey: string,
  model: string,
  useMultimodal: boolean = false
): Promise<string> => {
  if (useMultimodal) {
    return generateMultimodalImage(prompt, apiKey, model);
  } else {
    return generateImageReliable(prompt, apiKey, model);
  }
};