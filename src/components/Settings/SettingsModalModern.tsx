import React from 'react';
import { X, Key, Palette, Info, Save, Zap } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useModels } from '../../hooks/useModels';
import './SettingsModalModern.css';

interface SettingsModalModernProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModalModern: React.FC<SettingsModalModernProps> = ({ isOpen, onClose }) => {
  const { 
    apiKey, 
    selectedModel, 
    theme, 
    setApiKey, 
    setSelectedModel, 
    setTheme
  } = useSettings();
  const { models } = useModels();

  if (!isOpen) return null;

  const handleSave = () => {
    // Les paramètres sont automatiquement sauvegardés via Zustand persist
    onClose();
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    console.log('🎨 Changement de thème:', newTheme);
    setTheme(newTheme);
    // Forcer l'application du thème immédiatement
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.className = `theme-${newTheme}`;
  };

  const getModelDisplayName = (modelId: string) => {
    return modelId.split('/').pop() || modelId;
  };

  const getModelProvider = (modelId: string) => {
    const parts = modelId.split('/');
    return parts.length > 1 ? parts[0] : 'Unknown';
  };

  return (
    <div className="settings-modal-modern-overlay" onClick={onClose}>
      <div className="settings-modal-modern" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-modal-modern-header">
          <div className="settings-modal-modern-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            <h2>Paramètres</h2>
          </div>
          <button
            onClick={onClose}
            className="settings-modal-modern-close"
            aria-label="Fermer les paramètres"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        <div className="settings-modal-modern-content">
          {/* Section API Key */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Key size={18} />
              <h3>Clé API OpenRouter</h3>
              <div className="settings-section-modern-badge required">
                Requis
              </div>
            </div>
            
            <div className="settings-field-modern">
              <label htmlFor="apiKey" className="settings-label-modern">
                Votre clé API
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="sk-or-v1-..."
                className="settings-input-modern"
              />
              <div className="settings-help-modern">
                <Info size={12} />
                <span>
                  Obtenez votre clé API sur{' '}
                  <a 
                    href="https://openrouter.ai/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="settings-link-modern"
                  >
                    OpenRouter.ai
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Section Modèle par défaut */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Zap size={18} />
              <h3>Modèle par défaut</h3>
              <div className="settings-section-modern-badge optional">
                Optionnel
              </div>
            </div>
            
            <div className="settings-field-modern">
              <label htmlFor="defaultModel" className="settings-label-modern">
                Sélectionner un modèle
              </label>
              <select
                id="defaultModel"
                value={selectedModel}
                onChange={handleModelChange}
                className="settings-select-modern"
              >
                <option value="">Choisir un modèle...</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {getModelDisplayName(model.id)} ({getModelProvider(model.id)})
                  </option>
                ))}
              </select>
              <div className="settings-help-modern">
                <Info size={12} />
                <span>
                  Ce modèle sera sélectionné automatiquement au démarrage
                </span>
              </div>
            </div>
          </div>

          {/* Section Thème */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Palette size={18} />
              <h3>Apparence</h3>
              <div className="settings-section-modern-badge experimental">
                Bêta
              </div>
            </div>
            
            <div className="settings-field-modern">
              <label className="settings-label-modern">
                Thème de l'interface
              </label>
              <div className="settings-theme-options-modern">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`settings-theme-option-modern ${theme === 'dark' ? 'active' : ''}`}
                >
                  <div className="settings-theme-preview-modern dark">
                    <div className="settings-theme-preview-header-modern dark-header" />
                    <div className="settings-theme-preview-content-modern dark-content" />
                  </div>
                  <span>🌙 Sombre (Cyber)</span>
                  {theme === 'dark' && <span className="theme-active-indicator">✓</span>}
                </button>
                
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`settings-theme-option-modern ${theme === 'light' ? 'active' : ''}`}
                >
                  <div className="settings-theme-preview-modern light">
                    <div className="settings-theme-preview-header-modern light-header" />
                    <div className="settings-theme-preview-content-modern light-content" />
                  </div>
                  <span>☀️ Clair</span>
                  {theme === 'light' && <span className="theme-active-indicator">✓</span>}
                </button>
              </div>
              <div className="settings-help-modern">
                <Info size={12} />
                <span>
                  Thème actuel: <strong>{theme === 'dark' ? 'Sombre (Cyber)' : 'Clair'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="settings-section-modern">
            <div className="settings-section-modern-header">
              <Info size={18} />
              <h3>Informations</h3>
            </div>
            
            <div className="settings-info-grid-modern">
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Version</span>
                <span className="settings-info-value-modern">PolyChat AI v2.0</span>
              </div>
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Modèles disponibles</span>
                <span className="settings-info-value-modern">{models.length}</span>
              </div>
              <div className="settings-info-item-modern">
                <span className="settings-info-label-modern">Statut API</span>
                <span className={`settings-info-value-modern ${apiKey ? 'connected' : 'disconnected'}`}>
                  {apiKey ? 'Connecté' : 'Non configuré'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-modal-modern-footer">
          <button
            onClick={onClose}
            className="settings-btn-modern secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="settings-btn-modern primary"
          >
            <Save size={16} />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModalModern;
