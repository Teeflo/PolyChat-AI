import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Check, Loader2 } from 'lucide-react';
import { getImageModels } from '../../services/openRouter';
import './ImageModelSelector.css';

interface ImageModelSelectorProps {
  onNext: () => void;
}

const ImageModelSelector: React.FC<ImageModelSelectorProps> = ({ onNext }) => {
  const { setSelectedModel } = useSettings();
  const [selectedModelId, setSelectedModelId] = useState('');
  const [models, setModels] = useState<Array<{id: string, name: string, desc: string, emoji: string}>>([]);
  const [loading, setLoading] = useState(true);

  // Charger les modèles d'image au montage du composant
  useEffect(() => {
    const loadImageModels = async () => {
      try {
        setLoading(true);
        const imageModels = await getImageModels();
        setModels(imageModels);
      } catch (error) {
        console.error('Error loading image models:', error);
        // Fallback vers les vrais modèles d'image connus
        setModels([
          { id: 'google/gemini-2.5-flash-image-preview:free', name: 'Gemini 2.5 Flash Image (Gratuit)', desc: 'Génération d\'images IA avancée - Version gratuite', emoji: '🎨' },
          { id: 'google/gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash Image (Premium)', desc: 'Génération d\'images IA avancée - Haute qualité', emoji: '🎨' },
          { id: 'openai/gpt-4o', name: 'GPT-4o', desc: 'Modèle multimodal avec génération d\'images', emoji: '🎨' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadImageModels();
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
      <div className="image-models-header">
        <h3>🎨 Modèles de Génération d'Images</h3>
        <p>Choisissez un modèle spécialisé dans la création d'images</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#64748b' }} />
          <span className="loading-text">Chargement des modèles d'image...</span>
        </div>
      ) : (
        models.map(model => (
          <button
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            className={`model-card image-model-card ${
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
        ))
      )}

      {selectedModelId && (
        <div className="model-success-message">
          <div className="model-success-content">
            <Check className="w-4 h-4 text-green-400" />
            <span>Modèle d'image sélectionné ! Transition automatique...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModelSelector;