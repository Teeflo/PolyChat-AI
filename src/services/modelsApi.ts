// Service pour récupérer les modèles depuis l'API OpenRouter

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  created: number;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
    request: string;
    image: string;
  };
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
    instruct_type: string | null;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
  supported_parameters: string[];
}

export interface ModelsResponse {
  data: OpenRouterModel[];
}

/**
 * Récupère la liste des modèles depuis l'API OpenRouter
 * Filtre pour ne garder que les modèles gratuits ou peu chers
 */
export async function fetchAvailableModels(): Promise<OpenRouterModel[]> {
  try {
    console.log('🔄 Récupération des modèles depuis OpenRouter...');
    
    // Essayer avec un timeout de 10 secondes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PolyChat-AI/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data: ModelsResponse = await response.json();
    console.log(`📊 ${data.data.length} modèles récupérés depuis l'API`);
    
    // Filtrer les modèles :
    // 1. Qui supportent le texte en entrée et sortie
    // 2. Qui sont gratuits ou peu chers (prix prompt < 0.001)
    // 3. Trier par popularité (créés récemment en premier)
    const filteredModels = data.data
      .filter(model => {
        try {
          // Vérifications de sécurité
          if (!model.architecture || !model.pricing || !model.id) {
            return false;
          }
          
          // Vérifier que le modèle supporte texte en entrée et sortie
          const inputModalities = model.architecture.input_modalities || [];
          const outputModalities = model.architecture.output_modalities || [];
          const supportsText = 
            inputModalities.includes('text') &&
            outputModalities.includes('text');
          
          // Vérifier le prix (gratuit ou très peu cher)
          const promptPriceStr = model.pricing.prompt || '0';
          const promptPrice = parseFloat(promptPriceStr);
          const isAffordable = isNaN(promptPrice) || promptPrice === 0 || promptPrice < 0.001;
          
          const isValid = supportsText && isAffordable;
          if (isValid) {
            console.log(`✅ Modèle sélectionné: ${model.id} (prix: ${promptPriceStr})`);
          }
          
          return isValid;
        } catch (err) {
          console.warn(`⚠️ Erreur lors du filtrage du modèle ${model.id}:`, err);
          return false;
        }
      })
      .sort((a, b) => (b.created || 0) - (a.created || 0)) // Plus récents en premier
      .slice(0, 50); // Limiter à 50 modèles pour éviter une liste trop longue
    
    console.log(`✅ ${filteredModels.length} modèles filtrés et sélectionnés`);
    
    if (filteredModels.length === 0) {
      console.warn('⚠️ Aucun modèle gratuit trouvé, utilisation des modèles par défaut');
      return getDefaultModels();
    }
    
    return filteredModels;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des modèles:', error);
    
    // Retourner des modèles par défaut en cas d'erreur
    console.log('🔄 Utilisation des modèles par défaut');
    return getDefaultModels();
  }
}

/**
 * Modèles par défaut en cas d'erreur de récupération
 */
function getDefaultModels(): OpenRouterModel[] {
  return [
    {
      id: 'meta-llama/llama-3.1-8b-instruct:free',
      name: 'Llama 3.1 8B Instruct (Free)',
      description: 'Modèle Llama 3.1 8B optimisé pour les instructions, gratuit',
      created: Date.now() / 1000,
      context_length: 131072,
      pricing: {
        prompt: '0',
        completion: '0',
        request: '0',
        image: '0'
      },
      architecture: {
        input_modalities: ['text'],
        output_modalities: ['text'],
        tokenizer: 'Llama',
        instruct_type: 'llama'
      },
      top_provider: {
        context_length: 131072,
        max_completion_tokens: 8192,
        is_moderated: true
      },
      supported_parameters: ['temperature', 'top_p', 'max_tokens']
    },
    {
      id: 'microsoft/phi-3-mini-128k-instruct:free',
      name: 'Phi-3 Mini 128K Instruct (Free)',
      description: 'Modèle Phi-3 Mini avec contexte 128K, gratuit',
      created: Date.now() / 1000 - 86400,
      context_length: 128000,
      pricing: {
        prompt: '0',
        completion: '0',
        request: '0',
        image: '0'
      },
      architecture: {
        input_modalities: ['text'],
        output_modalities: ['text'],
        tokenizer: 'GPT',
        instruct_type: 'phi'
      },
      top_provider: {
        context_length: 128000,
        max_completion_tokens: 4096,
        is_moderated: true
      },
      supported_parameters: ['temperature', 'top_p', 'max_tokens']
    },
    {
      id: 'google/gemini-flash-1.5:free',
      name: 'Gemini Flash 1.5 (Free)',
      description: 'Modèle Gemini Flash 1.5 de Google, rapide et gratuit',
      created: Date.now() / 1000 - 172800,
      context_length: 1000000,
      pricing: {
        prompt: '0',
        completion: '0',
        request: '0',
        image: '0'
      },
      architecture: {
        input_modalities: ['text', 'image'],
        output_modalities: ['text'],
        tokenizer: 'Gemini',
        instruct_type: 'gemini'
      },
      top_provider: {
        context_length: 1000000,
        max_completion_tokens: 8192,
        is_moderated: true
      },
      supported_parameters: ['temperature', 'top_p', 'max_tokens']
    }
  ];
}

/**
 * Formate le nom d'affichage d'un modèle
 */
export function formatModelName(model: OpenRouterModel): string {
  // Si le nom existe déjà et est bien formaté, l'utiliser
  if (model.name && model.name.length > 0) {
    return model.name;
  }
  
  // Sinon, formatter l'ID
  return model.id
    .split('/')
    .map(part => part.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '))
    .join(' - ');
}

/**
 * Obtient les informations de prix formatées
 */
export function getModelPricing(model: OpenRouterModel): string {
  const promptPrice = parseFloat(model.pricing.prompt);
  const completionPrice = parseFloat(model.pricing.completion);
  
  if (promptPrice === 0 && completionPrice === 0) {
    return 'Gratuit';
  }
  
  if (promptPrice < 0.001 && completionPrice < 0.001) {
    return 'Très peu cher';
  }
  
  return `$${promptPrice.toFixed(6)}/$${completionPrice.toFixed(6)}`;
}
