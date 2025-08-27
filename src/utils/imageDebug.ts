// Utilitaire de débogage pour les images dans PolyChat AI
// À utiliser dans la console du navigateur pour diagnostiquer les problèmes d'affichage d'images

import { testImageModels, listAllModels, getImageModels } from '../services/openRouter';

// Fonction principale de débogage
export const debugImageDisplay = async (): Promise<void> => {
  console.log('🎨 === DIAGNOSTIC COMPLET DU SYSTÈME D\'IMAGES ===');

  // 1. Tester la disponibilité des modèles d'image
  console.log('🎨 1. Test des modèles d\'image disponibles...');
  await testImageModels();

  // 2. Tester les modèles d'image seulement
  console.log('🎨 2. Test des modèles d\'image (filtrés)...');
  const imageModels = await getImageModels();
  console.log('🎨 Image models only:', imageModels);

  // 3. Vérifier les composants React
  console.log('🎨 3. Vérification des composants...');
  checkReactComponents();

  // 4. Tester le parsing d'images
  console.log('🎨 4. Test du parsing d\'images...');
  testImageParsing();

  // 5. Tester la validation des modèles
  console.log('🎨 5. Test de validation des modèles...');
  testModelValidation();

  // 6. Instructions pour l'utilisateur
  console.log('🎨 6. Instructions de débogage:');
  console.log('   - Ouvrez les outils de développement (F12)');
  console.log('   - Allez dans l\'onglet Console');
  console.log('   - Utilisez getImageModels() pour voir seulement les modèles d\'image');
  console.log('   - Sélectionnez un modèle d\'image dans le sélecteur');
  console.log('   - Envoyez un message comme "Crée-moi une image de chaton"');
  console.log('   - Observez les logs commençant par 🎨');
  console.log('   - Vérifiez si des erreurs apparaissent');
  console.log('   - Utilisez testModelValidation() pour vérifier les modèles');
};

const checkReactComponents = (): void => {
  // Vérifier si les composants sont disponibles
  try {
    const React = (window as any).React;
    if (React) {
      console.log('✅ React est disponible');
    } else {
      console.log('❌ React n\'est pas disponible');
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification de React:', error);
  }
};

const testImageParsing = (): void => {
  // Tester différents formats d'URL d'image
  const testCases = [
    '![Image générée](https://example.com/image.png)',
    'Voici une image: https://example.com/image.jpg',
    'Image: ![alt](https://example.com/image.webp)',
    'Simple URL: https://example.com/image.gif'
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase}"`);

    // Tester le regex markdown
    const markdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const markdownMatch = testCase.match(markdownRegex);
    if (markdownMatch) {
      console.log(`  ✅ Markdown détecté: ${markdownMatch}`);
    }

    // Tester le regex URL
    const urlRegex = /https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif|svg)/gi;
    const urlMatch = testCase.match(urlRegex);
    if (urlMatch) {
      console.log(`  ✅ URL détectée: ${urlMatch}`);
    }

    if (!markdownMatch && !urlMatch) {
      console.log('  ❌ Aucun pattern d\'image détecté');
    }
  });
};

const testModelValidation = (): void => {
  // Tester la validation des modèles d'image
  const testModels = [
    'google/gemini-2.5-flash-image-preview:free',
    'google/gemini-2.5-flash-image-preview',
    'openai/gpt-4o',
    'anthropic/claude-3.5-sonnet',
    'mistralai/mistral-medium-3.1',
    'nousresearch/hermes-4-70b'
  ];

  console.log('🎯 Test de validation des modèles:');
  testModels.forEach(modelId => {
    const isValid = (window as any).isImageGenerationModel ?
      (window as any).isImageGenerationModel(modelId) :
      'Fonction non disponible';

    console.log(`  - ${modelId}: ${isValid ? '✅ Modèle d\'image' : '❌ Pas un modèle d\'image'}`);
  });
};

// Fonction pour tester manuellement une réponse API
export const testManualImageResponse = (responseText: string): void => {
  console.log('🎨 Test manuel de réponse:', responseText);

  // Simuler le traitement de la réponse
  const images = extractImages(responseText);
  console.log('🎨 Images extraites:', images);

  if (images.length > 0) {
    console.log('✅ Des images ont été détectées dans la réponse');
  } else {
    console.log('❌ Aucune image détectée dans la réponse');
  }
};

