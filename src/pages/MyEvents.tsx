import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarHeart, Sparkles, Trash2, Edit3, MapPin, Calendar as CalendarIcon, Users, Wallet, X } from 'lucide-react';
import { fetchEvents, fetchBookings, deleteEvent, updateEvent, type UserEvent } from '../services/api';
import './MyEvents.css';

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

const MyEvents = () => {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<UserEvent | null>(null);
  const [editFormData, setEditFormData] = useState({
    occasion: '',
    location: 'Mumbai',
    date: '',
    guests: 100,
    budget: 300000,
    special: ''
  });
  const [updating, setUpdating] = useState<boolean>(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const [eventsData, bookingsData] = await Promise.all([fetchEvents(), fetchBookings()]);

      const mappedEvents: UserEvent[] = eventsData.map((e: any) => ({
        id: e.id,
        type: 'event',
        occasion: e.occasion || 'Event',
        location: e.location || 'Mumbai',
        date: e.date || '',
        guests: e.guests || 100,
        budget: e.budget || 300000,
        special: e.special || '',
        status: 'Planned'
      }));

      const mappedBookings: UserEvent[] = bookingsData.map((b: any) => ({
        id: b.id,
        type: 'booking',
        occasion: b.event_type || 'Booking',
        location: b.venue_id ? 'Venue Assigned' : 'TBD',
        date: b.event_date || '',
        guests: b.guest_count || 100,
        budget: b.value_inr || 0,
        special: b.notes || '',
        status: b.status || 'Confirmed',
        clientName: b.client_name
      }));

      setEvents([...mappedEvents, ...mappedBookings]);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEvents();
  }, []);

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleOpenEdit = (event: UserEvent) => {
    setEditingEvent(event);
    setEditFormData({
      occasion: event.occasion,
      location: event.location,
      date: event.date,
      guests: event.guests,
      budget: event.budget,
      special: event.special || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setUpdating(true);

    try {
      await updateEvent(editingEvent.id, editFormData);
      setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? { ...ev, ...editFormData } : ev));
      setEditingEvent(null);
    } catch (err) {
      console.error('Error updating event:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredEvents = events;

  const totalBudget = events.reduce((sum, ev) => sum + (ev.budget || 0), 0);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return <div className="loading" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading your dashboard...</div>;
  }

  return (
    <div className="my-events-page fade-in">
      <div className="events-header">
        <div>
          <h1>My Events Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all your planned occasions & active bookings</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/plan')}>
          <Sparkles size={18} /> Plan another event
        </button>
      </div>

      {/* Summary Statistics Bar */}
      {events.length > 0 && (
        <div className="stats-summary-bar">
          <div className="stat-card">
            <div className="stat-icon"><Sparkles size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Total Events Planned</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Wallet size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{formatCurrency(totalBudget)}</div>
              <div className="stat-label">Total Budget Value</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><CalendarIcon size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{events.filter(e => e.date).length} Scheduled</div>
              <div className="stat-label">Confirmed Dates</div>
            </div>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <CalendarHeart size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No events planned yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Tell Vedika what you're celebrating and get instant matching recommendations for your budget.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/plan')}>
            <Sparkles size={18} /> Start Planning My Event
          </button>
        </div>
      ) : (
        <>
          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={`${event.type}-${event.id}`} className="event-card">
                <div>
                  <div className="event-card-top">
                    <div className="event-icon-box">
                      {occasionIcons[event.occasion] || '✨'}
                    </div>
                    <div className="event-main-info">
                      <div className="event-title-row">
                        <h3>{event.occasion}</h3>
                        <span className="tag tag-purple">
                          {event.status || (event.type === 'booking' ? 'Booking' : 'Planned')}
                        </span>
                      </div>
                      {event.clientName && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 600 }}>
                          Client: {event.clientName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="event-meta-list">
                    <div className="event-meta-item">
                      <MapPin size={15} style={{ color: 'var(--secondary)' }} />
                      <span>{event.location}</span>
                    </div>
                    <div className="event-meta-item">
                      <CalendarIcon size={15} style={{ color: 'var(--secondary)' }} />
                      <span>{event.date ? new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}</span>
                    </div>
                    <div className="event-meta-item">
                      <Users size={15} style={{ color: 'var(--secondary)' }} />
                      <span>{event.guests} Guests</span>
                    </div>
                  </div>

                  <div className="event-budget-tag">
                    {event.type === 'booking' ? 'Booking Value' : 'Budget'}: {formatCurrency(event.budget)}
                  </div>

                  {event.special && (
                    <div className="event-special-box">
                      <strong>Notes:</strong> {event.special}
                    </div>
                  )}
                </div>

                <div className="event-actions-row">
                  <button className="btn-icon" onClick={() => handleOpenEdit(event)} title="Edit Details">
                    <Edit3 size={18} />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => setDeletingId(event.id)} title="Delete Event">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Edit Event Details</h2>
              <button className="btn-icon" onClick={() => setEditingEvent(null)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Occasion Title</label>
                <input 
                  type="text"
                  className="form-input"
                  value={editFormData.occasion}
                  onChange={e => setEditFormData({ ...editFormData, occasion: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Location</label>
                  <select 
                    className="form-select"
                    value={editFormData.location}
                    onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Goa">Goa</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Event Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={editFormData.date}
                    onChange={e => setEditFormData({ ...editFormData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Guest Count: {editFormData.guests}</label>
                <input 
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={editFormData.guests}
                  onChange={e => setEditFormData({ ...editFormData, guests: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Budget: {formatCurrency(editFormData.budget)}</label>
                <input 
                  type="range"
                  min="50000"
                  max="2500000"
                  step="25000"
                  value={editFormData.budget}
                  onChange={e => setEditFormData({ ...editFormData, budget: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Notes</label>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={editFormData.special}
                  onChange={e => setEditFormData({ ...editFormData, special: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingEvent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div className="empty-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Delete this event?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={() => handleDeleteConfirm(deletingId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
