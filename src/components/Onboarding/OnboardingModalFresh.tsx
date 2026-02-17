import { useState } from 'react';
import { X, Zap, Bot, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import ModelSelectionStepCompact from './ModelSelectionStepCompact';
import './OnboardingModalFresh.css';

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
          <div className="popup-welcome-avatar blue" aria-hidden="true">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h4>Chat IA moderne avec plusieurs modèles</h4>
          <div className="popup-features">
            <div className="popup-feature">
              <div className="popup-feature-icon yellow" aria-hidden="true">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="popup-feature-text">Interface intuitive</span>
            </div>
            <div className="popup-feature">
              <div className="popup-feature-icon blue" aria-hidden="true">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="popup-feature-text">GPT, Claude, Gemini</span>
            </div>
            <div className="popup-feature">
              <div className="popup-feature-icon green" aria-hidden="true">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="popup-feature-text">Templates intelligents</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: 'Clé API OpenRouter',
      content: (
        <div className="popup-welcome-center">
          <div className="popup-welcome-avatar amber" aria-hidden="true">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h4>Configuration de votre clé API</h4>
          <p>Ajoutez votre clé API pour utiliser PolyChat.</p>

          <div className="popup-form-group">
            <label htmlFor="onboarding-api-key" className="popup-label">
              Clé API OpenRouter
            </label>
            <input
              id="onboarding-api-key"
              type="password"
              placeholder="Votre clé API OpenRouter"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="popup-input"
            />
          </div>

          <div className="popup-card">
            <p className="popup-tip">
              <Sparkles className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>
                <strong>Gratuit :</strong> Créez un compte sur{' '}
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  openrouter.ai
                </a>{' '}
                pour obtenir votre clé API.
              </span>
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Bot,
      title: 'Modèle préféré',
      content: (
        <div className="popup-welcome-center">
          <div className="popup-welcome-avatar green" aria-hidden="true">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h4>Choisissez votre modèle d'IA par défaut</h4>
          <ModelSelectionStepCompact onNext={() => handleNext()} />
        </div>
      ),
    },
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
    <div
      className="onboarding-fresh-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="onboarding-fresh-card">
        <div className="onboarding-sidebar">
          <div
            className="polychat-logo-sm"
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-6)',
            }}
            aria-hidden="true"
          >
            <Icon size={24} color="white" />
          </div>
          <h2 id="onboarding-title" className="onboarding-step-title" style={{ color: 'white' }}>
            PolyChat AI
          </h2>
          <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>
            L'interface ultime pour vos modèles d'IA préférés.
          </p>

          <div style={{ marginTop: 'auto' }}>
            <div className="step-indicator" role="tablist" aria-label="Étapes de la configuration">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`step-dot ${i === currentStep ? 'active' : ''}`}
                  style={{ background: i === currentStep ? 'white' : 'rgba(255,255,255,0.3)' }}
                  role="tab"
                  aria-selected={i === currentStep}
                  aria-label={`Étape ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="onboarding-main">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)',
            }}
          >
            <div>
              <h3 className="onboarding-step-title">{currentStepData.title}</h3>
              <p
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--text-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Fermer l'assistant de configuration"
            >
              <X size={18} />
            </button>
          </div>

          <div className="onboarding-step-content" style={{ flex: 1, overflowY: 'auto' }}>
            {currentStepData.content}
          </div>

          <div className="onboarding-action-bar">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="polychat-btn-modern polychat-btn-secondary"
            >
              Précédent
            </button>
            <button onClick={handleNext} disabled={!canProceed()} className="polychat-btn-modern">
              {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingModalFresh;
