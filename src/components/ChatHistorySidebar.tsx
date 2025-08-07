import React from 'react';
import { useChat } from '../hooks/useChat';
import { useSettings } from '../hooks/useSettings';
import { Trash2, Plus, MessageSquare } from 'lucide-react';

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
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Historique</h2>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={handleNewSession}
              disabled={!selectedModel}
              className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Nouvelle conversation</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-4">
            {activeSessions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucune conversation</p>
            ) : (
              <div className="space-y-2">
                {activeSessions.map((session) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  const lastMessageContent = lastMessage?.content || 'Nouvelle conversation';
                  const truncatedContent = lastMessageContent.length > 50 
                    ? lastMessageContent.substring(0, 50) + '...' 
                    : lastMessageContent;

                  return (
                    <div
                      key={session.id}
                      className="group relative p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleSwitchSession(session.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-300">
                              {session.modelName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {truncatedContent}
                          </p>
                        </div>
                        {activeSessions.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                            title="Supprimer la conversation"
                            aria-label="Supprimer la conversation"
                          >
                            <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              {activeSessions.length} conversation{activeSessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};