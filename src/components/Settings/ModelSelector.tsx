import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import { 
  fetchAvailableModels, 
  formatModelName, 
  getModelPricing, 
  type OpenRouterModel 
} from '../../services/modelsApi';
import './ModelSelector.css';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel, theme } = useSettings();
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDark = theme === 'dark';

  // Charger les modèles au montage du composant
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedModels = await fetchAvailableModels();
      setModels(fetchedModels);
      
      // Si le modèle actuel n'est pas dans la liste, sélectionner le premier
      if (fetchedModels.length > 0 && !fetchedModels.find(m => m.id === selectedModel)) {
        setSelectedModel(fetchedModels[0].id);
      }
    } catch (err) {
      setError('Erreur lors du chargement des modèles');
      console.error('Erreur chargement modèles:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className={`model-selector ${isDark ? 'dark' : 'light'}`}>
      <div className="ms-header">
        <label htmlFor="model-select" className={`ms-label ${isDark ? 'dark' : 'light'}`}>
          <span className="ms-title">
            <Brain size={16} />
            <span>Modèle d'IA</span>
          </span>
        </label>
        <button
          onClick={loadModels}
          disabled={loading}
          className={`ms-refresh-btn ${isDark ? 'dark' : 'light'}`}
          title="Actualiser la liste des modèles"
          aria-label="Actualiser la liste des modèles"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <RefreshCw size={14} />
          )}
        </button>
      </div>
      
      {error && (
        <div className="ms-error">
          <p id="model-select-error">{error}</p>
        </div>
      )}

      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        disabled={loading || models.length === 0}
        id="model-select"
        name="model-select"
  className={`ms-select ${isDark ? 'dark' : 'light'}`}
  aria-describedby={error ? 'model-select-error' : undefined}
      >
        {loading ? (
          <option>Chargement des modèles...</option>
        ) : models.length === 0 ? (
          <option>Aucun modèle disponible</option>
        ) : (
          models.map((model) => (
            <option key={model.id} value={model.id}>
              {formatModelName(model.id)}
            </option>
          ))
        )}
      </select>
      
      {/* Description du modèle sélectionné */}
      {selectedModelData && (
        <div className={`ms-card ${isDark ? 'dark' : 'light'}`}>
          <div className="ms-card-header">
            <h4 className={`ms-card-title ${isDark ? 'dark' : 'light'}`}>
              {formatModelName(selectedModelData.id)}
            </h4>
            <span className={`ms-badge ${selectedModelData.pricing.prompt === '0' ? 'free' : 'paid'}`}>
              {getModelPricing(selectedModelData)}
            </span>
          </div>
          
          <p className={`ms-card-desc ${isDark ? 'dark' : 'light'}`}>
            {selectedModelData.description || 'Aucune description disponible'}
          </p>
          
          <div className={`ms-card-meta ${isDark ? 'dark' : 'light'}`}>
            <span>Contexte: {selectedModelData.context_length.toLocaleString()} tokens</span>
            <span>•</span>
            <span>Tokenizer: {selectedModelData.architecture.tokenizer}</span>
          </div>
        </div>
      )}
      
      <p className={`ms-note ${isDark ? 'dark' : 'light'}`}>
        ✨ Liste automatiquement mise à jour depuis OpenRouter ({models.length} modèles disponibles)
      </p>
    </div>
  );
};

export default ModelSelector;