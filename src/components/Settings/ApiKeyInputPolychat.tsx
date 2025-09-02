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
    <div className="polychat-input-group">
      <label className="polychat-label">
        <div className="polychat-label-content">
          <Key size={12} />
          <span>OPENROUTER API KEY</span>
          <Lock size={8} className="polychat-security-icon" />
        </div>
      </label>

      <form onSubmit={handleSubmit} className="polychat-form">
        <div className="polychat-input-container-with-button">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="polychat-input polychat-api-input"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="polychat-btn polychat-btn-secondary polychat-toggle-btn"
            title={showApiKey ? 'HIDE' : 'SHOW'}
          >
            {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>

        <button
          type="submit"
          className="polychat-btn polychat-btn-success polychat-submit-btn"
          disabled={!tempApiKey.trim() || tempApiKey === apiKey}
        >
          <span className="polychat-btn-text">SAVE KEY</span>
        </button>
      </form>

      <div className="polychat-help-text">
        <span>SECURE KEY STORAGE - LOCAL ONLY</span>
      </div>
    </div>
  );
};

export default ApiKeyInput;
