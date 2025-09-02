import React from 'react';
import { Settings, Cpu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './Header.css';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="polychat-header">
      <div className="header-container">
        {/* Logo et titre */}
        <div className="header-brand">
          {/* Logo pixel rétro */}
          <div className="polychat-logo polychat-glow header-logo">
            {/* Image du logo (WebP > SVG). Si non supporté, l'icône CPU sert de fallback */}
            <picture className="header-logo-picture">
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.svg"
                alt="PolyChat logo"
                className="header-logo-img"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </picture>
            <Cpu size={24} className="header-logo-icon" />
          </div>
          
          {/* Titre avec effet rétro */}
          <div>
            <h1 className="header-title">
              POLYCHAT
            </h1>
            {/* Texte supprimé pour une interface plus épurée */}
          </div>
        </div>
        
        {/* Contrôles */}
        <div className="header-controls">
          {/* Indicateur de statut */}
          <div className="header-status">
            <div className="polychat-status-online" />
            ONLINE
          </div>
          
          {/* Toggle thème */}
          <ThemeToggle />
          
          {/* Bouton paramètres pixel */}
          <button
            onClick={onSettingsClick}
            className="polychat-btn polychat-btn-secondary header-settings-btn"
            title="SETTINGS"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      {/* Barre de progression animée */}
      <div className="header-progress-bar">
        <div className="header-progress-animation" />
      </div>
    </header>
  );
};

export default Header;