import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import './ThemeToggle.css';

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
      className={`polychat-btn-modern theme-toggle-btn ${isDark ? 'dark-theme' : 'light-theme'}`}
      title={isDark ? 'LIGHT MODE' : 'DARK MODE'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
