import React from 'react';
import { Settings, Cpu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSettings } from '../../hooks/useSettings';

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
            <Cpu size={24} style={{ 
              color: 'var(--pixel-bg-primary)',
              filter: 'drop-shadow(1px 1px 0px var(--pixel-white))'
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
            {/* Texte supprimé pour une interface plus épurée */}
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
            border: '2px solid var(--pixel-green)',
            fontSize: '8px',
            color: 'var(--pixel-green)',
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

  return (
    <>
      <header style={{
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🤖
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '700',
            color: isDark ? '#f9fafb' : '#111827',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            PolyChat AI
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          <button
            onClick={onSettingsClick}
            style={{
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              border: 'none',
              color: isDark ? '#e5e7eb' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
              target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
              target.style.transform = 'scale(1)';
            }}
            aria-label="Paramètres"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;