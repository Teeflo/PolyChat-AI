import React from 'react';
import { Settings, Cpu } from 'lucide-react';
import ThemeToggle from './ThemeTogglePixel';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="pixel-header">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px'
      }}>
        {/* Logo et titre */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px' 
        }}>
          {/* Logo pixel rétro */}
          <div className="pixel-logo pixel-glow" style={{
            width: '48px',
            height: '48px',
            background: 'var(--pixel-accent-1)',
            border: '3px solid var(--pixel-bg-primary)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <picture className="header-logo-picture">
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.svg"
                alt="PolyChat logo"
                className="header-logo-img"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </picture>
            <Cpu size={24} style={{ 
              color: 'var(--pixel-bg-primary)',
              filter: 'drop-shadow(1px 1px 0px var(--pixel-white))',
              zIndex: 1
            }} />
          </div>
          
          {/* Titre avec effet rétro */}
          <div>
            <h1 style={{
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '16px',
              color: 'var(--pixel-white)',
              margin: 0,
              textShadow: '2px 2px 0px var(--pixel-bg-primary), 4px 4px 0px var(--pixel-accent-1)',
              letterSpacing: '2px',
              lineHeight: 1.2
            }}>
              POLYCHAT
            </h1>
            <div style={{
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '8px',
              color: 'var(--pixel-accent-1)',
              marginTop: '4px',
              letterSpacing: '1px',
              display: 'none' // Masquer pour une interface plus épurée
            }}>
            </div>
          </div>
        </div>
        
        {/* Contrôles */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          {/* Indicateur de statut */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--pixel-bg-primary)',
            border: '2px solid var(--matrix-green)',
            fontSize: '8px',
            color: 'var(--matrix-green)',
            fontFamily: 'Press Start 2P, monospace'
          }}>
            <div className="pixel-status-online" />
            ONLINE
          </div>
          
          {/* Toggle thème */}
          <ThemeToggle />
          
          {/* Bouton paramètres pixel */}
          <button
            onClick={onSettingsClick}
            className="pixel-btn pixel-btn-secondary"
            style={{
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '48px',
              minHeight: '48px'
            }}
            title="SETTINGS"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      {/* Barre de progression animée */}
      <div style={{
        height: '4px',
        background: 'var(--pixel-bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          background: `linear-gradient(
            90deg,
            transparent 0%,
            var(--pixel-accent-1) 50%,
            transparent 100%
          )`,
          animation: 'pixelSlideIn 3s infinite linear'
        }} />
      </div>
    </header>
  );
};

export default Header;
