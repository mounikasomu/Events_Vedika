import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Discover from './pages/Discover';
import Plan from './pages/Plan';
import MyEvents from './pages/MyEvents';
import ProposalView from './pages/ProposalView';
import BookingTracker from './pages/BookingTracker';
import FeedbackForm from './pages/FeedbackForm';
import VedikaAI from './pages/VedikaAI';
import Updates from './pages/Updates';
import VedikaAISupportWidget from './components/VedikaAISupportWidget';

function App() {
  return (
    <>
      <Header />
      <main className="container" style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '32px', paddingBottom: '80px' }}>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/proposal" element={<ProposalView />} />
          <Route path="/tracker" element={<BookingTracker />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/vedika" element={<VedikaAI />} />
          <Route path="/updates" element={<Updates />} />
        </Routes>
      </main>

      {/* Global Vedika AI Customer Support Agent Floating Drawer */}
      <VedikaAISupportWidget />

      <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border-color)', padding: '24px 0', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div className="container">
          <div className="rainbow-bar" style={{ marginBottom: '16px' }} />
          <p>© 2026 EventsVedika Client Application — Seamless, Joyful Event Planning. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
