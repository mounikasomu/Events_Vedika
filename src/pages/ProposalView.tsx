import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, RefreshCw, Users, MapPin, Calendar, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { fetchQuotation, fetchVendors, approveQuotation, requestQuotationRevision, type ProposalQuotation, type VendorItem } from '../services/api';
import VendorPortfolioModal from '../components/VendorPortfolioModal';
import ImageWithFallback from '../components/ImageWithFallback';
import './ProposalView.css';

const ProposalView = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || 'bk-101';
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState<ProposalQuotation | null>(null);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<VendorItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showRevisionModal, setShowRevisionModal] = useState<boolean>(false);
  const [revisionNotes, setRevisionNotes] = useState<string>('');

  useEffect(() => {
    Promise.all([fetchQuotation(bookingId), fetchVendors()]).then(([qData, vData]) => {
      setQuotation(qData);
      setVendors(vData);
      setLoading(false);
    });
  }, [bookingId]);

  const handleApprove = async () => {
    if (!quotation) return;
    setShowConfetti(true);
    await approveQuotation(quotation.id, quotation.bookingId);
    setQuotation({ ...quotation, status: 'Approved' });

    setTimeout(() => {
      setShowConfetti(false);
      navigate(`/tracker?bookingId=${bookingId}`);
    }, 2800);
  };

  const handleSendRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotation || !revisionNotes) return;

    await requestQuotationRevision(quotation.id, revisionNotes);
    setQuotation({ ...quotation, status: 'Revision Requested' });
    setShowRevisionModal(false);
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  if (loading || !quotation) {
    return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Setting the table... Preparing proposal breakdown...</div>;
  }

  return (
    <div className="proposal-page fade-in">
      {/* CELEBRATORY CONFETTI ANIMATION */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 40 }).map((_, idx) => {
            const colors = ['#db2777', '#f97316', '#9333ea', '#2563eb', '#10b981', '#eab308'];
            const randomColor = colors[idx % colors.length];
            const leftPercent = Math.random() * 100;
            const delay = Math.random() * 0.5;
            return (
              <div 
                key={idx} 
                className="confetti-piece"
                style={{
                  left: `${leftPercent}%`,
                  background: randomColor,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Header Summary */}
      <div className="proposal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`tag ${quotation.status === 'Approved' ? 'tag-green' : 'tag-pink'}`}>
                {quotation.status}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Valid until {quotation.validUntil}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{quotation.title}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span><MapPin size={15} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {quotation.venueName}</span>
              <span><Calendar size={15} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {quotation.eventDate}</span>
              <span><Users size={15} style={{ display: 'inline', color: 'var(--primary-pink)' }} /> {quotation.guestCount} Guests</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Estimated Cost</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-pink)' }}>{formatCurrency(quotation.totalAmount)}</span>
          </div>
        </div>

        <div className="rainbow-bar" style={{ margin: '24px 0' }} />

        {/* Line Item Financial Breakdown */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} style={{ color: 'var(--primary-pink)' }} /> Itemized Financial Breakdown
        </h3>

        <table className="quotation-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description & Inclusions</th>
              <th style={{ textAlign: 'right' }}>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.category}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{item.description}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
              <td colSpan={2} style={{ fontSize: '1rem' }}>Total All-Inclusive Investment</td>
              <td style={{ textAlign: 'right', fontSize: '1.15rem', color: 'var(--primary-pink)' }}>{formatCurrency(quotation.totalAmount)}</td>
            </tr>
          </tbody>
        </table>

        {/* Vendor Portfolio Section */}
        <div style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Assigned Vendor Partner Portfolios</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Display-only showcase of past work portfolios for caterers, decorators & photographers assigned to your package
              </p>
            </div>
            <span className="tag tag-pink" style={{ fontSize: '0.75rem' }}>
              <ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px' }} /> Vedika Verified Partners
            </span>
          </div>

          <div className="vendors-portfolio-grid">
            {vendors.map(vendor => (
              <div key={vendor.id} className="vendor-card" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="vendor-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <ImageWithFallback 
                    src={vendor.profilePhoto} 
                    alt={vendor.name} 
                    className="vendor-avatar"
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-pink)' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>{vendor.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span className="tag tag-pink" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>{vendor.category}</span>
                      <span>•</span>
                      <span style={{ color: '#eab308', fontWeight: 700 }}>★ {vendor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* 2-3 Portfolio Work Images */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Past Work Portfolio (2–3 Photos)
                  </div>

                  <div className="portfolio-thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {vendor.portfolioImages && vendor.portfolioImages.length > 0 ? (
                      vendor.portfolioImages.slice(0, 3).map((img, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedVendorForModal(vendor)}
                          style={{ height: '70px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                        >
                          <ImageWithFallback src={img} alt={`${vendor.name} past work ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))
                    ) : (
                      <div style={{ gridColumn: 'span 3', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Portfolio coming soon
                      </div>
                    )}
                  </div>
                </div>

                {vendor.portfolioImages && vendor.portfolioImages.length > 0 && (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => setSelectedVendorForModal(vendor)} 
                    style={{ width: '100%', padding: '6px', fontSize: '0.78rem', marginTop: '8px' }}
                  >
                    Expand Portfolio Photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          {quotation.status !== 'Approved' && (
            <button className="btn btn-secondary" onClick={() => setShowRevisionModal(true)}>
              <RefreshCw size={16} /> Request Revision
            </button>
          )}

          {quotation.status === 'Approved' ? (
            <button className="btn btn-primary" onClick={() => navigate(`/tracker?bookingId=${bookingId}`)}>
              <ShieldCheck size={18} /> View Confirmed Booking Tracker <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleApprove}>
              <CheckCircle2 size={18} /> Approve Proposal & Confirm Booking
            </button>
          )}
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Request Proposal Revision</h3>
              <button className="btn-icon" onClick={() => setShowRevisionModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSendRevision}>
              <div className="form-group">
                <label className="form-label">What changes would you like?</label>
                <textarea 
                  className="form-textarea"
                  rows={4}
                  placeholder="E.g., Please swap catering option to pure vegetarian menu, add extra entrance marigold floral arches..."
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRevisionModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Revision Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Portfolio Modal */}
      {selectedVendorForModal && (
        <VendorPortfolioModal 
          vendor={selectedVendorForModal}
          onClose={() => setSelectedVendorForModal(null)}
        />
      )}
    </div>
  );
};

export default ProposalView;
