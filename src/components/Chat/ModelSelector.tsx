import React from 'react';
import { useModels } from '../../hooks/useModels';
import { useChat } from '../../hooks/useChat';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ModelSelector: React.FC = () => {
  const { models, loading, error } = useModels();
  const { selectedModels, addModel, removeModel } = useChat();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleModelToggle = (modelId: string) => {
    const isSelected = selectedModels.includes(modelId);
    if (isSelected) {
      removeModel(modelId);
    } else {
      addModel(modelId);
    }
  };

  const handleClearSelection = () => {
    // Clear all models except the first one to maintain at least one active session
    const modelsToRemove = selectedModels.slice(1);
    modelsToRemove.forEach((modelId) => removeModel(modelId));
  };

  if (loading) {
    return (
      <div className="polychat-model-selector">
        <div className="polychat-loading-models">
          <div className="polychat-loading-spinner" />
          <span>CHARGEMENT DES MODÈLES...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="polychat-model-selector">
        <div className="polychat-error-models">
          <span>⚠️ {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="polychat-model-selector">
      <div className="polychat-model-selector-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="polychat-model-selector-title">
          MODÈLES SÉLECTIONNÉS ({selectedModels.length})
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {isOpen && (
        <div className="polychat-model-dropdown">
          {selectedModels.length > 0 && (
            <div className="polychat-model-actions">
              <button className="polychat-clear-button" onClick={handleClearSelection}>
                EFFACER TOUT
              </button>
            </div>
          )}

          <div className="polychat-model-list">
            {models.map((model) => (
              <div
                key={model.id}
                className={`polychat-model-item ${selectedModels.includes(model.id) ? 'selected' : ''}`}
                onClick={() => handleModelToggle(model.id)}
              >
                <div className="polychat-model-checkbox">
                  {selectedModels.includes(model.id) ? '✓' : ''}
                </div>
                <div className="polychat-model-info">
                  <div className="polychat-model-name">{model.name}</div>
                  <div className="polychat-model-description">{model.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
