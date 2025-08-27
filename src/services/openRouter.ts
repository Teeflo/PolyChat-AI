import type { Message, MessageContent } from '../types/index';



const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const fetchAIResponse = async (
  messages: Message[],
  apiKey: string,
  model: string,
  systemPrompt?: string
): Promise<string | MessageContent[]> => {
  try {
    const apiMessages = messages.map(({ id, timestamp, modelId, streaming, imageData, ...message }) => {
      let content = '';
      if (typeof message.content === 'string') {
        content = message.content;
      } else if (Array.isArray(message.content)) {
        content = message.content.filter(item => item.type === 'text').map(item => item.text || '').join(' ');
      }
      return { ...message, content };
    });

    if (systemPrompt && systemPrompt.trim()) {
      apiMessages.unshift({
        role: 'system',
        content: systemPrompt.trim(),
      });
    }

    const payload: any = {
      model,
      messages: apiMessages,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PolyChat AI',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🎨 OpenRouter Response:', JSON.stringify(data, null, 2));

    const message = data.choices[0].message;
    const textResponse = message.content || '';

    if (message.images && Array.isArray(message.images) && message.images.length > 0) {
      console.log('🎨 Found images in response:', message.images);
      const content: MessageContent[] = [];

      if (textResponse) {
        content.push({ type: 'text', text: textResponse });
      }

      for (const imageItem of message.images) {
        let imageUrl = '';
        if (typeof imageItem === 'string') {
          imageUrl = imageItem;
        } else if (imageItem?.image_url?.url) {
          imageUrl = imageItem.image_url.url;
        } else if (imageItem?.url) {
          imageUrl = imageItem.url;
        }

        if (imageUrl) {
          content.push({ type: 'image_url', image_url: { url: imageUrl } });
        }
      }

      if (content.length > 0) {
        return content;
      }
    }

    return textResponse;

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
): Promise<string | MessageContent[]> {
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

// Récupérer les modèles d'image uniquement
export const getImageModels = async (): Promise<Array<{id: string, name: string, desc: string, emoji: string}>> => {
  try {
    console.log('🎨 Fetching image models from OpenRouter API...');

    // Récupérer tous les modèles puis filtrer côté client
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models API');
    }

    const data = await response.json();
    const allModels: OpenRouterModel[] = data.data || [];

    // Filtrer uniquement les modèles qui peuvent générer des images (text+image->text+image)
    const imageModels = allModels.filter(model => {
      const modality = model.architecture?.modality;
      return modality === 'text+image->text+image';
    });

    console.log(`🎨 Found ${imageModels.length} true image generation models out of ${allModels.length} total models`);

    const result: Array<{id: string, name: string, desc: string, emoji: string}> = [];

    // Ajouter uniquement les vrais modèles de génération d'images
    for (const imageModel of imageModels) {
      console.log(`🎨 Image model: ${imageModel.id} - ${imageModel.name} (${imageModel.architecture?.modality})`);

      result.push({
        id: imageModel.id,
        name: imageModel.name || imageModel.id.split('/').pop() || 'Unknown Model',
        desc: 'Génération d\'images IA',
        emoji: '🎨'
      });
    }

    // Si aucun modèle d'image trouvé, utiliser des modèles connus qui supportent la génération d'images
    if (result.length === 0) {
      console.log('🎨 No image generation models found, using known image-capable models...');

      // Liste des modèles connus qui peuvent générer des images
      const knownImageModels = [
        'google/gemini-2.5-flash-image-preview:free',
        'google/gemini-2.5-flash-image-preview',
        'google/gemini-2.5-flash-exp-03-25',
        'openai/gpt-4o',
        'openai/gpt-4o-mini',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3.7-sonnet'
      ];

      // Vérifier lesquels de ces modèles existent dans la liste complète
      for (const modelId of knownImageModels) {
        const existingModel = allModels.find(model => model.id === modelId);
        if (existingModel) {
          result.push({
            id: existingModel.id,
            name: existingModel.name || existingModel.id.split('/').pop() || 'Unknown Model',
            desc: 'Génération d\'images IA',
            emoji: '🎨'
          });
        }
      }

      // Si toujours aucun modèle trouvé, utiliser des valeurs par défaut
      if (result.length === 0) {
        console.log('🎨 Using fallback image models...');
        result.push(
          { id: 'google/gemini-2.5-flash-image-preview:free', name: 'Gemini 2.5 Flash Image', desc: 'Génération d\'images IA avancée', emoji: '🎨' },
          { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Modèle multimodal OpenAI', emoji: '🎨' }
        );
      }
    }

    console.log('🎨 Returning filtered image models:', result);
    return result;

  } catch (error) {
    console.error('Error fetching image models from OpenRouter:', error);

    // Fallback vers les modèles connus qui supportent la génération d'images
    return [
      { id: 'google/gemini-2.5-flash-image-preview:free', name: 'Gemini 2.5 Flash Image', desc: 'Génération d\'images IA avancée', emoji: '🎨' },
      { id: 'google/gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash Image Pro', desc: 'Génération d\'images IA premium', emoji: '🎨' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Modèle multimodal OpenAI', emoji: '🎨' }
    ];
  }
};

// Récupérer les modèles trending de la page d'accueil OpenRouter (modèles généraux)
export const getTopWeeklyModels = async (): Promise<Array<{id: string, name: string, desc: string, emoji: string}>> => {
  try {
    console.log('🔥 Fetching trending models from OpenRouter API...');

    // Récupérer depuis l'API models directement
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
    console.log('🔥 Available models count:', models.length);

    // Patterns pour les modèles populaires généraux
    const modelPatterns = [
      {
        regex: /Gemini\s+2\.5\s+Pro/i,
        id: 'google/gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        desc: 'Modèle trending #1',
        emoji: '🔥'
      },
      {
        regex: /GPT-4o/i,
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        desc: 'Le plus polyvalent',
        emoji: '🎯'
      },
      {
        regex: /Claude\s+3\.5/i,
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        desc: 'Excellent pour l\'écriture',
        emoji: '✍️'
      },
      {
        regex: /GPT-4o\s+mini/i,
        id: 'openai/gpt-4o-mini',
        name: 'GPT-4o Mini',
        desc: 'Rapide et économique',
        emoji: '⚡'
      }
    ];

    const result: Array<{id: string, name: string, desc: string, emoji: string}> = [];

    // Chercher les modèles populaires
    for (const pattern of modelPatterns) {
      const found = models.find(model => model.id === pattern.id);
      if (found) {
        result.push({
          id: found.id,
          name: pattern.name,
          desc: pattern.desc,
          emoji: pattern.emoji
        });
      }
    }

    // Si on n'a pas assez de modèles, ajouter d'autres populaires
    if (result.length < 3) {
      const additionalModels = models
        .filter(model => !result.some(r => r.id === model.id))
        .sort((a, b) => (b.created || 0) - (a.created || 0)) // Trier par date de création
        .slice(0, 3 - result.length);

      for (const model of additionalModels) {
        result.push({
          id: model.id,
          name: model.name || model.id.split('/').pop() || 'Unknown Model',
          desc: 'Modèle populaire',
          emoji: '🤖'
        });
      }
    }

    console.log('🔥 Returning trending models:', result);
    return result;

  } catch (error) {
    console.error('Error fetching trending models from OpenRouter:', error);

    // Fallback vers des modèles populaires connus
    return [
      { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Le plus polyvalent', emoji: '🎯' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Excellent pour l\'écriture', emoji: '✍️' },
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Rapide et économique', emoji: '⚡' }
    ];
  }
};

// Fonction de test pour vérifier les modèles d'image disponibles
export const testImageModels = async (): Promise<void> => {
  try {
    console.log('🎨 Testing image models availability...');

    // 1. Tester le filtre direct OpenRouter
    console.log('🎨 1. Using OpenRouter filter: ?output_modalities=image');
    const imageResponse = await fetch('https://openrouter.ai/api/v1/models?output_modalities=image', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const imageModels: OpenRouterModel[] = imageData.data || [];
      console.log(`🎨 Direct filter returned: ${imageModels.length} models`);

      imageModels.forEach(model => {
        console.log(`  - ${model.id}: ${model.name}`);
        console.log(`    Modality: ${model.architecture?.modality || 'N/A'}`);
        console.log(`    Image pricing: ${model.pricing?.image || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('🎨 Direct filter failed, using fallback method...');
    }

    // 2. Tester tous les modèles avec analyse détaillée
    console.log('🎨 2. Analyzing all models...');
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

    console.log(`🎨 Total models available: ${models.length}`);

    // Lister tous les modèles avec leurs modalities
    console.log('🎨 3. Modality distribution:');
    const modalityGroups: Record<string, number> = {};

    models.forEach(model => {
      const modality = model.architecture?.modality || 'unknown';
      modalityGroups[modality] = (modalityGroups[modality] || 0) + 1;
    });

    Object.entries(modalityGroups).forEach(([modality, count]) => {
      console.log(`  - ${modality}: ${count} models`);
    });

    // 3. Chercher spécifiquement les modèles de génération d'images
    console.log('🎨 4. True image generation models found:');
    const imageGenerationModels = models.filter(model => {
      const modality = model.architecture?.modality;
      return modality === 'text+image->text+image';
    });

    console.log(`🎨 Found ${imageGenerationModels.length} true image generation models:`);
    imageGenerationModels.forEach(model => {
      console.log(`  - ${model.id}: ${model.name}`);
      console.log(`    Modality: ${model.architecture?.modality || 'N/A'}`);
      console.log(`    Image pricing: ${model.pricing?.image || 'N/A'}`);
      console.log('');
    });

    // 4. Lister aussi les modèles de vision uniquement
    console.log('🎨 5. Vision-only models (text+image->text):');
    const visionOnlyModels = models.filter(model => {
      const modality = model.architecture?.modality;
      return modality === 'text+image->text';
    });

    console.log(`🎨 Found ${visionOnlyModels.length} vision-only models:`);
    visionOnlyModels.slice(0, 10).forEach(model => { // Limiter l'affichage
      console.log(`  - ${model.id}: ${model.name}`);
    });
    if (visionOnlyModels.length > 10) {
      console.log(`  ... and ${visionOnlyModels.length - 10} more`);
    }

  } catch (error) {
    console.error('Error testing image models:', error);
  }
};

// Fonction pour vérifier si un modèle peut générer des images
export const isImageGenerationModel = (modelId: string): boolean => {
  // Liste des modèles connus pour la génération d'images
  const imageGenerationModels = [
    'google/gemini-2.5-flash-image-preview:free',
    'google/gemini-2.5-flash-image-preview',
    'google/gemini-2.5-flash-exp-03-25',
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3.7-sonnet'
  ];

  return imageGenerationModels.includes(modelId);
};

// Fonction pour obtenir un message d'erreur informatif pour la génération d'images
export const getImageGenerationError = (modelId: string | undefined): string => {
  if (!modelId) {
    return 'Aucun modèle sélectionné. Veuillez choisir un modèle d\'image dans les paramètres.';
  }

  if (!isImageGenerationModel(modelId)) {
    return `Le modèle "${modelId}" ne supporte pas la génération d'images. Veuillez sélectionner un modèle d'image (comme Gemini 2.5 Flash Image).`;
  }

  return 'Erreur lors de la génération d\'image. Vérifiez votre connexion et votre clé API.';
};

// Fonction pour optimiser les prompts d'image selon les meilleures pratiques OpenRouter
export const optimizeImagePrompt = (prompt: string): string => {
  console.log('🎨 Optimizing image prompt:', prompt);

  // Ajouter des éléments pour améliorer la qualité selon OpenRouter
  let optimizedPrompt = prompt;

  // Si le prompt est court, ajouter des détails
  if (prompt.length < 50) {
    optimizedPrompt += ', highly detailed, professional quality, vibrant colors, sharp focus, high resolution';
  }

  // Ajouter des instructions de style si non spécifiées
  if (!prompt.toLowerCase().includes('style') && !prompt.toLowerCase().includes('digital')) {
    optimizedPrompt += ', digital art style';
  }

  // Ajouter des paramètres de qualité
  if (!prompt.toLowerCase().includes('resolution') && !prompt.toLowerCase().includes('quality')) {
    optimizedPrompt += ', high resolution, photorealistic';
  }

  console.log('🎨 Optimized prompt:', optimizedPrompt);
  return optimizedPrompt;
};

// Fonction pour créer des prompts avancés selon les meilleures pratiques OpenRouter
export const createAdvancedImagePrompt = (
  basePrompt: string,
  options: {
    style?: 'natural' | 'vivid' | 'digital_art' | 'photorealistic' | 'anime' | 'oil_painting' | 'watercolor';
    mood?: 'bright' | 'dark' | 'serene' | 'dramatic' | 'playful' | 'mysterious';
    lighting?: 'natural' | 'studio' | 'dramatic' | 'soft' | 'neon' | 'golden_hour';
    composition?: 'centered' | 'rule_of_thirds' | 'wide_angle' | 'close_up' | 'birds_eye';
    quality?: 'standard' | 'hd' | 'ultra_hd';
  } = {}
): string => {
  let prompt = basePrompt;

  // Ajouter le style
  if (options.style) {
    const styleDescriptions = {
      natural: 'natural photography style',
      vivid: 'vivid and colorful digital art',
      digital_art: 'digital art style with clean lines',
      photorealistic: 'photorealistic, highly detailed',
      anime: 'anime style with vibrant colors',
      oil_painting: 'oil painting style with texture',
      watercolor: 'watercolor painting style'
    };
    prompt += `, ${styleDescriptions[options.style]}`;
  }

  // Ajouter l'ambiance
  if (options.mood) {
    const moodDescriptions = {
      bright: 'bright and cheerful atmosphere',
      dark: 'dark and moody atmosphere',
      serene: 'serene and peaceful atmosphere',
      dramatic: 'dramatic and intense atmosphere',
      playful: 'playful and fun atmosphere',
      mysterious: 'mysterious and enigmatic atmosphere'
    };
    prompt += `, ${moodDescriptions[options.mood]}`;
  }

  // Ajouter l'éclairage
  if (options.lighting) {
    const lightingDescriptions = {
      natural: 'natural lighting',
      studio: 'professional studio lighting',
      dramatic: 'dramatic lighting with strong shadows',
      soft: 'soft and diffused lighting',
      neon: 'neon lighting with vibrant colors',
      golden_hour: 'golden hour lighting'
    };
    prompt += `, ${lightingDescriptions[options.lighting]}`;
  }

  // Ajouter la composition
  if (options.composition) {
    const compositionDescriptions = {
      centered: 'centered composition',
      rule_of_thirds: 'rule of thirds composition',
      wide_angle: 'wide angle view',
      close_up: 'close-up view with details',
      birds_eye: 'bird\'s eye view'
    };
    prompt += `, ${compositionDescriptions[options.composition]}`;
  }

  // Ajouter la qualité
  if (options.quality) {
    const qualityDescriptions = {
      standard: 'good quality',
      hd: 'high definition, detailed',
      ultra_hd: 'ultra high definition, extremely detailed'
    };
    prompt += `, ${qualityDescriptions[options.quality]}`;
  }

  // Toujours ajouter des éléments de qualité de base
  prompt += ', professional quality, sharp focus, well-composed';

  return prompt;
};

// Fonction spécialisée pour la génération d'images avec paramètres optimaux
export const generateImage = async (
  prompt: string,
  apiKey: string,
  model: string = 'google/gemini-2.5-flash-image-preview:free',
  options: {
    size?: '1024x1024' | '512x512' | '256x256';
    style?: 'natural' | 'vivid' | 'digital_art';
    quality?: 'standard' | 'hd';
  } = {}
): Promise<string | MessageContent[]> => {
  try {
    console.log('🎨 Generating image with prompt:', prompt);
    console.log('🎨 Using model:', model);
    console.log('🎨 Options:', options);

    // Vérifier que le modèle supporte la génération d'images
    if (!isImageGenerationModel(model)) {
      throw new Error(`Le modèle ${model} ne supporte pas la génération d'images`);
    }

    // Optimiser le prompt
    const optimizedPrompt = optimizeImagePrompt(prompt);

    // Créer le message système spécialisé pour la génération d'images
    const systemPrompt = `You are an expert AI image generator. Create high-quality images based on user descriptions.
    Always respond with a complete image description and provide the image in the response.
    Focus on: composition, lighting, colors, style, and technical quality.`;

    // Créer le message utilisateur optimisé
    const userMessage = `Generate an image with this description: "${optimizedPrompt}"

Please create a high-quality image that captures all the visual elements and mood described. Make it professionally composed with excellent lighting and colors.`;

    const messages: Message[] = [
      {
        id: `img-gen-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }
    ];

    // Appeler l'API avec les paramètres d'image
    const response = await fetchAIResponse(messages, apiKey, model, systemPrompt);

    console.log('🎨 Image generation response:', response);
    return response;

  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Erreur lors de la génération d'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

// Fonction de génération d'image fiable avec retry automatique et fallback
export const generateImageReliable = async (
  prompt: string,
  apiKey: string,
  primaryModel?: string,
  options: {
    maxRetries?: number;
    fallbackModels?: string[];
    size?: '1024x1024' | '512x512' | '256x256';
    style?: 'natural' | 'vivid' | 'digital_art';
    quality?: 'standard' | 'hd';
  } = {}
): Promise<string | MessageContent[]> => {
  const {
    maxRetries = 3,
    fallbackModels = [
      'google/gemini-2.5-flash-image-preview:free',
      'google/gemini-2.5-flash-image-preview',
      'google/gemini-2.5-flash-exp-03-25',
      'openai/gpt-4o',
      'anthropic/claude-3.5-sonnet'
    ],
    ...generationOptions
  } = options;

  // Liste des modèles à essayer (modèle primaire en premier)
  const modelsToTry = primaryModel
    ? [primaryModel, ...fallbackModels.filter(m => m !== primaryModel)]
    : fallbackModels;

  let lastError: Error | null = null;

  console.log('🎯 Starting reliable image generation...');
  console.log('🎯 Prompt:', prompt);
  console.log('🎯 Models to try:', modelsToTry);

  // Essayer chaque modèle avec retry
  for (const model of modelsToTry) {
    console.log(`🎯 Trying model: ${model}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎯 Attempt ${attempt}/${maxRetries} with ${model}`);

        // Vérifier la validité de la clé API avant chaque tentative
        if (!apiKey || apiKey.trim().length < 10) {
          throw new Error('Clé API manquante ou invalide');
        }

        const result = await generateImage(prompt, apiKey, model, generationOptions);

        // Vérifier que le résultat contient bien une image
        if (Array.isArray(result)) {
          const hasImage = result.some(part =>
            part.type === 'image_url' && part.image_url?.url
          );
          if (hasImage) {
            console.log(`✅ Image successfully generated with ${model} on attempt ${attempt}`);
            return result;
          }
        } else if (typeof result === 'string') {
          // Vérifier si la réponse texte contient une URL d'image
          const imageUrlMatch = result.match(/https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif)/i);
          if (imageUrlMatch) {
            console.log(`✅ Image URL found in response from ${model} on attempt ${attempt}`);
            return result;
          }
        }

        // Si on arrive ici, le modèle n'a pas généré d'image valide
        throw new Error(`Le modèle ${model} n'a pas généré d'image valide`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.warn(`⚠️ Attempt ${attempt} failed for ${model}: ${errorMessage}`);

        lastError = error instanceof Error ? error : new Error(errorMessage);

        // Attendre avant le prochain retry (sauf pour le dernier)
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.log(`❌ All attempts failed for model ${model}`);
  }

  // Si tous les modèles ont échoué, créer une réponse d'erreur informative
  const errorMessage = `Impossible de générer l'image après avoir essayé ${modelsToTry.length} modèles avec ${maxRetries} tentatives chacun. Dernière erreur: ${lastError?.message || 'Erreur inconnue'}`;

  console.error('🚨 All image generation attempts failed:', errorMessage);

  // Retourner une réponse d'erreur structurée
  return [
    {
      type: 'text',
      text: `❌ Erreur de génération d'image: ${errorMessage}

Suggestions:
• Vérifiez votre connexion internet
• Vérifiez que votre clé API OpenRouter est valide
• Essayez avec un prompt plus simple
• Réessayez dans quelques instants

Le système a automatiquement essayé plusieurs modèles et méthodes pour garantir la génération de votre image.`
    }
  ];
};

// Fonction utilitaire pour valider une clé API OpenRouter
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
};

// Fonction pour créer une image de secours si tout échoue
export const createFallbackImage = (prompt: string): MessageContent[] => {
  console.log('🎨 Creating fallback image response for prompt:', prompt);

  return [
    {
      type: 'text',
      text: `🎨 Image demandée: "${prompt}"

Bien que la génération automatique ait rencontré des difficultés, voici une description détaillée de l'image que j'aurais créée:

**Description visuelle:**
• Composition professionnelle avec un sujet central bien éclairé
• Palette de couleurs vibrantes et harmonieuses
• Détails techniques de haute qualité
• Style artistique adapté au sujet

**Paramètres techniques:**
• Résolution: 1024×1024 pixels
• Format: PNG avec transparence
• Qualité: Haute définition
• Style: Numérique moderne

Pour obtenir l'image réelle, vous pouvez:
1. Réessayer avec le même prompt
2. Utiliser un prompt plus court et simple
3. Vérifier votre connexion internet
4. Contacter le support si le problème persiste

Le système de génération d'images est conçu pour être extrêmement fiable et utilise plusieurs mécanismes de secours automatiques.`
    }
  ];
};

// Fonction pour lister tous les modèles avec leurs modalities
export const listAllModels = async (): Promise<void> => {
  try {
    console.log('🎨 Fetching all available models...');

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

    console.log(`🎨 Total models: ${models.length}`);
    console.log('🎨 First 20 models:');

    models.slice(0, 20).forEach((model, index) => {
      console.log(`${index + 1}. ${model.id}`);
      console.log(`   Name: ${model.name}`);
      console.log(`   Modality: ${model.architecture?.modality || 'N/A'}`);
      console.log(`   Image pricing: ${model.pricing?.image || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error listing all models:', error);
  }
};
