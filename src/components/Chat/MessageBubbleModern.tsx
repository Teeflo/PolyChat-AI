import React, { useMemo, useState } from 'react';
import { User, Bot, Copy, RefreshCw, Trash2 } from 'lucide-react';
import type { Message, MessageContent } from '../../types/index';
import './MessageBubbleModern.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettings } from '../../hooks/useSettings';
import ImageDisplay from '../ui/ImageDisplay';

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
  onDelete,
}) => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  const markdownComponents = useMemo(
    () => ({
      img: ({ src, alt }: React.ComponentProps<'img'>) => {
        if (!src) return null;
        return (
          <ImageDisplay src={src} alt={alt || 'Image générée'} className="message-embedded-image" />
        );
      },
      code: ({
        className,
        children,
        ...props
      }: React.ComponentProps<'code'> & { inline?: boolean; 'data-nodeid'?: string }) => {
        const inline = props.inline;
        const match = /language-(\w+)/.exec(className || '');
        if (!inline) {
          const language = match ? match[1] : '';
          const codeStr = String(children).replace(/\n$/, '');
          const blockId = `${message.id}-${(props as { 'data-nodeid'?: string })['data-nodeid'] || Math.random().toString(36).slice(2)}`;
          const onCopyBlock = async () => {
            try {
              await navigator.clipboard.writeText(codeStr);
              setCopiedBlockId(blockId);
              setTimeout(() => setCopiedBlockId((prev) => (prev === blockId ? null : prev)), 1200);
            } catch {
              // Ignorer
            }
          };
          return (
            <div className="code-block-wrapper">
              <button
                onClick={onCopyBlock}
                className={`code-copy-btn ${copiedBlockId === blockId ? 'success' : ''}`}
              >
                <Copy size={12} /> {copiedBlockId === blockId ? 'Copié' : 'Copier'}
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
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      a: ({ href, children, ...props }: React.ComponentProps<'a'>) => {
        return (
          <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
            {children}
          </a>
        );
      },
    }),
    [copiedBlockId, isDark, message.id]
  );

  const getMessageText = (content: string | MessageContent[]): string => {
    if (typeof content === 'string') {
      return content;
    }
    return content
      .filter((item) => item.type === 'text')
      .map((item) => item.text || '')
      .join(' ');
  };

  const hasVisibleContent = (content: string | MessageContent[]): boolean => {
    if (typeof content === 'string') {
      return content.trim() !== '';
    }
    if (Array.isArray(content)) {
      return content.some((part) => {
        if (part.type === 'text' && part.text) {
          return part.text.trim() !== '';
        }
        if (part.type === 'image_url' && part.image_url?.url) {
          return true;
        }
        return false;
      });
    }
    return false;
  };

  if (isAssistant && !hasVisibleContent(message.content) && !message.streaming) {
    return null;
  }

  const handleCopy = () => {
    const textToCopy = getMessageText(message.content);
    navigator.clipboard.writeText(textToCopy);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <div className={`message-bubble-modern ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-bubble-modern-avatar">
        {isUser ? <User size={18} /> : <Bot size={18} />}
        {message.modelId && (
          <div className="message-bubble-modern-model-badge">
            {message.modelId.split('/').pop()?.split('-')[0] || 'AI'}
          </div>
        )}
      </div>

      <div className="message-bubble-modern-content">
        <div className="message-bubble-modern-header">
          <span className="message-bubble-modern-role">
            {isUser ? 'Vous' : message.modelId ? message.modelId.split('/').pop() : 'Assistant'}
          </span>
          <span className="message-bubble-modern-timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div className="message-bubble-modern-body">
          <div className="message-bubble-modern-text markdown-body">
            {(() => {
              if (Array.isArray(message.content)) {
                return (
                  <>
                    {message.content.map((part, index) => {
                      if (part.type === 'text') {
                        const textContent = part.text || '';
                        return (
                          <ReactMarkdown
                            key={index}
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {textContent}
                          </ReactMarkdown>
                        );
                      } else if (part.type === 'image_url' && part.image_url?.url) {
                        return (
                          <ImageDisplay
                            key={index}
                            src={part.image_url.url}
                            alt="Generated Image"
                            className="message-embedded-image"
                          />
                        );
                      }
                      return null;
                    })}
                    {message.streaming && (
                      <span className="streaming-cursor" aria-hidden="true">
                        ▌
                      </span>
                    )}
                  </>
                );
              } else {
                const textContent = getMessageText(message.content);
                return (
                  <>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {textContent}
                    </ReactMarkdown>
                    {message.streaming && (
                      <span className="streaming-cursor" aria-hidden="true">
                        ▌
                      </span>
                    )}
                  </>
                );
              }
            })()}
          </div>
        </div>

        {!isLoading && (
          <div className="message-bubble-modern-actions">
            <button
              onClick={handleCopy}
              className="message-bubble-modern-action-btn"
              aria-label="Copier le message"
            >
              <Copy size={14} />
            </button>
            {isAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="message-bubble-modern-action-btn"
                aria-label="Régénérer la réponse"
              >
                <RefreshCw size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="message-bubble-modern-action-btn message-bubble-modern-delete-btn"
                aria-label="Supprimer le message"
              >
                <Trash2 size={14} />
              </button>
            )}
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

const arePropsEqual = (
  prevProps: MessageBubbleModernProps,
  nextProps: MessageBubbleModernProps
) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.streaming === nextProps.message.streaming &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.error === nextProps.error
  );
};

export default React.memo(MessageBubbleModern, arePropsEqual);
