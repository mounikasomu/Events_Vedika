// Comprehensive API Service for EventsVedika Client Application

export interface PackageItem {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  description: string;
  features: string[];
  price: string;
  priceValue?: number;
  priceInfo: string;
  icon: string;
  occasions?: string[];
}

export interface UserEvent {
  id: string;
  occasion: string;
  location: string;
  date: string;
  guests: number;
  budget: number;
  special: string;
  createdAt?: string;
  type?: 'event' | 'booking';
  status?: string;
  clientName?: string;
}

export interface BookingItem {
  id: string;
  client_name?: string;
  clientName?: string;
  email?: string;
  event_type?: string;
  eventType?: string;
  event_date?: string;
  eventDate?: string;
  guest_count?: number;
  guestCount?: number;
  status: string;
  venue_id?: string;
  vendor_id?: string;
  value_inr?: number;
  valueInr?: number;
  notes?: string;
  created_at?: string;
}

export interface VenueItem {
  id: string;
  name: string;
  city: string;
  capacity: number;
  price_per_day: number;
  rating: number;
  description: string;
  amenities: string[];
  images: string[];
}

export interface VendorItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  city: string;
  profilePhoto: string;
  portfolioImages: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  category: string;
}

export interface QuotationItem {
  category: string;
  description: string;
  amount: number;
}

export interface ProposalQuotation {
  id: string;
  bookingId: string;
  title: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Revision Requested';
  eventDate: string;
  venueName: string;
  guestCount: number;
  items: QuotationItem[];
  totalAmount: number;
  validUntil: string;
  notes?: string;
}

export interface ClientBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: string;
  city: string;
  guestCount: number;
  status: 'Enquiry' | 'Proposal Sent' | 'Approved' | 'Confirmed' | 'Completed';
  stageIndex: number; // 0 to 4
  venueId?: string;
  venueName?: string;
  valueInr: number;
  eventManager: string;
  managerPhone: string;
  moodBoard?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  sender: 'client' | 'manager' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface FeedbackData {
  id?: string;
  bookingId: string;
  rating: number;
  recommendationScore: number;
  feedbackTags: string[];
  comments: string;
  createdAt?: string;
}

const API_BASE = 'http://localhost:3001';

// Memory fallback store
const memoryStore = {
  events: [
    {
      id: "VdIbdILhodM",
      occasion: "Reception",
      location: "Mumbai",
      date: "2026-08-30",
      guests: 150,
      budget: 300000,
      special: "Pure vegetarian buffet and outdoor seating area.",
      createdAt: "2026-08-05T18:22:53.752Z"
    },
    {
      id: "mXcfb-0bOc0",
      occasion: "Baby Shower",
      location: "Mumbai",
      date: "2026-09-15",
      guests: 80,
      budget: 150000,
      special: "Pastel pink and mint green balloon theme.",
      createdAt: "2026-08-05T18:33:28.782Z"
    }
  ] as UserEvent[],
  bookings: [
    {
      id: "bk-101",
      clientName: "mounikasomu",
      clientEmail: "mounikasomu@gmail.com",
      eventType: "Wedding",
      eventDate: "2026-11-20",
      city: "Mumbai",
      guestCount: 350,
      status: "Confirmed",
      stageIndex: 3,
      venueId: "v1",
      venueName: "The Royal Pavilion",
      valueInr: 1450000,
      eventManager: "Ananya Roy",
      managerPhone: "+91 98201 44552",
      moodBoard: "Royal Festive",
      notes: "Requires Shehnai group at entrance and pure veg catering options."
    }
  ] as ClientBooking[],
  quotations: [
    {
      id: "q-101",
      bookingId: "bk-101",
      title: "Grand Wedding Proposal - Rohan & Priya",
      status: "Approved",
      eventDate: "2026-11-20",
      venueName: "The Royal Pavilion, Mumbai",
      guestCount: 350,
      items: [
        { category: "Venue Rental", description: "The Royal Pavilion Hall + Lawn (Full Day Access)", amount: 250000 },
        { category: "Catering", description: "Gourmet Multi-cuisine Buffet (₹1,800 x 350 plates)", amount: 630000 },
        { category: "Decor & Floral", description: "Mandap floral arch, stage backdrop & aisle entry decor", amount: 220000 },
        { category: "Photography", description: "Candid 4K videography, drone shots & pre-wedding shoot", amount: 120000 },
        { category: "Entertainment", description: "Live DJ setup, moving head lights & sparkler entry effect", amount: 80000 },
        { category: "GST & Service Fee", description: "18% GST and event management coordination fee", amount: 150000 }
      ],
      totalAmount: 1450000,
      validUntil: "2026-08-30",
      notes: "Approved by client on 2026-08-05."
    }
  ] as ProposalQuotation[],
  messages: [
    {
      id: "c1",
      bookingId: "bk-101",
      sender: "manager",
      senderName: "Ananya Roy (Event Manager)",
      message: "Namaste Priya & Rohan! I have updated the floral Mandap setup to include pink orchids and marigolds as requested. Please check your quotation details.",
      timestamp: "10:30 AM"
    },
    {
      id: "c2",
      bookingId: "bk-101",
      sender: "client",
      senderName: "bitsmasai",
      message: "Thank you Ananya! The proposal looks fantastic. We have approved the quotation.",
      timestamp: "11:15 AM"
    }
  ] as ChatMessage[],
  reminders: [
    { id: "r1", title: "Finalize venue decor theme for Reception", dueDate: "2026-08-15", completed: false, category: "Venue" },
    { id: "r2", title: "Taste test food menu with Flavors Gourmet", dueDate: "2026-08-18", completed: true, category: "Catering" },
    { id: "r3", title: "Send out digital invitations to guests", dueDate: "2026-08-20", completed: false, category: "Invites" },
    { id: "r4", title: "Confirm DJ playlist and sound check", dueDate: "2026-08-25", completed: false, category: "Entertainment" }
  ] as ReminderItem[]
};

