import { X, Bot, Sparkles, MessageCircle } from 'lucide-react';
import './WelcomePopup.css';

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
    <div className="welcome-popup-container">
      <div className="welcome-popup-header">
        <div className="welcome-popup-avatar">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="welcome-popup-title">Bienvenue sur PolyChat AI</h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
            Votre assistant {modelName} est prêt
          </p>
        </div>
        <button onClick={onClose} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }}>
          <X size={18} />
        </button>
      </div>

      <div className="welcome-popup-body">
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Bonjour ! 👋 Je suis votre assistant IA personnel. Je peux vous aider avec une grande
          variété de tâches.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <MessageCircle size={14} color="var(--accent-primary)" />
            <span>Répondre à vos questions</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <Bot size={14} color="var(--accent-secondary)" />
            <span>Vous aider dans vos tâches</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <Sparkles size={14} color="var(--accent-tertiary)" />
            <span>Créer du contenu</span>
          </div>
        </div>

        <div
          className="polychat-card-modern"
          style={{
            padding: 'var(--space-3)',
            fontSize: 'var(--text-xs)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Sparkles size={12} style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
          <strong>Astuce :</strong> Utilisez les templates pour des prompts prêts à l'emploi !
        </div>

        <button onClick={onClose} className="polychat-btn-modern" style={{ width: '100%' }}>
          Commencer à chatter
        </button>
      </div>
    </div>
  );
}

export default WelcomePopup;
