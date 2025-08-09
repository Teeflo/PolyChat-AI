import React,  {
    title: 'Ajoutez votre clé API',
    description: 'Rendez-vous dans Paramètres > API pour coller votre clé OpenRouter.',
    icon: <SettingsIcon size={24} />,
  },
  {
    title: 'Choisissez votre modèle IA',
    description: 'Sélectionnez le modèle qui correspond le mieux à vos besoins.',
    icon: <Bot size={24} />,
    isModelSelection: true,
  },
  {
    title: 'Choisissez un ton',
    description: 'Définissez le style de l'IA: formel, amical, professionnel, etc.',
    icon: <Zap size={24} />,
  },e } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Cpu, Zap, Settings as SettingsIcon, Bell, Bot } from 'lucide-react';
import ModelSelectionStep from './ModelSelectionStep';
import './OnboardingModal.css';
import './ModelSelectionStep.css';

const steps = [
  {
    title: 'Bienvenue dans PolyChat AI',
    description: 'Multi-modèles, rapide, et personnalisable pour vos conversations IA.',
    icon: <Cpu size={24} />,
  },
  {
    title: 'Ajoutez votre clé API',
    description: 'Rendez-vous dans Paramètres > API pour coller votre clé OpenRouter.',
    icon: <SettingsIcon size={24} />,
  },
  {
    title: 'Choisissez un ton',
    description: 'Définissez le style de l’IA: formel, amical, professionnel, etc.',
    icon: <Zap size={24} />,
  },
  {
    title: 'Activez les notifications',
    description: 'Recevez une alerte lorsqu’une réponse est prête (navigateur).',
    icon: <Bell size={24} />,
  },
];

const OnboardingModal: React.FC = () => {
  const { hasOnboarded, setHasOnboarded, setNotificationsEnabled, notificationsEnabled } = useSettings();
  const [index, setIndex] = useState(0);

  if (hasOnboarded) return null;

  const close = () => setHasOnboarded(true);

  const requestNotifPermission = async () => {
    if (!('Notification' in window)) return;
    try {
      const res = await Notification.requestPermission();
      setNotificationsEnabled(res === 'granted');
    } catch {
      setNotificationsEnabled(false);
    }
  };

  return (
    <div className="onboard-overlay" role="dialog" aria-modal="true">
      <div className="onboard-modal">
        <div className="onboard-header">
          <div className="onboard-icon">{steps[index].icon}</div>
          <h2 className="onboard-title">{steps[index].title}</h2>
          <p className="onboard-desc">{steps[index].description}</p>
        </div>
        <div className="onboard-footer">
          <div className="onboard-steps">{index + 1} / {steps.length}</div>
          <div className="onboard-actions">
            {index === steps.length - 1 ? (
              <>
                <button className="onboard-btn secondary" onClick={close}>Plus tard</button>
                <button className="onboard-btn primary" onClick={() => { requestNotifPermission(); close(); }}>
                  Terminer
                </button>
              </>
            ) : (
              <>
                <button className="onboard-btn secondary" onClick={close}>Ignorer</button>
                <button className="onboard-btn primary" onClick={() => setIndex(i => Math.min(i + 1, steps.length - 1))}>
                  Suivant
                </button>
              </>
            )}
          </div>
          {index === 3 && (
            <div className="onboard-tip">
              État: {notificationsEnabled ? 'Notifications activées' : 'Notifications désactivées'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