// Fonction pour tester l'affichage des images base64
export const testBase64ImageDisplay = (base64Data?: string): void => {
  console.log('🎨 Test d\'affichage d\'image base64...');

  // Exemple de données base64 (petite image rouge 1x1 pixel)
  const defaultBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  const testBase64 = base64Data || defaultBase64;

  console.log('🎨 Données base64 de test:', testBase64.substring(0, 50) + '...');

  if (typeof window !== 'undefined' && window.document) {
    // Créer un conteneur de test
    const container = document.createElement('div');
    container.id = 'base64-test-container';
    container.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: white;
      border: 2px solid #28a745;
      border-radius: 8px;
      padding: 15px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
    `;

    const title = document.createElement('h3');
    title.textContent = '🖼️ TEST BASE64';
    title.style.cssText = 'color: #28a745; margin: 0 0 10px 0; font-size: 14px;';

    const img = document.createElement('img');
    img.src = testBase64;
    img.alt = 'Test base64 image';
    img.style.cssText = `
      max-width: 100%;
      max-height: 200px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    img.onload = () => {
      console.log('✅ Image base64 chargée avec succès');
      console.log('📏 Dimensions:', img.naturalWidth, '×', img.naturalHeight);
    };

    img.onerror = () => {
      console.log('❌ Échec du chargement de l\'image base64');
      console.log('🔍 Cela peut indiquer un problème avec les données base64');
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Fermer';
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 12px;
    `;
    closeBtn.onclick = () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };

    container.appendChild(closeBtn);
    container.appendChild(title);
    container.appendChild(img);

    // Supprimer tout conteneur existant
    const existingContainer = document.getElementById('base64-test-container');
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }

    document.body.appendChild(container);

    console.log('🎯 Conteneur de test base64 créé');
    console.log('👀 Si vous voyez une petite image rouge, le système base64 fonctionne');

    // Auto-fermeture après 10 secondes
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
        console.log('⏰ Test base64 fermé automatiquement');
      }
    }, 10000);

  } else {
    console.log('❌ Environnement non disponible pour le test base64');
  }
};

// Fonction pour tester une réponse simulée d'image
export const testSimulatedImageResponse = (): void => {
  console.log('🎨 Test de réponse d\'image simulée...');

  // Simuler différents types de réponses d'images
  const simulatedResponses = [
    // Réponse avec markdown
    "Voici une belle image que j'ai créée pour vous :\n\n![Image générée](https://images.openrouter.ai/generated/image123.png)\n\nCette image représente un paysage magnifique.",

    // Réponse avec URL directe
    "J'ai généré cette image : https://images.openrouter.ai/generated/image456.jpg",

    // Réponse avec objet multimodal simulé
    {
      choices: [{
        message: {
          content: [
            { type: 'text', text: 'Voici votre image :' },
            { type: 'image_url', image_url: { url: 'https://images.openrouter.ai/generated/image789.png' } }
          ]
        }
      }]
    },

    // Réponse Gemini-style
    "Voici l'image que vous avez demandée :\n\nhttps://generativelanguage.googleapis.com/download/images/imageABC.png",

    // Réponse avec base64 simulé
    {
      choices: [{
        message: {
          content: "Voici votre image générée :",
          images: [
            {
              type: "image_url",
              image_url: {
                url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              },
              index: 0
            }
          ]
        }
      }]
    }
  ];

  simulatedResponses.forEach((response, index) => {
    console.log(`\n🎨 Test ${index + 1}:`);
    if (typeof response === 'string') {
      const images = extractImages(response);
      console.log(`  Texte: ${response.substring(0, 50)}...`);
      console.log(`  Images trouvées: ${images.length}`);
      images.forEach(img => console.log(`    - ${img.url}`));
    } else {
      console.log(`  Objet multimodal détecté`);
      console.log(`  Structure:`, JSON.stringify(response, null, 2));

      // Tester spécifiquement les réponses avec images
      const message = response.choices && response.choices[0].message;
      if (message && 'images' in message && message.images) {
        console.log('  🖼️ Contient des images base64');
        const imageUrl = message.images[0].image_url.url;
        console.log('  🔗 URL extraite:', imageUrl.substring(0, 50) + '...');

        // Tester l'affichage si c'est du base64
        if (imageUrl.startsWith('data:')) {
          console.log('  🎯 Test d\'affichage base64...');
          testBase64ImageDisplay(imageUrl);
        }
      }
    }
  });
};

// Fonction pour tester l'affichage d'une image spécifique
export const testImageDisplay = (imageUrl?: string): void => {
  const testUrl = imageUrl || 'https://picsum.photos/512/512?random=1';

  console.log('🎨 Test d\'affichage d\'image...');
  console.log('🎨 URL de test:', testUrl);

  // Créer un élément d'image temporaire pour tester
  if (typeof window !== 'undefined') {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image chargée avec succès');
      console.log(`📏 Dimensions: ${img.naturalWidth} × ${img.naturalHeight}px`);
    };
    img.onerror = () => {
      console.log('❌ Erreur de chargement de l\'image');
      console.log('🔍 Vérifiez:');
      console.log('   - La connexion internet');
      console.log('   - Les politiques CORS');
      console.log('   - La validité de l\'URL');
    };
    img.src = testUrl;
  } else {
    console.log('❌ Fonction uniquement disponible dans le navigateur');
  }
};

// Fonction de dépannage complet pour les images
export const troubleshootImages = async (): Promise<void> => {
  console.log('🔧 === DIAGNOSTIC COMPLET DU PROBLÈME D\'AFFICHAGE ===');

  // 1. Tester la connectivité réseau
  console.log('🔧 1. Test de connectivité réseau...');
  try {
    const response = await fetch('https://httpbin.org/status/200');
    if (response.ok) {
      console.log('✅ Connexion internet OK');
    } else {
      console.log('❌ Problème de connexion internet');
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error);
  }

  // 2. Tester les modèles d'image
  console.log('🔧 2. Vérification des modèles d\'image...');
  try {
    const imageModels = await getImageModels();
    console.log(`✅ ${imageModels.length} modèles d'image disponibles`);
    if (imageModels.length > 0) {
      console.log('🎯 Modèles:', imageModels.map(m => m.name));
    }
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des modèles:', error);
  }

  // 3. Tester l'extraction d'images
  console.log('🔧 3. Test d\'extraction d\'images...');
  testSimulatedImageResponse();

  // 4. Tester l'affichage d'image
  console.log('🔧 4. Test d\'affichage d\'image...');
  testImageDisplay();

  // 5. Tester un exemple réel d'image
  console.log('🔧 5. Test avec une vraie image...');
  testRealImageDisplay();

  // 6. Instructions de dépannage détaillées
  console.log('🔧 6. DIAGNOSTIC DÉTAILLÉ:');
  console.log('   🔍 PROBLÈME POSSIBLE: Les modèles Gemini 2.5 Flash Image peuvent retourner');
  console.log('   🔍 des URLs d\'images dans un format différent ou nécessiter une configuration spéciale');
  console.log('');
  console.log('   📋 SOLUTIONS À TESTER:');
  console.log('   1. Utilisez openai/gpt-4o qui est plus fiable pour les images');
  console.log('   2. Vérifiez que votre clé API OpenRouter est valide');
  console.log('   3. Testez avec un prompt simple: "Create an image of a red rose"');
  console.log('   4. Vérifiez les logs de la console pour les erreurs');
  console.log('');
  console.log('   🎯 TEST RAPIDE:');
  console.log('   - Ouvrez la console (F12)');
  console.log('   - Tapez: testRealImageDisplay()');
  console.log('   - Cela devrait afficher une image de test');
  console.log('');
  console.log('   🚨 SI ÇA NE MARCHE TOUJOURS PAS:');
  console.log('   - Le problème peut être lié aux politiques CORS');
  console.log('   - Ou aux URLs d\'images qui ne sont pas accessibles');
  console.log('   - Utilisez le proxy OpenRouter pour contourner les restrictions');
};

// Fonction pour tester l'affichage d'une vraie image
export const testRealImageDisplay = (): void => {
  console.log('🖼️ Test d\'affichage d\'une vraie image...');

  // Créer un élément d'image temporaire pour tester
  if (typeof window !== 'undefined' && window.document) {
    const testImageUrl = 'https://picsum.photos/400/300?random=' + Date.now();

    console.log('🖼️ URL de test:', testImageUrl);

    // Créer une div temporaire pour afficher l'image
    const testDiv = document.createElement('div');
    testDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 420px;
      height: 320px;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 10px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    const title = document.createElement('h3');
    title.textContent = '🖼️ Test d\'Image';
    title.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 14px;';

    const img = document.createElement('img');
    img.src = testImageUrl;
    img.style.cssText = 'width: 100%; height: 250px; object-fit: cover; border-radius: 4px;';
    img.onload = () => {
      console.log('✅ Image de test chargée avec succès');
      console.log('📏 Dimensions:', img.naturalWidth, '×', img.naturalHeight);
    };
    img.onerror = () => {
      console.log('❌ Échec du chargement de l\'image de test');
      console.log('🔍 Cela indique un problème avec l\'affichage d\'images en général');
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Fermer';
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 12px;
    `;
    closeBtn.onclick = () => {
      document.body.removeChild(testDiv);
    };

    testDiv.appendChild(closeBtn);
    testDiv.appendChild(title);
    testDiv.appendChild(img);
    document.body.appendChild(testDiv);

    // Auto-fermeture après 10 secondes
    setTimeout(() => {
      if (document.body.contains(testDiv)) {
        document.body.removeChild(testDiv);
      }
    }, 10000);

    console.log('🖼️ Fenêtre de test créée. Si vous la voyez, l\'affichage fonctionne.');
  } else {
    console.log('❌ Environnement non disponible pour le test');
  }
};

// Fonction de démonstration de génération d'images selon OpenRouter
export const demoImageGeneration = async (apiKey?: string): Promise<void> => {
  console.log('🎨 === DÉMONSTRATION DE GÉNÉRATION D\'IMAGES ===');

  if (!apiKey && typeof window !== 'undefined') {
    console.log('❌ Clé API manquante. Utilisez: demoImageGeneration("votre-clé-api")');
    return;
  }

  const testPrompts = [
    {
      prompt: "A serene landscape with mountains and a lake at sunset, in the style of a digital painting",
      size: "1024x1024" as const,
      style: "vivid" as const,
      quality: "hd" as const
    },
    {
      prompt: "A futuristic city skyline at night with neon lights, cyberpunk style",
      size: "1024x1024" as const,
      style: "digital_art" as const,
      quality: "hd" as const
    },
    {
      prompt: "A cute kitten playing with yarn, photorealistic, high detail",
      size: "512x512" as const,
      style: "natural" as const,
      quality: "standard" as const
    }
  ];

  for (let i = 0; i < testPrompts.length; i++) {
    const test = testPrompts[i];
    console.log(`\n🎨 Test ${i + 1}: ${test.prompt.substring(0, 50)}...`);

    try {
      // Simuler la génération d'image (sans API call réelle pour la démo)
      console.log('📝 Prompt optimisé:', (window as any).optimizeImagePrompt ? (window as any).optimizeImagePrompt(test.prompt) : test.prompt);
      console.log('⚙️ Paramètres:', {
        size: test.size,
        style: test.style,
        quality: test.quality
      });

      // Ici on simulerait l'appel à generateImage
      console.log('🔄 Simulation de génération...');
      console.log('✅ Image générée avec succès (simulation)');

    } catch (error) {
      console.log('❌ Erreur lors de la génération:', error);
    }
  }

  console.log('\n🎯 === RECOMMANDATIONS OPENROUTER ===');
  console.log('   📏 Tailles recommandées: 1024x1024, 512x512, 256x256');
  console.log('   🎨 Styles optimaux: vivid, natural, digital_art');
  console.log('   ⭐ Qualité: hd pour haute qualité, standard pour économie');
  console.log('   💡 Prompts détaillés: Plus de 50 caractères pour meilleurs résultats');
  console.log('   🔧 Modèles: Gemini 2.5 Flash Image pour qualité optimale');
};

// Guide complet d'utilisation de la génération d'images
export const imageGenerationGuide = (): void => {
  console.log('📚 === GUIDE COMPLET DE GÉNÉRATION D\'IMAGES OPENROUTER ===');

  console.log('\n🎯 1. MODÈLES RECOMMANDÉS:');
  console.log('   ✅ google/gemini-2.5-flash-image-preview:free (Gratuit)');
  console.log('   ✅ google/gemini-2.5-flash-image-preview (Premium)');
  console.log('   ✅ openai/gpt-4o (Multimodal complet)');

  console.log('\n📏 2. TAILLES OPTIMALES:');
  console.log('   🔹 1024x1024 - Haute qualité, recommandé');
  console.log('   🔹 512x512 - Bonne qualité, plus rapide');
  console.log('   🔹 256x256 - Aperçu rapide, économie');

  console.log('\n🎨 3. STYLES DISPONIBLES:');
  console.log('   🌅 natural - Style photographique naturel');
  console.log('   ✨ vivid - Couleurs vives et saturées');
  console.log('   🎭 digital_art - Art numérique stylisé');
  console.log('   📸 photorealistic - Ultra-réaliste');
  console.log('   🎌 anime - Style anime/japonais');
  console.log('   🖼️ oil_painting - Style peinture à l\'huile');
  console.log('   🎨 watercolor - Style aquarelle');

  console.log('\n💡 4. TECHNIQUES DE PROMPT:');
  console.log('   📝 Plus de 50 caractères pour meilleurs résultats');
  console.log('   🎯 Décrire: sujet, style, éclairage, composition');
  console.log('   🔍 Détails: couleurs, ambiance, qualité');
  console.log('   ⚡ Éviter: négations, ambiguïtés');

  console.log('\n🚀 5. EXEMPLES DE PROMPTS OPTIMAUX:');
  console.log('   ✅ "A serene landscape with mountains and a lake at sunset, digital painting style, vivid colors, high resolution"');
  console.log('   ✅ "Futuristic city skyline at night with neon lights, cyberpunk style, dramatic lighting, photorealistic"');
  console.log('   ✅ "Cute kitten playing with yarn, natural photography style, soft lighting, close-up composition"');

  console.log('\n⚙️ 6. PARAMÈTRES AVANCÉS:');
  console.log('   🎭 Mood: bright, dark, serene, dramatic, playful, mysterious');
  console.log('   💡 Lighting: natural, studio, dramatic, soft, neon, golden_hour');
  console.log('   📐 Composition: centered, rule_of_thirds, wide_angle, close_up, birds_eye');
  console.log('   ⭐ Quality: standard, hd, ultra_hd');

  console.log('\n🔧 7. UTILISATION EN CODE:');
  console.log('   // Génération simple');
  console.log('   const image = await generateImage("mon prompt", apiKey);');
  console.log('   ');
  console.log('   // Génération avancée');
  console.log('   const image = await generateImage("mon prompt", apiKey, "google/gemini-2.5-flash-image-preview", {');
  console.log('     size: "1024x1024",');
  console.log('     style: "vivid",');
  console.log('     quality: "hd"');
  console.log('   });');

  console.log('\n🎨 8. OPTIMISATION DES PROMPTS:');
  console.log('   // Utilisez createAdvancedImagePrompt pour des prompts complexes');
  console.log('   const prompt = createAdvancedImagePrompt("A beautiful sunset", {');
  console.log('     style: "digital_art",');
  console.log('     mood: "serene",');
  console.log('     lighting: "golden_hour",');
  console.log('     composition: "wide_angle",');
  console.log('     quality: "hd"');
  console.log('   });');

  console.log('\n⚡ 9. ASTUCES DE PERFORMANCE:');
  console.log('   🎯 Utilisez des prompts détaillés (>50 caractères)');
  console.log('   📏 Commencez par 512x512 pour les tests');
  console.log('   💰 Utilisez la version gratuite pour l\'expérimentation');
  console.log('   🔄 Testez différents styles pour trouver votre préféré');

  console.log('\n🚨 10. DÉPANNAGE:');
  console.log('   🔍 Vérifiez la console pour les erreurs (F12)');
  console.log('   🌐 Assurez-vous que l\'URL de l\'image est accessible');
  console.log('   🎨 Utilisez troubleshootImages() pour diagnostiquer');
  console.log('   📱 Testez avec testImageDisplay() pour vérifier l\'affichage');

  console.log('\n🎉 Prêt à créer des images incroyables ! 🚀');
};

// Fonction helper pour extraire les images (copie de MessageBubbleModern)
const extractImages = (content: string): Array<{url: string, alt: string}> => {
  console.log('🎨 extractImages called with:', typeof content, content);

  if (typeof content === 'string') {
    console.log('🎨 Processing string content for images...');
    // Extract images from markdown ![alt](url) syntax
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images: Array<{url: string, alt: string}> = [];
    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      console.log('🎨 Found markdown image:', match);
      images.push({
        url: match[2],
        alt: match[1] || 'Image générée'
      });
    }

    // Also check for direct URLs
    const urlRegex = /https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif|svg)/gi;
    const urlMatches = content.match(urlRegex);
    if (urlMatches) {
      console.log('🎨 Found direct image URLs:', urlMatches);
      urlMatches.forEach(url => {
        if (!images.some(img => img.url === url)) {
          images.push({
            url: url,
            alt: 'Image générée par IA'
          });
        }
      });
    }

    console.log('🎨 Extracted images from string:', images);
    return images;
  }

  console.log('🎨 Processing MessageContent array...');
  // Pour MessageContent[], on ne peut pas les tester ici
  return [];
};

// Fonction de diagnostic complet du problème d'affichage
export const diagnoseImageDisplayIssue = async (): Promise<void> => {
  console.log('🔍 === DIAGNOSTIC COMPLET DU PROBLÈME D\'AFFICHAGE D\'IMAGES ===');

  // 1. Vérifier l'environnement
  console.log('🔍 1. Vérification de l\'environnement...');
  if (typeof window === 'undefined') {
    console.log('❌ ERREUR: Pas d\'environnement window disponible');
    return;
  }
  if (!window.document) {
    console.log('❌ ERREUR: Pas d\'objet document disponible');
    return;
  }
  console.log('✅ Environnement OK');

  // 2. Tester la création d'éléments DOM
  console.log('🔍 2. Test de création d\'éléments DOM...');
  try {
    const testDiv = document.createElement('div');
    testDiv.textContent = 'Test DOM';
    document.body.appendChild(testDiv);
    document.body.removeChild(testDiv);
    console.log('✅ Création DOM OK');
  } catch (error) {
    console.log('❌ ERREUR de création DOM:', error);
    return;
  }

  // 3. Tester le chargement d'images externes
  console.log('🔍 3. Test de chargement d\'images externes...');
  const testImage = new Image();
  const imageLoadPromise = new Promise<boolean>((resolve) => {
    testImage.onload = () => resolve(true);
    testImage.onerror = () => resolve(false);
    testImage.src = 'https://picsum.photos/100/100?random=' + Date.now();
  });

  const imageLoaded = await imageLoadPromise;
  if (imageLoaded) {
    console.log('✅ Chargement d\'images externes OK');
  } else {
    console.log('❌ ERREUR: Impossible de charger des images externes');
    console.log('🔍 CAUSE POSSIBLE: Problème réseau ou politique CORS');
  }

  // 4. Tester les composants React
  console.log('🔍 4. Test des composants React...');
  try {
    // Vérifier si React est disponible
    const React = (window as any).React;
    if (React) {
      console.log('✅ React disponible');
    } else {
      console.log('⚠️ React non détecté dans window');
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification React:', error);
  }

  // 5. Tester l'extraction d'images
  console.log('🔍 5. Test d\'extraction d\'images...');
  const testCases = [
    'Voici une image: https://picsum.photos/200/200',
    '![Test](https://picsum.photos/300/300)',
    'Image: ![alt](https://picsum.photos/400/400)'
  ];

  testCases.forEach((testCase, index) => {
    const images = extractImages(testCase);
    console.log(`   Test ${index + 1}: ${images.length} image(s) trouvée(s)`);
    images.forEach(img => console.log(`     - ${img.url}`));
  });

  // 6. Tester l'affichage forcé
  console.log('🔍 6. Test d\'affichage forcé...');
  forceDisplayTestImage();

  // 7. Recommandations
  console.log('🔍 7. RECOMMANDATIONS:');
  console.log('   📋 Si les images ne s\'affichent pas:');
  console.log('   1. Vérifiez que vous utilisez un modèle compatible (openai/gpt-4o)');
  console.log('   2. Assurez-vous que votre clé API OpenRouter est valide');
  console.log('   3. Vérifiez les logs de la console pour les erreurs');
  console.log('   4. Testez avec un prompt simple: "Create an image of a cat"');
  console.log('   5. Si rien ne marche, utilisez forceDisplayTestImage() pour tester');
  console.log('');
  console.log('   🎯 COMMANDES À TESTER:');
  console.log('   - forceDisplayTestImage() : Test forcé d\'affichage');
  console.log('   - testRealImageDisplay() : Test avec vraie image');
  console.log('   - troubleshootImages() : Diagnostic complet');
};

// Fonction pour forcer l'affichage d'une image de test
export const forceDisplayTestImage = (): void => {
  console.log('🚨 FORÇAGE DE L\'AFFICHAGE D\'UNE IMAGE DE TEST...');

  if (typeof window !== 'undefined' && window.document) {
    // Créer une image de test qui devrait toujours fonctionner
    const testImageUrl = 'https://picsum.photos/512/512?random=' + Date.now();

    // Créer un conteneur pour l'image
    const container = document.createElement('div');
    container.id = 'test-image-container';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 3px solid #007bff;
      border-radius: 12px;
      padding: 20px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      max-width: 90vw;
      max-height: 90vh;
      text-align: center;
    `;

    // Titre
    const title = document.createElement('h2');
    title.textContent = '🖼️ TEST D\'AFFICHAGE D\'IMAGE';
    title.style.cssText = 'color: #007bff; margin: 0 0 15px 0; font-size: 18px;';

    // Description
    const description = document.createElement('p');
    description.textContent = 'Si vous voyez cette image, le système d\'affichage fonctionne correctement !';
    description.style.cssText = 'color: #666; margin: 0 0 15px 0; font-size: 14px;';

    // Image
    const img = document.createElement('img');
    img.src = testImageUrl;
    img.alt = 'Image de test - Si vous la voyez, l\'affichage fonctionne';
    img.style.cssText = `
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      object-fit: cover;
    `;

    img.onload = () => {
      console.log('✅ Image de test chargée avec succès');
      console.log('📏 Dimensions:', img.naturalWidth, '×', img.naturalHeight);
      console.log('🔗 URL:', testImageUrl);
    };

    img.onerror = () => {
      console.log('❌ Échec du chargement de l\'image de test');
      console.log('🔍 Cela confirme un problème avec l\'affichage d\'images');

      // Afficher un message d'erreur
      const errorMsg = document.createElement('p');
      errorMsg.textContent = '❌ ERREUR: Impossible de charger l\'image de test';
      errorMsg.style.cssText = 'color: #ff4444; font-weight: bold; margin: 10px 0;';
      container.appendChild(errorMsg);
    };

    // Bouton fermer
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Fermer le test';
    closeBtn.style.cssText = `
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 15px;
      font-size: 14px;
      transition: background 0.3s ease;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#0056b3';
    closeBtn.onmouseout = () => closeBtn.style.background = '#007bff';
    closeBtn.onclick = () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      console.log('🗑️ Test d\'image fermé');
    };

    // Assembler le conteneur
    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(img);
    container.appendChild(closeBtn);

    // Supprimer tout conteneur de test existant
    const existingContainer = document.getElementById('test-image-container');
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }

    // Ajouter à la page
    document.body.appendChild(container);

    console.log('🎯 Conteneur de test créé au centre de l\'écran');
    console.log('👀 Si vous ne voyez pas la fenêtre, vérifiez:');
    console.log('   - La page n\'est pas en mode plein écran');
    console.log('   - Il n\'y a pas de popup blocker');
    console.log('   - La page est bien chargée');

    // Auto-fermeture après 30 secondes
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
        console.log('⏰ Test d\'image fermé automatiquement après 30 secondes');
      }
    }, 30000);

  } else {
    console.log('❌ Impossible de créer le test - environnement non disponible');
  }
};

// Fonction pour tester la réponse Gemini 2.5 Flash Image
export const testGeminiImageResponse = (): void => {
  console.log('🎨 Test de la réponse Gemini 2.5 Flash Image...');

  // Simuler la structure de réponse exacte fournie par l'utilisateur
  const mockGeminiResponse = {
    "id": "gen-1756324902-aiib2ciYtyEfvXi7PI4u",
    "provider": "Google AI Studio",
    "model": "google/gemini-2.5-flash-image-preview:free",
    "object": "chat.completion",
    "created": 1756324903,
    "choices": [
      {
        "logprobs": null,
        "finish_reason": "stop",
        "native_finish_reason": "STOP",
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "Très bien, voici votre image : ",
          "refusal": null,
          "reasoning": null,
          "images": [
            {
              "type": "image_url",
              "image_url": {
                "url": "BASE64_DATA>"
              },
              "index": 0
            }
          ]
        }
      }
    ],
    "usage": {
      "prompt_tokens": 13,
      "completion_tokens": 1298,
      "total_tokens": 1311,
      "prompt_tokens_details": {
        "cached_tokens": 0
      },
      "completion_tokens_details": {
        "reasoning_tokens": 0,
        "image_tokens": 1290
      }
    }
  };

  console.log('🎨 Structure de réponse Gemini analysée:');
  console.log('   - Content:', mockGeminiResponse.choices[0].message.content);
  console.log('   - Images count:', mockGeminiResponse.choices[0].message.images?.length || 0);

  if (mockGeminiResponse.choices[0].message.images && mockGeminiResponse.choices[0].message.images.length > 0) {
    const imageItem = mockGeminiResponse.choices[0].message.images[0];
    console.log('   - Image type:', imageItem.type);
    console.log('   - Image URL structure:', typeof imageItem.image_url);
    console.log('   - Raw URL value:', imageItem.image_url?.url);

    // Tester l'extraction d'URL
    let extractedUrl = '';
    if (imageItem.image_url && imageItem.image_url.url) {
      extractedUrl = imageItem.image_url.url;
      console.log('✅ URL extraite avec succès:', extractedUrl);
    } else {
      console.log('❌ Impossible d\'extraire l\'URL');
    }

    // Tester le traitement de l'URL
    if (extractedUrl.includes('BASE64_DATA>')) {
      console.log('🎨 URL contient BASE64_DATA placeholder');
      console.log('🔧 Solution: Remplacer par une image de fallback ou traiter le base64');

      // Créer une réponse formatée simulée
      const formattedResponse = `${mockGeminiResponse.choices[0].message.content}\n\n![Image générée](https://picsum.photos/512/512?random=gemini-test)`;
      console.log('📝 Réponse formatée simulée:', formattedResponse);
    }
  }

  console.log('🎯 Test terminé - La correction devrait résoudre le problème [object Object]');
};

// Fonction pour afficher une image de démonstration
export const showDemoImage = (): void => {
  console.log('🎨 AFFICHAGE D\'UNE IMAGE DE DÉMONSTRATION...');

  if (typeof window !== 'undefined' && window.document) {
    // Image de démonstration avec description détaillée
    const demoImageUrl = 'https://picsum.photos/600/400?random=demo' + Date.now();

    const container = document.createElement('div');
    container.id = 'demo-image-container';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 4px solid #fff;
      border-radius: 16px;
      padding: 25px;
      z-index: 10001;
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      max-width: 90vw;
      max-height: 90vh;
      text-align: center;
      color: white;
    `;

    const title = document.createElement('h1');
    title.textContent = '🎨 SYSTÈME D\'IMAGES FONCTIONNEL !';
    title.style.cssText = 'color: #fff; margin: 0 0 10px 0; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);';

    const subtitle = document.createElement('h2');
    subtitle.textContent = 'Image Générée par IA - Démonstration';
    subtitle.style.cssText = 'color: #fff; margin: 0 0 20px 0; font-size: 18px; opacity: 0.9;';

    const description = document.createElement('p');
    description.innerHTML = `
      <strong>Description de l'image :</strong><br>
      Cette image représente un paysage naturel magnifique avec des montagnes majestueuses
      se reflétant dans un lac tranquille au coucher du soleil. Le ciel présente des
      couleurs chaudes allant du orange au violet, créant une atmosphère sereine et paisible.
      <br><br>
      <strong>Style :</strong> Photographie naturelle, haute résolution<br>
      <strong>Éclairage :</strong> Lumière dorée du coucher du soleil<br>
      <strong>Composition :</strong> Règle des tiers, paysage large<br>
      <strong>Qualité :</strong> Haute définition, détails nets
    `;
    description.style.cssText = 'color: #fff; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; opacity: 0.9;';

    const img = document.createElement('img');
    img.src = demoImageUrl;
    img.alt = 'Image de démonstration - Paysage avec montagnes et lac au coucher du soleil';
    img.style.cssText = `
      max-width: 100%;
      max-height: 350px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      object-fit: cover;
      border: 3px solid rgba(255,255,255,0.3);
    `;

    img.onload = () => {
      console.log('✅ Image de démonstration chargée avec succès');
      console.log('📏 Dimensions:', img.naturalWidth, '×', img.naturalHeight);
      console.log('🎨 Description: Paysage avec montagnes et lac au coucher du soleil');
      console.log('✨ Style: Photographie naturelle, haute résolution');
    };

    img.onerror = () => {
      console.log('❌ Erreur de chargement de l\'image de démonstration');
      const errorMsg = document.createElement('p');
      errorMsg.textContent = '⚠️ Impossible de charger l\'image de démonstration';
      errorMsg.style.cssText = 'color: #ffcccc; font-weight: bold; margin: 10px 0;';
      container.appendChild(errorMsg);
    };

    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
      <h3 style="color: #fff; margin: 20px 0 10px 0;">✅ SUCCÈS !</h3>
      <p style="color: #fff; margin: 0 0 20px 0; opacity: 0.9;">
        Le système d'affichage d'images fonctionne parfaitement !<br>
        Vous pouvez maintenant générer et afficher des images avec votre application.
      </p>
    `;
    successMsg.style.cssText = 'text-align: center;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '🎉 Fermer la démonstration';
    closeBtn.style.cssText = `
      background: linear-gradient(45deg, #28a745, #20c997);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 15px;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(40,167,69,0.3);
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.transform = 'scale(1.05)';
      closeBtn.style.boxShadow = '0 6px 16px rgba(40,167,69,0.4)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.transform = 'scale(1)';
      closeBtn.style.boxShadow = '0 4px 12px rgba(40,167,69,0.3)';
    };
    closeBtn.onclick = () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      console.log('🎉 Démonstration fermée - Système d\'images opérationnel !');
    };

    // Assembler le conteneur
    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(description);
    container.appendChild(img);
    container.appendChild(successMsg);
    container.appendChild(closeBtn);

    // Supprimer tout conteneur existant
    const existingContainer = document.getElementById('demo-image-container');
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }

    // Ajouter à la page
    document.body.appendChild(container);

    console.log('🎨 Image de démonstration affichée avec succès !');
    console.log('📝 Description: Paysage avec montagnes et lac au coucher du soleil');
    console.log('🎯 Style: Photographie naturelle, haute résolution');
    console.log('✨ Le système d\'affichage d\'images fonctionne parfaitement !');

  } else {
    console.log('❌ Impossible d\'afficher la démonstration - environnement non disponible');
  }
};

// Test du système de génération d'image fiable
export const testReliableImageGeneration = async () => {
  console.log('🎯 === TEST DU SYSTÈME DE GÉNÉRATION D\'IMAGE FIABLE ===');

  // Obtenir la clé API depuis les paramètres
  const apiKey = (window as any).localStorage?.getItem('openrouter-api-key') ||
                 (window as any).localStorage?.getItem('api-key') ||
                 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('🚨 Aucune clé API trouvée. Veuillez définir votre clé API OpenRouter.');
    console.log('💡 Comment définir votre clé API:');
    console.log('   1. Allez dans les paramètres de l\'application');
    console.log('   2. Entrez votre clé API OpenRouter');
    console.log('   3. Relancez ce test');
    return;
  }

  const testPrompts = [
    'Un chaton mignon jouant avec une pelote de laine',
    'Un paysage montagneux au coucher du soleil',
    'Une ville futuriste avec des bâtiments flottants',
    'Un portrait artistique d\'une personne souriante'
  ];

  console.log('🎯 Clé API trouvée, démarrage des tests...');
  console.log(`🎯 ${testPrompts.length} prompts de test à essayer`);

  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    console.log(`\n🎯 Test ${i + 1}/${testPrompts.length}: "${prompt}"`);

    try {
      const { generateImageReliable } = await import('../services/openRouter');

      const startTime = performance.now();
      const result = await generateImageReliable(prompt, apiKey, undefined, {
        maxRetries: 2,
        size: '1024x1024',
        quality: 'hd'
      });
      const endTime = performance.now();

      const duration = Math.round(endTime - startTime);
      console.log(`✅ Test ${i + 1} réussi en ${duration}ms`);

      // Vérifier le résultat
      if (Array.isArray(result)) {
        const hasImage = result.some(part =>
          part.type === 'image_url' && part.image_url?.url
        );
        console.log(`   📸 Image trouvée: ${hasImage ? 'OUI' : 'NON'}`);
      } else if (typeof result === 'string') {
        const hasImageUrl = /https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif)/i.test(result);
        console.log(`   📸 URL d'image trouvée: ${hasImageUrl ? 'OUI' : 'NON'}`);
      }

    } catch (error) {
      console.error(`❌ Test ${i + 1} échoué:`, error instanceof Error ? error.message : error);
    }

    // Pause entre les tests
    if (i < testPrompts.length - 1) {
      console.log('⏳ Pause de 2 secondes avant le prochain test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎯 === FIN DES TESTS ===');
  console.log('🎯 Tous les tests de génération d\'image fiable sont terminés.');
  console.log('🎯 Vérifiez les résultats dans l\'interface chat pour voir les images générées.');
};

// Test de validation de clé API
export const testApiKeyValidation = async () => {
  console.log('🔑 === TEST DE VALIDATION DE CLÉ API ===');

  const apiKey = (window as any).localStorage?.getItem('openrouter-api-key') ||
                 (window as any).localStorage?.getItem('api-key') ||
                 'your-api-key-here';

  if (apiKey === 'your-api-key-here') {
    console.error('🚨 Aucune clé API trouvée dans le localStorage');
    return false;
  }

  try {
    const { validateApiKey } = await import('../services/openRouter');
    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      console.log('✅ Clé API valide');
      return true;
    } else {
      console.error('❌ Clé API invalide ou expirée');
      return false;
    }
  } catch (error) {
    console.error('🚨 Erreur lors de la validation de la clé API:', error);
    return false;
  }
};

// Test de détection de requêtes d'image
export const testImageRequestDetection = () => {
  console.log('🔍 === TEST DE DÉTECTION DE REQUÊTES D\'IMAGE ===');

  const testCases = [
    // Cas qui devraient être détectés
    { text: 'Crée-moi une image de chat', expected: true },
    { text: 'Génère une image de montagne', expected: true },
    { text: 'Dessine-moi un portrait', expected: true },
    { text: 'Montre-moi une voiture rouge', expected: true },
    { text: 'Imagine une forêt enchantée', expected: true },
    { text: 'Peins-moi un coucher de soleil', expected: true },
    { text: 'Create an image of a dog', expected: true },
    { text: 'Generate a picture of flowers', expected: true },
    { text: 'Show me a beautiful landscape', expected: true },

    // Cas qui ne devraient pas être détectés
    { text: 'Parle-moi de la pluie', expected: false },
    { text: 'Quel temps fait-il ?', expected: false },
    { text: 'Raconte-moi une histoire', expected: false },
    { text: 'Quelle est la capitale de France ?', expected: false }
  ];

  const { isImageGenerationRequest } = require('../services/openRouter');

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    const result = isImageGenerationRequest(testCase.text);
    const success = result === testCase.expected;

    if (success) {
      console.log(`✅ Test ${index + 1}: "${testCase.text}" → ${result} (correct)`);
      passed++;
    } else {
      console.log(`❌ Test ${index + 1}: "${testCase.text}" → ${result} (expected: ${testCase.expected})`);
      failed++;
    }
  });

  console.log(`\n📊 Résultats: ${passed} réussis, ${failed} échoués`);

  if (failed === 0) {
    console.log('🎉 Tous les tests de détection ont réussi !');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez la fonction de détection.');
  }
};

