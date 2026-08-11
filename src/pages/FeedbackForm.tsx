import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { submitFeedback } from '../services/api';
import BrandLogo from '../components/BrandLogo';
import './FeedbackForm.css';

const availableTags = [
  'Punctual Execution',
  'Beautiful Floral Decor',
  'Gourmet Food Quality',
  'Seamless Management',
  'Helpful Event Manager',
  'Great Value'
];

const FeedbackForm = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || 'bk-101';
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(5);
  const [recommendationScore, setRecommendationScore] = useState<number>(10);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual Execution', 'Beautiful Floral Decor']);
  const [comments, setComments] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitFeedback({
        bookingId,
        rating,
        recommendationScore,
        feedbackTags: selectedTags,
        comments
      });
      setSubmitting(false);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page fade-in">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <BrandLogo size="md" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '12px' }}>Post-Event Celebration Review</h1>
        <p style={{ color: 'var(--text-secondary)' }}>How did we do? Share your experience with the EventsVedika team.</p>
      </div>

      {submitted ? (
        <div className="feedback-card" style={{ textAlign: 'center', padding: '48px 36px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Heart size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Thank You For Celebrating With Us!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Your feedback has been submitted successfully to our team and shared backend. We look forward to planning your next milestone event!
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <Sparkles size={18} /> Back To Home Page
          </button>
        </div>
      ) : (
        <div className="feedback-card">
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="form-group">
              <label className="form-label">Overall Experience Rating</label>
              <div className="star-rating-row">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    type="button" 
                    className={`star-btn ${star <= rating ? 'selected' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Score Slider */}
            <div className="form-group">
              <div className="label-row">
                <label className="form-label">How likely are you to recommend EventsVedika to friends & family?</label>
                <span className="value-display" style={{ color: 'var(--primary-pink)' }}>{recommendationScore} / 10</span>
              </div>
              <input 
                type="range"
                min="1"
                max="10"
                value={recommendationScore}
                onChange={e => setRecommendationScore(parseInt(e.target.value))}
              />
            </div>

            {/* Highlight Tags */}
            <div className="form-group">
              <label className="form-label">What stood out most?</label>
              <div className="feedback-tags-grid">
                {availableTags.map(tag => (
                  <button 
                    key={tag}
                    type="button"
                    className={`feedback-tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="form-group">
              <label className="form-label">Detailed Comments & Memories</label>
              <textarea 
                className="form-textarea"
                rows={4}
                placeholder="Share what you loved about the venue, catering, decor, or team..."
                value={comments}
                onChange={e => setComments(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={submitting}>
              <Sparkles size={20} /> {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