// API Functions
export async function fetchPackages(): Promise<PackageItem[]> {
  try {
    const res = await fetch(`${API_BASE}/packages`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback packages:', e);
  }
  return [
    {
      id: "1",
      title: "Classic Royal Wedding",
      tag: "Most booked",
      tagColor: "pink",
      description: "Our signature grand wedding setup with multi-cuisine catering and mandap decor.",
      features: ["Banquet venue hall", "Themed mandap & entry floral arch", "Multi-cuisine 40-item buffet", "Candid photography & 4K stream", "Live DJ & sound system"],
      price: "₹8.50 Lakh",
      priceValue: 850000,
      priceInfo: "estimated for 200 guests",
      icon: "Wedding",
      occasions: ["Wedding", "Reception"]
    },
    {
      id: "2",
      title: "Themed Birthday Celebration",
      tag: "Trending",
      tagColor: "purple",
      description: "Pick a theme, we handle decor, cake and games.",
      features: ["Balloon arch & customized backdrop", "2 kg designer cake + dessert station", "Anchor / Kids entertainer + DJ", "Return gift hampers package"],
      price: "₹1.50 Lakh",
      priceValue: 150000,
      priceInfo: "estimated for 80 guests",
      icon: "Birthday",
      occasions: ["Birthday"]
    }
  ];
}

export async function fetchEvents(): Promise<UserEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback events:', e);
  }
  return memoryStore.events;
}

export async function createEvent(event: Omit<UserEvent, 'id' | 'createdAt'>): Promise<UserEvent> {
  const newEvent: UserEvent = {
    ...event,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Memory fallback create event:', e);
  }
  memoryStore.events.unshift(newEvent);
  return newEvent;
}

export async function updateEvent(id: string, updatedData: Partial<UserEvent>): Promise<UserEvent | null> {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Memory update event fallback:', e);
  }

  const idx = memoryStore.events.findIndex(ev => ev.id === id);
  if (idx !== -1) {
    memoryStore.events[idx] = { ...memoryStore.events[idx], ...updatedData };
    return memoryStore.events[idx];
  }
  return null;
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (e) {
    console.warn('Memory delete event fallback:', e);
  }
  memoryStore.events = memoryStore.events.filter(ev => ev.id !== id);
  return true;
}

export async function fetchBookings(): Promise<ClientBooking[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback bookings:', e);
  }
  return memoryStore.bookings;
}

export async function createBooking(data: any): Promise<ClientBooking> {
  return createLeadEnquiry(data);
}

export function emitWebhookEvent(eventType: 'lead.created' | 'quotation.approved' | 'feedback.submitted', payload: any) {
  console.log(`[SHARED BACKEND WEBHOOK] Event: "${eventType}" dispatched to n8n / Sales CRM`, payload);
}

