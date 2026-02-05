import { useState } from 'react';
import { AlertTriangle, Key } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import './ConfigurationPopup.css';

interface ConfigurationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'missing-api-key' | 'configuration-error';
}

export function ConfigurationPopup({ isOpen, onClose, type }: ConfigurationPopupProps) {
  const { setApiKey } = useSettings();
  const [tempApiKey, setTempApiKey] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      onClose();
    }
  };

  const getContent = () => {
    switch (type) {
      case 'missing-api-key':
        return {
          icon: Key,
          title: 'Configuration requise',
          iconClasses: 'bg-amber-100 text-amber-600',
          headerIconClasses: 'bg-amber-100 text-amber-600',
          buttonClasses: 'bg-amber-600 hover:bg-amber-700',
          content: (
            <div>
              <div className="popup-welcome-center">
                <div className="popup-welcome-avatar amber">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h4>Clé API manquante</h4>
                <p>
                  Veuillez configurer votre clé API OpenRouter pour utiliser PolyChat AI.
                </p>
              </div>

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
                  <Key className="w-4 h-4 text-blue-400" />
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
          ),
          actions: (
            <div className="popup-actions">
              <button
                onClick={onClose}
                className="popup-secondary-btn"
              >
                Plus tard
              </button>
              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
                className="popup-main-btn"
              >
                Sauvegarder
              </button>
            </div>
          )
        };

      case 'configuration-error':
        return {
          icon: AlertTriangle,
          title: 'Erreur de configuration',
          iconClasses: 'bg-red-100 text-red-600',
          headerIconClasses: 'bg-red-100 text-red-600',
          buttonClasses: 'bg-red-600 hover:bg-red-700',
          content: (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Configuration incorrecte
                </h4>
                <p className="text-gray-600 text-sm">
                  Il y a un problème avec votre configuration. Veuillez vérifier vos paramètres.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-800 leading-relaxed">
                  ⚠️ Vérifiez que votre clé API est valide et que vous avez une connexion internet.
                </p>
              </div>
            </div>
          ),
          actions: (
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  // Ouvrir les paramètres
                  onClose();
                }}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Paramètres
              </button>
            </div>
          )
        };

      default:
        return null;
    }
  };

  const config = getContent();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="config-popup-overlay">
      <div className="config-popup-content">
        <div className="config-popup-icon">
          <Icon size={32} />
        </div>
        
        <h3 className="config-popup-title">{config.title}</h3>
        
        <div className="config-popup-body" style={{ margin: 'var(--space-4) 0' }}>
          {config.content}
        </div>

        <div className="config-popup-actions">
          {config.actions}
        </div>
      </div>
    </div>
  );
}

export default ConfigurationPopup;
