// Script de debug pour l'onboarding
console.log('=== DEBUG ONBOARDING ===');

// Vérifier l'état du localStorage
const stored = localStorage.getItem('settings-storage');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    console.log('localStorage settings:', parsed);
    console.log('hasOnboarded:', parsed.state?.hasOnboarded);
  } catch (e) {
    console.error('Error parsing localStorage:', e);
  }
} else {
  console.log('No settings in localStorage');
}

// Vérifier si le modal devrait s'afficher
const shouldShow = !parsed?.state?.hasOnboarded;
console.log('Modal should show:', shouldShow);

// Reset pour test
console.log('Pour tester l\'onboarding, tapez: localStorage.removeItem("settings-storage"); location.reload()');
