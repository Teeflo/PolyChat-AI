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
      aria-label={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;