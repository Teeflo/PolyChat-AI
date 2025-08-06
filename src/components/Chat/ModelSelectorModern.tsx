import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Cpu, Zap } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useModels } from '../../hooks/useModels';
import './ModelSelectorModern.css';

const ModelSelectorModern: React.FC = () => {
  const { activeSessions, selectedModels, addModel, removeModel } = useChat();
  const { models } = useModels();
  const [isExpanded, setIsExpanded] = useState(false);

  const availableModels = models.filter(model => !selectedModels.includes(model.id));
  const canAddMore = selectedModels.length < 3;

  const handleAddModel = (modelId: string, modelName: string) => {
    addModel(modelId, modelName);
    setIsExpanded(false);
  };

  const handleRemoveModel = (modelId: string) => {
    if (selectedModels.length > 1) {
      removeModel(modelId);
    }
  };

  const getModelDisplayName = (modelName: string) => {
    return modelName.split('/').pop() || modelName;
  };

  const getModelProvider = (modelName: string) => {
    const parts = modelName.split('/');
    return parts.length > 1 ? parts[0] : 'Unknown';
  };

  return (
    <div className="model-selector-modern">
      {/* Header avec statistiques */}
      <div className="model-selector-modern-header">
        <div className="model-selector-modern-title">
          <Cpu size={18} />
          <span>Modèles IA Actifs</span>
          <div className="model-selector-modern-badge">
            {selectedModels.length}/3
          </div>
        </div>
        
        {canAddMore && availableModels.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="model-selector-modern-toggle"
            aria-label={isExpanded ? 'Fermer la sélection' : 'Ajouter un modèle'}
          >
            <Plus size={16} />
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Modèles actifs */}
      <div className="model-selector-modern-active">
        {activeSessions.map((session) => (
          <div key={session.id} className="model-card-modern">
            <div className="model-card-modern-info">
              <div className="model-card-modern-icon">
                <Zap size={16} />
              </div>
              <div className="model-card-modern-details">
                <div className="model-card-modern-name">
                  {getModelDisplayName(session.modelName)}
                </div>
                <div className="model-card-modern-provider">
                  {getModelProvider(session.modelName)}
                </div>
              </div>
            </div>
            
            <div className="model-card-modern-status">
              <div className={`model-card-modern-indicator ${session.isLoading ? 'loading' : 'ready'}`} />
              <span className="model-card-modern-status-text">
                {session.isLoading ? 'Actif' : 'Prêt'}
              </span>
            </div>

            {selectedModels.length > 1 && (
              <button
                onClick={() => handleRemoveModel(session.modelId)}
                className="model-card-modern-remove"
                aria-label={`Supprimer ${getModelDisplayName(session.modelName)}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Liste des modèles disponibles */}
      {isExpanded && canAddMore && (
        <div className="model-selector-modern-dropdown">
          <div className="model-selector-modern-dropdown-header">
            <span>Ajouter un modèle</span>
            <span className="model-selector-modern-available-count">
              {availableModels.length} disponibles
            </span>
          </div>
          
          <div className="model-selector-modern-grid">
            {availableModels.slice(0, 6).map((model) => (
              <button
                key={model.id}
                onClick={() => handleAddModel(model.id, model.name)}
                className="model-option-modern"
              >
                <div className="model-option-modern-icon">
                  <Cpu size={14} />
                </div>
                <div className="model-option-modern-details">
                  <div className="model-option-modern-name">
                    {getModelDisplayName(model.name)}
                  </div>
                  <div className="model-option-modern-provider">
                    {getModelProvider(model.name)}
                  </div>
                </div>
                <div className="model-option-modern-add">
                  <Plus size={12} />
                </div>
              </button>
            ))}
          </div>

          {availableModels.length > 6 && (
            <div className="model-selector-modern-more">
              +{availableModels.length - 6} autres modèles disponibles
            </div>
          )}
        </div>
      )}

      {/* État vide */}
      {selectedModels.length === 0 && (
        <div className="model-selector-modern-empty">
          <Cpu size={24} />
          <span>Aucun modèle sélectionné</span>
        </div>
      )}
    </div>
  );
};

export default ModelSelectorModern;
