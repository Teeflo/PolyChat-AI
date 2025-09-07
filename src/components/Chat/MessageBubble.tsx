import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../../types/index';
import { useSettings } from '../../hooks/useSettings';
import './MessageBubble.css';

interface MessageBubbleProps { message: Message; }

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
      'data-nodeid'?: string;
    }) => {
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
            // Silently fail if clipboard is not available
          }
        };
        return (
          <div className="code-block-wrapper">
            <button
              onClick={onCopyBlock}
              className={`code-copy-btn ${isDark ? 'dark' : 'light'}`}
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
        <code className={`inline-code ${isUser ? 'user' : 'assistant'} ${isDark ? 'dark' : 'light'}`} {...props}>
          {children}
        </code>
      );
    },
    p: ({ children, ...props }: React.ComponentProps<"p">) => <p className="paragraph" {...props}>{children}</p>,
  }), [copiedBlockId, isDark, isUser, message.id]);

  // Guard: ne rien rendre si le contenu est vide après trim (évite bulle vide)
  const contentText = typeof message.content === 'string' ? message.content : '';
  if (message.role === 'assistant' && (!contentText || contentText.trim() === '')) {
    return null;
  }


  return (
    <div className={`message-bubble-container ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message-bubble ${isUser ? 'user' : `assistant ${isDark ? 'dark' : 'light'}`}`}>
        {!isUser && (
          <div className="message-bubble-header">
            <div className="message-bubble-avatar">
              🤖
            </div>
            <span className={`message-bubble-role ${isDark ? 'dark' : 'light'}`}>
              Assistant IA
            </span>
          </div>
        )}

        <div className="message-bubble-content">
          {(() => {
            // Only handle string content for text-based operations
            if (typeof message.content !== 'string') {
              return (
                <>
                  <div>Contenu multimédia non supporté</div>
                  {message.streaming && <span className="streaming-cursor">▌</span>}
                </>
              );
            }

            const content = message.content;
            const fenceCount = (content.match(/```/g) || []).length;
            const hasOpenFence = message.streaming && fenceCount % 2 === 1;
            if (hasOpenFence) {
              // Render only completed part before last fence and raw partial after
              const lastIndex = content.lastIndexOf('```');
              const head = content.slice(0, lastIndex);
              const partial = content.slice(lastIndex + 3); // after fence delimiter
              return (
                <>
                  {head && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {head}
                    </ReactMarkdown>
                  )}
                  <div className="partial-code-block">
                    <pre>{partial || ' '}</pre>
                    <div className="partial-code-hint">Bloc de code en cours…</div>
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

        <div className={`message-bubble-timestamp ${isUser ? 'user' : 'assistant'}`}>
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