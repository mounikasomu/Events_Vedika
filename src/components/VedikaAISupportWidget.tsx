import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, PhoneCall } from 'lucide-react';
import { customerSupportAgent, type ClientBooking, type ProposalQuotation } from '../services/api';

interface VedikaAISupportWidgetProps {
  booking?: ClientBooking;
  quotation?: ProposalQuotation;
}

interface SupportMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  escalated?: boolean;
}

const VedikaAISupportWidget = ({ booking, quotation }: VedikaAISupportWidgetProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Namaste! I am your 24/7 Vedika Support Assistant. I can answer questions about your booking, clarify line items in your quotation, or connect you with your Event Manager Ananya Roy.",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim();
    if (!text) return;

    const userMsg: SupportMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await customerSupportAgent(text, { booking, quotation });
      const aiMsg: SupportMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        escalated: res.escalated
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1100,
            background: 'var(--primary-cta)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 6px 25px rgba(219, 39, 119, 0.45)',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <Bot size={22} /> Ask Vedika AI
        </button>
      )}

      {/* Slide-out Support Drawer */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '520px',
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* Drawer Header */}
          <div style={{ padding: '14px 20px', background: 'var(--primary-cta)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={22} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Vedika Support Agent</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Online • 24/7 Event Support</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}><X size={20} /></button>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? 'var(--primary-cta)' : '#ffffff',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  fontSize: '0.86rem',
                  lineHeight: 1.4
                }}
              >
                <div>{msg.text}</div>
                {msg.escalated && (
                  <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#059669', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PhoneCall size={14} /> Assigned Manager: Ananya Roy
                  </div>
                )}
                <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> Vedika is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div style={{ padding: '8px 12px', background: '#ffffff', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            <button className="tag tag-pink" onClick={() => handleSend("Explain GST & Service Fee line item")}>
              Line Item FAQ
            </button>
            <button className="tag tag-purple" onClick={() => handleSend("What is my booking status?")}>
              Booking Status
            </button>
            <button className="tag tag-orange" onClick={() => handleSend("Connect me to Event Manager")}>
              Call Manager
            </button>
          </div>

          {/* Input Row */}
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} style={{ padding: '12px', background: '#ffffff', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}
              placeholder="Ask support..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)' }} disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default VedikaAISupportWidget;
