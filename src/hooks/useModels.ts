import { useState, useEffect } from 'react';

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
    image: string;
  };
  context_length: number;
}

export const useModels = () => {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://openrouter.ai/api/v1/models?max_price=0&order=top-weekly');
        const data = await response.json();
        
        // Filtrer les modèles gratuits (prix = 0)
        const freeModels = data.data.filter((model: OpenRouterModel) => 
          parseFloat(model.pricing.prompt) === 0 && 
          parseFloat(model.pricing.completion) === 0
        );
        
        // Transformer les données pour correspondre à notre format
        const formattedModels = freeModels.map((model: OpenRouterModel) => ({
          id: model.id,
          name: model.name,
          description: model.description || 'Modèle gratuit disponible sur OpenRouter',
          context_length: model.context_length
        }));
        
        setModels(formattedModels);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des modèles:', err);
        setError('Impossible de charger les modèles. Utilisation des modèles par défaut.');
        // Modèles par défaut en cas d'erreur
        setModels([
          { id: 'meta-llama/Llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', description: 'Rapide et efficace', context_length: 128000 },
          { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', description: 'Excellent pour le français', context_length: 32768 },
          { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', description: 'Polyvalent et précis', context_length: 8192 },
          { id: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', name: 'Nous Hermes 2 Mixtral 8x7B DPO', description: 'Très performant', context_length: 32768 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, loading, error };
};