import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '50px', 
      fontSize: '24px', 
      backgroundColor: '#f0f0f0',
      color: '#333',
      textAlign: 'center' 
    }}>
      <h1>TEST APPLICATION</h1>
      <p>Si vous voyez ceci, React fonctionne correctement !</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#007bff', color: 'white' }}>
        Composant de test chargé avec succès
      </div>
    </div>
  );
};

export default TestApp;
