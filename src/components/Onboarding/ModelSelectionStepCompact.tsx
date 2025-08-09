import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Check } from 'lucide-react';

interface ModelSelectionStepProps {
  onNext: () => void;
}

const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({ onNext }) => {
  const { setSelectedModel } = useSettings();
  const [selectedModelId, setSelectedModelId] = useState('');

  // Modèles les plus utilisés sur OpenRouter (top weekly)
  const quickModels = [
    { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Le plus polyvalent', emoji: '🎯' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Excellent pour l\'écriture', emoji: '✍️' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Rapide et économique', emoji: '⚡' }
  ];

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setSelectedModel(modelId);
    // Auto-continue après sélection
    setTimeout(() => {
      onNext();
    }, 500);
  };

  return (
    <div className="model-selection-grid">
      {quickModels.map(model => (
        <button
          key={model.id}
          onClick={() => handleModelSelect(model.id)}
          className={`model-card ${
            selectedModelId === model.id ? 'selected' : ''
          }`}
        >
          <div className="model-card-content">
            <div className="model-emoji">{model.emoji}</div>
            <div className="model-info">
              <div className="model-name">{model.name}</div>
              <div className="model-desc">{model.desc}</div>
            </div>
            {selectedModelId === model.id && (
              <div className="model-check">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        </button>
      ))}
      
      {selectedModelId && (
        <div className="model-success-message">
          <div className="model-success-content">
            <Check className="w-4 h-4 text-green-400" />
            <span>Modèle sélectionné ! Transition automatique...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelectionStep;
