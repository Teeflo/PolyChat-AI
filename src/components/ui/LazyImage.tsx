import React, { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYXJnZW1lbnQuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`lazy-image-container ${className}`} ref={imgRef}>
      {!isLoaded && !hasError && (
        <img src={placeholder} alt="Chargement..." className="lazy-image-placeholder" />
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {hasError && (
        <div className="lazy-image-error">
          <span>❌ Impossible de charger l'image</span>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
              // Recharger après un court délai
              setTimeout(() => {
                const img = new Image();
                img.onload = handleLoad;
                img.onerror = handleError;
                img.src = src;
              }, 1000);
            }}
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