export async function createLeadEnquiry(data: Partial<ClientBooking>): Promise<ClientBooking> {
  const newBooking: ClientBooking = {
    id: `bk-${Date.now()}`,
    clientName: "mounikasomu",
    clientEmail: "mounikasomu@gmail.com",
    eventType: data.eventType || 'Wedding',
    eventDate: data.eventDate || '2026-11-20',
    city: data.city || 'Mumbai',
    guestCount: data.guestCount || 200,
    status: 'Enquiry',
    stageIndex: 0,
    valueInr: data.valueInr || 500000,
    eventManager: 'Ananya Roy',
    managerPhone: '+91 98201 44552',
    moodBoard: data.moodBoard || 'Royal Festive',
    notes: data.notes || ''
  };

  emitWebhookEvent('lead.created', newBooking);

  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Memory fallback create booking:', e);
  }

  memoryStore.bookings.unshift(newBooking);
  return newBooking;
}

export async function fetchQuotation(bookingId: string): Promise<ProposalQuotation | null> {
  try {
    const res = await fetch(`${API_BASE}/quotations?bookingId=${bookingId}`);
    if (res.ok) {
      const list = await res.json();
      if (list.length > 0) return list[0];
    }
  } catch (e) {
    console.warn('Fallback quotation:', e);
  }
  return memoryStore.quotations.find(q => q.bookingId === bookingId) || memoryStore.quotations[0];
}

