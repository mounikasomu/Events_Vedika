import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { type VendorItem } from '../services/api';
import ImageWithFallback from './ImageWithFallback';

interface VendorPortfolioModalProps {
  vendor: VendorItem;
  initialIndex?: number;
  onClose: () => void;
}

const VendorPortfolioModal = ({ vendor, initialIndex = 0, onClose }: VendorPortfolioModalProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = vendor.portfolioImages && vendor.portfolioImages.length > 0
    ? vendor.portfolioImages
    : [vendor.profilePhoto];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="modal-overlay fade-in" style={{ zIndex: 1250, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-content" style={{ maxWidth: '820px', padding: '0', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ImageWithFallback 
              src={vendor.profilePhoto} 
              alt={vendor.name} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-pink)' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{vendor.name}</h3>
                <span className="tag tag-pink" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  <Award size={12} style={{ display: 'inline', marginRight: '3px' }} /> {vendor.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <span><MapPin size={13} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {vendor.city}</span>
                <span>•</span>
                <span style={{ color: '#eab308', fontWeight: 700 }}>
                  <Star size={13} fill="#eab308" style={{ display: 'inline' }} /> {vendor.rating} Ratings
                </span>
                <span>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Verified EventsVedika Partner</span>
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ background: '#f1f5f9' }}><X size={18} /></button>
        </div>

        {/* Main Photo Viewer */}
        <div 
          style={{ position: 'relative', width: '100%', height: '440px', background: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ImageWithFallback 
            src={images[activeIndex]} 
            alt={`${vendor.name} Portfolio ${activeIndex + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {images.length > 1 && (
            <>
              <button 
                className="btn-icon" 
                onClick={handlePrev}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                <ChevronLeft size={22} />
              </button>
              <button 
                className="btn-icon" 
                onClick={handleNext}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div style={{ position: 'absolute', bottom: '14px', right: '16px', background: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
            Portfolio Work {activeIndex + 1} of {images.length}
          </div>

          <div style={{ position: 'absolute', bottom: '14px', left: '16px', background: 'rgba(219,39,119,0.85)', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Display-Only Work Portfolio
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', padding: '12px 24px', background: '#f8fafc', overflowX: 'auto', borderBottom: '1px solid var(--border-color)' }}>
            {images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{ 
                  width: '68px', 
                  height: '50px', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: idx === activeIndex ? '2px solid var(--primary-pink)' : '2px solid transparent',
                  opacity: idx === activeIndex ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }}
              >
                <ImageWithFallback src={img} alt={`thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '16px 24px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            This vendor's work portfolio is updated via cloud storage integrations.
          </span>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
            Close Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorPortfolioModal;
