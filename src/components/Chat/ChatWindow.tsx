import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../../hooks/useChat';
import { useSettings } from '../../hooks/useSettings';
import { Loader2 } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const { messages, isLoading, error } = useChat();
  const { theme } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
      backgroundColor: isDark ? '#111827' : '#f8fafc',
      backgroundImage: isDark 
        ? 'radial-gradient(circle at 25% 25%, #1e293b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0f172a 0%, transparent 50%)'
        : 'radial-gradient(circle at 25% 25%, #f1f5f9 0%, transparent 50%), radial-gradient(circle at 75% 75%, #e2e8f0 0%, transparent 50%)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: isDark ? '#9ca3af' : '#6b7280'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              💬
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
              color: isDark ? '#e5e7eb' : '#374151'
            }}>
              Commencez une conversation
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Posez-moi n'importe quelle question !
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              color: isDark ? '#e5e7eb' : '#374151',
              borderRadius: '18px',
              borderBottomLeftRadius: '6px',
              padding: '16px 20px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 
                  size={16} 
                  style={{ 
                    animation: 'spin 1s linear infinite',
                    color: isDark ? '#818cf8' : '#6366f1'
                  }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  IA en train d'écrire...
                </span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '18px',
              borderBottomLeftRadius: '6px',
              padding: '16px 20px',
              border: '1px solid #fecaca',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <div>
                  <strong style={{ fontSize: '14px' }}>Erreur :</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
