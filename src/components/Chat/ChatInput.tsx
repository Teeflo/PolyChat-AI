import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Image } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useChat } from '../../hooks/useChat';
import ImageGenerator from '../ImageEditor/ImageGenerator';
import type { GeneratedImage } from '../../types/index';
import './ChatInput.css';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const { theme } = useSettings();
  const { sendMessageToAll, isAnyLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isAnyLoading) {
      await sendMessageToAll(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageGenerated = (image: GeneratedImage) => {
    // Send the image as a message in the chat
    const imageMessage = `![Image générée](${image.url})\n\n**Prompt:** ${image.prompt}\n**Modèle:** ${image.model}`;
    sendMessageToAll(imageMessage);
    setShowImageGenerator(false);
  };

  useEffect(() => {
    console.log('🎨 ChatInput component mounted - Image button should be visible');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Log pour vérifier le rendu du bouton
  useEffect(() => {
    console.log('🎨 ChatInput render - showImageGenerator:', showImageGenerator);
  }, [showImageGenerator]);

  return (
    <>
      <div className={`chat-input-container ${isDark ? 'dark' : 'light'}`}>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className={`chat-input-wrapper ${isDark ? 'dark' : 'light'}`}>
            <button
              type="button"
              onClick={() => {
                console.log('🎨 Image button clicked!');
                setShowImageGenerator(true);
              }}
              className={`chat-input-image-btn ${isDark ? 'dark' : 'light'}`}
              title="Générer une image avec IA"
            >
              <Image size={18} />
            </button>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
              disabled={isAnyLoading}
              rows={1}
              className={`chat-input-textarea ${isDark ? 'dark' : 'light'}`}
            />
            <button
              type="submit"
              disabled={!message.trim() || isAnyLoading}
              className={`chat-input-send-btn ${(!message.trim() || isAnyLoading) ? 'disabled' : 'enabled'} ${isDark ? 'dark' : 'light'}`}
            >
              {isAnyLoading ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          <div className={`chat-input-info ${isDark ? 'dark' : 'light'}`}>
            <span>
              🎨 Bouton image disponible • Utilisez Shift+Entrée pour une nouvelle ligne
            </span>
            <span>
              {message.length}/2000
            </span>
          </div>
        </form>
      </div>

      {showImageGenerator && (
        <div className="image-generator-modal-overlay">
          <div className="image-generator-modal">
            <ImageGenerator
              onImageGenerated={handleImageGenerated}
              onClose={() => setShowImageGenerator(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInput;