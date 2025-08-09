// Script de test pour les nouveaux pop-ups
console.log('=== TEST DES POP-UPS DE BIENVENUE ET CONFIGURATION ===');

// Fonction pour réinitialiser l'état et tester différents scénarios
function testScenario(description, setup) {
  console.log(`\n📋 ${description}`);
  console.log('Instructions:');
  console.log('1. Ouvrez la console du navigateur');
  console.log('2. Tapez les commandes ci-dessous une par une');
  console.log('3. Observez les pop-ups qui apparaissent');
  console.log('\nCommandes:');
  setup.forEach((cmd, i) => {
    console.log(`${i + 1}. ${cmd}`);
  });
}

// Scénario 1: Nouvel utilisateur (doit voir l'onboarding)
testScenario('Test 1: Nouvel utilisateur complet', [
  'localStorage.clear()',
  'location.reload()',
  '// → Devrait afficher l\'onboarding modal en premier',
  '// → Après configuration, le pop-up de bienvenue devrait apparaître'
]);

// Scénario 2: Utilisateur sans clé API (après onboarding)
testScenario('Test 2: Utilisateur avec onboarding fait mais sans clé API', [
  'localStorage.setItem("polychat-settings", JSON.stringify({state: {hasOnboarded: true, apiKey: ""}, version: 0}))',
  'location.reload()',
  '// → Devrait afficher le pop-up de configuration (clé API manquante)'
]);

// Scénario 3: Utilisateur configuré (doit voir le pop-up de bienvenue)
testScenario('Test 3: Utilisateur configuré qui commence une nouvelle session', [
  'localStorage.setItem("polychat-settings", JSON.stringify({state: {hasOnboarded: true, apiKey: "test-key", selectedModel: "gpt-3.5-turbo"}, version: 0}))',
  'localStorage.removeItem("polychat-chat-history")',
  'location.reload()',
  '// → Devrait afficher le pop-up de bienvenue'
]);

// Scénario 4: Réinitialisation pour voir l'onboarding
testScenario('Test 4: Réinitialisation complète', [
  'localStorage.clear()',
  'location.reload()',
  '// → Retour à l\'onboarding initial'
]);

console.log('\n🎯 OBJECTIFS DU TEST:');
console.log('✅ L\'onboarding doit toujours apparaître en premier pour les nouveaux utilisateurs');
console.log('✅ Le pop-up de configuration doit apparaître si la clé API manque');
console.log('✅ Le pop-up de bienvenue doit apparaître pour les utilisateurs configurés avec une session vide');
console.log('✅ Plus aucun message de bienvenue automatique dans les chats');

console.log('\n📝 POUR TESTER:');
console.log('Copiez et collez chaque série de commandes dans la console, une à la fois.');
console.log('Observez les pop-ups qui apparaissent et vérifiez qu\'ils correspondent aux attentes.');

console.log('\n🔄 RESET RAPIDE:');
console.log('Pour revenir à l\'état initial: localStorage.clear(); location.reload()');
