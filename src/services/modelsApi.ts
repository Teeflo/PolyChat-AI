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
 * Récupère tous les modèles disponibles sans limite artificielle
 */
export async function fetchAllAvailableModels(): Promise<OpenRouterModel[]> {
  try {
    console.log('🔄 Récupération de TOUS les modèles depuis OpenRouter...');
    
    const params = new URLSearchParams();
    // Suppression de la limite artificielle - récupérer tous les modèles disponibles
    params.append('order', 'top-weekly');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
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
    
    console.log(`📊 ${allModels.length} modèles récupérés depuis l'API`);
    
    // Déduplication par ID pour être sûr (éviter les doublons)
    const uniqueModels = allModels.filter((model, index, array) => 
      array.findIndex(m => m.id === model.id) === index
    );
    
    console.log(`🔧 ${uniqueModels.length} modèles uniques après déduplication`);
    
    // Filtrer les modèles valides
    const validModels = uniqueModels.filter((model: OpenRouterModel) => {
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
 * Sans limite artificielle pour récupérer tous les modèles
 */
export async function fetchAvailableModels(filters?: Partial<ModelFilters>): Promise<OpenRouterModel[]> {
  try {
    console.log('🔄 Récupération des modèles depuis OpenRouter...', filters);
    
    // Construire les paramètres de requête de base
    const params = new URLSearchParams();
    // Suppression de la limite artificielle
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
              (inputModalities.length === 0 || inputModalities.includes('text')) &&
              (outputModalities.length === 0 || outputModalities.includes('text'));
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
      .sort((a, b) => {
        // Trier par date de création (plus récent d'abord). Fallback sur nom ensuite.
        const ca = a.created || 0;
        const cb = b.created || 0;
        if (cb !== ca) return cb - ca;
        return (a.name || a.id).localeCompare(b.name || b.id);
      });
    
    console.log(`✅ ${filteredModels.length} modèles filtrés et triés`);
    return filteredModels;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des modèles:', error);
    
    // Retourner des modèles par défaut en cas d'erreur
    return [];
  }
}

/**
 * Recherche de modèles avec terme de recherche
 */
export async function searchModels(searchTerm: string): Promise<OpenRouterModel[]> {
  if (!searchTerm.trim()) {
    return fetchAvailableModels();
  }
  
  return fetchAvailableModels({ searchTerm });
}

/**
 * Récupère les fournisseurs disponibles
 */
export async function getAvailableProviders(): Promise<string[]> {
  try {
    const models = await fetchAvailableModels();
    const providers = new Set<string>();
    
    models.forEach(model => {
      const provider = model.id.split('/')[0];
      if (provider) {
        providers.add(provider);
      }
    });
    
    return Array.from(providers).sort();
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des fournisseurs:', error);
    return [];
  }
}

/**
 * Récupère les informations de prix d'un modèle avec précision maximale
 */
export function getModelPricing(model: OpenRouterModel): string {
  if (!model.pricing) return 'Prix non disponible';
  
  const promptPrice = parseFloat(model.pricing.prompt) || 0;
  const completionPrice = parseFloat(model.pricing.completion) || 0;
  
  // Vérification stricte pour vraiment gratuit (0 exactement)
  if (promptPrice === 0 && completionPrice === 0) {
    return 'Gratuit';
  }
  
  // Affichage précis des prix réels
  if (promptPrice > 0 || completionPrice > 0) {
    const promptStr = promptPrice > 0 ? `${(promptPrice * 1000000).toFixed(2)}$/1M tokens` : '';
    const completionStr = completionPrice > 0 ? `${(completionPrice * 1000000).toFixed(2)}$/1M tokens` : '';
    
    if (promptPrice > 0 && completionPrice > 0) {
      return `In: ${promptStr} | Out: ${completionStr}`;
    } else if (promptPrice > 0) {
      return `Input: ${promptStr}`;
    } else {
      return `Output: ${completionStr}`;
    }
  }
  
  return 'Prix non disponible';
}

/**
 * Catégorise le prix d'un modèle avec précision stricte
 */
export function getPriceCategory(model: OpenRouterModel): PriceRange {
  if (!model.pricing) return 'premium';
  
  const promptPrice = parseFloat(model.pricing.prompt) || 0;
  const completionPrice = parseFloat(model.pricing.completion) || 0;
  
  // Vérification stricte : VRAIMENT gratuit (0 exactement)
  if (promptPrice === 0 && completionPrice === 0) return 'free';
  
  // Calcul plus précis basé sur le prix moyen par token
  const avgPrice = (promptPrice + completionPrice) / 2;
  
  // Catégories plus strictes et réalistes
  if (avgPrice <= 0.000005) return 'cheap';        // ≤ $5/1M tokens
  if (avgPrice <= 0.00002) return 'moderate';      // ≤ $20/1M tokens  
  return 'premium';                                 // > $20/1M tokens
}

/**
 * Formate le nom d'un modèle pour l'affichage
 */
export function formatModelName(modelId: string): string {
  if (!modelId) return 'Unknown Model';
  
  // Séparer par '/' et prendre la partie après le provider
  const parts = modelId.split('/');
  const modelName = parts.length > 1 ? parts.slice(1).join('/') : modelId;
  
  // Nettoyer le nom en remplaçant les tirets et underscores par des espaces
  return modelName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}
