import React from 'react';
import { User, Bot, Copy, RefreshCw, Trash2 } from 'lucide-react';
import type { Message } from '../../types/index';
import './MessageBubbleModern.css';

interface MessageBubbleModernProps {
  message: Message;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
}

const MessageBubbleModern: React.FC<MessageBubbleModernProps> = ({ 
  message, 
  isLoading = false,
  error,
  onRetry,
  onRegenerate,
  onDelete
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

        {/* Actions - Pour tous les messages */}
        {!isLoading && (
          <div className="message-bubble-modern-actions">
            {/* Bouton copier - pour tous les messages */}
            <button
              onClick={handleCopy}
              className="message-bubble-modern-action-btn"
              aria-label="Copier le message"
            >
              <Copy size={14} />
            </button>
            
            {/* Bouton régénérer - seulement pour les messages assistant */}
            {isAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="message-bubble-modern-action-btn"
                aria-label="Régénérer la réponse"
              >
                <RefreshCw size={14} />
              </button>
            )}
            
            {/* Bouton supprimer - pour tous les messages */}
            {onDelete && (
              <button
                onClick={onDelete}
                className="message-bubble-modern-action-btn message-bubble-modern-delete-btn"
                aria-label="Supprimer le message"
              >
                <Trash2 size={14} />
              </button>
            )}
            
            {/* Bouton retry pour les erreurs */}
            {onRetry && (
              <button
                onClick={onRetry}
                className="message-bubble-modern-action-btn"
                aria-label="Réessayer"
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
