import { X, Bot, Sparkles, MessageCircle } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  modelName?: string;
}

export function WelcomePopup({ isOpen, onClose, modelName = 'IA' }: WelcomePopupProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-icon-container">
            <div className="popup-icon">
              <Bot className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="popup-title">
                Bienvenue sur PolyChat AI
              </h3>
              <p className="popup-subtitle">
                Votre assistant {modelName} est prêt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="popup-close-btn"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="popup-body">
          <div className="popup-welcome-center">
            <div className="popup-welcome-avatar">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h4>Bonjour ! 👋</h4>
            <p>
              Je suis votre assistant IA personnel. Je peux vous aider avec une grande variété de tâches.
            </p>
          </div>

          <div className="popup-features">
            <div className="popup-feature">
              <div className="popup-feature-icon blue">
                <MessageCircle className="w-4 h-4 text-blue-400" />
              </div>
              <span className="popup-feature-text">Répondre à vos questions</span>
            </div>
            <div className="popup-feature">
              <div className="popup-feature-icon green">
                <Bot className="w-4 h-4 text-green-400" />
              </div>
              <span className="popup-feature-text">Vous aider dans vos tâches</span>
            </div>
            <div className="popup-feature">
              <div className="popup-feature-icon purple">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <span className="popup-feature-text">Créer du contenu</span>
            </div>
          </div>

          <div className="popup-card">
            <p className="popup-tip">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <strong>Astuce :</strong> Utilisez les templates en bas à droite pour des prompts prêts à l'emploi !
            </p>
          </div>
        </div>

        <div className="popup-footer">
          <button
            onClick={onClose}
            className="popup-main-btn"
          >
            Commencer à chatter
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;
