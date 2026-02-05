import { useState, useEffect, useMemo } from 'react';
import {
  fetchAvailableModels,
  fetchAllAvailableModels,
  getPriceCategory,
} from '../services/modelsApi';
import type { OpenRouterModel, ModelFilters } from '../services/modelsApi';

export const useModels = () => {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ModelFilters>({
    searchTerm: '',
    provider: 'all',
    contextLength: 'all',
    priceRange: 'all',
  });

  // Récupération initiale des modèles
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Essayer d'abord de récupérer tous les modèles avec pagination
        let allModels: OpenRouterModel[];

        try {
          allModels = await fetchAllAvailableModels();
        } catch {
          allModels = await fetchAvailableModels();
        }

        setModels(allModels);

        // Ne pas auto-sélectionner de modèle - l'utilisateur choisira dans l'onboarding
      } catch {
        setError('Impossible de charger les modèles depuis OpenRouter');

        // Utiliser des modèles par défaut en cas d'erreur
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Filtrage des modèles basé sur les filtres actuels
  const filteredModels = useMemo(() => {
    let result = models;

    // Recherche textuelle
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (model) =>
          model.id.toLowerCase().includes(searchLower) ||
          model.name?.toLowerCase().includes(searchLower) ||
          model.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par fournisseur
    if (filters.provider && filters.provider !== 'all') {
      result = result.filter((model) => {
        const provider = model.id.split('/')[0];
        return provider === filters.provider;
      });
    }

    // Filtre par longueur de contexte
    if (filters.contextLength && filters.contextLength !== 'all') {
      result = result.filter((model) => {
        const contextLength = model.context_length || 0;
        switch (filters.contextLength) {
          case 'short':
            return contextLength <= 8192;
          case 'medium':
            return contextLength > 8192 && contextLength <= 32768;
          case 'long':
            return contextLength > 32768;
          default:
            return true;
        }
      });
    }

    // Filtre par prix
    if (filters.priceRange && filters.priceRange !== 'all') {
      result = result.filter((model) => {
        const priceCategory = getPriceCategory(model);
        return priceCategory === filters.priceRange;
      });
    }

    return result;
  }, [models, filters]);

  // Fournisseurs disponibles
  const availableProviders = useMemo(() => {
    const providers = new Set<string>();

    models.forEach((model) => {
      const provider = model.id.split('/')[0];
      if (provider) {
        providers.add(provider);
      }
    });

    return Array.from(providers).sort();
  }, [models]);

  // Fonction pour mettre à jour les filtres
  const updateFilters = (newFilters: Partial<ModelFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Fonction pour recharger les modèles
  const refreshModels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Utiliser la même logique que le chargement initial
      let freshModels: OpenRouterModel[];

      try {
        freshModels = await fetchAllAvailableModels();
      } catch {
        freshModels = await fetchAvailableModels();
      }

      setModels(freshModels);
    } catch {
      setError('Impossible de recharger les modèles');
    } finally {
      setLoading(false);
    }
  };

  return {
    models: filteredModels,
    allModels: models,
    loading,
    error,
    filters,
    availableProviders,
    updateFilters,
    refreshModels,
  };
};
