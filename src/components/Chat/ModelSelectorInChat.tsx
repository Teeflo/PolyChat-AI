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
    <div className="polychat-model-selector-chat">
      {/* Modèles actifs */}
      <div className="polychat-active-models">
        <div className="polychat-models-header">
          <span className="polychat-models-title">ACTIVE MODELS ({selectedModels.length}/3)</span>
        </div>
        
        <div className="polychat-models-list">
          {activeSessions.map((session) => (
            <div key={session.id} className="polychat-model-chip">
              <span className="polychat-model-name">
                {session.modelName.split('/').pop() || session.modelName}
              </span>
              {selectedModels.length > 1 && (
                <button
                  onClick={() => handleRemoveModel(session.modelId)}
                  className="polychat-model-remove"
                  title="Remove model"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          
          {/* Bouton pour ajouter un modèle */}
          {canAddMore && (
            <div className="polychat-add-model-container">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="polychat-add-model-btn"
                title="Add model"
              >
                <Plus size={14} />
                <span>ADD MODEL</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {/* Dropdown des modèles disponibles */}
              {isExpanded && (
                <div className="polychat-models-dropdown">
                  <div className="polychat-dropdown-header">
                    <span>SELECT MODEL TO ADD</span>
                  </div>
                  <div className="polychat-dropdown-content">
                    {availableModels.length > 0 ? (
                      availableModels.slice(0, 10).map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleAddModel(model.id)}
                          className="polychat-dropdown-item"
                        >
                          <span className="polychat-model-id">{model.id}</span>
                          <span className="polychat-model-full-name">{model.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="polychat-dropdown-empty">
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