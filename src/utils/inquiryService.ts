/**
 * Inquiry Storage and Management Service
 * Provides client-side local persistence with optional cloud database synchronization.
 */

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  timestamp: number;
  status: 'new' | 'contacted' | 'completed';
  notes?: string;
}

const STORAGE_KEY = 'swamy_consultation_inquiries';

// Pre-seeded mock inquiries for display/demo if none exist
const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Srinivas Rao',
    email: 'srinivas.r@example.com',
    phone: '+91 94405 12345',
    interest: 'life',
    message: 'Looking for a family term insurance cover under MWPA Act to secure my home loan and family protection.',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    status: 'new'
  },
  {
    id: 'inq-2',
    name: 'Lakshmi Prasanna',
    email: 'lakshmi.p@example.com',
    phone: '+91 98480 98765',
    interest: 'sip',
    message: 'Want to start a goal-based SIP of ₹25,000 per month for my daughter\'s higher education. Need tax saving ELSS advice.',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    status: 'contacted',
    notes: 'Called on Monday. Set up follow-up for next week.'
  },
  {
    id: 'inq-3',
    name: 'Satish Kumar',
    email: 'satish.k@example.com',
    phone: '+91 77022 55511',
    interest: 'health',
    message: 'Need a comprehensive family floater health plan. Parents are senior citizens, looking for options with zero co-pay.',
    timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    status: 'new'
  }
];

export const InquiryService = {
  /**
   * Retrieves all inquiries, seeding with defaults if empty
   */
  getInquiries(): Inquiry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with mocks so the advisor can see how it works instantly
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INQUIRIES));
        return MOCK_INQUIRIES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading inquiries:', e);
      return [];
    }
  },

  /**
   * Saves a new inquiry submission
   */
  saveInquiry(data: Omit<Inquiry, 'id' | 'timestamp' | 'status'>): Inquiry {
    const inquiries = this.getInquiries();
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: Date.now(),
      status: 'new'
    };

    inquiries.unshift(newInquiry); // Add to beginning
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Error saving inquiry:', e);
    }
    return newInquiry;
  },

  /**
   * Updates an inquiry's status or notes
   */
  updateInquiry(id: string, updates: Partial<Pick<Inquiry, 'status' | 'notes'>>): boolean {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex(inq => inq.id === id);
    if (index === -1) return false;

    inquiries[index] = {
      ...inquiries[index],
      ...updates
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
      return true;
    } catch (e) {
      console.error('Error updating inquiry:', e);
      return false;
    }
  },

  /**
   * Deletes an inquiry
   */
  deleteInquiry(id: string): boolean {
    const inquiries = this.getInquiries();
    const filtered = inquiries.filter(inq => inq.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting inquiry:', e);
      return false;
    }
  },

  /**
   * Resets all inquiries to mock data (for testing)
   */
  resetToMocks(): Inquiry[] {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INQUIRIES));
      return MOCK_INQUIRIES;
    } catch (e) {
      console.error('Error resetting inquiries:', e);
      return [];
    }
  },

  /**
   * Clears all inquiries
   */
  clearAll(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.error('Error clearing inquiries:', e);
    }
  }
};
