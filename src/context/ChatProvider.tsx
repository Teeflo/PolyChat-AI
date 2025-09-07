
import React, { createContext, useEffect } from 'react';
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

