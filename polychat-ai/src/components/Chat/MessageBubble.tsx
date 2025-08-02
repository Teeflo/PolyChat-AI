import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types/index';
import { useSettings } from '../../hooks/useSettings';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { theme } = useSettings();
  const isUser = message.role === 'user';
  const isDark = theme === 'dark';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '20px'
    }}>
      <div style={{
        maxWidth: '75%',
        borderRadius: '20px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ...(isUser ? {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          borderBottomRightRadius: '6px'
        } : {
          backgroundColor: isDark ? '#374151' : '#ffffff',
          color: isDark ? '#e5e7eb' : '#374151',
          borderBottomLeftRadius: '6px',
          border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb'
        })
      }}>
        {!isUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              🤖
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Assistant IA
            </span>
          </div>
        )}

        <div style={{
          fontSize: '14px',
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
              code: ({ children }) => (
                <code style={{
                  backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : (isDark ? '#1f2937' : '#f3f4f6'),
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre style={{
                  backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : (isDark ? '#1f2937' : '#f3f4f6'),
                  padding: '12px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  margin: '8px 0',
                  fontSize: '13px',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  {children}
                </pre>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div style={{
          fontSize: '11px',
          marginTop: '8px',
          opacity: 0.7,
          textAlign: isUser ? 'right' : 'left'
        }}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;