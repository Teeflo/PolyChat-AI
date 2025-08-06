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
 * Récupère tous les modèles disponibles avec une seule requête optimisée
 */
export async function fetchAllAvailableModels(): Promise<OpenRouterModel[]> {
  try {
    console.log('🔄 Récupération de TOUS les modèles depuis OpenRouter...');
    
    const params = new URLSearchParams();
    params.append('limit', '400'); // Limite raisonnable basée sur le nombre réel sur OpenRouter (~400 modèles)
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
        // Trier par nom pour un affichage cohérent
        return a.name?.localeCompare(b.name) || 0;
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
 * Récupère les informations de prix d'un modèle
 */
export function getModelPricing(model: OpenRouterModel): string {
  if (!model.pricing) return 'Prix non disponible';
  
  const promptPrice = parseFloat(model.pricing.prompt) || 0;
  const completionPrice = parseFloat(model.pricing.completion) || 0;
  
  if (promptPrice === 0 && completionPrice === 0) {
    return 'Gratuit';
  }
  
  const avgPrice = (promptPrice + completionPrice) / 2;
  
  if (avgPrice < 0.000001) return 'Gratuit';
  if (avgPrice < 0.00001) return 'Très peu cher';
  if (avgPrice < 0.0001) return 'Peu cher';
  if (avgPrice < 0.001) return 'Modéré';
  return 'Premium';
}

/**
 * Catégorise le prix d'un modèle
 */
export function getPriceCategory(model: OpenRouterModel): PriceRange {
  if (!model.pricing) return 'premium';
  
  const promptPrice = parseFloat(model.pricing.prompt) || 0;
  const completionPrice = parseFloat(model.pricing.completion) || 0;
  
  if (promptPrice === 0 && completionPrice === 0) return 'free';
  
  const avgPrice = (promptPrice + completionPrice) / 2;
  
  if (avgPrice < 0.000001) return 'free';
  if (avgPrice < 0.00001) return 'cheap';
  if (avgPrice < 0.001) return 'moderate';
  return 'premium';
}
