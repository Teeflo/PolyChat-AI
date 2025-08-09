// Script de diagnostic pour les problèmes de positionnement
console.log('=== DIAGNOSTIC POSITIONNEMENT POP-UPS ===');

// Fonction pour diagnostiquer les problèmes
function diagnosePopupIssues() {
  console.log('\n🔍 DIAGNOSTIC EN COURS...');
  
  // Vérifier les éléments avec popup-overlay
  const overlays = document.querySelectorAll('.popup-overlay');
  console.log(`Nombre d'overlays trouvés: ${overlays.length}`);
  
  overlays.forEach((overlay, index) => {
    console.log(`\n📋 Overlay ${index + 1}:`);
    const styles = window.getComputedStyle(overlay);
    console.log(`- Position: ${styles.position}`);
    console.log(`- Z-index: ${styles.zIndex}`);
    console.log(`- Top: ${styles.top}`);
    console.log(`- Left: ${styles.left}`);
    console.log(`- Width: ${styles.width}`);
    console.log(`- Height: ${styles.height}`);
    console.log(`- Display: ${styles.display}`);
    console.log(`- Visibility: ${styles.visibility}`);
    
    // Vérifier la position réelle
    const rect = overlay.getBoundingClientRect();
    console.log(`- Position réelle: top=${rect.top}, left=${rect.left}, width=${rect.width}, height=${rect.height}`);
  });
  
  // Vérifier s'il y a des éléments avec z-index plus élevé
  console.log('\n🔍 Recherche d\'éléments avec z-index élevé...');
  const allElements = document.querySelectorAll('*');
  const highZIndexElements = [];
  
  allElements.forEach(el => {
    const zIndex = parseInt(window.getComputedStyle(el).zIndex);
    if (zIndex > 10000) {
      highZIndexElements.push({
        element: el,
        zIndex: zIndex,
        tagName: el.tagName,
        className: el.className
      });
    }
  });
  
  if (highZIndexElements.length > 0) {
    console.log('⚠️ Éléments avec z-index > 10000 trouvés:');
    highZIndexElements.forEach(item => {
      console.log(`- ${item.tagName}.${item.className}: z-index ${item.zIndex}`);
    });
  } else {
    console.log('✅ Aucun élément avec z-index > 10000');
  }
  
  // Vérifier les erreurs CSS
  console.log('\n🔍 Vérification des erreurs CSS...');
  const cssRules = Array.from(document.styleSheets).flatMap(sheet => {
    try {
      return Array.from(sheet.cssRules || []);
    } catch (e) {
      return [];
    }
  });
  
  const popupRules = cssRules.filter(rule => 
    rule.selectorText && rule.selectorText.includes('popup-overlay')
  );
  
  console.log(`Règles CSS pour .popup-overlay trouvées: ${popupRules.length}`);
  popupRules.forEach(rule => {
    console.log(`- ${rule.selectorText}: ${rule.cssText}`);
  });
}

// Fonction pour créer un overlay de test
function createTestOverlay() {
  console.log('\n🧪 Création d\'un overlay de test...');
  
  // Supprimer l'overlay de test existant
  const existing = document.getElementById('test-overlay');
  if (existing) existing.remove();
  
  // Créer un nouvel overlay de test
  const testOverlay = document.createElement('div');
  testOverlay.id = 'test-overlay';
  testOverlay.className = 'popup-overlay';
  testOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Rouge semi-transparent
  testOverlay.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
      <h2>Overlay de Test</h2>
      <p>Si vous voyez ceci centré, les styles fonctionnent!</p>
      <button onclick="document.getElementById('test-overlay').remove()">Fermer</button>
    </div>
  `;
  
  document.body.appendChild(testOverlay);
  console.log('✅ Overlay de test créé');
  
  // Diagnostiquer immédiatement
  setTimeout(() => {
    diagnosePopupIssues();
  }, 100);
}

// Exposer les fonctions
window.diagnosePopupIssues = diagnosePopupIssues;
window.createTestOverlay = createTestOverlay;

console.log('\n🎮 COMMANDES DISPONIBLES:');
console.log('- diagnosePopupIssues() : Diagnostiquer les problèmes actuels');
console.log('- createTestOverlay() : Créer un overlay de test');

console.log('\n⚡ TEST RAPIDE:');
console.log('Tapez: createTestOverlay()');
console.log('Pour créer un overlay de test et voir s\'il est centré');

// Auto-diagnostic au chargement
setTimeout(() => {
  console.log('\n🔄 Auto-diagnostic au chargement...');
  diagnosePopupIssues();
}, 2000);
