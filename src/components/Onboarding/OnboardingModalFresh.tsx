import { useState } from 'react';
import { X, Zap, Bot, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import ModelSelectionStepCompact from './ModelSelectionStepCompact';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModalFresh({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { setApiKey } = useSettings();
  const [tempApiKey, setTempApiKey] = useState('');

  const steps = [
    {
      icon: Zap,
      title: 'Bienvenue sur PolyChat AI',
      content: (
        <div className="popup-welcome-center">
          <div className="popup-welcome-avatar blue">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h4>Chat IA moderne avec plusieurs modèles</h4>
          <div className="popup-features">
            <div className="popup-feature">
              <div className="popup-feature-icon yellow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="popup-feature-text">Interface intuitive</span>
            </div>
            <div className="popup-feature">
              <div className="popup-feature-icon blue">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="popup-feature-text">GPT, Claude, Gemini</span>
            </div>
            <div className="popup-feature">
              <div className="popup-feature-icon green">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="popup-feature-text">Templates intelligents</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: 'Clé API OpenRouter',
      content: (
        <div className="popup-welcome-center">
          <div className="popup-welcome-avatar amber">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h4>Configuration de votre clé API</h4>
          <p>Ajoutez votre clé API pour utiliser PolyChat.</p>
          
          <div className="popup-form-group">
            <label className="popup-label">
              Clé API OpenRouter
            </label>
            <input
              type="password"
              placeholder="Votre clé API OpenRouter"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="popup-input"
            />
          </div>

          <div className="popup-card">
            <p className="popup-tip">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>
                <strong>Gratuit :</strong> Créez un compte sur{' '}
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  openrouter.ai
                </a>
                {' '}pour obtenir votre clé API.
              </span>
            </p>
          </div>
        </div>
      )
    },
    {
      icon: Bot,
      title: 'Modèle préféré',
      content: (
        <div className="popup-welcome-center">
          <div className="popup-welcome-avatar green">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h4>Choisissez votre modèle d'IA par défaut</h4>
          <ModelSelectionStepCompact onNext={() => handleNext()} />
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData?.icon || Zap;

  const handleNext = () => {
    if (currentStep === 1 && tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return tempApiKey.trim().length > 0;
    }
    return true;
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content onboarding">
        <div className="popup-header">
          <div className="popup-header-content">
            <div className="popup-icon">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="popup-title">
                {currentStepData.title}
              </h3>
              <p className="popup-subtitle">
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="popup-close-btn"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="popup-body">
          <div className="popup-progress-bar">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`popup-progress-step ${
                  index <= currentStep ? 'active' : ''
                }`}
              />
            ))}
          </div>

          <div className="popup-step-content">
            {currentStepData.content}
          </div>
        </div>

        <div className="popup-footer">
          <div className="popup-actions">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="popup-secondary-btn"
            >
              Précédent
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="popup-main-btn"
            >
              {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingModalFresh;
