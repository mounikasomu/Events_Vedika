import { useState, useEffect } from 'react';
import { Check, Plus, Calendar, Sparkles, X } from 'lucide-react';
import { fetchReminders, updateReminder, addReminder, fetchEvents, type ReminderItem, type UserEvent } from '../services/api';
import './Updates.css';

const Updates = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add Reminder state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('General');

  useEffect(() => {
    Promise.all([fetchReminders(), fetchEvents()]).then(([remData, evData]) => {
      setReminders(remData);
      setEvents(evData);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await updateReminder(id, !currentStatus);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !currentStatus } : r));
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const item = await addReminder(newTitle, newDueDate || '2026-08-25', newCategory);
    setReminders(prev => [item, ...prev]);
    setNewTitle('');
    setNewDueDate('');
    setShowAddModal(false);
  };

  // Find nearest upcoming event
  const upcomingEvent = events.find(ev => ev.date && new Date(ev.date) >= new Date());

  // Calculate days remaining
  const daysRemaining = upcomingEvent ? Math.max(0, Math.ceil((new Date(upcomingEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 24;

  return (
    <div className="updates-page fade-in">
      {/* Event Countdown Banner */}
      <div className="countdown-banner">
        <div className="countdown-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <Sparkles size={16} /> NEXT CELEBRATION COUNTDOWN
          </div>
          <h2>{upcomingEvent ? `${upcomingEvent.occasion} in ${upcomingEvent.location}` : 'Grand Reception Celebration'}</h2>
          <p>Scheduled for {upcomingEvent?.date ? new Date(upcomingEvent.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 30, 2026'}</p>
        </div>

        <div className="countdown-timer-boxes">
          <div className="timer-unit">
            <div className="number">{daysRemaining}</div>
            <div className="label">Days</div>
          </div>
          <div className="timer-unit">
            <div className="number">14</div>
            <div className="label">Hours</div>
          </div>
          <div className="timer-unit">
            <div className="number">32</div>
            <div className="label">Mins</div>
          </div>
        </div>
      </div>

      {/* Reminders & Checklist Section */}
      <div className="reminders-section">
        <div className="reminders-header">
          <div>
            <h2>Planning Checklist & Reminders</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Keep your event setup organized and on schedule</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading checklist...</div>
        ) : (
          <div className="reminders-list">
            {reminders.map(item => (
              <div key={item.id} className={`reminder-item ${item.completed ? 'done' : ''}`}>
                <div className="reminder-left">
                  <button className="checkbox-btn" onClick={() => handleToggle(item.id, item.completed)}>
                    <Check size={14} />
                  </button>
                  <div>
                    <div className="reminder-title">{item.title}</div>
                    <div className="reminder-meta">
                      <span><Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Due: {item.dueDate}</span>
                      <span>•</span>
                      <span className="tag tag-purple" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>{item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Reminder</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateReminder}>
              <div className="form-group">
                <label className="form-label">Task Description</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="E.g., Confirm photographer arrival time"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Invites">Invites</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Due Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Updates;
