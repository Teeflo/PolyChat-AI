// Utilitaire de test de clé API OpenRouter
// À utiliser dans la console du navigateur pour diagnostiquer les problèmes de clé API

import { diagnoseApiKey } from '../services/openRouter';

// Fonction de test de la clé API OpenRouter
export const testApiKey = async (): Promise<void> => {
  console.log('🔑 === TEST CLÉ API OPENROUTER ===');

  // Chercher la clé API dans localStorage
  const settings = localStorage.getItem('polychat-settings');
  if (!settings) {
    console.log('❌ Aucun paramètre trouvé');
    console.log('💡 Allez dans les paramètres pour définir votre clé API');
    return;
  }

  try {
    const parsed = JSON.parse(settings);
    const apiKey = parsed.state?.apiKey;

    if (!apiKey) {
      console.log('❌ Aucune clé API trouvée dans les paramètres');
      console.log('💡 Entrez votre clé API dans les paramètres');
      return;
    }

    if (!apiKey.startsWith('sk-or-v1-')) {
      console.log('❌ Format de clé API invalide');
      console.log('💡 La clé doit commencer par "sk-or-v1-"');
      return;
    }

    // Masquer la clé dans les logs
    const maskedKey = apiKey.substring(0, 12) + '...' + apiKey.substring(apiKey.length - 4);
    console.log(`🔑 Clé API trouvée: ${maskedKey}`);

    // Tester la validation
    console.log('🔍 Validation auprès d\'OpenRouter...');
    const diagnosis = await diagnoseApiKey(apiKey);
    console.log(`📋 Résultat: ${diagnosis.message}`);

    if (diagnosis.valid) {
      console.log('✅ Clé API valide !');
      console.log('🎯 Vous pouvez maintenant utiliser le chat');
    } else {
      console.log('❌ Clé API rejetée');
      diagnosis.suggestions.forEach(suggestion => console.log(`   💡 ${suggestion}`));
    }

  } catch (error) {
    console.log('❌ Erreur lors du test:', error);
    console.log('🔍 Vérifiez votre connexion internet');
  }
};

// Rendre la fonction disponible globalement
if (typeof window !== 'undefined') {
  (window as any).testApiKey = testApiKey;

  console.log('🔑 === FONCTION DE TEST DISPONIBLE ===');
  console.log('🔑 Tapez testApiKey() dans la console pour tester votre clé API');
}