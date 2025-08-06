import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types/index';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`pixel-message-container ${isUser ? 'user' : 'assistant'}`}>
      <div className={`pixel-message ${isUser ? 'pixel-message-user' : 'pixel-message-assistant'}`}>
        {!isUser && (
          <div className="pixel-message-header">
            <div className="pixel-avatar-container">
              <Bot size={12} style={{ color: 'var(--matrix-green)' }} />
            </div>
            <span className="pixel-message-sender">AI ASSISTANT</span>
            <div className="pixel-status-dot active" />
          </div>
        )}

        {isUser && (
          <div className="pixel-message-header user">
            <div className="pixel-status-dot active" />
            <span className="pixel-message-sender">USER</span>
            <div className="pixel-avatar-container user">
              <User size={12} style={{ color: 'white' }} />
            </div>
          </div>
        )}

        <div className="pixel-message-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="pixel-message-paragraph">{children}</p>,
              code: ({ children }) => (
                <code className="pixel-inline-code">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="pixel-code-block">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="pixel-list">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="pixel-list">
                  {children}
                </ol>
              ),
              h1: ({ children }) => <h1 className="pixel-heading pixel-h1">{children}</h1>,
              h2: ({ children }) => <h2 className="pixel-heading pixel-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="pixel-heading pixel-h3">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="pixel-blockquote">
                  {children}
                </blockquote>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div className="pixel-message-footer">
          <div className="pixel-timestamp">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div className="pixel-message-status">
            {isUser ? 'SENT' : 'RECEIVED'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
