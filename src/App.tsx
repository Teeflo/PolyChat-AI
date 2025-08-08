import React, { useState } from 'react'
import { ChatProvider } from './context/ChatProvider'
import HeaderModern from './components/Layout/HeaderModern'
import MultiChatWindowModern from './components/Chat/MultiChatWindowModern'
import ChatInputModern from './components/Chat/ChatInputModern'
import ModelSelectorModern from './components/Chat/ModelSelectorModern'
import SettingsModalModern from './components/Settings/SettingsModalModern'
import { ChatHistorySidebar } from './components/Layout/ChatHistorySidebar'
import { useSettings } from './hooks/useSettings'
import { useChat } from './hooks/useChat'
import { useEffect } from 'react'
import { fetchAvailableModels } from './services/modelsApi'
import { Menu } from 'lucide-react'
import './styles/modern-pixel.css'
import OnboardingModal from './components/Onboarding/OnboardingModal.tsx'
import UsageDashboard from './components/Settings/UsageDashboard.tsx'
import SmartSuggestions from './components/Chat/SmartSuggestions.tsx'

// Composant interne qui utilise les hooks
const AppContent: React.FC = () => {
  const { isSettingsOpen, toggleSettings, theme } = useSettings()
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
  
  // Test de l'API au chargement
  useEffect(() => {
    const testAPI = async () => {
      console.log('🚀 Test de l\'API OpenRouter au démarrage...');
      try {
        const models = await fetchAvailableModels();
        console.log('✅ API fonctionne, modèles récupérés:', models.length);
      } catch (error) {
        console.error('❌ Erreur test API:', error);
      }
    };
    testAPI();
  }, []);

  // Appliquer le thème à la racine
  useEffect(() => {
    console.log('🎨 Application du thème:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme}`;
    // Ajouter aussi la classe au conteneur principal
    const appContainer = document.querySelector('.pixel-app-container');
    if (appContainer) {
      appContainer.className = `pixel-container pixel-app-container theme-${theme}`;
    }
  }, [theme]);

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

  return (
    <div className={`pixel-container pixel-app-container theme-${theme}`}>
      {/* Effet de grille rétro en arrière-plan */}
      <div className="pixel-grid-background" />
      
      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          className="pixel-sidebar-toggle"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Toggle conversation history"
          title="Conversation History"
        >
          <Menu size={20} />
        </button>
      )}
      
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Header Modernisé */}
      <div className="pixel-header-container">
        <HeaderModern onSettingsClick={toggleSettings} />
      </div>
      
      {/* Main Chat Area */}
      <div className={`pixel-main-chat-area ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Model Selector Modernisé */}
        <div className="pixel-model-selector-container">
          <ModelSelectorModern />
        </div>
        
  {/* Suggestions intelligentes selon le contexte */}
  <SmartSuggestions />

  {/* Chat Messages Modernisé */}
        <div className="pixel-messages-container">
          <MultiChatWindowModern sessions={activeSessions} />
        </div>
        
        {/* Chat Input Modernisé */}
        <div className="pixel-input-area">
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
  <OnboardingModal />

  {/* Tableau de bord d'usage (toggle via clavier: Ctrl+U) */}
  {showDashboard && (<UsageDashboard onClose={() => setShowDashboard(false)} />)}
      
      {/* Effet de particules flottantes */}
      <div className="pixel-particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`pixel-particle pixel-particle-${i % 5}`}
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
