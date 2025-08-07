import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useSettings();

  const isDark = theme === 'dark';

  const toggle = () => {
    toggleTheme();
    // Appliquer le thème au document
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggle}
      className="pixel-btn"
      style={{
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '48px',
        minHeight: '48px',
        background: isDark ? 'var(--pixel-accent-2)' : 'var(--pixel-yellow)',
        color: 'var(--pixel-bg-primary)'
      }}
      title={isDark ? 'LIGHT MODE' : 'DARK MODE'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;