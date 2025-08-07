import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useChat } from '../../hooks/useChat';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { theme } = useSettings();
  const { sendMessageToAll, isAnyLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isAnyLoading) {
      await sendMessageToAll(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div style={{
      borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      padding: '20px 24px',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          backgroundColor: isDark ? '#374151' : '#f8fafc',
          borderRadius: '24px',
          padding: '6px',
          border: `2px solid ${isDark ? '#4b5563' : '#e2e8f0'}`,
          transition: 'border-color 0.2s ease'
        }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
            disabled={isAnyLoading}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: '12px 16px',
              fontSize: '14px',
              lineHeight: '1.5',
              color: isDark ? '#e5e7eb' : '#374151',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              const container = e.target.parentElement as HTMLElement;
              if (container) {
                container.style.borderColor = '#667eea';
              }
            }}
            onBlur={(e) => {
              const container = e.target.parentElement as HTMLElement;
              if (container) {
                container.style.borderColor = isDark ? '#4b5563' : '#e2e8f0';
              }
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || isAnyLoading}
            style={{
              background: (!message.trim() || isAnyLoading) 
                ? (isDark ? '#4b5563' : '#e5e7eb')
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: (!message.trim() || isAnyLoading) 
                ? (isDark ? '#9ca3af' : '#9ca3af')
                : '#ffffff',
              border: 'none',
              borderRadius: '18px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (!message.trim() || isAnyLoading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              margin: '3px'
            }}
            onMouseOver={(e) => {
              if (!(!message.trim() || isAnyLoading)) {
                (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
              }
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            {isAnyLoading ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
          fontSize: '12px',
          color: isDark ? '#9ca3af' : '#6b7280'
        }}>
          <span>
            Utilisez Shift+Entrée pour une nouvelle ligne
          </span>
          <span>
            {message.length}/2000
          </span>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;