export async function approveQuotation(quotationId: string, bookingId: string): Promise<boolean> {
  emitWebhookEvent('quotation.approved', { quotationId, bookingId, approvedAt: new Date().toISOString() });

  try {
    await fetch(`${API_BASE}/quotations/${quotationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });

    await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Confirmed', stageIndex: 3 })
    });
  } catch (e) {
    console.warn('Memory approval fallback:', e);
  }

  const q = memoryStore.quotations.find(item => item.id === quotationId);
  if (q) q.status = 'Approved';

  const b = memoryStore.bookings.find(item => item.id === bookingId);
  if (b) {
    b.status = 'Confirmed';
    b.stageIndex = 3;
  }
  return true;
}

export async function requestQuotationRevision(quotationId: string, notes: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/quotations/${quotationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Revision Requested', notes })
    });
  } catch (e) {
    console.warn('Memory revision fallback:', e);
  }

  const q = memoryStore.quotations.find(item => item.id === quotationId);
  if (q) {
    q.status = 'Revision Requested';
    q.notes = notes;
  }
  return true;
}

export async function fetchMessages(bookingId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/communicationLogs?bookingId=${bookingId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback messages:', e);
  }
  return memoryStore.messages;
}

export async function sendMessage(bookingId: string, messageText: string): Promise<ChatMessage> {
  const newMsg: ChatMessage = {
    id: `c-${Date.now()}`,
    bookingId,
    sender: 'client',
    senderName: 'mounikasomu',
    message: messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    const res = await fetch(`${API_BASE}/communicationLogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback send message:', e);
  }

  memoryStore.messages.push(newMsg);
  return newMsg;
}

export async function fetchVenues(): Promise<VenueItem[]> {
  try {
    const res = await fetch(`${API_BASE}/venues`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback venues:', e);
  }
  return [
    {
      id: "v1",
      name: "The Royal Pavilion",
      city: "Mumbai",
      capacity: 500,
      price_per_day: 250000,
      rating: 4.9,
      description: "A majestic palace-style banquet hall in South Mumbai featuring grand crystal chandeliers, high ceilings, and landscaped garden space.",
      amenities: ["Air Conditioned", "Valet Parking", "In-house Catering", "Bridal Dressing Suite", "Power Backup"],
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "v2",
      name: "Grand Horizon Banquet",
      city: "Delhi",
      capacity: 400,
      price_per_day: 180000,
      rating: 4.8,
      description: "Contemporary luxury banquet with state-of-the-art intelligent lighting and pillarless hall design in South Delhi.",
      amenities: ["Pillarless Hall", "Modern Lighting", "Green Rooms", "DJ Setup", "Spacious Kitchen"],
      images: [
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "v3",
      name: "Emerald Gardens Resort",
      city: "Bangalore",
      capacity: 600,
      price_per_day: 300000,
      rating: 4.9,
      description: "Sprawling lush green lawn and glasshouse pavilion ideal for outdoor weddings and evening reception parties.",
      amenities: ["Outdoor Lawn", "Glasshouse Pavilion", "Cottage Rooms", "Swimming Pool Side", "Ample Parking"],
      images: [
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ];
}

export async function fetchVendors(): Promise<VendorItem[]> {
  try {
    const res = await fetch(`${API_BASE}/vendors`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback vendors:', e);
  }
  return [
    {
      id: "vd1",
      name: "Aura Floral & Decor",
      category: "Decorator",
      rating: 4.9,
      city: "Mumbai",
      profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      portfolioImages: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "vd2",
      name: "Flavors Gourmet Catering",
      category: "Catering",
      rating: 4.8,
      city: "Mumbai",
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      portfolioImages: [
        "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      ]
    },
    {
      id: "vd3",
      name: "Starlight Sound & Visuals",
      category: "Entertainment",
      rating: 4.9,
      city: "Delhi",
      profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      portfolioImages: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
      ]
    }
  ];
}

export async function fetchReminders(): Promise<ReminderItem[]> {
  try {
    const res = await fetch(`${API_BASE}/reminders`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback reminders:', e);
  }
  return memoryStore.reminders;
}

export async function updateReminder(id: string, completed: boolean): Promise<ReminderItem | null> {
  try {
    const res = await fetch(`${API_BASE}/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback update reminder:', e);
  }

  const item = memoryStore.reminders.find(r => r.id === id);
  if (item) {
    item.completed = completed;
    return item;
  }
  return null;
}

export async function addReminder(title: string, dueDate: string, category: string): Promise<ReminderItem> {
  const newItem: ReminderItem = {
    id: `r-${Date.now()}`,
    title,
    dueDate,
    completed: false,
    category
  };

  try {
    const res = await fetch(`${API_BASE}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Fallback add reminder:', e);
  }
  memoryStore.reminders.unshift(newItem);
  return newItem;
}

export async function submitFeedback(feedback: FeedbackData): Promise<boolean> {
  const newFeedback = {
    ...feedback,
    id: `fb-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  emitWebhookEvent('feedback.submitted', newFeedback);

  try {
    await fetch(`${API_BASE}/feedbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeedback)
    });
  } catch (e) {
    console.warn('Fallback feedback:', e);
  }
  return true;
}

// ----------------------------------------------------
// DUAL AI AGENT SERVICE FUNCTIONS
// ----------------------------------------------------

export async function customerSupportAgent(userQuery: string, clientContext?: { booking?: ClientBooking; quotation?: ProposalQuotation }): Promise<{ reply: string; escalated: boolean }> {
  const q = userQuery.toLowerCase();
  
  if (q.includes('gst') || q.includes('tax') || q.includes('service fee') || q.includes('line item')) {
    return {
      reply: "In your quotation, GST (18%) and Service Fees cover official tax compliance, end-to-end event day coordination, vendor dispatch, and risk management insurance. Every rupee is itemized clearly!",
      escalated: false
    };
  }

  if (q.includes('manager') || q.includes('speak to human') || q.includes('call') || q.includes('escalate')) {
    return {
      reply: `I have notified your assigned Event Manager, Ananya Roy (+91 98201 44552). She will reach out to you within 30 minutes!`,
      escalated: true
    };
  }

  if (q.includes('status') || q.includes('booking stage') || q.includes('where is my event')) {
    const statusText = clientContext?.booking?.status || 'Confirmed';
    return {
      reply: `Your current event booking status is "${statusText}". You can follow the live step-by-step progress timeline on your Booking Tracker screen!`,
      escalated: false
    };
  }

  return {
    reply: `Namaste! I'm Vedika, your 24/7 Support Assistant. I can help explain quotation details, answer booking FAQs, or connect you directly with your Event Manager Ananya Roy.`,
    escalated: false
  };
}

export function bookingAssistantAgent(context: { guestCount: number; city: string; selectedVenueCapacity?: number; eventDate?: string }): { tips: string[]; capacityWarning?: string } {
  const tips: string[] = [];
  let capacityWarning: string | undefined = undefined;

  if (context.selectedVenueCapacity && context.guestCount > context.selectedVenueCapacity) {
    capacityWarning = `Notice: Your guest count (${context.guestCount}) exceeds this venue's recommended capacity (${context.selectedVenueCapacity}). We suggest upgrading to an outdoor lawn or expanding banquet rooms.`;
  } else if (context.selectedVenueCapacity && context.guestCount <= context.selectedVenueCapacity) {
    tips.push(`Great fit! ${context.guestCount} guests fit comfortably within this venue's ${context.selectedVenueCapacity}-person capacity.`);
  }

  if (context.city === 'Mumbai' || context.city === 'Delhi') {
    tips.push(`Peak Wedding Season Tip: Weekend dates in ${context.city} book out fast. We recommend approving your proposal soon to lock in venue slots.`);
  }

  return { tips, capacityWarning };
}
