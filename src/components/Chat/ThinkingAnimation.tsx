import React, { useState, useEffect } from 'react';
import './ThinkingAnimation.css';

interface ThinkingAnimationProps {
  theme: 'dark' | 'light';
  position?: 'bottom' | 'inline' | 'integrated';
  onStop?: () => void;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ 
  theme, 
  position = 'bottom',
  onStop 
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const thinkingMessages = [
    "L'IA réfléchit...",
    "Analyse en cours...", 
    "Traitement de votre demande...",
    "Formulation de la réponse...",
    "Recherche des meilleures informations..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % thinkingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [thinkingMessages.length]);

  const getContainerClass = () => {
    switch (position) {
      case 'bottom':
        return `thinking-animation-bottom ${theme}`;
      case 'inline':
        return `thinking-animation-inline ${theme}`;
      case 'integrated':
        return `thinking-animation-integrated ${theme}`;
      default:
        return `thinking-animation-bottom ${theme}`;
    }
  };

  const containerClass = getContainerClass();

  return (
    <div className={containerClass}>
      <div className="thinking-brain">
        <span className="brain-emoji">🧠</span>
        <div className="thinking-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>
      
      <div className="thinking-dots">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`thinking-dot thinking-dot-${i}`}
          />
        ))}
      </div>
      
      <span className="thinking-text">
        {thinkingMessages[currentMessage]}
      </span>
      
      {(position === 'bottom' || position === 'integrated') && onStop && (
        <button onClick={onStop} className="thinking-stop-btn">
          ⏹️ Arrêter
        </button>
      )}
    </div>
  );
};

export default ThinkingAnimation;
