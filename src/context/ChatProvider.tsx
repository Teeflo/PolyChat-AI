
import React, { createContext, useContext, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const ChatContext = createContext<ReturnType<typeof useChat> | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatStore = useChat();
  
  // Initialiser le chat au montage du provider
  useEffect(() => {
    chatStore.initializeChat();
  }, []);
  
  return (
    <ChatContext.Provider value={chatStore}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
