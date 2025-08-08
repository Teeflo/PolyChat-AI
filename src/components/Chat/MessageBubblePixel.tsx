import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../../types/index';
import { User, Bot } from 'lucide-react';
import './MessageBubblePixel.css';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  const markdownComponents = useMemo(() => ({
    p: ({ children, ...props }: React.ComponentProps<"p">) => <p className="pixel-message-paragraph" {...props}>{children}</p>,
    ul: ({ children, ...props }: React.ComponentProps<"ul">) => <ul className="pixel-list" {...props}>{children}</ul>,
    ol: ({ children, ...props }: React.ComponentProps<"ol">) => <ol className="pixel-list" {...props}>{children}</ol>,
    h1: ({ children, ...props }: React.ComponentProps<"h1">) => <h1 className="pixel-heading pixel-h1" {...props}>{children}</h1>,
    h2: ({ children, ...props }: React.ComponentProps<"h2">) => <h2 className="pixel-heading pixel-h2" {...props}>{children}</h2>,
    h3: ({ children, ...props }: React.ComponentProps<"h3">) => <h3 className="pixel-heading pixel-h3" {...props}>{children}</h3>,
    blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => <blockquote className="pixel-blockquote" {...props}>{children}</blockquote>,
    a: ({ href, children, ...props }: React.ComponentProps<"a">) => {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
          {children}
        </a>
      );
    },
    code: ({ className, children, ...props }: React.ComponentProps<"code"> & { inline?: boolean }) => {
      const inline = (props as any).inline;
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
          <div className="pixel-code-block">
            <button
              onClick={onCopyBlock}
              className="pixel-btn-modern pixel-code-copy-btn"
            >
              {copiedBlockId === blockId ? 'Copié' : 'Copier'}
            </button>
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{ margin: 0, background: 'transparent' }}
              PreTag="div"
              CodeTag="code"
            >
              {codeStr}
            </SyntaxHighlighter>
          </div>
        );
      }
      return <code className="pixel-inline-code" {...props}>{children}</code>;
    },
  }), [copiedBlockId, message.id]);
  
  return (
    <div className={`pixel-message-container ${isUser ? 'user' : 'assistant'}`}>
      <div className={`pixel-message ${isUser ? 'pixel-message-user' : 'pixel-message-assistant'}`}>
        {!isUser && (
          <div className="pixel-message-header">
            <div className="pixel-avatar-container">
              <Bot size={12} className="bot-icon" />
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
              <User size={12} className="user-icon" />
            </div>
          </div>
        )}

        <div className="pixel-message-content markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
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
