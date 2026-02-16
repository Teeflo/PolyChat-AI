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
      <button
        className="polychat-model-selector-header w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isOpen ? 'Fermer le sélecteur de modèle' : 'Ouvrir le sélecteur de modèle'}
      >
        <span className="polychat-model-selector-title">
          MODÈLES SÉLECTIONNÉS ({selectedModels.length})
        </span>
        {isOpen ? (
          <ChevronUp size={16} aria-hidden="true" />
        ) : (
          <ChevronDown size={16} aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="polychat-model-dropdown" role="menu">
          {selectedModels.length > 0 && (
            <div className="polychat-model-actions">
              <button className="polychat-clear-button" onClick={handleClearSelection}>
                EFFACER TOUT
              </button>
            </div>
          )}

          <div className="polychat-model-list">
            {models.map((model) => (
              <button
                key={model.id}
                className={`polychat-model-item w-full text-left ${selectedModels.includes(model.id) ? 'selected' : ''}`}
                onClick={() => handleModelToggle(model.id)}
                role="menuitemcheckbox"
                aria-checked={selectedModels.includes(model.id)}
              >
                <div className="polychat-model-checkbox" aria-hidden="true">
                  {selectedModels.includes(model.id) ? '✓' : ''}
                </div>
                <div className="polychat-model-info">
                  <div className="polychat-model-name">{model.name}</div>
                  <div className="polychat-model-description">{model.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
