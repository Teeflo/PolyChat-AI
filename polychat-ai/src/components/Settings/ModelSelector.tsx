import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Brain } from 'lucide-react';

const MODELS = [
  { id: 'meta-llama/Llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', description: 'Rapide et efficace' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct', description: 'Excellent pour le français' },
  { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', description: 'Polyvalent et précis' },
  { id: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', name: 'Nous Hermes 2 Mixtral 8x7B DPO', description: 'Très performant' },
];

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel, theme } = useSettings();
  const isDark = theme === 'dark';

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
          <Brain size={16} />
          Modèle d'IA
        </div>
      </label>
      
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        style={{
          width: '100%',
          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '14px',
          backgroundColor: isDark ? '#374151' : '#ffffff',
          color: isDark ? '#e5e7eb' : '#374151',
          outline: 'none',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = '#667eea';
        }}
        onBlur={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = isDark ? '#4b5563' : '#d1d5db';
        }}
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      
      {/* Description du modèle sélectionné */}
      <div style={{
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: isDark ? '#111827' : '#f8fafc',
        border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
        borderRadius: '6px'
      }}>
        <p style={{
          fontSize: '12px',
          color: isDark ? '#9ca3af' : '#6b7280',
          margin: 0
        }}>
          {MODELS.find(m => m.id === selectedModel)?.description}
        </p>
      </div>
      
      <p style={{
        fontSize: '12px',
        color: isDark ? '#9ca3af' : '#6b7280',
        marginTop: '8px',
        lineHeight: '1.4'
      }}>
        ✨ Tous ces modèles sont gratuits sur OpenRouter
      </p>
    </div>
  );
};

export default ModelSelector;