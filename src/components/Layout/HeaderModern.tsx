import React from 'react';
import { Settings, Cpu, Zap, Activity, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeTogglePixel';
import { useSettings } from '../../hooks/useSettings';
import './HeaderModern.css';

interface HeaderProps {
  onSettingsClick: () => void;
  onModelClick?: () => void;
  onHistoryClick?: () => void;
}

const HeaderModern: React.FC<HeaderProps> = ({ onSettingsClick, onModelClick, onHistoryClick }) => {
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
            <picture className="header-modern-logo-picture">
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.svg"
                alt="PolyChat logo"
                className="header-modern-logo-img"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </picture>
            <Cpu size={28} style={{ 
              color: 'var(--pixel-text-inverse)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              zIndex: 1
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
          {/* Indicateur de modèle cliquable */}
          <button 
            onClick={onModelClick}
            className="header-modern-model-indicator"
            aria-label="Changer de modèle"
          >
            <Zap size={12} />
            {getModelDisplayName(selectedModel)}
          </button>
        </div>

        {/* Actions à droite */}
        <div className="header-modern-actions">
          {/* Bouton Historique */}
          {onHistoryClick && (
            <button 
              onClick={onHistoryClick}
              className="header-modern-history-btn"
              aria-label="Ouvrir l'historique"
              title="Historique des conversations"
            >
              <MessageSquare size={18} />
            </button>
          )}
          
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
