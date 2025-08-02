import React from 'react';
import { Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSettings } from '../../hooks/useSettings';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { theme } = useSettings();

  const isDark = theme === 'dark';

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