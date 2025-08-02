import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Eye, EyeOff, Key } from 'lucide-react';

const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey, theme } = useSettings();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempApiKey);
  };

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#e5e7eb' : '#374151',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={16} />
          Clé API OpenRouter
        </div>
      </label>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type={showApiKey ? 'text' : 'password'}
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            style={{
              width: '100%',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '8px',
              padding: '10px 40px 10px 12px',
              fontSize: '14px',
              backgroundColor: isDark ? '#374151' : '#ffffff',
              color: isDark ? '#e5e7eb' : '#374151',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = isDark ? '#4b5563' : '#d1d5db';
            }}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'transparent',
              border: 'none',
              color: isDark ? '#9ca3af' : '#6b7280',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.target as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          Sauvegarder
        </button>
      </form>
      
      <p style={{
        fontSize: '12px',
        color: isDark ? '#9ca3af' : '#6b7280',
        marginTop: '8px',
        lineHeight: '1.4'
      }}>
        Vous pouvez obtenir une clé API gratuite sur{' '}
        <a 
          href="https://openrouter.ai/keys" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#667eea',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLAnchorElement).style.textDecoration = 'underline';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLAnchorElement).style.textDecoration = 'none';
          }}
        >
          openrouter.ai
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput;