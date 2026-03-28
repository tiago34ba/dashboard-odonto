import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const ImageContainer = styled.div<{ width?: string; height?: string }>`
  position: relative;
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
`;

const PlaceholderDiv = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy'
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkWebPSupport = () => {
      return new Promise<boolean>((resolve) => {
        const webP = new window.Image();
        webP.onload = webP.onerror = () => {
          resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };

    const loadOptimizedImage = async () => {
      try {
        const supportsWebP = await checkWebPSupport();
        
        // Gerar URLs otimizadas
        const baseUrl = src.replace(/\.[^/.]+$/, ''); // Remove extensão
        const extension = src.split('.').pop();
        
        let optimizedSrc = src;
        
        if (supportsWebP) {
          // Tentar carregar versão WebP primeiro
          const webpSrc = `${baseUrl}.webp`;
          
          try {
            await new Promise((resolve, reject) => {
              const img = new window.Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = webpSrc;
            });
            optimizedSrc = webpSrc;
          } catch {
            // Se WebP falhar, usar original
            optimizedSrc = src;
          }
        }
        
        setImageSrc(optimizedSrc);
        setImageLoading(false);
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        setImageError(true);
        setImageLoading(false);
      }
    };

    loadOptimizedImage();
  }, [src]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    // Fallback para imagem original
    setImageSrc(src);
  };

  if (imageError && !imageSrc) {
    return (
      <ImageContainer width={width} height={height} className={className}>
        <PlaceholderDiv />
      </ImageContainer>
    );
  }

  return (
    <ImageContainer width={width} height={height} className={className}>
      {imageLoading && <PlaceholderDiv />}
      {imageSrc && (
        <StyledImage
          src={imageSrc}
          alt={alt}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoading ? 0 : 1 }}
        />
      )}
    </ImageContainer>
  );
};

export default OptimizedImage;