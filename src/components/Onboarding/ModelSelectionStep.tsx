import React, { useState, useMemo } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useModels } from '../../hooks/useModels';
import { Search, Star } from 'lucide-react';

interface ModelSelectionStepProps {
  onNext: () => void;
}

const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({ onNext }) => {
  const { setSelectedModel } = useSettings();
  const { models } = useModels();
  const [selectedModelId, setSelectedModelId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // NOTE: Liste rapide retirée (expérimental)

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setSelectedModel(modelId);
    // Auto-continue après sélection
    setTimeout(() => {
      onNext();
    }, 300);
  };

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return models
      .filter((m) => m.id.toLowerCase().includes(term) || m.name?.toLowerCase().includes(term))
      .slice(0, 12);
  }, [models, searchTerm]);

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
        <div className="models-section">
          <h3 className="section-title">
            <Star size={16} /> Résultats
          </h3>
          <div className="models-grid">
            {filtered.map((model) => (
              <div
                key={model.id}
                className={`model-card ${selectedModelId === model.id ? 'selected' : ''}`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="model-header">
                  <span className="model-name">{model.name || model.id.split('/')[1]}</span>
                </div>
                <div className="model-provider">{model.id.split('/')[0]}</div>
                {model.context_length && (
                  <div className="model-context">{model.context_length.toLocaleString()} ctx</div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="model-empty">Aucun résultat</div>}
          </div>
        </div>
      </div>

      <div className="selection-footer">
        <div className="selection-info">
          {selectedModelId ? (
            <span className="selected-text">
              ✅ Modèle sélectionné: {selectedModelId.split('/')[1]}
            </span>
          ) : (
            <span className="no-selection">Choisissez un modèle pour continuer</span>
          )}
        </div>
        <button
          className={`continue-btn ${selectedModelId ? 'enabled' : 'disabled'}`}
          onClick={onNext}
          disabled={!selectedModelId}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default ModelSelectionStep;
