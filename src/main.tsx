import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/pixel.css'
import './index.css'
import './styles/hacker-cursor.css'
import './styles/force-simple.css'

// Curseur simple sans effets JavaScript
setTimeout(() => {
  document.body.style.cursor = 'crosshair';
  document.documentElement.style.cursor = 'crosshair';
  console.log('🎯 Curseur simple activé');
}, 100);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)