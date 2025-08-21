import React, { useState } from 'react'
import { ChatProvider } from './context/ChatProvider'
import HeaderModern from './components/Layout/HeaderModern'
import MultiChatWindowModern from './components/Chat/MultiChatWindowModern'
import ChatInputModern from './components/Chat/ChatInputModern'
import ModelSwitcher from './components/Chat/ModelSwitcher'
import SettingsModalModern from './components/Settings/SettingsModalModern'
import { ChatHistorySidebar } from './components/Layout/ChatHistorySidebar'
import { useSettings } from './hooks/useSettings'
import { useChat } from './hooks/useChat'
import { useEffect } from 'react'
import { fetchAvailableModels } from './services/modelsApi'
import './styles/modern-polychat.css'
import OnboardingModalFresh from './components/Onboarding/OnboardingModalFresh'
import ConfigurationPopup from './components/Onboarding/ConfigurationPopup'
import UsageDashboard from './components/Settings/UsageDashboard.tsx'


// Composant interne qui utilise les hooks
const AppContent: React.FC = () => {
  const { 
    isSettingsOpen, 
    toggleSettings, 
    theme, 
    hasOnboarded, 
    setHasOnboarded, 
    apiKey,
    showConfigurationPopup,
    configurationPopupType,
    setShowConfigurationPopup,
    accent
  } = useSettings()
  const { activeSessions } = useChat()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'u')) {
        e.preventDefault();
        setShowDashboard(s=>!s);
      }
    }
    window.addEventListener('keydown', handler);
    return ()=>window.removeEventListener('keydown', handler);
  },[])
  
  // Suppression du test API au démarrage pour éviter les doublons et logs

  // Appliquer le thème et l'accent à la racine
  useEffect(() => {
    console.log('🎨 Application du thème:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (accent) {
      document.documentElement.setAttribute('data-accent', accent);
    }
    document.body.className = `theme-${theme}`;
    // Ajouter aussi la classe au conteneur principal
    const appContainer = document.querySelector('.polychat-app-container');
    if (appContainer) {
      appContainer.className = `polychat-container polychat-app-container theme-${theme}`;
    }
  }, [theme, accent]);

  // Optionnel: demander la permission de notification si l'utilisateur active l'option
  useEffect(()=>{
    const onFocus = () => {
      // Only request on focus to avoid intrusive popup on load
      import('./hooks/useSettings').then(({ useSettings }) => {
        const { notificationsEnabled } = useSettings.getState();
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission().catch(()=>{});
        }
      });
      window.removeEventListener('focus', onFocus);
    };
    window.addEventListener('focus', onFocus);
    return ()=>window.removeEventListener('focus', onFocus);
  },[])

  // Logique pour afficher le pop-up de configuration
  useEffect(() => {
    if (hasOnboarded && !apiKey && !showConfigurationPopup) {
      setShowConfigurationPopup(true, 'missing-api-key');
    }
  }, [hasOnboarded, apiKey, showConfigurationPopup, setShowConfigurationPopup]);

  return (
    <div className={`polychat-container polychat-app-container theme-${theme}`}>
      {/* Effet de grille rétro en arrière-plan */}
      <div className="polychat-grid-background" />
      
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Header Modernisé */}
      <div className="polychat-header-container">
        <HeaderModern 
          onSettingsClick={toggleSettings}
          onHistoryClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onModelClick={() => {
            // Ouvrir les paramètres directement sur la section modèle par défaut
            // Si déjà ouvert, simplement mettre en évidence la section
            const wasClosed = !isSettingsOpen;
            if (wasClosed) {
              toggleSettings();
            }
            // Laisser le temps au modal de s'afficher
            setTimeout(() => {
              const section = document.getElementById('default-model-section');
              if (section) {
                section.classList.add('flash-highlight');
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(()=> section.classList.remove('flash-highlight'), 2600);
              }
              // Ne plus forcer le focus sur le champ de recherche pour centrer sur la section
            }, wasClosed ? 120 : 40);
          }}
        />
      </div>
      
      {/* Main Chat Area */}
      <div className={`polychat-main-chat-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Model Selector Modernisé */}
  <div className="polychat-model-selector-container polychat-model-switcher-bar">
          <ModelSwitcher />
        </div>

  {/* Chat Messages Modernisé */}
        <div className="polychat-messages-container">
          <MultiChatWindowModern sessions={activeSessions} />
        </div>
        
        {/* Chat Input Modernisé */}
        <div className="polychat-input-area">
          <ChatInputModern />
        </div>
      </div>
      
  {/* Settings Modal Modernisé */}
      {isSettingsOpen && (
        <SettingsModalModern
          isOpen={isSettingsOpen}
          onClose={toggleSettings}
        />
      )}

  {/* Onboarding pour nouveaux utilisateurs */}
      <OnboardingModalFresh 
        isOpen={!hasOnboarded} 
        onClose={() => setHasOnboarded(true)} 
      />  {/* Onboarding Modal */}

      {/* Pop-up de configuration */}
      <ConfigurationPopup 
        isOpen={showConfigurationPopup}
        onClose={() => setShowConfigurationPopup(false)}
        type={configurationPopupType || 'missing-api-key'}
      />

  {showDashboard && (<UsageDashboard onClose={() => setShowDashboard(false)} />)}
      
      {/* Effet de particules flottantes */}
      <div className="polychat-particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`polychat-particle polychat-particle-${i % 5}`}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  )
}

export default App
