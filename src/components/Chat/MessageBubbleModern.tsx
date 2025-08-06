import React from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import type { Message } from '../../types/index';
import './MessageBubbleModern.css';

interface MessageBubbleModernProps {
  message: Message;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const MessageBubbleModern: React.FC<MessageBubbleModernProps> = ({ 
  message, 
  isLoading = false,
  error,
  onRetry 
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    // Ici vous pourriez ajouter une notification de succès
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className={`message-bubble-modern ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar */}
      <div className="message-bubble-modern-avatar">
        {isUser ? (
          <User size={18} />
        ) : (
          <Bot size={18} />
        )}
        {message.modelId && (
          <div className="message-bubble-modern-model-badge">
            {message.modelId.split('/').pop()?.split('-')[0] || 'AI'}
          </div>
        )}
      </div>

      {/* Contenu du message */}
      <div className="message-bubble-modern-content">
        {/* Header avec metadata */}
        <div className="message-bubble-modern-header">
          <span className="message-bubble-modern-role">
            {isUser ? 'Vous' : (message.modelId ? message.modelId.split('/').pop() : 'Assistant')}
          </span>
          <span className="message-bubble-modern-timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Corps du message */}
        <div className="message-bubble-modern-body">
          {isLoading ? (
            <div className="message-bubble-modern-loading">
              <div className="message-bubble-modern-typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Génération de la réponse...</span>
            </div>
          ) : (
            <div className="message-bubble-modern-text">
              {message.content}
            </div>
          )}
        </div>

        {/* Actions (uniquement pour les messages de l'assistant) */}
        {isAssistant && !isLoading && (
          <div className="message-bubble-modern-actions">
            <button
              onClick={handleCopy}
              className="message-bubble-modern-action-btn"
              aria-label="Copier le message"
            >
              <Copy size={14} />
            </button>
            
            <button
              className="message-bubble-modern-action-btn"
              aria-label="J'aime cette réponse"
            >
              <ThumbsUp size={14} />
            </button>
            
            <button
              className="message-bubble-modern-action-btn"
              aria-label="Je n'aime pas cette réponse"
            >
              <ThumbsDown size={14} />
            </button>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="message-bubble-modern-action-btn"
                aria-label="Régénérer la réponse"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        )}

        {/* Indicateur d'erreur */}
        {error && (
          <div className="message-bubble-modern-error">
            <span>❌ Erreur: {error}</span>
            {onRetry && (
              <button onClick={onRetry} className="message-bubble-modern-retry-btn">
                Réessayer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubbleModern;
