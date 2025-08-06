import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Smile, Square } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import './ChatInputModern.css';

const ChatInputModern: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ici vous pourriez implémenter la logique d'enregistrement vocal
  };

  return (
    <div className="chat-input-modern-container">
      <div className="chat-input-modern-wrapper">
        {/* Barre d'outils */}
        <div className="chat-input-modern-toolbar">
          <button
            className="chat-input-modern-tool-btn"
            aria-label="Joindre un fichier"
          >
            <Paperclip size={18} />
          </button>
          
          <button
            className="chat-input-modern-tool-btn"
            aria-label="Ajouter un emoji"
          >
            <Smile size={18} />
          </button>
        </div>

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
          {/* Bouton d'enregistrement vocal */}
          <button
            onClick={toggleRecording}
            className={`chat-input-modern-action-btn ${isRecording ? 'recording' : ''}`}
            aria-label={isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message vocal"}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} />}
          </button>

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

      {/* Indicateur de frappe si nécessaire */}
      {isAnyLoading && (
        <div className="chat-input-modern-typing-indicator">
          <div className="chat-input-modern-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="chat-input-modern-typing-text">L'IA réfléchit...</span>
        </div>
      )}

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
