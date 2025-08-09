// Test spécifique pour l'onboarding modal
console.log('=== TEST ONBOARDING MODAL POSITIONING ===');

console.log('\n🎯 Test du positionnement de l\'onboarding modal');
console.log('Commande pour déclencher l\'onboarding :');
console.log('localStorage.clear(); location.reload();');

console.log('\n✅ Après l\'exécution, l\'onboarding modal devrait apparaître :');
console.log('- Centré sur l\'écran (pas en bas)');
console.log('- Avec un overlay sombre sur tout l\'écran');
console.log('- Au-dessus de tous les autres éléments');

console.log('\n🔧 Si le problème persiste :');
console.log('1. Ouvrez l\'inspecteur (F12)');
console.log('2. Cherchez l\'élément avec la classe "popup-overlay"');
console.log('3. Vérifiez que le z-index est bien 9999');
console.log('4. Vérifiez qu\'il n\'y a pas d\'erreurs CSS dans la console');

// Fonction pour forcer le reset et test
function testOnboarding() {
  console.log('\n🚀 Lancement du test onboarding...');
  localStorage.clear();
  console.log('✅ localStorage vidé');
  console.log('🔄 Rechargement de la page...');
  location.reload();
}

// Exposer la fonction
window.testOnboarding = testOnboarding;

console.log('\n⚡ COMMANDE RAPIDE :');
console.log('Tapez: testOnboarding()');
console.log('Pour tester immédiatement le positionnement de l\'onboarding');

// Auto-test si demandé
if (window.location.hash === '#test-onboarding') {
  console.log('\n🔄 Auto-test détecté, lancement...');
  setTimeout(testOnboarding, 1000);
}
