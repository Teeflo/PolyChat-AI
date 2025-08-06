import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Eye, EyeOff, Key, Lock } from 'lucide-react';

const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey } = useSettings();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempApiKey);
  };

  return (
    <div className="pixel-input-group">
      <label className="pixel-label">
        <div className="pixel-label-content">
          <Key size={12} />
          <span>OPENROUTER API KEY</span>
          <Lock size={8} className="pixel-security-icon" />
        </div>
      </label>

      <form onSubmit={handleSubmit} className="pixel-form">
        <div className="pixel-input-container-with-button">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="pixel-input pixel-api-input"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="pixel-btn pixel-btn-secondary pixel-toggle-btn"
            title={showApiKey ? 'HIDE' : 'SHOW'}
          >
            {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>

        <button
          type="submit"
          className="pixel-btn pixel-btn-success pixel-submit-btn"
          disabled={!tempApiKey.trim() || tempApiKey === apiKey}
        >
          <span className="pixel-btn-text">SAVE KEY</span>
        </button>
      </form>

      <div className="pixel-help-text">
        <span>SECURE KEY STORAGE - LOCAL ONLY</span>
      </div>
    </div>
  );
};

export default ApiKeyInput;
