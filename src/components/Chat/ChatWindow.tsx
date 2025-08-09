import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../../hooks/useChat';
import { useSettings } from '../../hooks/useSettings';
import './ChatWindow.css';

interface ChatWindowProps {
  sessions?: any[]; // Ajouter la prop sessions si nécessaire
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sessions }) => {
  const { activeSessions, isAnyLoading, stopStreaming } = useChat();
  const { theme } = useSettings();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  
  // Utiliser les sessions passées en prop ou les sessions actives du store
  const currentSessions = sessions || activeSessions;
  const messages = currentSessions[0]?.messages || [];
  const error = currentSessions[0]?.error || null;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
          </div>
        )}

        {messages.map((message: any) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
  {isAnyLoading && (
          <div className="chat-loading-container">
            <div className={`chat-loading-bubble ${isDark ? 'dark' : 'light'}`}>
              {/* Effet de shimmer */}
              <div className={`chat-loading-shimmer ${isDark ? 'dark' : 'light'}`} />
              <div className="chat-loading-content">
                <div className="chat-loading-dots">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`chat-loading-dot ${isDark ? 'dark' : 'light'}`}
                      style={{ animationDelay: `${(i - 1) * 0.16}s` }}
                    />
                  ))}
                </div>
                <span className="chat-loading-text">
                  Génération de la réponse...
                </span>
    <button onClick={() => stopStreaming()} className="stop-stream-btn">Arrêter</button>
              </div>
            </div>
          </div>
        )}
        
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
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
