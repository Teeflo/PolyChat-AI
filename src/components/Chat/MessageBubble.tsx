import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../../types/index';
import { useSettings } from '../../hooks/useSettings';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { theme } = useSettings();
  const isUser = message.role === 'user';
  const isDark = theme === 'dark';
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  const markdownComponents = useMemo(() => ({
    a: ({ href, children, ...props }: React.ComponentProps<'a'>) => (
      <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
      </a>
    ),
          code: ({ inline, className, children, ...props }: {
        inline?: boolean;
        className?: string;
        children?: React.ReactNode;
        [key: string]: any;
      }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline) {
        const language = match ? match[1] : '';
        const codeStr = String(children).replace(/\n$/, '');
        const blockId = `${message.id}-${(props as any)['data-nodeid'] || Math.random().toString(36).slice(2)}`;
        const onCopyBlock = async () => {
          try {
            await navigator.clipboard.writeText(codeStr);
            setCopiedBlockId(blockId);
            setTimeout(() => setCopiedBlockId((prev) => (prev === blockId ? null : prev)), 1200);
          } catch {
            // Silently fail if clipboard is not available
          }
        };
        return (
          <div style={{ position: 'relative' }}>
            <button
              onClick={onCopyBlock}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                fontSize: 11,
                padding: '4px 6px',
                borderRadius: 6,
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                background: isDark ? '#111827' : '#ffffff',
                color: isDark ? '#e5e7eb' : '#111827'
              }}
            >
              {copiedBlockId === blockId ? 'Copié' : 'Copier'}
            </button>
            <SyntaxHighlighter
              language={language}
              style={isDark ? oneDark : oneLight}
              customStyle={{ margin: 0, background: 'transparent' }}
              PreTag="div"
              CodeTag="code"
            >
              {codeStr}
            </SyntaxHighlighter>
          </div>
        );
      }
      return (
        <code style={{
          backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : (isDark ? '#1f2937' : '#f3f4f6'),
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'Monaco, Consolas, monospace'
        }} className={className} {...props}>
          {children}
        </code>
      );
    },
    p: ({ children, ...props }: React.ComponentProps<"p">) => <p style={{ margin: '0 0 8px 0' }} {...props}>{children}</p>,
  }), [copiedBlockId, isDark, isUser, message.id]);

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

        <div className="markdown-body" style={{ fontSize: '14px', lineHeight: '1.6', wordBreak: 'break-word', whiteSpace: 'normal' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
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