import React, { useState } from 'react';
import { Loader2, Image, X, Wand2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { generateImageReliable } from '../../services/openRouter';
import type { GeneratedImage } from '../../types/index';
import './ImageGenerator.css';

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  onClose: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onImageGenerated,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash-image-preview:free');
  const [selectedSize, setSelectedSize] = useState<'1024x1024' | '512x512' | '256x256'>('1024x1024');
  const [selectedStyle, setSelectedStyle] = useState<'natural' | 'vivid' | 'digital_art'>('vivid');
  const { theme, apiKey } = useSettings();

  const isDark = theme === 'dark';

  const modelOptions = [
    { value: 'google/gemini-2.5-flash-image-preview:free', label: 'Gemini 2.5 Flash (Gratuit)' },
    { value: 'google/gemini-2.5-flash-image-preview', label: 'Gemini 2.5 Flash (Premium)' },
    { value: 'openai/gpt-4o', label: 'GPT-4o (Multimodal)' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' }
  ];

  const sizeOptions = [
    { value: '1024x1024', label: 'Grande (1024×1024)' },
    { value: '512x512', label: 'Moyenne (512×512)' },
    { value: '256x256', label: 'Petite (256×256)' }
  ];

  const styleOptions = [
    { value: 'natural', label: 'Naturel' },
    { value: 'vivid', label: 'Vif' },
    { value: 'digital_art', label: 'Art numérique' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !apiKey) return;

    setIsGenerating(true);

    try {
      console.log('🎨 Starting image generation with prompt:', prompt);

      const result = await generateImageReliable(
        prompt.trim(),
        apiKey,
        selectedModel,
        {
          maxRetries: 3,
          size: selectedSize,
          style: selectedStyle,
          quality: 'hd'
        }
      );

      // Convertir le résultat en GeneratedImage
      let imageUrl = '';

      if (Array.isArray(result)) {
        // Chercher l'URL d'image dans le contenu multimodal
        for (const part of result) {
          if (part.type === 'image_url' && part.image_url?.url) {
            imageUrl = part.image_url.url;
            break;
          }
        }
      } else if (typeof result === 'string') {
        // Extraire l'URL d'une chaîne
        const urlMatch = result.match(/https?:\/\/[^\s]+\.(?:png|jpg|jpeg|webp|gif)/i);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }

      if (imageUrl) {
        // Créer l'objet GeneratedImage
        const generatedImage: GeneratedImage = {
          url: imageUrl,
          width: selectedSize === '1024x1024' ? 1024 : selectedSize === '512x512' ? 512 : 256,
          height: selectedSize === '1024x1024' ? 1024 : selectedSize === '512x512' ? 512 : 256,
          format: 'png',
          size: 0, // Sera mis à jour si on peut récupérer la taille
          prompt: prompt.trim(),
          model: selectedModel,
          timestamp: new Date()
        };

        console.log('✅ Image generated successfully:', generatedImage);
        onImageGenerated(generatedImage);
        onClose();
      } else {
        throw new Error('Aucune URL d\'image trouvée dans la réponse');
      }

    } catch (error) {
      console.error('❌ Image generation failed:', error);
      // L'erreur sera affichée dans le chat via le système de génération fiable
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className={`image-generator ${isDark ? 'dark' : 'light'}`}>
      <div className="image-generator-header">
        <h3 className="image-generator-title">
          <Wand2 size={20} className="inline mr-2" />
          Générateur d'Images IA
        </h3>
        <button
          onClick={onClose}
          className="image-generator-close"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="image-generator-content">
        <div className="image-generator-form">
          <div className="form-group">
            <label htmlFor="prompt" className="form-label">
              Description de l'image *
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Décrivez l'image que vous souhaitez créer... (ex: Un chaton jouant dans un jardin ensoleillé)"
              disabled={isGenerating}
              rows={4}
              className={`form-textarea ${isDark ? 'dark' : 'light'}`}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="model" className="form-label">
                Modèle IA
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isGenerating}
                className={`form-select ${isDark ? 'dark' : 'light'}`}
              >
                {modelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="size" className="form-label">
                Taille
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as '1024x1024' | '512x512' | '256x256')}
                disabled={isGenerating}
                className={`form-select ${isDark ? 'dark' : 'light'}`}
              >
                {sizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="style" className="form-label">
                Style
              </label>
              <select
                id="style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as 'natural' | 'vivid' | 'digital_art')}
                disabled={isGenerating}
                className={`form-select ${isDark ? 'dark' : 'light'}`}
              >
                {styleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="image-generator-actions">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className={`btn-secondary ${isDark ? 'dark' : 'light'}`}
            >
              Annuler
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !apiKey}
              className={`btn-primary ${isDark ? 'dark' : 'light'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="spin mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <Image size={16} className="mr-2" />
                  Générer l'image
                </>
              )}
            </button>
          </div>
        </div>

        <div className="image-generator-info">
          <div className="info-section">
            <h4>💡 Conseils pour de meilleurs résultats :</h4>
            <ul>
              <li>Soyez spécifique dans votre description</li>
              <li>Mentionnez les couleurs, l'éclairage, l'ambiance</li>
              <li>Plus de 50 caractères pour de meilleurs résultats</li>
              <li>Utilisez des mots-clés comme "photographie", "illustration", "art numérique"</li>
            </ul>
          </div>

          <div className="info-section">
            <h4>🎨 Styles disponibles :</h4>
            <ul>
              <li><strong>Naturel :</strong> Style photographique réaliste</li>
              <li><strong>Vif :</strong> Couleurs saturées et contrastées</li>
              <li><strong>Art numérique :</strong> Style artistique stylisé</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;