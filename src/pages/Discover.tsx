import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Images, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import VenueLightboxModal from '../components/VenueLightboxModal';
import VendorPortfolioModal from '../components/VendorPortfolioModal';
import ImageWithFallback from '../components/ImageWithFallback';
import { fetchVenues, fetchVendors, type VenueItem, type VendorItem } from '../services/api';
import './Discover.css';

const occasionIcons: Record<string, string> = {
  Wedding: '💍',
  Engagement: '💐',
  Reception: '🥂',
  Birthday: '🎂',
  'Baby Shower': '🍼',
  Anniversary: '❤️',
  Corporate: '🏢',
  'House Warming': '🏡',
  'Festival Party': '🎉'
};

const Discover = () => {
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [selectedVenueForModal, setSelectedVenueForModal] = useState<VenueItem | null>(null);
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<VendorItem | null>(null);
  const [cardPhotoIndex, setCardPhotoIndex] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchVenues(), fetchVendors()]).then(([venueData, vendorData]) => {
      setVenues(venueData);
      setVendors(vendorData);
      setLoading(false);
    });
  }, []);

  const handleCardPrevPhoto = (e: React.MouseEvent, venue: VenueItem) => {
    e.stopPropagation();
    const imgs = venue.images || [];
    if (imgs.length <= 1) return;
    const current = cardPhotoIndex[venue.id] || 0;
    const prev = current === 0 ? imgs.length - 1 : current - 1;
    setCardPhotoIndex({ ...cardPhotoIndex, [venue.id]: prev });
  };

  const handleCardNextPhoto = (e: React.MouseEvent, venue: VenueItem) => {
    e.stopPropagation();
    const imgs = venue.images || [];
    if (imgs.length <= 1) return;
    const current = cardPhotoIndex[venue.id] || 0;
    const next = current === imgs.length - 1 ? 0 : current + 1;
    setCardPhotoIndex({ ...cardPhotoIndex, [venue.id]: next });
  };

  return (
    <div className="discover-page fade-in">
      {/* Hero Banner */}
      <div className="hero-section">
        <div className="hero-trust-badge">
          <Star size={14} fill="#db2777" /> Celebrated over 10,000+ happy events across India
        </div>

        <div style={{ margin: '12px 0 16px' }}>
          <BrandLogo size="lg" />
        </div>

        <h1 className="hero-title">Plan Your Dream Event In Easy Steps</h1>
        
        <p className="hero-desc">
          Tell us your budget, occasion, and guest count — Vedika matches transparent packages, 3–6 real photo venue galleries, and verified partner portfolios with zero stress.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/plan')}>
            <Sparkles size={18} /> Start Event Enquiry
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/tracker')}>
            Track My Booking <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="rainbow-bar" />

      {/* Occasion Categories */}
      <div className="occasions-section">
        <div className="section-title-row">
          <div>
            <h2>What are you celebrating?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select an occasion to customize your enquiry</p>
          </div>
          {selectedOccasion !== 'All' && (
            <button className="btn btn-outline" onClick={() => setSelectedOccasion('All')} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              Show All
            </button>
          )}
        </div>

        <div className="occasions-grid">
          <div 
            className={`occasion-card ${selectedOccasion === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedOccasion('All')}
          >
            <span style={{ fontSize: '1.8rem' }}>✨</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>All Events</span>
          </div>

          {Object.entries(occasionIcons).map(([name, icon]) => (
            <div 
              key={name} 
              className={`occasion-card ${selectedOccasion === name ? 'active' : ''}`}
              onClick={() => setSelectedOccasion(selectedOccasion === name ? 'All' : name)}
            >
              <span style={{ fontSize: '1.8rem' }}>{icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Venues Photo Explorer */}
      <div className="venues-section">
        <div className="section-title-row">
          <div>
            <h2>Featured Venues (3–6 Photo Galleries)</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Browse exterior, interior hall, seating, and night lighting like a hotel listing</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Setting the table... Loading venues...</div>
        ) : (
          <div className="venues-grid">
            {venues.map(venue => {
              const activeIdx = cardPhotoIndex[venue.id] || 0;
              const images = venue.images && venue.images.length > 0 ? venue.images : [];
              const currentSrc = images[activeIdx] || '';

              return (
                <div key={venue.id} className="venue-card">
                  {/* Photo Box with inline preview arrow controls */}
                  <div className="venue-thumb-box" onClick={() => setSelectedVenueForModal(venue)} style={{ cursor: 'pointer', position: 'relative' }}>
                    <ImageWithFallback 
                      src={currentSrc} 
                      alt={`${venue.name} photo ${activeIdx + 1}`}
                      fallbackText={`${venue.name} Gallery`}
                    />

                    {images.length > 1 && (
                      <>
                        <button 
                          className="btn-icon" 
                          onClick={(e) => handleCardPrevPhoto(e, venue)}
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.85)',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button 
                          className="btn-icon" 
                          onClick={(e) => handleCardNextPhoto(e, venue)}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.85)',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}

                    <div className="photo-count-badge">
                      <Images size={13} /> {activeIdx + 1}/{images.length} Photos
                    </div>
                  </div>

                  <div className="venue-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{venue.name}</h3>
                      <span className="tag tag-orange">★ {venue.rating}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <span><MapPin size={14} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {venue.city}</span>
                      <span><Users size={14} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {venue.capacity} Guests</span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                      {venue.description.substring(0, 100)}...
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Daily Rental</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-pink)' }}>₹{(venue.price_per_day / 100000).toFixed(2)} L</span>
                      </div>

                      <button className="btn btn-secondary" onClick={() => setSelectedVenueForModal(venue)} style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
                        <Images size={14} /> Hotel Lightbox Gallery
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verified Vendor Partners Showcase */}
      <div className="vendors-section" style={{ marginTop: '20px' }}>
        <div className="section-title-row">
          <div>
            <h2>Verified Vendor Portfolios</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Explore caterers, decorators, photographers & entertainment past work</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {vendors.map(vendor => (
            <div key={vendor.id} className="vendor-card" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <ImageWithFallback 
                  src={vendor.profilePhoto} 
                  alt={vendor.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-pink)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>{vendor.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span className="tag tag-pink" style={{ padding: '1px 6px', fontSize: '0.68rem' }}><Award size={10} style={{ display: 'inline', marginRight: '2px' }} />{vendor.category}</span>
                    <span>•</span>
                    <span style={{ color: '#eab308', fontWeight: 700 }}>★ {vendor.rating}</span>
                  </div>
                </div>
              </div>

              {/* Portfolio Thumbs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {vendor.portfolioImages && vendor.portfolioImages.length > 0 ? (
                  vendor.portfolioImages.slice(0, 3).map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedVendorForModal(vendor)}
                      style={{ height: '70px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}
                    >
                      <ImageWithFallback src={img} alt="Past work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: 'span 3', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No portfolio images added yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Venue Lightbox Modal */}
      {selectedVenueForModal && (
        <VenueLightboxModal 
          venue={selectedVenueForModal}
          onClose={() => setSelectedVenueForModal(null)}
          onSelectVenue={(v) => navigate('/plan', { state: { venueId: v.id, venueName: v.name, city: v.city } })}
        />
      )}

      {/* Vendor Portfolio Lightbox Modal */}
      {selectedVendorForModal && (
        <VendorPortfolioModal 
          vendor={selectedVendorForModal}
          onClose={() => setSelectedVendorForModal(null)}
        />
      )}
    </div>
  );
};

export default Discover;

