import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Users, Wallet, Images, Bot, AlertTriangle } from 'lucide-react';
import { createLeadEnquiry, fetchVenues, bookingAssistantAgent, type VenueItem } from '../services/api';
import VenueLightboxModal from '../components/VenueLightboxModal';
import ImageWithFallback from '../components/ImageWithFallback';
import './Plan.css';

const moodBoards = [
  { id: 'Royal Festive', name: 'Royal Festive', icon: '👑', desc: 'Marigolds, mandaps, traditional grandeur & brass lanterns' },
  { id: 'Elegant Minimalist', name: 'Elegant Minimalist', icon: '✨', desc: 'Pastel flowers, fairy lights, clean white drapes' },
  { id: 'Rustic Chic', name: 'Rustic Chic', icon: '🌿', desc: 'Earthy wood, pampas grass, warm Edison bulbs' },
  { id: 'Modern Glam', name: 'Modern Glam', icon: '💎', desc: 'Chandelier luxury, mirror aisles, neon photo backdrops' }
];

const eventTypes = ['Wedding', 'Engagement', 'Reception', 'Birthday', 'Baby Shower', 'Corporate', 'Anniversary'];

const Plan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    eventType: location.state?.occasion || 'Wedding',
    city: location.state?.city || 'Mumbai',
    eventDate: '2026-11-20',
    guestCount: 250,
    valueInr: 650000,
    moodBoard: 'Royal Festive',
    venueId: location.state?.venueId || 'v1',
    venueName: location.state?.venueName || 'The Royal Pavilion',
    notes: ''
  });

  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [selectedVenueForModal, setSelectedVenueForModal] = useState<VenueItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchVenues().then(data => setVenues(data));
  }, []);

  const currentVenue = venues.find(v => v.id === formData.venueId);

  // Invoke Booking Assistant Agent function
  const aiAssistantOutput = bookingAssistantAgent({
    guestCount: formData.guestCount,
    city: formData.city,
    selectedVenueCapacity: currentVenue?.capacity,
    eventDate: formData.eventDate
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newBooking = await createLeadEnquiry({
        ...formData,
        venueName: currentVenue?.name || formData.venueName
      });
      setSubmitting(false);
      navigate(`/proposal?bookingId=${newBooking.id}`);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="plan-page fade-in">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Event Enquiry & Proposal Builder</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select your event parameters and mood board to generate an instant proposal.</p>
      </div>

      <div className="plan-card">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Mood Board Selection */}
          <div className="form-group">
            <label className="form-label">Step 1: Pick Your Event Vibe / Mood Board</label>
            <div className="mood-board-grid">
              {moodBoards.map(mood => (
                <div 
                  key={mood.id}
                  className={`mood-card ${formData.moodBoard === mood.id ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, moodBoard: mood.id })}
                >
                  <div className="mood-icon">{mood.icon}</div>
                  <div className="mood-name">{mood.name}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{mood.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rainbow-bar" style={{ margin: '28px 0' }} />

          {/* Step 2: Event Parameters */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Event Type</label>
              <select 
                className="form-select"
                value={formData.eventType}
                onChange={e => setFormData({ ...formData, eventType: e.target.value })}
              >
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">City Location</label>
              <select 
                className="form-select"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Goa">Goa</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Target Date</label>
              <input 
                type="date"
                className="form-input"
                value={formData.eventDate}
                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="form-group">
            <div className="label-row">
              <label className="form-label"><Users size={16} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> Guest Count</label>
              <span className="value-display">{formData.guestCount} Guests</span>
            </div>
            <input 
              type="range"
              min="20"
              max="800"
              step="10"
              value={formData.guestCount}
              onChange={e => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label"><Wallet size={16} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> Target Budget</label>
              <span className="value-display">{formatCurrency(formData.valueInr)}</span>
            </div>
            <input 
              type="range"
              min="100000"
              max="2500000"
              step="25000"
              value={formData.valueInr}
              onChange={e => setFormData({ ...formData, valueInr: parseInt(e.target.value) })}
            />
          </div>

          {/* Step 3: Preferred Venue Selection */}
          <div className="form-group">
            <label className="form-label">Step 3: Select Preferred Venue</label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select 
                className="form-select"
                style={{ flex: 1 }}
                value={formData.venueId}
                onChange={e => {
                  const v = venues.find(item => item.id === e.target.value);
                  setFormData({ ...formData, venueId: e.target.value, venueName: v?.name || '' });
                }}
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.city}) — Capacity: {v.capacity} guests</option>
                ))}
              </select>

              {currentVenue && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedVenueForModal(currentVenue)}
                  style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                >
                  <Images size={16} /> Hotel Swipe Gallery ({currentVenue.images?.length || 0} Photos)
                </button>
              )}
            </div>

            {/* Selected Venue Mini Photo Card */}
            {currentVenue && (
              <div 
                style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)', 
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedVenueForModal(currentVenue)}
              >
                <div style={{ width: '100px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <ImageWithFallback 
                    src={currentVenue.images?.[0]} 
                    alt={currentVenue.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{currentVenue.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentVenue.city} • Capacity: {currentVenue.capacity} guests • ★ {currentVenue.rating}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-pink)', fontWeight: 700, marginTop: '2px' }}>
                    Click to view 3–6 photo hotel-style gallery
                  </div>
                </div>
                <button type="button" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                  Browse Photos
                </button>
              </div>
            )}
          </div>

          {/* BOOKING ASSISTANT AGENT CONTEXTUAL NUDGES */}
          <div className="ai-nudge-box">
            <div className="ai-nudge-icon">
              <Bot size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Vedika Booking Assistant Nudge
              </div>
              {aiAssistantOutput.capacityWarning ? (
                <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> {aiAssistantOutput.capacityWarning}
                </div>
              ) : (
                aiAssistantOutput.tips.map((tip, idx) => (
                  <div key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    • {tip}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Special Catering / Decor Notes (Optional)</label>
            <textarea 
              className="form-textarea"
              rows={3}
              placeholder="E.g., Pure vegetarian catering, Jain food options, open bar lawn setup..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={submitting}>
            <Sparkles size={20} /> {submitting ? 'Setting the table... Generating Proposal...' : 'Generate Proposal & View Quotation'}
          </button>
        </form>
      </div>

      {/* Lightbox Modal */}
      {selectedVenueForModal && (
        <VenueLightboxModal 
          venue={selectedVenueForModal}
          onClose={() => setSelectedVenueForModal(null)}
        />
      )}
    </div>
  );
};

export default Plan;
