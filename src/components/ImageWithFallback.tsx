import React, { useState } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Image preview',
  className = '',
  style = {},
  fallbackText = 'Photo Gallery Preview',
  onError,
  ...props
}) => {
  const [error, setError] = useState<boolean>(!src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (onError) onError(e);
  };

  if (error || !src) {
    return (
      <div
        className={`image-fallback-container ${className}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '160px',
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#be185d',
          padding: '16px',
          textAlign: 'center',
          userSelect: 'none',
          boxSizing: 'border-box',
          position: 'relative',
          borderRadius: style.borderRadius || 'inherit',
          ...style,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            padding: '12px',
            borderRadius: '50%',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(219, 39, 119, 0.15)',
          }}
        >
          <ImageOff size={24} color="#db2777" />
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={13} /> EventsVedika Photo
        </div>
        <span style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
          {alt || fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
