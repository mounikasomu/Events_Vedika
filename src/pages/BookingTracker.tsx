import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Phone, Send, ShieldCheck, Heart } from 'lucide-react';
import { fetchBookings, fetchMessages, sendMessage, type ClientBooking, type ChatMessage } from '../services/api';
import './BookingTracker.css';

const stages = [
  { id: 'Enquiry', label: '1. Enquiry Sent' },
  { id: 'Proposal Sent', label: '2. Proposal Sent' },
  { id: 'Approved', label: '3. Proposal Approved' },
  { id: 'Confirmed', label: '4. Confirmed' },
  { id: 'Completed', label: '5. Event Completed' }
];

const BookingTracker = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || 'bk-101';
  const navigate = useNavigate();

  const [booking, setBooking] = useState<ClientBooking | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([fetchBookings(), fetchMessages(bookingId)]).then(([bList, mList]) => {
      const found = bList.find(b => b.id === bookingId) || bList[0];
      setBooking(found);
      setMessages(mList);
      setLoading(false);
    });
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = await sendMessage(bookingId, inputMsg);
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  // Calculate Days Remaining
  const targetDate = booking?.eventDate ? new Date(booking.eventDate) : new Date('2026-11-20');
  const daysLeft = Math.max(0, Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  if (loading || !booking) {
    return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Setting the table... Loading tracker...</div>;
  }

  const activeIndex = booking.stageIndex || 3;
  const progressPercent = (activeIndex / (stages.length - 1)) * 100;

  return (
    <div className="tracker-page fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-pink)', fontSize: '0.85rem', fontWeight: 800 }}>
            <ShieldCheck size={16} /> CONFIRMED BOOKING # {booking.id}
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>{booking.eventType} Celebration Journey</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Follow your live booking status, countdown, and event manager chat</p>
        </div>

        <button className="btn btn-secondary" onClick={() => navigate(`/proposal?bookingId=${booking.id}`)}>
          View Quotation Breakdown
        </button>
      </div>

      {/* Countdown Widget */}
      <div className="countdown-box">
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-pink)', fontWeight: 800, textTransform: 'uppercase' }}>
            Event Countdown
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{daysLeft} Days To Go!</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Scheduled for {new Date(booking.eventDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} at {booking.venueName || 'The Royal Pavilion'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#ffffff', padding: '12px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-pink)' }}>{daysLeft}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Days</div>
          </div>
        </div>
      </div>

      {/* Animated Step Timeline Tracker */}
      <div className="timeline-wrapper">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Booking Journey Timeline</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Live status updates managed by Vedika shared backend</p>

        <div className="timeline-steps">
          <div className="timeline-line-back" />
          <div className="timeline-line-front" style={{ width: `${progressPercent}%` }} />

          {stages.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div 
                key={stage.id} 
                className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="step-node">
                  {isCompleted ? <Check size={20} /> : idx + 1}
                </div>
                <div className="step-label">{stage.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Section: Event Manager Chat & Day Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Communication Thread */}
        <div className="chat-thread-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>{booking.eventManager}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned Event Manager • {booking.managerPhone}</div>
            </div>
            <a href={`tel:${booking.managerPhone}`} className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderColor: 'transparent' }}>
              <Phone size={18} />
            </a>
          </div>

          <div className="chat-thread-list">
            {messages.map(m => (
              <div key={m.id} className={`chat-bubble ${m.sender}`}>
                <div style={{ fontSize: '0.72rem', opacity: 0.8, marginBottom: '2px' }}>{m.senderName}</div>
                <div>{m.message}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>{m.timestamp}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <input 
              type="text"
              className="form-input"
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              placeholder="Message your event manager..."
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }} disabled={!inputMsg.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Confirmed Day-Of Details & Feedback CTA */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Event Day Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div><strong>Venue:</strong> {booking.venueName || 'The Royal Pavilion'}</div>
              <div><strong>City:</strong> {booking.city}</div>
              <div><strong>Date:</strong> {booking.eventDate}</div>
              <div><strong>Guests:</strong> {booking.guestCount} Guests</div>
              <div><strong>Vibe Theme:</strong> {booking.moodBoard || 'Royal Festive'}</div>
              <div><strong>Total Investment:</strong> ₹{(booking.valueInr / 100000).toFixed(2)} Lakh</div>
            </div>
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)', marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={() => navigate(`/feedback?bookingId=${booking.id}`)} style={{ width: '100%' }}>
              <Heart size={18} style={{ color: 'var(--primary-pink)' }} /> Submit Post-Event Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTracker;
