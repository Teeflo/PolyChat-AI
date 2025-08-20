import React from 'react';
import MessageBubbleModern from './MessageBubbleModern';
import { Terminal, Zap, Bot } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import InlineModelPicker from './InlineModelPicker';
import type { ChatSession } from '../../types/index';
import './MultiChatWindowModern.css';

interface MultiChatWindowModernProps {
  sessions: ChatSession[];
}

const MultiChatWindowModern: React.FC<MultiChatWindowModernProps> = ({ sessions }) => {
  const { regenerateMessage, deleteMessage, streamingProgress, setSessionModel } = useChat();

  const renderChatWindow = (session: ChatSession) => (
    <div key={session.id} className="chat-session-modern">
      <div className="chat-window-modern">
        {/* Header de la fenêtre de chat modernisé */}
        <div className="chat-header-modern">
          <div className="chat-header-modern-info">
            <div className="chat-header-modern-icon">
              <Bot size={18} />
            </div>
            <div className="chat-header-modern-details">
              <InlineModelPicker
                sessionId={session.id}
                currentModelId={session.modelId}
                currentModelName={session.modelName}
                onSelect={(id)=> setSessionModel(session.id, id)}
              />
              <span className="chat-header-modern-subtitle">
                {/* Affiche 0 si aucun message utilisateur n'a été envoyé */}
                {session.messages.filter(m => m.role !== 'system').length} messages
              </span>
            </div>
          </div>
          
          <div className="chat-header-modern-status">
            {/* Point vert retiré */}
            {session.isLoading && (
              <span className="chat-status-text-modern">Réflexion...</span>
            )}
          </div>
        </div>

        {/* Contenu du chat */}
        <div className="chat-content-modern">
          {session.isLoading && streamingProgress[session.id] && (
            <div className="chat-stream-progress" aria-label="Progression du flux">
              <div className="chat-stream-bar">
                {(() => {
                  const chars = streamingProgress[session.id].chars;
                  const pct = Math.min(90, 10 + (Math.log10(chars + 10) * 25));
                  const bucket = Math.round(pct / 5) * 5; // step 5%
                  const cls = `w-${bucket}`; // will map in CSS
                  return <div className={`chat-stream-bar-fill ${cls}`} />;
                })()}
              </div>
              <span className="chat-stream-metric">
                {streamingProgress[session.id].chars} caractères
              </span>
            </div>
          )}
          {/* Messages du chat - TOUT dans la zone scrollable */}
          <div className="chat-messages-modern">
            {/* Message d'accueil stylisé */}
            {session.messages.length === 1 && session.messages[0].role === 'assistant' && (
              <div className="chat-welcome-modern">
                <div className="chat-welcome-modern-icon">
                  <Zap size={32} />
                </div>
                <div className="chat-welcome-modern-content">
                  <h3 className="chat-welcome-modern-title">
                    Assistant IA Prêt
                  </h3>
                  <p className="chat-welcome-modern-subtitle">
                    {session.modelName.split('/').pop()} • Modèle optimisé
                  </p>
                  <div className="chat-welcome-modern-features">
                    <span className="chat-welcome-modern-feature">🎯 Réponses précises</span>
                    <span className="chat-welcome-modern-feature">⚡ Ultra rapide</span>
                    <span className="chat-welcome-modern-feature">🧠 Intelligent</span>
                  </div>
                </div>
              </div>
            )}

            {session.messages.map((message) => (
              <MessageBubbleModern
                key={message.id}
                message={message}
                error={session.error}
                onRegenerate={message.role === 'assistant' ? () => regenerateMessage(session.id, message.id) : undefined}
                onDelete={() => deleteMessage(session.id, message.id)}
              />
            ))}
            
            {/* Message de chargement */}
            {session.isLoading && (
              <MessageBubbleModern
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date(),
                  modelId: session.modelId
                }}
                isLoading={true}
              />
            )}
            
          </div>
        </div>

        {/* Footer avec informations sur le modèle */}
        <div className="chat-footer-modern">
          <div className="chat-footer-modern-info">
            <Terminal size={12} />
            <span>{session.modelId}</span>
          </div>
          {session.error && (
            <div className="chat-footer-modern-error">
              ⚠️ Erreur de connexion
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (sessions.length === 0) {
    return (
      <div className="chat-empty-state-modern">
        <div className="chat-empty-state-modern-icon">
          <Bot size={48} />
        </div>
        <h3 className="chat-empty-state-modern-title">
          Aucun modèle sélectionné
        </h3>
        <p className="chat-empty-state-modern-description">
          Sélectionnez un modèle d'IA pour commencer une conversation
        </p>
      </div>
    );
  }

  return (
    <div className="multi-chat-container-modern">
      {sessions.length === 1 ? (
        // Affichage pleine largeur pour une seule session
        <div className="single-chat-modern">
          {renderChatWindow(sessions[0])}
        </div>
      ) : (
        // Affichage en grille pour plusieurs sessions
        <div className={`multi-chat-grid-modern grid-${Math.min(sessions.length, 3)}`}>
          {sessions.map(renderChatWindow)}
        </div>
      )}
    </div>
  );
};

export default MultiChatWindowModern;
