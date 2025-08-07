import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubblePixel';
import { useChat } from '../../hooks/useChat';
import { Loader2, Terminal, Zap } from 'lucide-react';

interface ChatWindowPixelProps {
  sessions?: any[];
}

const ChatWindow: React.FC<ChatWindowPixelProps> = ({ sessions }) => {
  const { activeSessions, isAnyLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="pixel-card pixel-chat-window">
      {/* Header de la fenêtre de chat */}
      <div className="pixel-chat-header">
        <Terminal size={16} className="pixel-pulse" />
        <span className="pixel-chat-title">CHAT TERMINAL</span>
        <div className="pixel-chat-status" style={{ display: 'none' }}>
              <div className="pixel-status-indicator active" />
              <span>ONLINE</span>
            </div>
      </div>

      <div className="pixel-chat-content">
        {messages.length === 0 && (
          <div className="pixel-welcome-message">
            <div className="pixel-welcome-icon">
              <Zap size={32} className="pixel-pulse" />
            </div>
            <div className="pixel-welcome-text">
              <h3 className="pixel-welcome-title">SYSTEM READY</h3>
              <p className="pixel-welcome-subtitle">
                ENTER YOUR QUERY TO BEGIN...
              </p>
            </div>
            <div className="pixel-welcome-grid">
              <div className="pixel-grid-cell" />
              <div className="pixel-grid-cell" />
              <div className="pixel-grid-cell" />
              <div className="pixel-grid-cell" />
            </div>
          </div>
        )}

        {messages.map((message: any) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isAnyLoading && (
          <div className="pixel-typing-indicator">
            <div className="pixel-message-assistant">
              <div className="pixel-typing-content">
                <Loader2 size={16} className="pixel-pulse" />
                <span className="pixel-typing-text">AI PROCESSING...</span>
              </div>
              <div className="pixel-loading-bar">
                <div className="pixel-loading-progress" />
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="pixel-error-message">
            <div className="pixel-error-content">
              <div className="pixel-error-header">
                <span className="pixel-error-icon">⚠️</span>
                <span className="pixel-error-title">SYSTEM ERROR</span>
              </div>
              <div className="pixel-error-body">
                <p className="pixel-error-text">{error}</p>
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
