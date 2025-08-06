import React, { useState } from 'react';
import { X, Wifi, WifiOff, Loader2, MousePointer } from 'lucide-react';
import ApiKeyInput from './ApiKeyInput';
import ModelSelector from './ModelSelector';
import { useSettings } from '../../hooks/useSettings';
import { testOpenRouterAPI } from '../../services/apiTest';
import { toggleHackerCursor } from '../../utils/hackerCursor';

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
    } catch (error) {
      setApiTestResult({
        success: false,
        message: 'Erreur lors du test de l\'API'
      });
    } finally {
      setTestingAPI(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 50,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
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
              ⚙️
            </div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: isDark ? '#f9fafb' : '#111827',
              margin: 0
            }}>
              Paramètres
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              color: isDark ? '#9ca3af' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
              (e.target as HTMLButtonElement).style.color = isDark ? '#e5e7eb' : '#374151';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.target as HTMLButtonElement).style.color = isDark ? '#9ca3af' : '#6b7280';
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ApiKeyInput />
            <ModelSelector />
            
            {/* Hacker Cursor Effects Section */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDark ? '#e5e7eb' : '#374151'
                }}>
                  Effets de Curseur Hacker
                </h3>
                <button
                  onClick={() => {
                    toggleHackerCursor();
                    setHackerCursorEnabled(!hackerCursorEnabled);
                  }}
                  style={{
                    backgroundColor: hackerCursorEnabled 
                      ? (isDark ? '#065f46' : '#d1fae5')
                      : (isDark ? '#374151' : '#f3f4f6'),
                    color: hackerCursorEnabled 
                      ? (isDark ? '#34d399' : '#059669')
                      : (isDark ? '#9ca3af' : '#6b7280'),
                    border: `1px solid ${hackerCursorEnabled 
                      ? (isDark ? '#059669' : '#34d399')
                      : (isDark ? '#4b5563' : '#d1d5db')}`,
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = hackerCursorEnabled 
                      ? (isDark ? '#047857' : '#a7f3d0')
                      : (isDark ? '#4b5563' : '#e5e7eb');
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = hackerCursorEnabled 
                      ? (isDark ? '#065f46' : '#d1fae5')
                      : (isDark ? '#374151' : '#f3f4f6');
                  }}
                >
                  <MousePointer size={14} />
                  {hackerCursorEnabled ? 'Désactiver' : 'Activer'}
                </button>
              </div>
              
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
                lineHeight: '1.4'
              }}>
                Active les effets de curseur personnalisés avec des particules et animations pour une expérience plus immersive.
              </p>
            </div>
            
            {/* Test API Section */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDark ? '#e5e7eb' : '#374151',
                  margin: 0
                }}>
                  Test de connectivité
                </h3>
                <button
                  onClick={handleTestAPI}
                  disabled={testingAPI}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    color: isDark ? '#e5e7eb' : '#374151',
                    fontSize: '12px',
                    cursor: testingAPI ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: testingAPI ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!testingAPI) {
                      (e.target as HTMLButtonElement).style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
                    }
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                  }}
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
                <div style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: apiTestResult.success 
                    ? (isDark ? '#065f46' : '#d1fae5')
                    : (isDark ? '#7f1d1d' : '#fee2e2'),
                  border: `1px solid ${apiTestResult.success 
                    ? (isDark ? '#059669' : '#34d399')
                    : (isDark ? '#dc2626' : '#fecaca')}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    {apiTestResult.success ? (
                      <Wifi size={16} style={{ color: isDark ? '#34d399' : '#059669' }} />
                    ) : (
                      <WifiOff size={16} style={{ color: isDark ? '#fca5a5' : '#dc2626' }} />
                    )}
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: apiTestResult.success 
                        ? (isDark ? '#34d399' : '#059669')
                        : (isDark ? '#fca5a5' : '#dc2626')
                    }}>
                      {apiTestResult.success ? 'API accessible' : 'API inaccessible'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: apiTestResult.success 
                      ? (isDark ? '#a7f3d0' : '#047857')
                      : (isDark ? '#fecaca' : '#b91c1c'),
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {apiTestResult.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
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
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;