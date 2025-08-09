// Test spécifique pour le positionnement des pop-ups
console.log('=== TEST POSITIONNEMENT POP-UPS ===');

// Fonction pour tester le positionnement
function testPopupPositioning() {
  console.log('\n🎯 Test du positionnement du pop-up de bienvenue');
  console.log('Instructions :');
  console.log('1. Ouvrez l\'inspecteur du navigateur (F12)');
  console.log('2. Exécutez les commandes ci-dessous');
  console.log('3. Vérifiez que le pop-up apparaît CENTRÉ sur l\'écran');
  
  console.log('\n📋 Commandes de test :');
  console.log('// Configurer un utilisateur avec session vide pour déclencher le pop-up de bienvenue');
  console.log('localStorage.setItem("polychat-settings", JSON.stringify({state: {hasOnboarded: true, apiKey: "test-key", selectedModel: "gpt-3.5-turbo", showWelcomePopup: false}, version: 0}));');
  console.log('localStorage.removeItem("polychat-chat-history");');
  console.log('location.reload();');
  
  console.log('\n🔍 Vérifications à faire dans l\'inspecteur :');
  console.log('1. Le pop-up doit avoir la classe "popup-overlay"');
  console.log('2. Le z-index doit être 9999');
  console.log('3. Le pop-up doit être centré verticalement et horizontalement');
  console.log('4. Le fond doit couvrir tout l\'écran avec un overlay sombre');
  
  console.log('\n🚨 Si le pop-up est toujours en bas :');
  console.log('1. Vérifiez si d\'autres éléments ont un z-index plus élevé');
  console.log('2. Vérifiez que les styles CSS ne sont pas surchargés');
  console.log('3. Vérifiez la console pour les erreurs CSS');
}

// Fonction pour inspecter les z-index actuels
function inspectZIndexes() {
  console.log('\n🔍 Inspection des z-index dans la page :');
  
  const elements = document.querySelectorAll('*');
  const zIndexElements = [];
  
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const zIndex = style.zIndex;
    if (zIndex !== 'auto' && zIndex !== '0') {
      zIndexElements.push({
        element: el.tagName + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
        zIndex: parseInt(zIndex),
        position: style.position
      });
    }
  });
  
  // Trier par z-index décroissant
  zIndexElements.sort((a, b) => b.zIndex - a.zIndex);
  
  console.log('Éléments avec z-index (triés par ordre décroissant) :');
  zIndexElements.forEach(item => {
    console.log(`${item.element}: z-index ${item.zIndex} (${item.position})`);
  });
  
  return zIndexElements;
}

// Fonction pour forcer l'affichage du pop-up de bienvenue
function forceShowWelcomePopup() {
  console.log('\n🚀 Forçage de l\'affichage du pop-up de bienvenue...');
  
  // Importer les hooks React si possible
  try {
    // Cette méthode fonctionne si les hooks sont exposés globalement
    if (window.useSettings) {
      const { setShowWelcomePopup } = window.useSettings();
      setShowWelcomePopup(true);
      console.log('✅ Pop-up de bienvenue forcé via hook');
    } else {
      console.log('❌ Impossible d\'accéder aux hooks React depuis la console');
      console.log('💡 Utilisez plutôt les méthodes de test avec localStorage');
    }
  } catch (error) {
    console.log('❌ Erreur lors du forçage:', error.message);
  }
}

// Lancer les tests
testPopupPositioning();

// Exposer les fonctions pour utilisation manuelle
window.testPopupPositioning = testPopupPositioning;
window.inspectZIndexes = inspectZIndexes;
window.forceShowWelcomePopup = forceShowWelcomePopup;

console.log('\n🎮 FONCTIONS DISPONIBLES :');
console.log('- testPopupPositioning() : Instructions de test');
console.log('- inspectZIndexes() : Voir tous les z-index de la page');
console.log('- forceShowWelcomePopup() : Tenter de forcer l\'affichage');

console.log('\n⚡ TEST RAPIDE :');
console.log('Tapez: inspectZIndexes()');
console.log('Pour voir si d\'autres éléments interfèrent avec le z-index 9999');
