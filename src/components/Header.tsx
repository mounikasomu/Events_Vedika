import { NavLink } from 'react-router-dom';
import { Compass, CalendarPlus, Calendar, FileText, Activity, Bell } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Header = () => {
  return (
    <header className="header-wrapper">
      <div className="header container">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <BrandLogo size="md" />
        </NavLink>
        
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Compass size={15} /> Discover
          </NavLink>
          <NavLink to="/plan" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <CalendarPlus size={15} /> Plan
          </NavLink>
          <NavLink to="/my-events" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Calendar size={15} /> My Events
          </NavLink>
          <NavLink to="/proposal" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FileText size={15} /> Proposal
          </NavLink>
          <NavLink to="/tracker" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Activity size={15} /> Tracker
          </NavLink>
          <NavLink to="/updates" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Bell size={15} /> Updates
          </NavLink>
        </nav>

        <div className="user-profile">
          <div className="user-avatar">
            B
          </div>
          <div className="user-info">
            <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>bitsmasai</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Client Portal</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
