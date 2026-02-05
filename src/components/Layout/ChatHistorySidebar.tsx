import React, { useMemo, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { X, Plus, MessageSquare, Trash2, Calendar, Search } from 'lucide-react';
import type { ChatSession } from '../../types';

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

  const getSessionTitle = (session: ChatSession): string => {
    // Try to find the first user message
    const userMessage = session.messages.find(msg => msg.role === 'user');
    if (userMessage && typeof userMessage.content === 'string' && userMessage.content.trim()) {
      return userMessage.content.trim();
    }
    
    // Fallback based on model name and date
    const date = new Date(session.messages[0]?.timestamp || Date.now()).toLocaleDateString();
    return `Conversation ${session.modelName} (${date})`;
  };

  const getSessionPreview = (session: ChatSession): string => {
    if (!session.messages.length) return 'Nouvelle conversation';
    
    const lastMessage = session.messages[session.messages.length - 1];
    if (lastMessage && typeof lastMessage.content === 'string' && lastMessage.content.trim()) {
      return lastMessage.content.trim();
    }
    return '...';
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return allSessions;
    const query = searchQuery.toLowerCase();
    return allSessions.filter(session => {
      const title = getSessionTitle(session).toLowerCase();
      const preview = getSessionPreview(session).toLowerCase();
      return title.includes(query) || preview.includes(query);
    });
  }, [allSessions, searchQuery]);

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: Record<string, ChatSession[]> = {
      'Aujourd\'hui': [],
      'Hier': [],
      '7 derniers jours': [],
      'Plus ancien': []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Sort sessions by most recent message/creation
    const sortedSessions = [...filteredSessions].sort((a, b) => {
      const dateA = a.messages.length > 0 
        ? new Date(a.messages[a.messages.length - 1].timestamp).getTime() 
        : parseInt(a.id.split('-')[1] || '0');
      
      const dateB = b.messages.length > 0 
        ? new Date(b.messages[b.messages.length - 1].timestamp).getTime() 
        : parseInt(b.id.split('-')[1] || '0');
        
      return dateB - dateA;
    });

    sortedSessions.forEach(session => {
      // Determine session date (last message or creation)
      let sessionDateStr = session.messages.length > 0 
        ? session.messages[session.messages.length - 1].timestamp 
        : null;
        
      // Fallback to timestamp in ID if no messages
      if (!sessionDateStr) {
        const parts = session.id.split('-');
        if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
          sessionDateStr = new Date(parseInt(parts[1]));
        } else {
          sessionDateStr = new Date();
        }
      }

      const sessionDate = new Date(sessionDateStr);
      const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

      if (sessionDateOnly.getTime() === today.getTime()) {
        groups['Aujourd\'hui'].push(session);
      } else if (sessionDateOnly.getTime() === yesterday.getTime()) {
        groups['Hier'].push(session);
      } else if (sessionDateOnly > lastWeek) {
        groups['7 derniers jours'].push(session);
      } else {
        groups['Plus ancien'].push(session);
      }
    });

    return groups;
  }, [filteredSessions]);

  const handleNewChat = () => {
    createNewSession();
    // Don't close sidebar automatically on new chat if on desktop
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      deleteSession(sessionId);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="polychat-sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <div className={`polychat-sidebar ${isOpen ? 'open' : ''}`} role="complementary" aria-label="Historique des conversations">
        <div className="polychat-sidebar-header">
          <h2 className="polychat-sidebar-title">
            <MessageSquare size={18} />
            Historique
          </h2>
          <button
            className="polychat-sidebar-close"
            onClick={onClose}
            aria-label="Fermer l'historique"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="chat-history-search">
          <div className="chat-history-search-input">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear-btn">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="polychat-history-list">
          {allSessions.length === 0 ? (
            <div className="empty-history-message">
              <Calendar size={48} strokeWidth={1} />
              <p>Votre historique est vide</p>
              <button 
                className="polychat-new-chat-btn" 
                onClick={handleNewChat}
              >
                Commencer
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="empty-history-message">
              <Search size={48} strokeWidth={1} />
              <p>Aucun résultat pour "{searchQuery}"</p>
            </div>
          ) : (
            Object.entries(groupedSessions).map(([group, sessions]) => (
              sessions.length > 0 && (
                <div key={group} className="polychat-history-section">
                  <div className="polychat-history-section-title">{group}</div>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`polychat-history-item ${
                        session.id === currentSessionId ? 'active' : ''
                      }`}
                      onClick={() => handleSessionClick(session.id)}
                    >
                      <div className="polychat-history-item-content">
                        <div className="polychat-history-item-title" title={getSessionTitle(session)}>
                          {getSessionTitle(session)}
                        </div>
                        <div className="polychat-history-item-preview">
                          {getSessionPreview(session)}
                        </div>
                        <div className="polychat-history-item-meta">
                          <span className="polychat-history-item-model">
                            {session.modelName.split('/').pop()}
                          </span>
                          <span className="polychat-history-item-date">
                            • {session.messages.length} msg
                          </span>
                        </div>
                      </div>
                      <button
                        className="polychat-history-delete-btn"
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        aria-label="Supprimer la conversation"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ))
          )}
        </div>

        <div className="polychat-sidebar-footer">
          <button
            className="polychat-new-chat-btn"
            onClick={handleNewChat}
          >
            <Plus size={16} />
            Nouvelle Conversation
          </button>
        </div>
      </div>
    </>
  );
};
