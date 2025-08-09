import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useModels } from '../../hooks/useModels';
import { Search, Star, Zap } from 'lucide-react';

interface ModelSelectionStepProps {
  onNext: () => void;
}

const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({ onNext }) => {
  const { setSelectedModel } = useSettings();
  const { models } = useModels();
  const [selectedModelId, setSelectedModelId] = useState('');

  // Modèles recommandés pour le pop-up
  const quickModels = [
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Rapide et économique' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Le plus polyvalent' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5', desc: 'Excellent pour l\'écriture' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude Haiku', desc: 'Ultra-rapide' }
  ];

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setSelectedModel(modelId);
    // Auto-continue après sélection
    setTimeout(() => {
      onNext();
    }, 300);
  };

  const getPriceIcon = (model: any) => {
    // Estimation du prix basée sur l'ID
    if (model.id.includes('gpt-4o') && !model.id.includes('mini')) return '💰💰💰';
    if (model.id.includes('claude-3-opus')) return '💰💰💰';
    if (model.id.includes('mini') || model.id.includes('haiku') || model.id.includes('8b')) return '💰';
    return '💰💰';
  };

  return (
    <div className="model-selection-step">
      <div className="model-search">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="models-sections">
        {popularModels.length > 0 && (
          <div className="models-section">
            <h3 className="section-title">
              <Star size={16} />
              Modèles populaires
            </h3>
            <div className="models-grid">
              {popularModels.map(model => (
                <div
                  key={model.id}
                  className={`model-card ${selectedModelId === model.id ? 'selected' : ''}`}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <div className="model-header">
                    <span className="model-name">{model.name || model.id.split('/')[1]}</span>
                    <span className="model-price">{getPriceIcon(model)}</span>
                  </div>
                  <div className="model-provider">{model.id.split('/')[0]}</div>
                  {model.context_length && (
                    <div className="model-context">
                      Contexte: {model.context_length.toLocaleString()} tokens
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {otherModels.length > 0 && (
          <div className="models-section">
            <h3 className="section-title">
              <Zap size={16} />
              Autres modèles
            </h3>
            <div className="models-list">
              {otherModels.slice(0, 10).map(model => (
                <div
                  key={model.id}
                  className={`model-item ${selectedModelId === model.id ? 'selected' : ''}`}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <span className="model-name">{model.name || model.id.split('/')[1]}</span>
                  <span className="model-provider">{model.id.split('/')[0]}</span>
                  <span className="model-price">{getPriceIcon(model)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="selection-footer">
        <div className="selection-info">
          {selectedModelId ? (
            <span className="selected-text">✅ Modèle sélectionné: {selectedModelId.split('/')[1]}</span>
          ) : (
            <span className="no-selection">Choisissez un modèle pour continuer</span>
          )}
        </div>
        <button 
          className={`continue-btn ${selectedModelId ? 'enabled' : 'disabled'}`}
          onClick={handleContinue}
          disabled={!selectedModelId}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default ModelSelectionStep;
