import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Brain, Loader2, RefreshCw, Cpu } from 'lucide-react';
import { 
  fetchAvailableModels, 
  formatModelName, 
  type OpenRouterModel 
} from '../../services/modelsApi';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel } = useSettings();
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedModels = await fetchAvailableModels();
      setModels(fetchedModels);

      if (fetchedModels.length > 0 && !fetchedModels.find(m => m.id === selectedModel)) {
        setSelectedModel(fetchedModels[0].id);
      }
    } catch (err) {
      setError('MODEL LOADING FAILED');
      console.error('Model loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedModel, setSelectedModel]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return (
    <div className="polychat-input-group">
      <label className="polychat-label">
        <div className="polychat-label-content">
          <Brain size={12} />
          <span>AI MODEL SELECTION</span>
          <Cpu size={8} className="polychat-cpu-icon" />
        </div>
      </label>

      <div className="polychat-model-controls">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={loading || models.length === 0}
          className="polychat-select polychat-model-select"
          title="Select AI Model"
        >
          {loading ? (
            <option>LOADING MODELS...</option>
          ) : error ? (
            <option>ERROR LOADING MODELS</option>
          ) : models.length === 0 ? (
            <option>NO MODELS AVAILABLE</option>
          ) : (
            models.map((model) => (
              <option key={model.id} value={model.id}>
                {formatModelName(model.id)}
              </option>
            ))
          )}
        </select>

        <button
          onClick={loadModels}
          disabled={loading}
          className={`polychat-btn polychat-btn-secondary polychat-refresh-btn ${loading ? 'loading' : ''}`}
          title="REFRESH MODELS"
        >
          {loading ? (
            <Loader2 size={12} className="polychat-pulse" />
          ) : (
            <RefreshCw size={12} />
          )}
        </button>
      </div>

      {error && (
        <div className="polychat-error-message-small">
          <span>{error}</span>
        </div>
      )}

      {!loading && models.length > 0 && (
        <div className="polychat-model-info">
          <span>MODELS LOADED: {models.length}</span>
          <span>STATUS: READY</span>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
