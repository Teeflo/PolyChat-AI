import React from 'react';
import { useChat } from '../hooks/useChat';
import { useSettings } from '../hooks/useSettings';
import { Trash2, Plus, MessageSquare, X } from 'lucide-react';
import './ChatHistorySidebar.css';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ isOpen, onClose }) => {
  const { activeSessions, setActiveSession, createNewSession, deleteSession } = useChat();
  const { selectedModel } = useSettings.getState();

  const handleNewSession = () => {
    createNewSession();
    onClose();
  };

  const handleSwitchSession = (sessionId: string) => {
    setActiveSession(sessionId);
    onClose();
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSessions.length > 1) {
      deleteSession(sessionId);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`chat-history-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-history-sidebar-content">
          {/* Header */}
          <div className="chat-history-header">
            <div className="chat-history-header-content">
              <div className="chat-history-icon">
                <MessageSquare size={18} />
              </div>
              <h2 className="chat-history-title">Historique</h2>
            </div>
            <button
              onClick={onClose}
              className="chat-history-close-btn"
              aria-label="Fermer l'historique"
            >
              <X size={18} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="chat-history-new-section">
            <button
              onClick={handleNewSession}
              disabled={!selectedModel}
              className="chat-history-new-btn"
            >
              <div className="chat-history-new-btn-icon">
                <Plus size={18} />
              </div>
              <span>Nouvelle conversation</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="chat-history-list">
            {activeSessions.length === 0 ? (
              <div className="chat-history-empty">
                <MessageSquare size={24} />
                <p>Aucune conversation</p>
              </div>
            ) : (
              <div className="chat-history-sessions">
                {activeSessions.map((session) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  const lastMessageContent = lastMessage?.content || 'Nouvelle conversation';
                  const truncatedContent = lastMessageContent.length > 50 
                    ? lastMessageContent.substring(0, 50) + '...' 
                    : lastMessageContent;

                  return (
                    <div
                      key={session.id}
                      className="chat-history-session"
                      onClick={() => handleSwitchSession(session.id)}
                    >
                      <div className="chat-history-session-content">
                        <div className="chat-history-session-header">
                          <div className="chat-history-session-icon">
                            <MessageSquare size={14} />
                          </div>
                          <span className="chat-history-session-model">
                            {session.modelName}
                          </span>
                        </div>
                        <p className="chat-history-session-preview">
                          {truncatedContent}
                        </p>
                      </div>
                      {activeSessions.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="chat-history-session-delete"
                          title="Supprimer la conversation"
                          aria-label="Supprimer la conversation"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="chat-history-footer">
            <div className="chat-history-footer-content">
              <span className="chat-history-count">
                {activeSessions.length} conversation{activeSessions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};