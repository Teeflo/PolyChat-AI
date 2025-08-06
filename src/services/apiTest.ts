// Test simple de l'API OpenRouter pour vérifier la connectivité
export async function testOpenRouterAPI(): Promise<{
  success: boolean;
  message: string;
  modelCount?: number;
}> {
  try {
    console.log('🔍 Test de connectivité à l\'API OpenRouter...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return {
        success: false,
        message: `Erreur HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    const modelCount = data.data?.length || 0;
    
    console.log(`✅ API accessible, ${modelCount} modèles disponibles`);
    
    return {
      success: true,
      message: `API accessible, ${modelCount} modèles trouvés`,
      modelCount
    };
    
  } catch (error) {
    console.error('❌ Test API échoué:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Timeout: l\'API ne répond pas dans les temps'
        };
      }
      
      return {
        success: false,
        message: `Erreur: ${error.message}`
      };
    }
    
    return {
      success: false,
      message: 'Erreur inconnue lors du test de l\'API'
    };
  }
}
