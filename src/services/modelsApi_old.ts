// Service pour récupérer les modèles depuis l'API OpenRouter

export inte      console.log(`📄 ${allModels.length} modèles récupérés depuis l'API`);
      
      // Déduplication par ID pour être sûr
      const uniqueModels = allModels.filter((model, index, array) => 
        array.findIndex(m => m.id === model.id) === index
      );
      
      console.log(`🔍 ${uniqueModels.length} modèles uniques après déduplication`);
      
      console.log(`✅ ${uniqueModels.length} modèles uniques récupérés au total`);
      
      // Filtrer les modèles valides
      const validModels = uniqueModels.filter((model: OpenRouterModel) => {del {
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

export interface ModelFilters {
  searchTerm: string;
  provider: string;
  contextLength: string;
  priceRange: string;
}

export type PriceRange = 'free' | 'cheap' | 'moderate' | 'premium' | 'all';

export interface ModelsResponse {
  data: OpenRouterModel[];
}

/**
 * Récupère tous les modèles disponibles avec une seule requête optimisée
 */
export async function fetchAllAvailableModels(): Promise<OpenRouterModel[]> {
  try {
    console.log('🔄 Récupération de TOUS les modèles depuis OpenRouter...');
    
    const params = new URLSearchParams();
    params.append('limit', '400'); // Limite raisonnable basée sur le nombre réel sur OpenRouter
    params.append('order', 'top-weekly');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    try {
      const response = await fetch(`https://openrouter.ai/api/v1/models?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PolyChat-AI/1.0',
          'HTTP-Referer': window.location.origin,
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }
      
      const data: ModelsResponse = await response.json();
      const allModels = data.data || [];
      
      console.log(`� ${allModels.length} modèles récupérés depuis l'API`);
      
      // Déduplication par ID pour être sûr
      const uniqueModels = allModels.filter((model, index, array) => 
        array.findIndex(m => m.id === model.id) === index
      );
      
      console.log(`� ${uniqueModels.length} modèles uniques après déduplication`);
      
    } catch (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError);
      throw fetchError;
    }
    
    console.log(`✅ ${uniqueModels.length} modèles uniques récupérés au total`);
    
    // Filtrer les modèles valides
    const validModels = allModels.filter(model => {
      if (!model.id || !model.name) return false;
      
      // Accepter les modèles avec architecture manquante mais avoir un fallback
      let supportsText = true;
      if (model.architecture && model.architecture.input_modalities && model.architecture.output_modalities) {
        const inputModalities = model.architecture.input_modalities || [];
        const outputModalities = model.architecture.output_modalities || [];
        supportsText = 
          (inputModalities.length === 0 || inputModalities.includes('text')) &&
          (outputModalities.length === 0 || outputModalities.includes('text'));
      }
      
      return supportsText;
    });
    
    console.log(`🎯 ${validModels.length} modèles valides après filtrage`);
    return validModels;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de tous les modèles:', error);
    // Fallback vers la méthode simple
    return fetchAvailableModels();
  }
}

/**
 * Récupère la liste des modèles depuis l'API OpenRouter
 * Utilise une limite raisonnable pour éviter les doublons
 */
export async function fetchAvailableModels(filters?: Partial<ModelFilters>): Promise<OpenRouterModel[]> {
  try {
    console.log('🔄 Récupération des modèles depuis OpenRouter...', filters);
    
    // Construire les paramètres de requête de base
    const params = new URLSearchParams();
    // Limite raisonnable pour récupérer la plupart des modèles populaires
    params.append('limit', '400'); // Récupérer jusqu'à 400 modèles en une seule requête
    params.append('order', 'top-weekly'); // Trier par popularité
    
    // Ne pas filtrer par prix côté API pour avoir plus de modèles
    // Le filtrage se fera côté client pour plus de flexibilité
    
    // Timeout de 30 secondes pour permettre la récupération de plus de modèles
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`https://openrouter.ai/api/v1/models?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PolyChat-AI/1.0',
        'HTTP-Referer': window.location.origin,
        'Cache-Control': 'max-age=300', // Cache pendant 5 minutes
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data: ModelsResponse = await response.json();
    console.log(`📊 ${data.data.length} modèles récupérés depuis l'API`);
    
    // Filtrer les modèles selon les critères (côté client pour plus de flexibilité)
    const filteredModels = data.data
      .filter(model => {
        try {
          // Vérifications de sécurité de base
          if (!model.id || !model.name) {
            return false;
          }
          
          // Accepter tous les modèles qui ont des modalités de base
          // Être plus permissif sur les modalités
          let supportsText = true;
          if (model.architecture && model.architecture.input_modalities && model.architecture.output_modalities) {
            const inputModalities = model.architecture.input_modalities || [];
            const outputModalities = model.architecture.output_modalities || [];
            supportsText = 
              inputModalities.includes('text') &&
              outputModalities.includes('text');
          }
          
          if (!supportsText) return false;
          
          // Filtrer par recherche si spécifiée
          if (filters?.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const matchesSearch = 
              model.id.toLowerCase().includes(searchLower) ||
              model.name?.toLowerCase().includes(searchLower) ||
              model.description?.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }
          
          // Filtrer par fournisseur si spécifié
          if (filters?.provider && filters.provider !== 'all') {
            const provider = model.id.split('/')[0];
            if (provider !== filters.provider) return false;
          }
          
          // Filtrer par longueur de contexte si spécifiée
          if (filters?.contextLength && filters.contextLength !== 'all') {
            const contextLength = model.context_length || 0;
            switch (filters.contextLength) {
              case 'short':
                if (contextLength > 8192) return false;
                break;
              case 'medium':
                if (contextLength <= 8192 || contextLength > 32768) return false;
                break;
              case 'long':
                if (contextLength <= 32768) return false;
                break;
            }
          }
          
          return true;
        } catch (err) {
          console.warn(`⚠️ Erreur lors du filtrage du modèle ${model.id}:`, err);
          return false;
        }
      })
      .sort((a, b) => (b.created || 0) - (a.created || 0)) // Plus récents en premier
      .slice(0, 50); // Limiter à 50 modèles pour éviter une liste trop longue
    
    console.log(`✅ ${filteredModels.length} modèles filtrés et sélectionnés`);
    
    if (filteredModels.length === 0) {
      console.warn('⚠️ Aucun modèle trouvé avec ces filtres, utilisation des modèles par défaut');
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
  const promptPrice = parseFloat(model.pricing.prompt || '0');
  const completionPrice = parseFloat(model.pricing.completion || '0');
  
  if (promptPrice === 0 && completionPrice === 0) {
    return 'Gratuit';
  }
  
  if (promptPrice < 0.001 && completionPrice < 0.001) {
    return 'Très peu cher';
  }
  
  if (promptPrice < 0.01 && completionPrice < 0.01) {
    return 'Abordable';
  }
  
  return `$${promptPrice.toFixed(6)}/$${completionPrice.toFixed(6)} par 1k tokens`;
}

/**
 * Obtient la catégorie de prix d'un modèle
 */
export function getPriceCategory(model: OpenRouterModel): PriceRange {
  const promptPrice = parseFloat(model.pricing.prompt || '0');
  const completionPrice = parseFloat(model.pricing.completion || '0');
  
  if (promptPrice === 0 && completionPrice === 0) {
    return 'free';
  }
  
  if (promptPrice < 0.001 && completionPrice < 0.001) {
    return 'cheap';
  }
  
  if (promptPrice < 0.01 && completionPrice < 0.01) {
    return 'moderate';
  }
  
  return 'premium';
}

/**
 * Obtient la liste des fournisseurs disponibles
 */
export function getAvailableProviders(models: OpenRouterModel[]): string[] {
  const providers = new Set<string>();
  models.forEach(model => {
    const provider = model.id.split('/')[0];
    if (provider) {
      providers.add(provider);
    }
  });
  return Array.from(providers).sort();
}

/**
 * Recherche de modèles avec déduplication intelligente
 */
export function searchModels(models: OpenRouterModel[], query: string): OpenRouterModel[] {
  if (!query.trim()) return models;
  
  const searchTerm = query.toLowerCase().trim();
  const results = models.filter(model => {
    const searchFields = [
      model.id,
      model.name,
      model.description,
      model.id.split('/')[0], // provider
      model.id.split('/')[1]  // model name
    ].filter(Boolean);
    
    return searchFields.some(field => 
      field.toLowerCase().includes(searchTerm)
    );
  });
  
  // Trier par pertinence : exact match > starts with > contains
  return results.sort((a, b) => {
    const aName = (a.name || a.id).toLowerCase();
    const bName = (b.name || b.id).toLowerCase();
    
    // Exact match
    if (aName === searchTerm) return -1;
    if (bName === searchTerm) return 1;
    
    // Starts with
    if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
    if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
    
    // Alphabetical
    return aName.localeCompare(bName);
  });
}
