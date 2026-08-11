import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Users, Star, CheckCircle2, Maximize2, Sparkles } from 'lucide-react';
import { type VenueItem } from '../services/api';
import ImageWithFallback from './ImageWithFallback';

interface VenueLightboxModalProps {
  venue: VenueItem;
  onClose: () => void;
  onSelectVenue?: (venue: VenueItem) => void;
}

const photoCategoryLabels = [
  'Exterior & Entrance Façade',
  'Grand Interior Banquet Hall',
  'Seating Layout & Decor Setup',
  'Night & Event Lighting Ambiance',
  'Outdoor Garden & Pavilion'
];

const VenueLightboxModal = ({ venue, onClose, onSelectVenue }: VenueLightboxModalProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = venue.images && venue.images.length > 0 
    ? venue.images 
    : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'];

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
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isFullscreen]);

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

  const currentCategory = photoCategoryLabels[activeIndex % photoCategoryLabels.length];

  return (
    <div className="modal-overlay fade-in" style={{ zIndex: 1200, background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(8px)' }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: isFullscreen ? '98vw' : '880px', 
          maxHeight: isFullscreen ? '98vh' : '90vh',
          padding: '0', 
          overflow: 'hidden',
          borderRadius: isFullscreen ? '8px' : '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: '#ffffff' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{venue.name}</h2>
              <span className="tag tag-pink" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '3px' }} /> Real Photo Gallery
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span><MapPin size={14} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {venue.city}</span>
              <span>•</span>
              <span><Users size={14} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> Up to {venue.capacity} guests</span>
              <span>•</span>
              <span style={{ color: '#eab308', fontWeight: 700 }}><Star size={14} fill="#eab308" style={{ display: 'inline' }} /> {venue.rating}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-icon" 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Gallery'}
              style={{ background: '#f1f5f9' }}
            >
              <Maximize2 size={16} />
            </button>
            <button className="btn-icon" onClick={onClose} style={{ background: '#f1f5f9' }}><X size={18} /></button>
          </div>
        </div>

        {/* Main Lightbox Photo View */}
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: isFullscreen ? 'calc(98vh - 200px)' : '450px', 
            background: '#090d16', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            userSelect: 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ImageWithFallback 
            src={images[activeIndex]} 
            alt={`${venue.name} photo ${activeIndex + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            fallbackText={`${venue.name} Photo ${activeIndex + 1}`}
          />

          {/* Swipe / Arrow Controls */}
          {images.length > 1 && (
            <>
              <button 
                className="btn-icon" 
                onClick={handlePrev}
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'rgba(255,255,255,0.9)', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="btn-icon" 
                onClick={handleNext}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'rgba(255,255,255,0.9)', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Category Tag Overlay */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '16px', 
              background: 'rgba(15,23,42,0.75)', 
              backdropFilter: 'blur(4px)',
              color: '#ffffff', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '0.78rem', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Sparkles size={14} color="#f472b6" /> {currentCategory}
          </div>

          {/* Counter Badge */}
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '16px', 
              right: '16px', 
              background: 'rgba(0,0,0,0.75)', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: 700 
            }}
          >
            Photo {activeIndex + 1} of {images.length}
          </div>
        </div>

        {/* Thumbnail Selector Row */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', padding: '12px 24px', background: '#f8fafc', overflowX: 'auto', borderBottom: '1px solid var(--border-color)' }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: '72px',
                  height: '52px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: idx === activeIndex ? '2.5 solid var(--primary-pink)' : '2px solid transparent',
                  borderColor: idx === activeIndex ? 'var(--primary-pink)' : 'transparent',
                  opacity: idx === activeIndex ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <ImageWithFallback 
                  src={img} 
                  alt={`thumb ${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Venue Info & Amenities */}
        <div style={{ padding: isFullscreen ? '16px 24px' : '20px 24px', background: '#ffffff' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px', lineHeight: 1.5 }}>
            {venue.description}
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Venue Amenities & Highlights
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {venue.amenities?.map((item, idx) => (
                <span key={idx} className="tag tag-pink" style={{ fontSize: '0.78rem' }}>
                  <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily Rental Estimate (Cloud Verified)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-pink)' }}>₹{(venue.price_per_day / 100000).toFixed(2)} Lakh / day</div>
            </div>
            {onSelectVenue && (
              <button className="btn btn-primary" onClick={() => { onSelectVenue(venue); onClose(); }}>
                Select This Venue For My Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueLightboxModal;
