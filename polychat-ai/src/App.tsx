import { ChatProvider } from './context/ChatProvider'
import Header from './components/Layout/Header'
import ChatWindow from './components/Chat/ChatWindow'
import ChatInput from './components/Chat/ChatInput'
import SettingsModal from './components/Settings/SettingsModal'
import { useSettings } from './hooks/useSettings'

function App() {
  const { isSettingsOpen, toggleSettings } = useSettings()
  
  return (
    <ChatProvider>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <Header onSettingsClick={toggleSettings} />
        
        {/* Main Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflow: 'hidden'
          }}>
            <ChatWindow />
          </div>
          
          {/* Chat Input */}
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ChatInput />
          </div>
        </div>
        
        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={toggleSettings} 
          />
        )}
      </div>
    </ChatProvider>
  )
}

export default App
