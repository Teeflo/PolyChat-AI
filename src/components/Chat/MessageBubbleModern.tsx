import React, { useMemo, useState } from 'react';
import { User, Bot, Copy, RefreshCw, Trash2 } from 'lucide-react';
import type { Message } from '../../types/index';
import './MessageBubbleModern.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettings } from '../../hooks/useSettings';

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
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  // Guard: ne rien rendre si le contenu est vide après trim (évite bulle vide)
  if (isAssistant && (!message.content || message.content.trim() === '')) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const markdownComponents = useMemo(() => ({
    // Inline code
    code: ({ className, children, ...props }: React.ComponentProps<"code"> & { inline?: boolean; 'data-nodeid'?: string; }) => {
      const inline = props.inline;
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
          <div className="code-block-wrapper">
            <button onClick={onCopyBlock} className={`code-copy-btn ${copiedBlockId === blockId ? 'success' : ''}`}>
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
      return <code className={className} {...props}>{children}</code>;
    },
    a: ({ href, children, ...props }: React.ComponentProps<"a">) => {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
          {children}
        </a>
      );
    },
  }), [copiedBlockId, isDark, message.id]);

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
          <div className="message-bubble-modern-text markdown-body">
            {(() => {
              const content = message.content;
              const fenceCount = (content.match(/```/g) || []).length;
              const hasOpenFence = message.streaming && fenceCount % 2 === 1;
              if (hasOpenFence) {
                const lastIndex = content.lastIndexOf('```');
                const head = content.slice(0, lastIndex);
                const partial = content.slice(lastIndex + 3);
                return (
                  <>
                    {head && (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {head}
                      </ReactMarkdown>
                    )}
                    <div className="partial-code-block-modern">
                      <pre>{partial || ' '}</pre>
                      <div className="partial-code-hint-modern">Code en cours…</div>
                    </div>
                    {message.streaming && <span className="streaming-cursor">▌</span>}
                  </>
                );
              }
              return (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {content}
                  </ReactMarkdown>
                  {message.streaming && <span className="streaming-cursor">▌</span>}
                </>
              );
            })()}
          </div>
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
