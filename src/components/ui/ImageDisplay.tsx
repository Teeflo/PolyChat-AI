import React, { useState } from 'react';
import './ImageDisplay.css';

interface ImageDisplayProps {
  src: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt = 'Image générée par IA',
  className = '',
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`image-display-error ${className}`}>
        <div className="error-content">
          <span>❌ Impossible de charger l'image</span>
          <button
            onClick={() => window.open(src, '_blank')}
            className="error-link"
          >
            Ouvrir dans un nouvel onglet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-display-simple ${className}`}>
      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
          <span>Chargement de l'image...</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`generated-image-simple ${isLoading ? 'loading' : 'loaded'}`}
        onLoad={handleLoad}
        onError={handleError}
        draggable={false}
      />
    </div>
  );
};

export default ImageDisplay;