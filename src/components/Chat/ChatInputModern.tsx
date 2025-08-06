import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import './ChatInputModern.css';

const ChatInputModern: React.FC = () => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessageToAll, isAnyLoading } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = async () => {
    if (message.trim() && !isAnyLoading) {
      await sendMessageToAll(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-modern-container">
      <div className="chat-input-modern-wrapper">
        {/* Zone de saisie principale */}
        <div className="chat-input-modern-input-area">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question à l'IA..."
            className="chat-input-modern-textarea"
            disabled={isAnyLoading}
            rows={1}
            maxLength={4000}
          />
          
          {/* Compteur de caractères */}
          <div className="chat-input-modern-char-counter">
            {message.length}/4000
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="chat-input-modern-actions">
          {/* Bouton d'envoi */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isAnyLoading}
            className={`chat-input-modern-send-btn ${message.trim() ? 'active' : 'inactive'}`}
            aria-label="Envoyer le message"
          >
            {isAnyLoading ? (
              <div className="chat-input-modern-spinner" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Raccourcis clavier */}
      <div className="chat-input-modern-shortcuts">
        <span className="chat-input-modern-shortcut">
          <kbd>Entrée</kbd> pour envoyer • <kbd>Shift + Entrée</kbd> pour nouvelle ligne
        </span>
      </div>
    </div>
  );
};

export default ChatInputModern;
