import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Curseur simple sans effets JavaScript
setTimeout(() => {
  document.body.style.cursor = 'crosshair';
  document.documentElement.style.cursor = 'crosshair';
}, 100);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
