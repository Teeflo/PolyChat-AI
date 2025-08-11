import React, { useState } from 'react';
import { X, Zap, Bot, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { ModelSelectionStep } from './ModelSelectionStep';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { setApiKey } = useSettings();
  const [tempApiKey, setTempApiKey] = useState('');

  const steps = [
    {
      icon: Zap,
      title: 'Bienvenue sur PolyChat AI',
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Une expérience de chat IA moderne avec accès à plusieurs modèles de pointe.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✨ Interface moderne et intuitive<br/>
              🤖 Accès à GPT, Claude, Gemini et plus<br/>
              💬 Historique et templates intelligents
            </p>
          </div>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: 'Ajoutez votre clé API',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Pour utiliser PolyChat AI, vous devez ajouter votre clé API OpenRouter.
          </p>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Votre clé API OpenRouter"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                🔑 Obtenez votre clé API gratuitement sur{' '}
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  openrouter.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Bot,
      title: 'Choisissez votre modèle préféré',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Sélectionnez le modèle d'IA que vous souhaitez utiliser par défaut.
          </p>
          <ModelSelectionStep />
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-500">
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer la modal d'onboarding"
            title="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="min-h-[300px]">
            {currentStepData.content}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}
