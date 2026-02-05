import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Check, Loader2 } from 'lucide-react';
import { getTopWeeklyModels } from '../../services/openRouter';

interface ModelSelectionStepProps {
  onNext: () => void;
}

const ModelSelectionStep: React.FC<ModelSelectionStepProps> = ({ onNext }) => {
  const { setSelectedModel } = useSettings();
  const [selectedModelId, setSelectedModelId] = useState('');
  const [models, setModels] = useState<
    Array<{ id: string; name: string; desc: string; emoji: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Charger les modèles les plus populaires au montage du composant
  useEffect(() => {
    const loadTopModels = async () => {
      try {
        setLoading(true);
        const topModels = await getTopWeeklyModels();
        setModels(topModels);
      } catch {
        // Fallback vers des modèles par défaut
        setModels([
          { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Le plus polyvalent', emoji: '🎯' },
          {
            id: 'anthropic/claude-3.5-sonnet',
            name: 'Claude 3.5 Sonnet',
            desc: "Excellent pour l'écriture",
            emoji: '✍️',
          },
          {
            id: 'openai/gpt-4o-mini',
            name: 'GPT-4o Mini',
            desc: 'Rapide et économique',
            emoji: '⚡',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTopModels();
  }, []);

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
      {loading ? (
        <div className="loading-container">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#64748b' }} />
          <span className="loading-text">Chargement des modèles populaires...</span>
        </div>
      ) : (
        models.map((model) => (
          <button
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            className={`model-card ${selectedModelId === model.id ? 'selected' : ''}`}
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
        ))
      )}

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
