import React from 'react';
import { useChat } from '../hooks/useChat';
import { X, Plus, MessageSquare, Trash2 } from 'lucide-react';
import type { ChatSession } from '../types';
import './ChatHistorySidebar.css';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    allSessions, 
    currentSessionId, 
    setActiveSession, 
    createNewSession, 
    deleteSession 
  } = useChat();

  // Fonction pour extraire le titre d'une session (30 premiers caractères du premier message utilisateur)
  const getSessionTitle = (session: ChatSession): string => {
    const userMessage = session.messages.find(msg => msg.role === 'user');
    if (userMessage && userMessage.content.trim()) {
      const title = userMessage.content.trim();
      return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
    return `${session.modelName} - Nouvelle conversation`;
  };

  // Fonction pour extraire un aperçu de la conversation
  const getSessionPreview = (session: ChatSession): string => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (lastMessage && lastMessage.content.trim()) {
      const preview = lastMessage.content.trim();
      return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
    }
    return 'Aucun message';
  };

  const handleNewChat = () => {
    createNewSession();
    onClose(); // Fermer la sidebar sur mobile après création
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    onClose(); // Fermer la sidebar sur mobile après sélection
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Empêcher le clic de sélectionner la session
    deleteSession(sessionId);
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-150 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`chat-history-sidebar ${!isOpen ? 'collapsed' : ''}`} role="complementary" aria-label="Historique des conversations">
        {/* Header */}
        <div className="chat-history-header">
          <h2 className="chat-history-title">
            <MessageSquare size={20} className="inline mr-2" />
            Historique
          </h2>
          <button
            className="chat-history-toggle"
            onClick={onClose}
            aria-label="Fermer l'historique"
          >
            <X size={20} />
          </button>
        </div>

        {/* Liste des conversations */}
        <div className="chat-history-list">
          {allSessions.length === 0 ? (
            <div className="text-center py-8 text-polychat-text-muted">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucune conversation</p>
            </div>
          ) : (
            allSessions.map((session) => (
              <div
                key={session.id}
                className={`chat-history-item ${
                  session.id === currentSessionId ? 'active' : ''
                }`}
                onClick={() => handleSessionClick(session.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="chat-history-item-title">
                      {getSessionTitle(session)}
                    </h3>
                    <p className="chat-history-item-preview">
                      {getSessionPreview(session)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-polychat-accent-muted px-2 py-1 rounded text-white">
                        {session.modelName}
                      </span>
                    </div>
                    <div className="chat-history-item-preview mt-1">
                      {session.messages.length} messages
                    </div>
                  </div>
                  <button
                    className="chat-history-delete-btn"
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    aria-label="Supprimer la conversation"
                    title="Supprimer la conversation"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer avec bouton nouvelle conversation */}
        <div className="chat-history-footer">
          <button
            className="new-chat-btn"
            onClick={handleNewChat}
          >
            <Plus size={16} className="inline mr-2" />
            Nouvelle Conversation
          </button>
        </div>
      </div>
    </>
  );
};