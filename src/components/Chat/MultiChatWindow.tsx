import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubblePixel';
import ThinkingAnimation from './ThinkingAnimation';
import { Terminal, Zap } from 'lucide-react';
import type { ChatSession } from '../../types/index';

interface MultiChatWindowProps {
  sessions: ChatSession[];
}

const MultiChatWindow: React.FC<MultiChatWindowProps> = ({ sessions }) => {
  const messagesEndRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll individuel par session : chaque session scroll si ses messages changent ou si elle est en génération
  useEffect(() => {
    sessions.forEach(session => {
      const ref = messagesEndRefs.current[session.id];
      if (ref && (session.isLoading || session.messages.length > 0)) {
        ref.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, [sessions.map(s => s.messages.length).join(','), sessions.map(s => s.isLoading).join(',')]);

  const setMessagesEndRef = (sessionId: string) => (el: HTMLDivElement) => {
    messagesEndRefs.current[sessionId] = el;
  };

  const renderChatWindow = (session: ChatSession) => (
    <div key={session.id} className="pixel-chat-session">
      <div className="pixel-card pixel-chat-window">
        {/* Header de la fenêtre de chat */}
        <div className="pixel-chat-header">
          <Terminal size={16} className="pixel-pulse" />
          <span className="pixel-chat-title">
            {session.modelName.split('/').pop() || session.modelName}
          </span>
          <div className="pixel-chat-status">
            <div className={`pixel-status-indicator ${session.isLoading ? 'loading' : 'active'}`} />
            <span>{session.isLoading ? 'THINKING...' : 'READY'}</span>
          </div>
        </div>

        <div className="pixel-chat-content">
          {session.messages.length === 1 && session.messages[0].role === 'assistant' && (
            <div className="pixel-welcome-message">
              <div className="pixel-welcome-icon">
                <Zap size={24} className="pixel-pulse" />
              </div>
              <div className="pixel-welcome-text">
                <h4 className="pixel-welcome-title">MODEL READY</h4>
                <p className="pixel-welcome-subtitle">
                  {session.modelName.split('/').pop()}
                </p>
              </div>
            </div>
          )}

          {session.messages
            .filter((message) => {
              if (message.role !== 'assistant') return true;
              const content = (message.content || '').replace(/\s|\n|\r/g, '');
              if (!content || content === '…' || content.startsWith('…') || content.endsWith('…')) return false;
              return true;
            })
            .map((message) => (
              <MessageBubble key={message.id} message={message} />
          ))}

          {session.isLoading && (
            <div className="pixel-loading-container">
              <ThinkingAnimation 
                theme="dark" 
                position="inline"
              />
            </div>
          )}

          {session.error && (
            <div className="pixel-error-container">
              <div className="pixel-error-message">
                <div className="pixel-error-icon">⚠️</div>
                <div className="pixel-error-content">
                  <div className="pixel-error-title">ERROR</div>
                  <div className="pixel-error-text">{session.error}</div>
                </div>
              </div>
            </div>
          )}

          <div ref={setMessagesEndRef(session.id)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`pixel-multi-chat-container pixel-chat-count-${sessions.length}`}>
      {sessions.map(renderChatWindow)}
    </div>
  );
};

export default MultiChatWindow;
