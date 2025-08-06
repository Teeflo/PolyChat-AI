import React from 'react';
import { Settings, Cpu, Zap, Activity } from 'lucide-react';
import ThemeToggle from './ThemeTogglePixel';
import { useSettings } from '../../hooks/useSettings';
import './HeaderModern.css';

interface HeaderProps {
  onSettingsClick: () => void;
}

const HeaderModern: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { selectedModel } = useSettings();
  
  // Obtenir le nom d'affichage du modèle
  const getModelDisplayName = (modelName: string) => {
    if (!modelName) return 'Aucun modèle';
    return modelName.split('/').pop() || modelName;
  };

  return (
    <header className="pixel-header">
      <div className="header-modern-container">
        {/* Logo et titre modernisés */}
        <div className="header-modern-brand">
          {/* Logo moderne avec effet de glow */}
          <div className="header-modern-logo pixel-glow">
            <Cpu size={28} style={{ 
              color: 'var(--pixel-text-inverse)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} />
            
            {/* Indicateur d'activité */}
            <div className="header-modern-activity-indicator" />
          </div>
          
          {/* Titre avec hiérarchie moderne */}
          <div>
            <h1 className="header-modern-title">
              PolyChat
            </h1>
            <div className="header-modern-subtitle">
              <Activity size={12} />
              AI Assistant
            </div>
          </div>
        </div>
        
        {/* Barre de statut centrale */}
        <div className="header-modern-status-bar">
          {/* Indicateur de connexion */}
          <div className="header-modern-connection-status">
            <div className="header-modern-connection-dot" />
            Connecté
          </div>
          
          {/* Séparateur */}
          <div className="header-modern-separator" />
          
          {/* Indicateur de modèle */}
          <div className="header-modern-model-indicator">
            <Zap size={12} />
            {getModelDisplayName(selectedModel)}
          </div>
        </div>

        {/* Actions à droite */}
        <div className="header-modern-actions">
          {/* Toggle de thème modernisé */}
          <div className="header-modern-theme-toggle">
            <ThemeToggle />
          </div>
          
          {/* Bouton Settings simple et élégant */}
          <button 
            onClick={onSettingsClick}
            className="header-modern-settings-btn"
            aria-label="Ouvrir les paramètres"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Barre de progression décorative */}
      <div className="header-modern-progress-bar" />
    </header>
  );
};

export default HeaderModern;
