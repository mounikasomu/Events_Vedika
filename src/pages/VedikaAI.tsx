import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Sparkles, User, Lightbulb, ArrowRight } from 'lucide-react';
import { fetchPackages, type PackageItem } from '../services/api';
import './VedikaAI.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: PackageItem[];
  timestamp: string;
}

const quickPrompts = [
  "Calculate budget breakdown for 200 guests wedding",
  "Suggest themes for 25th Silver Jubilee Anniversary",
  "What venue is best in Mumbai for weddings?",
  "Recommend packages under ₹5 Lakh"
];

const VedikaAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Namaste! I am Vedika, your personal AI Event Planner. Ask me anything about event pricing, venue options, catering estimates, or package recommendations!",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PackageItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages().then(data => setPackages(data));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Simulate AI response logic
    setTimeout(() => {
      let replyText = "";
      let matchedRecs: PackageItem[] = [];

      const lower = query.toLowerCase();

      if (lower.includes('wedding') || lower.includes('marriage')) {
        replyText = "For a wedding celebration, we recommend budgeting approximately 45% for venue & catering, 20% for decor, 15% for photography, and 10% for entertainment. Here are top verified packages:";
        matchedRecs = packages.filter(p => p.icon === 'Wedding');
      } else if (lower.includes('budget') || lower.includes('5 lakh') || lower.includes('price')) {
        replyText = "Here are curated event packages tailored to fit comfortably within a ₹1.5L to ₹5.0L budget with zero hidden fees:";
        matchedRecs = packages.filter(p => (p.priceValue || 500000) <= 500000);
      } else if (lower.includes('birthday') || lower.includes('party')) {
        replyText = "For birthday celebrations, themed venue decor and dessert tables make the biggest impact. Check out these popular packages:";
        matchedRecs = packages.filter(p => p.icon === 'Birthday' || p.icon === 'House Warming');
      } else if (lower.includes('venue') || lower.includes('mumbai')) {
        replyText = "Top 5-star & boutique venues in Mumbai include The Royal Pavilion (capacity 500) and Sunset Bay Resort. Both provide in-house catering and AC banquet halls.";
      } else {
        replyText = `Great question! Based on your criteria for "${query}", Vedika AI recommends planning 4-6 weeks in advance to secure prime venues and caterers. Here are trending plans:`;
        matchedRecs = packages.slice(0, 2);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        recommendations: matchedRecs.length > 0 ? matchedRecs : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="vedika-page fade-in">
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="ai-avatar">
            <Bot size={24} />
          </div>
          <div className="chat-header-info">
            <h2>Vedika AI Assistant</h2>
            <div className="chat-status">
              <span className="status-dot"></span>
              Online & Ready to Plan
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="messages-list">
          {messages.map(msg => (
            <div key={msg.id} className={`message-item ${msg.sender}`}>
              <div className={`msg-avatar ${msg.sender}`}>
                {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="msg-bubble">
                <div>{msg.text}</div>

                {/* Optional embedded recommendations */}
                {msg.recommendations && (
                  <div style={{ marginTop: '12px' }}>
                    {msg.recommendations.map(pkg => (
                      <div key={pkg.id} className="chat-rec-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                          <span>{pkg.title}</span>
                          <span style={{ color: 'var(--secondary)' }}>{pkg.price}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px' }}>{pkg.description}</p>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                          onClick={() => navigate('/plan', { state: { occasion: pkg.icon } })}
                        >
                          Book this plan <ArrowRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '6px' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-item ai">
              <div className="msg-avatar ai"><Bot size={18} /></div>
              <div className="msg-bubble" style={{ color: 'var(--text-muted)' }}>
                <Sparkles size={16} className="pulse" style={{ display: 'inline', marginRight: '6px' }} />
                Vedika is analyzing requirements...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="quick-prompts-bar">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lightbulb size={14} /> Quick Suggestions:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button key={idx} className="prompt-chip" onClick={() => handleSend(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          className="chat-input-row"
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <input 
            type="text"
            className="form-input"
            placeholder="Ask Vedika about budget, venues, themes, packages..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim() || loading}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VedikaAI;
