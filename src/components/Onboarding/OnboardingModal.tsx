import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Cpu, Zap, Settings as SettingsIcon, Bell } from 'lucide-react';
import './OnboardingModal.css';

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
    description: 'Définissez le style de l\u2019IA: formel, amical, professionnel, etc.',
    icon: <Zap size={24} />,
  },
  {
    title: 'Activez les notifications',
    description: 'Recevez une alerte lorsqu\u2019une réponse est prête (navigateur).',
    icon: <Bell size={24} />,
  },
];

const OnboardingModal: React.FC = () => {
  const { hasOnboarded, setHasOnboarded, setNotificationsEnabled } = useSettings();
  const requestNotifPermission = async () => {
    if (!('Notification' in window)) return;
    try {
      const res = await Notification.requestPermission();
      setNotificationsEnabled(res === 'granted');
    } catch {
      setNotificationsEnabled(false);
    }
  };

  const [index, setIndex] = useState(0);

  if (hasOnboarded) return null;

  const close = () => setHasOnboarded(true);

  return (
    <div className="onboard-overlay" role="dialog" aria-modal="true">
      <div className="onboard-modal">
        <div className="onboard-header">
          <div className="config-popup-icon" style={{ margin: '0 auto var(--space-4)' }}>{steps[index].icon}</div>
          <h2 className="onboard-title">{steps[index].title}</h2>
          <p className="onboard-text" style={{ color: 'var(--text-secondary)' }}>{steps[index].description}</p>
        </div>
        <div className="onboard-content">
           <div className="step-indicator" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              {steps.map((_, i) => (
                <div key={i} className={`step-dot ${i === index ? 'active' : ''}`} />
              ))}
           </div>
        </div>
        <div className="onboard-footer">
          <div className="onboard-steps" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            ÉTAPE {index + 1} / {steps.length}
          </div>
          <div className="onboard-actions" style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {index === steps.length - 1 ? (
              <>
                <button className="polychat-btn-modern polychat-btn-secondary" onClick={close}>Plus tard</button>
                <button className="polychat-btn-modern" onClick={() => { requestNotifPermission(); close(); }}>
                  Terminer
                </button>
              </>
            ) : (
              <>
                <button className="polychat-btn-modern polychat-btn-secondary" onClick={close}>Ignorer</button>
                <button className="polychat-btn-modern" onClick={() => setIndex(i => Math.min(i + 1, steps.length - 1))}>
                  Suivant
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default OnboardingModal;
