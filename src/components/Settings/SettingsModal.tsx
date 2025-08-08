import React, { useState } from 'react';
import { X, Wifi, WifiOff, Loader2, MousePointer } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import ModelSelector from './ModelSelector';
import { useSettings } from '../../hooks/useSettings';
import { testOpenRouterAPI } from '../../services/apiTest';
import { toggleHackerCursor } from '../../utils/hackerCursor';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useSettings();
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
    modelCount?: number;
  } | null>(null);
  const [testingAPI, setTestingAPI] = useState(false);
  const [hackerCursorEnabled, setHackerCursorEnabled] = useState(true);
  const isDark = theme === 'dark';

  const handleTestAPI = async () => {
    setTestingAPI(true);
    setApiTestResult(null);
    
    try {
      const result = await testOpenRouterAPI();
      setApiTestResult(result);
    } catch (error: unknown) {
      setApiTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du test de l\'API'
      });
    } finally {
      setTestingAPI(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className={`settings-modal-container ${isDark ? 'dark' : 'light'}`}>
        {/* Header */}
        <div className={`settings-modal-header ${isDark ? 'dark' : 'light'}`}>
          <div className="settings-modal-header-content">
            <div className="settings-modal-icon">
              ⚙️
            </div>
            <h2 className={`settings-modal-title ${isDark ? 'dark' : 'light'}`}>
              Paramètres
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`settings-modal-close-btn ${isDark ? 'dark' : 'light'}`}
            title="Fermer les paramètres"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="settings-modal-content">
          <div className="settings-modal-sections">
            <ApiKeyInput />
            <ModelSelector />
            
            {/* Hacker Cursor Effects Section */}
            <div>
              <div className="settings-section-header">
                <h3 className={`settings-section-title ${isDark ? 'dark' : 'light'}`}>
                  Effets de Curseur Hacker
                </h3>
                <button
                  onClick={() => {
                    toggleHackerCursor();
                    setHackerCursorEnabled(!hackerCursorEnabled);
                  }}
                  className={`settings-toggle-btn ${hackerCursorEnabled ? 'enabled' : 'disabled'} ${isDark ? 'dark' : 'light'}`}
                >
                  <MousePointer size={14} />
                  {hackerCursorEnabled ? 'Désactiver' : 'Activer'}
                </button>
              </div>
              
              <p className={`settings-section-description ${isDark ? 'dark' : 'light'}`}>
                Active les effets de curseur personnalisés avec des particules et animations pour une expérience plus immersive.
              </p>
            </div>
            
            {/* Test API Section */}
            <div>
              <div className="settings-section-header">
                <h3 className={`settings-section-subtitle ${isDark ? 'dark' : 'light'}`}>
                  Test de connectivité
                </h3>
                <button
                  onClick={handleTestAPI}
                  disabled={testingAPI}
                  className={`settings-test-btn ${isDark ? 'dark' : 'light'}`}
                >
                  {testingAPI ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      Test...
                    </>
                  ) : (
                    <>
                      <Wifi size={14} />
                      Tester API
                    </>
                  )}
                </button>
              </div>
              
              {apiTestResult && (
                <div className={`settings-test-result ${apiTestResult.success ? 'success' : 'error'} ${isDark ? 'dark' : 'light'}`}>
                  <div className="settings-test-result-header">
                    {apiTestResult.success ? (
                      <Wifi size={16} className={`settings-test-result-icon success ${isDark ? 'dark' : 'light'}`} />
                    ) : (
                      <WifiOff size={16} className={`settings-test-result-icon error ${isDark ? 'dark' : 'light'}`} />
                    )}
                    <span className={`settings-test-result-title ${apiTestResult.success ? 'success' : 'error'} ${isDark ? 'dark' : 'light'}`}>
                      {apiTestResult.success ? 'API accessible' : 'API inaccessible'}
                    </span>
                  </div>
                  <p className={`settings-test-result-message ${apiTestResult.success ? 'success' : 'error'} ${isDark ? 'dark' : 'light'}`}>
                    {apiTestResult.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`settings-modal-footer ${isDark ? 'dark' : 'light'}`}>
          <button
            onClick={onClose}
            className="settings-close-btn"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;