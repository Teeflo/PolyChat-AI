import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import { 
  fetchAvailableModels, 
  formatModelName, 
  getModelPricing, 
  type OpenRouterModel 
} from '../../services/modelsApi';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel, theme } = useSettings();
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDark = theme === 'dark';

  // Charger les modèles au montage du composant
  useEffect(() => {
    loadModels();
  }, []);

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
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#e5e7eb' : '#374151',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={16} />
            Modèle d'IA
          </div>
          <button
            onClick={loadModels}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#9ca3af' : '#6b7280',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.color = isDark ? '#e5e7eb' : '#374151';
              }
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.color = isDark ? '#9ca3af' : '#6b7280';
            }}
            title="Actualiser la liste des modèles"
          >
            {loading ? (
              <Loader2 size={14} className="spin" />
            ) : (
              <RefreshCw size={14} />
            )}
          </button>
        </div>
      </label>
      
      {error && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          marginBottom: '8px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#dc2626',
            margin: 0
          }}>
            {error}
          </p>
        </div>
      )}

      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        disabled={loading || models.length === 0}
        style={{
          width: '100%',
          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '14px',
          backgroundColor: isDark ? '#374151' : '#ffffff',
          color: isDark ? '#e5e7eb' : '#374151',
          outline: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s ease',
          opacity: loading ? 0.6 : 1
        }}
        onFocus={(e) => {
          if (!loading) {
            (e.target as HTMLSelectElement).style.borderColor = '#667eea';
          }
        }}
        onBlur={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = isDark ? '#4b5563' : '#d1d5db';
        }}
      >
        {loading ? (
          <option>Chargement des modèles...</option>
        ) : models.length === 0 ? (
          <option>Aucun modèle disponible</option>
        ) : (
          models.map((model) => (
            <option key={model.id} value={model.id}>
              {formatModelName(model)}
            </option>
          ))
        )}
      </select>
      
      {/* Description du modèle sélectionné */}
      {selectedModelData && (
        <div style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: isDark ? '#111827' : '#f8fafc',
          border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
          borderRadius: '6px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '6px'
          }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: isDark ? '#e5e7eb' : '#374151',
              margin: 0
            }}>
              {formatModelName(selectedModelData)}
            </h4>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              backgroundColor: selectedModelData.pricing.prompt === '0' ? '#10b981' : '#f59e0b',
              color: 'white',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              {getModelPricing(selectedModelData)}
            </span>
          </div>
          
          <p style={{
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: '0 0 8px 0',
            lineHeight: '1.4'
          }}>
            {selectedModelData.description || 'Aucune description disponible'}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            fontSize: '11px',
            color: isDark ? '#9ca3af' : '#6b7280'
          }}>
            <span>Contexte: {selectedModelData.context_length.toLocaleString()} tokens</span>
            <span>•</span>
            <span>Tokenizer: {selectedModelData.architecture.tokenizer}</span>
          </div>
        </div>
      )}
      
      <p style={{
        fontSize: '12px',
        color: isDark ? '#9ca3af' : '#6b7280',
        marginTop: '8px',
        lineHeight: '1.4'
      }}>
        ✨ Liste automatiquement mise à jour depuis OpenRouter ({models.length} modèles disponibles)
      </p>
    </div>
  );
};

export default ModelSelector;