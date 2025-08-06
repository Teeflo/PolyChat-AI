import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Zap } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessageToAll, isAnyLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isAnyLoading) {
      sendMessageToAll(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <div className="pixel-card pixel-input-container">
      {/* Header du terminal */}
      <div className="pixel-terminal-header">
        <Zap size={12} className="pixel-pulse" />
        INPUT TERMINAL
        <div className="pixel-terminal-controls">
          <div className="pixel-terminal-dot green" />
          <div className="pixel-terminal-dot yellow" />
          <div className="pixel-terminal-dot red" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="pixel-input-form">
          {/* Zone de saisie */}
          <div className="pixel-input-wrapper">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ENTER MESSAGE..."
              disabled={isAnyLoading}
              className="pixel-input-textarea"
              style={{ 
                color: 'var(--pixel-accent-1)',
                borderColor: 'rgba(100, 116, 139, 0.3)'
              }}
            />
            
            {/* Curseur clignotant */}
            {message.length === 0 && (
              <div className="pixel-cursor" />
            )}
          </div>

          {/* Bouton d'envoi */}
          <button
            type="submit"
            disabled={!message.trim() || isAnyLoading}
            className={`pixel-btn pixel-btn-success pixel-send-btn ${
              isAnyLoading ? 'loading' : ''
            } ${(!message.trim() || isAnyLoading) ? 'disabled' : ''}`}
            title="SEND MESSAGE"
          >
            {isAnyLoading ? (
              <>
                <Loader2 size={16} className="pixel-pulse" />
                <span className="pixel-send-btn-text">SEND</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span className="pixel-send-btn-text">SEND</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Barre de statut */}
      <div className="pixel-status-bar">
        <span>CHARS: {message.length}/2000</span>
        <span>{isAnyLoading ? 'PROCESSING...' : 'READY'}</span>
        <span>SHIFT+ENTER: NEW LINE</span>
      </div>
    </div>
  );
};

export default ChatInput;
