import React, { useState } from 'react';
import { X, Wifi, WifiOff, Loader2, Settings, Monitor } from 'lucide-react';
import ApiKeyInput from './ApiKeyInputPixel';
import ModelSelector from './ModelSelectorPixel';
import { testOpenRouterAPI } from '../../services/apiTest';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
    modelCount?: number;
  } | null>(null);
  const [testingAPI, setTestingAPI] = useState(false);

  const handleTestAPI = async () => {
    setTestingAPI(true);
    setApiTestResult(null);
    
    try {
      const result = await testOpenRouterAPI();
      setApiTestResult(result);
    } catch (error) {
      setApiTestResult({
        success: false,
        message: 'API TEST FAILED'
      });
    } finally {
      setTestingAPI(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pixel-modal-overlay">
      <div className="pixel-modal-content">
        {/* Header du modal */}
        <div className="pixel-modal-header">
          <div className="pixel-modal-title-section">
            <Settings size={16} className="pixel-pulse" />
            <h2 className="pixel-modal-title">SYSTEM CONFIG</h2>
          </div>
          <button 
            onClick={onClose}
            className="pixel-btn pixel-btn-danger pixel-close-btn"
            title="CLOSE"
          >
            <X size={12} />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="pixel-modal-body">
          {/* Section API Key */}
          <div className="pixel-settings-section">
            <div className="pixel-section-header">
              <h3 className="pixel-section-title">API CONFIGURATION</h3>
              <div className="pixel-section-line" />
            </div>
            <div className="pixel-section-content">
              <ApiKeyInput />
            </div>
          </div>

          {/* Section Model */}
          <div className="pixel-settings-section">
            <div className="pixel-section-header">
              <h3 className="pixel-section-title">MODEL SELECTION</h3>
              <div className="pixel-section-line" />
            </div>
            <div className="pixel-section-content">
              <ModelSelector />
            </div>
          </div>

          {/* Section Test API */}
          <div className="pixel-settings-section">
            <div className="pixel-section-header">
              <h3 className="pixel-section-title">CONNECTION TEST</h3>
              <div className="pixel-section-line" />
            </div>
            <div className="pixel-section-content">
              <button
                onClick={handleTestAPI}
                disabled={testingAPI}
                className={`pixel-btn pixel-test-btn ${testingAPI ? 'loading' : ''}`}
              >
                {testingAPI ? (
                  <>
                    <Loader2 size={12} className="pixel-pulse" />
                    <span className="pixel-btn-text">TESTING...</span>
                  </>
                ) : (
                  <>
                    <Monitor size={12} />
                    <span className="pixel-btn-text">TEST API</span>
                  </>
                )}
              </button>

              {/* Résultat du test */}
              {apiTestResult && (
                <div className={`pixel-test-result ${apiTestResult.success ? 'success' : 'error'}`}>
                  <div className="pixel-test-status">
                    {apiTestResult.success ? (
                      <Wifi size={12} className="pixel-success-icon" style={{ color: 'var(--matrix-green)' }} />
                    ) : (
                      <WifiOff size={12} className="pixel-error-icon" />
                    )}
                    <span className="pixel-test-message">
                      {apiTestResult.success ? 'CONNECTION OK' : 'CONNECTION FAILED'}
                    </span>
                  </div>
                  {apiTestResult.modelCount && (
                    <div className="pixel-test-details">
                      MODELS AVAILABLE: {apiTestResult.modelCount}
                    </div>
                  )}
                  <div className="pixel-test-description">
                    {apiTestResult.message}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer du modal */}
        <div className="pixel-modal-footer">
          <div className="pixel-footer-info">
            <span>POLYCHAT AI v1.0</span>
            <span>SYSTEM STATUS: READY</span>
          </div>
          <button 
            onClick={onClose}
            className="pixel-btn pixel-btn-success"
          >
            <span className="pixel-btn-text">SAVE & EXIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