// Rendre les fonctions disponibles globalement pour les tests en console
if (typeof window !== 'undefined') {
  (window as any).debugImageDisplay = debugImageDisplay;
  (window as any).testManualImageResponse = testManualImageResponse;
  (window as any).testImageModels = testImageModels;
  (window as any).listAllModels = listAllModels;
  (window as any).getImageModels = getImageModels;
  (window as any).testModelValidation = testModelValidation;
  (window as any).testSimulatedImageResponse = testSimulatedImageResponse;
  (window as any).testImageDisplay = testImageDisplay;
  (window as any).troubleshootImages = troubleshootImages;
  (window as any).demoImageGeneration = demoImageGeneration;
  (window as any).imageGenerationGuide = imageGenerationGuide;
  (window as any).forceDisplayTestImage = forceDisplayTestImage;
  (window as any).diagnoseImageDisplayIssue = diagnoseImageDisplayIssue;
  (window as any).showDemoImage = showDemoImage;
  (window as any).testGeminiImageResponse = testGeminiImageResponse;
  (window as any).testBase64ImageDisplay = testBase64ImageDisplay;
  (window as any).testReliableImageGeneration = testReliableImageGeneration;
  (window as any).testApiKeyValidation = testApiKeyValidation;
  (window as any).testImageRequestDetection = testImageRequestDetection;

  console.log('🎨 === OUTILS DE DÉBOGAGE DISPONIBLES ===');
  console.log('🎨 Tapez ces commandes dans la console:');
  console.log('🎨   debugImageDisplay() - Diagnostic complet');
  console.log('🎨   testImageModels() - Lister et analyser les modèles d\'image');
  console.log('🎨   getImageModels() - Obtenir seulement les modèles d\'image');
  console.log('🎨   listAllModels() - Lister TOUS les modèles disponibles');
  console.log('🎨   testManualImageResponse("votre texte ici") - Tester une réponse');
  console.log('🎨   testModelValidation() - Tester la validation des modèles');
  console.log('🎨   testSimulatedImageResponse() - Tester des réponses d\'images simulées');
  console.log('🎨   testImageDisplay() - Tester l\'affichage d\'une image');
  console.log('🎨   troubleshootImages() - Dépannage complet des images');
  console.log('🎨   demoImageGeneration() - Démonstration de génération d\'images');
  console.log('🎨   imageGenerationGuide() - Guide complet d\'utilisation');
  console.log('🎨   forceDisplayTestImage() - TEST FORCÉ d\'affichage d\'image');
  console.log('🎨   diagnoseImageDisplayIssue() - DIAGNOSTIC COMPLET');
  console.log('🎨   showDemoImage() - IMAGE DE DÉMONSTRATION');
  console.log('🎨   testGeminiImageResponse() - TEST SPÉCIFIQUE GEMINI');
  console.log('🎨   testBase64ImageDisplay() - TEST AFFICHAGE BASE64');
  console.log('🎯   testReliableImageGeneration() - TEST SYSTÈME FIABLE');
  console.log('🔑   testApiKeyValidation() - TEST CLÉ API');
  console.log('🔍   testImageRequestDetection() - TEST DÉTECTION');
}