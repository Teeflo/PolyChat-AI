import React from 'react';
import MessageBubble from './MessageBubble';
import ThinkingAnimation from './ThinkingAnimation';
import { useChat } from '../../hooks/useChat';
import { useSettings } from '../../hooks/useSettings';
import type { ChatSession, Message } from '../../types/index';
import './ChatWindow.css';

interface ChatWindowProps {
  sessions?: ChatSession[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sessions }) => {
  const { activeSessions, isAnyLoading, stopStreaming } = useChat();
  const { theme } = useSettings();

  const isDark = theme === 'dark';
  // Utiliser les sessions passées en prop ou les sessions actives du store
  const currentSessions = sessions || activeSessions;
  const messages = currentSessions[0]?.messages || [];
  const error = currentSessions[0]?.error || null;
  const modelName = currentSessions[0]?.modelName || currentSessions[0]?.modelId || 'Modèle inconnu';




  // Gestion du scroll utilisateur : active/désactive l'auto-scroll
  // Scroll automatique désactivé : aucun effet, l'utilisateur contrôle le scroll.



  // Scroll intelligent : ne scrolle que si auto-scroll actif
  // Aucune logique de scroll automatique, l'utilisateur contrôle le scroll.

  return (
    <div className={`chat-window-container ${isDark ? 'dark' : 'light'}`}>
      <div className="chat-window-content">
        {messages.length === 0 && (
          <div className={`chat-welcome-container ${isDark ? 'dark' : 'light'}`}>
            <div className="chat-welcome-icon">
              💬
            </div>
            <h3 className={`chat-welcome-title ${isDark ? 'dark' : 'light'}`}>
              Commencez une conversation
            </h3>
            <p className="chat-welcome-subtitle">
              Posez-moi n'importe quelle question !
            </p>
            <div className="chat-model-default">
              <span className="chat-model-label">Modèle : </span>
              <span>{modelName}</span>
            </div>
          </div>
        )}

        {messages
          .filter((message: Message) => {
            if (message.role !== 'assistant') return true;
            const content = typeof message.content === 'string' ? message.content : '';
            const trimmedContent = content.trim();
            // Exclure tout message assistant vide, ne contenant que des espaces, en streaming, '…', ou qui commence/termine par '…'
            if (!trimmedContent || message.streaming || trimmedContent === '…' || trimmedContent.startsWith('…') || trimmedContent.endsWith('…')) return false;
            return true;
          })
          .map((message: Message) => (
            <MessageBubble key={message.id} message={message} />
        ))}
        
        {error && (
          <div className="chat-error-container">
            <div className="chat-error-bubble">
              <div className="chat-error-content">
                <span className="chat-error-icon">⚠️</span>
                <div>
                  <strong className="chat-error-title">Erreur :</strong>
                  <p className="chat-error-message">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
      {/* Animation en bas de page, hors du flux des messages */}
      {isAnyLoading && (
        <ThinkingAnimation 
          theme={isDark ? 'dark' : 'light'} 
          position="bottom"
          onStop={stopStreaming}
        />
      )}
    </div>
  );
};

export default ChatWindow;
