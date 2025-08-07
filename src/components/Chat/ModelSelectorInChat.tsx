import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useModels } from '../../hooks/useModels';

const ModelSelectorInChat: React.FC = () => {
  const { activeSessions, selectedModels, addModel, removeModel } = useChat();
  const { models } = useModels();
  const [isExpanded, setIsExpanded] = useState(false);

  const availableModels = models.filter(model => !selectedModels.includes(model.id));
  const canAddMore = selectedModels.length < 3;

  const handleAddModel = (modelId: string) => {
    addModel(modelId);
    setIsExpanded(false);
  };

  const handleRemoveModel = (modelId: string) => {
    if (selectedModels.length > 1) {
      removeModel(modelId);
    }
  };

  return (
    <div className="pixel-model-selector-chat">
      {/* Modèles actifs */}
      <div className="pixel-active-models">
        <div className="pixel-models-header">
          <span className="pixel-models-title">ACTIVE MODELS ({selectedModels.length}/3)</span>
        </div>
        
        <div className="pixel-models-list">
          {activeSessions.map((session) => (
            <div key={session.id} className="pixel-model-chip">
              <span className="pixel-model-name">
                {session.modelName.split('/').pop() || session.modelName}
              </span>
              {selectedModels.length > 1 && (
                <button
                  onClick={() => handleRemoveModel(session.modelId)}
                  className="pixel-model-remove"
                  title="Remove model"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          
          {/* Bouton pour ajouter un modèle */}
          {canAddMore && (
            <div className="pixel-add-model-container">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="pixel-add-model-btn"
                title="Add model"
              >
                <Plus size={14} />
                <span>ADD MODEL</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {/* Dropdown des modèles disponibles */}
              {isExpanded && (
                <div className="pixel-models-dropdown">
                  <div className="pixel-dropdown-header">
                    <span>SELECT MODEL TO ADD</span>
                  </div>
                  <div className="pixel-dropdown-content">
                    {availableModels.length > 0 ? (
                      availableModels.slice(0, 10).map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleAddModel(model.id)}
                          className="pixel-dropdown-item"
                        >
                          <span className="pixel-model-id">{model.id}</span>
                          <span className="pixel-model-full-name">{model.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="pixel-dropdown-empty">
                        No more models available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSelectorInChat;