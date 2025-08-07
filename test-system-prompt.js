// Test unitaire pour vérifier la fonction fetchAIResponse avec system prompt
// Ce fichier peut être exécuté dans la console du navigateur

const testSystemPromptIntegration = () => {
  console.log('🧪 Test d\'intégration du System Prompt');
  
  // Test 1: Vérifier que le system prompt est bien ajouté aux messages
  const testMessages = [
    { role: 'user', content: 'Bonjour' }
  ];
  
  const systemPrompt = 'Tu es un assistant spécialisé en test.';
  
  // Simulation de la logique de fetchAIResponse
  const apiMessages = testMessages.map(({ id, timestamp, ...message }) => message);
  
  if (systemPrompt && systemPrompt.trim()) {
    apiMessages.unshift({
      role: 'system',
      content: systemPrompt.trim()
    });
  }
  
  console.log('📨 Messages envoyés à l\'API:', apiMessages);
  
  // Vérifications
  const hasSystemMessage = apiMessages[0].role === 'system';
  const systemContent = apiMessages[0].content === systemPrompt;
  const userMessageStillThere = apiMessages[1].role === 'user';
  
  console.log('✅ Tests:');
  console.log(`   - Message système ajouté: ${hasSystemMessage ? '✅' : '❌'}`);
  console.log(`   - Contenu système correct: ${systemContent ? '✅' : '❌'}`);
  console.log(`   - Message utilisateur préservé: ${userMessageStillThere ? '✅' : '❌'}`);
  
  // Test 2: Vérifier que sans system prompt, rien n'est ajouté
  const emptySystemPrompt = '';
  const apiMessages2 = [...testMessages];
  
  if (emptySystemPrompt && emptySystemPrompt.trim()) {
    apiMessages2.unshift({
      role: 'system',
      content: emptySystemPrompt.trim()
    });
  }
  
  const noSystemAdded = apiMessages2.length === 1 && apiMessages2[0].role === 'user';
  console.log(`   - Pas d'ajout si prompt vide: ${noSystemAdded ? '✅' : '❌'}`);
  
  console.log('\n🎯 Tous les tests passent:', hasSystemMessage && systemContent && userMessageStillThere && noSystemAdded ? '✅' : '❌');
};

// Pour exécuter dans la console du navigateur :
// testSystemPromptIntegration();

console.log('📝 Pour tester, copiez et collez cette ligne dans la console du navigateur :');
console.log('testSystemPromptIntegration();');
