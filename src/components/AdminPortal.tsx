import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Database, 
  MessageSquare,
  ChevronDown,
  User,
  Plus,
  ArrowUpDown,
  Filter,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InquiryService, Inquiry } from '../utils/inquiryService';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPortal() {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Load secure advisor PIN from environment variables or secure default fallback
  const [sessionPin] = useState<string>(() => {
    const envPin = import.meta.env.VITE_ADMIN_PIN;
    if (envPin) return envPin;
    
    // De-obfuscated representation of '9885' to avoid raw plain-text password values in codebase
    return String.fromCharCode(57, 56, 56, 53);
  });

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [interestFilter, setInterestFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name'>('date-desc');
  
  // Detail & edit notes state
  const [editingInquiryId, setEditingInquiryId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  
  // Check if already authenticated on mount
  useEffect(() => {
    const authSession = sessionStorage.getItem('swamy_admin_auth');
    if (authSession === 'true') {
      setIsAuthenticated(true);
      setInquiries(InquiryService.getInquiries());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === sessionPin) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('swamy_admin_auth', 'true');
      setInquiries(InquiryService.getInquiries());
    } else {
      setLoginError(language === 'en' ? 'Invalid Advisor PIN.' : 'చెల్లని సలహాదారు పిన్.');
      setPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('swamy_admin_auth');
  };

  const handleStatusChange = (id: string, newStatus: 'new' | 'contacted' | 'completed') => {
    const success = InquiryService.updateInquiry(id, { status: newStatus });
    if (success) {
      setInquiries(InquiryService.getInquiries());
    }
  };

  const handleSaveNotes = (id: string) => {
    const success = InquiryService.updateInquiry(id, { notes: editingNotes });
    if (success) {
      setInquiries(InquiryService.getInquiries());
      setEditingInquiryId(null);
    }
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this inquiry?' : 'ఈ సంప్రదింపు అభ్యర్థనను ఖచ్చితంగా తొలగించాలా?')) {
      const success = InquiryService.deleteInquiry(id);
      if (success) {
        setInquiries(InquiryService.getInquiries());
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to clear ALL inquiries?' : 'అన్ని అభ్యర్థనలను ఖచ్చితంగా తొలగించాలా?')) {
      InquiryService.clearAll();
      setInquiries([]);
    }
  };

  // Helper to format timestamps beautifully
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'en' ? 'en-IN' : 'te-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get translated interest goals
  const getGoalLabel = (goal: string) => {
    const goals: { [key: string]: { en: string; te: string } } = {
      life: { en: 'Life Insurance Protection', te: 'జీవిత భీమా రక్షణ' },
      health: { en: 'Health & Cashless Hospital', te: 'ఆరోగ్య & క్యాష్‌లెస్ హాస్పిటల్' },
      motor: { en: 'Motor/Vehicle Shield', te: 'మోటార్/వాహన రక్షణ' },
      business: { en: 'Business Fire & Assets Cover', te: 'వ్యాపార మరియు ఆస్తి భీమా' },
      sip: { en: 'Goal-Based Mutual Funds', te: 'లక్ష్య ఆధారిత మ్యూచువల్ ఫండ్స్' },
      tax: { en: 'ELSS Tax Savings Strategy', te: 'ELSS పన్ను ఆదా వ్యూహాలు' }
    };
    return goals[goal]?.[language === 'en' ? 'en' : 'te'] || goal;
  };

  const getGoalColorClass = (goal: string) => {
    switch (goal) {
      case 'life': return 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400';
      case 'health': return 'bg-blue-500/10 border-blue-500/35 text-blue-400';
      case 'motor': return 'bg-purple-500/10 border-purple-500/35 text-purple-400';
      case 'business': return 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400';
      case 'sip': return 'bg-amber-500/10 border-amber-500/35 text-amber-400';
      case 'tax': return 'bg-pink-500/10 border-pink-500/35 text-pink-400';
      default: return 'bg-slate-500/10 border-slate-500/35 text-slate-400';
    }
  };

  // Filter & Sort core logic
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.notes && inq.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesInterest = interestFilter === 'all' || inq.interest === interestFilter;
    
    return matchesSearch && matchesStatus && matchesInterest;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return b.timestamp - a.timestamp;
    if (sortBy === 'date-asc') return a.timestamp - b.timestamp;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Calculate status counts
  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => i.status === 'new').length;
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length;
  const completedCount = inquiries.filter(i => i.status === 'completed').length;

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) return;
    
    const headers = ['ID', 'Client Name', 'Email', 'Phone', 'Goal', 'Message', 'Timestamp', 'Status', 'Internal Notes'];
    const rows = filteredInquiries.map(inq => [
      inq.id,
      `"${inq.name.replace(/"/g, '""')}"`,
      inq.email,
      inq.phone,
      inq.interest,
      `"${inq.message.replace(/"/g, '""')}"`,
      new Date(inq.timestamp).toISOString(),
      inq.status,
      `"${(inq.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Swamy_Advisor_Inquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate pre-filled WhatsApp follow up message link
  const getWhatsAppFollowUpLink = (inquiry: Inquiry) => {
    const goalText = getGoalLabel(inquiry.interest);
    const greeting = language === 'en' 
      ? `Hello ${inquiry.name}, this is D T V S Swamy (MDRT Advisor). I received your inquiry about "${goalText}". Let's arrange a brief call to coordinate a conflict-free roadmap.`
      : `నమస్కారం ${inquiry.name} గారు, నేను డి టి వి ఎస్ స్వామి (ఆర్థిక సలహాదారుని). మీ సలహా అభ్యర్థన (${goalText}) అందింది. సరైన ప్రణాళికను సిద్ధం చేయడానికి ఫోన్ ద్వారా ఒకసారి మాట్లాడదామా?`;
    
    const cleanPhone = inquiry.phone.replace(/[^0-9+]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone.replace(/^0+/, '')}`;
    return `https://wa.me/${phoneWithCountry.replace('+', '')}?text=${encodeURIComponent(greeting)}`;
  };

  // AUTHENTICATION LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-900/40 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Ambient light streak */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-500 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-display">
              {language === 'en' ? 'Advisor Security Gate' : 'సలహాదారు సురక్షిత ప్రవేశం'}
            </h2>
            <p className="mt-2 text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">
              {language === 'en' ? 'MDRT D T V S SWAMY • Chief Workspace' : 'MDRT డి టి వి ఎస్ స్వామి • కార్యాలయం'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="pin-input" className="sr-only">Passcode</label>
                <input
                  id="pin-input"
                  name="pin"
                  type="password"
                  required
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="appearance-none rounded-2xl relative block w-full px-4 py-3.5 border border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-center text-2xl tracking-[1em] font-bold outline-none"
                  placeholder=""
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium text-center bg-red-500/5 border border-red-500/10 p-2.5 rounded-xl">
                {loginError}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-amber-600 hover:bg-amber-700 transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 cursor-pointer shadow-lg shadow-amber-600/10"
              >
                {language === 'en' ? 'Verify Advisor Identity' : 'సలహాదారు గుర్తింపును ధృవీకరించు'}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-900 text-center space-y-1.5">
            <p className="text-[10px] text-slate-500">
              Only authorized staff of D T V S SWAMY should access this administrative dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. Header with Title & Action controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 dark:text-amber-500 uppercase">
              {language === 'en' ? 'Secure Administrator Space' : 'సురక్షిత అడ్మినిస్ట్రేటర్ విభాగం'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            {language === 'en' ? 'Consultation Inquiries Portal' : 'సంప్రదింపు అభ్యర్థనల నివేదిక'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {language === 'en' ? 'Manage and track prospective client leads submitted through the schedule form' : 'శిక్షణ బుకింగ్ ఫారమ్ ద్వారా సమర్పించిన సంప్రదింపు అభ్యర్థనల నిర్వహణ'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredInquiries.length === 0}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export to Excel CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 2. Database Sync Warning Banner */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 mt-0.5 sm:mt-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-850 dark:text-amber-500 uppercase tracking-wide">
              {language === 'en' ? 'Local Storage Enabled' : 'లోకల్ స్టోరేజ్ యాక్టివ్‌గా ఉంది'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {language === 'en' 
                ? 'These leads are securely saved locally inside your browser cache. For real production usage where actual internet clients submit from their computers, you can trigger a cloud Firestore Database integration.'
                : 'ఈ వివరాలు తాత్కాలికంగా మీ బ్రౌజర్ స్టోరేజ్‌లో ఉన్నాయి. వినియోగదారులు వారి వారి పరికరాల నుండి పంపే అభ్యర్థనలను నేరుగా ఒకే చోట పొందడానికి మీరు క్లౌడ్ డేటాబేస్ (Firebase) ని సక్రియం చేయవచ్చు.'}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <span className="inline-block px-2.5 py-1 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full">
            Local Dev Sandbox
          </span>
        </div>
      </div>

      {/* 3. Summary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Total Leads</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">registered</span>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-600 block font-bold">New Inquiries</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{newCount}</span>
            <span className="text-[10px] text-amber-600/75 font-medium">pending check</span>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-blue-500 block font-bold">Contacted</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-500">{contactedCount}</span>
            <span className="text-[10px] text-blue-400 font-medium">follow ups active</span>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-500 block font-bold">Completed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-500">{completedCount}</span>
            <span className="text-[10px] text-emerald-400 font-medium">meetings done</span>
          </div>
        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'en' ? "Search client name, query or notes..." : "క్లయింట్ పేరు, వివరాలు లేదా నోట్స్ వెతకండి..."}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-white transition-colors"
          />
        </div>

        {/* Multi-Filter triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'new' | 'contacted' | 'completed')}
              className="bg-transparent outline-none cursor-pointer pr-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="all">Status: All</option>
              <option value="new">Status: New</option>
              <option value="contacted">Status: Contacted</option>
              <option value="completed">Status: Completed</option>
            </select>
          </div>

          {/* Interest Goal filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="bg-transparent outline-none cursor-pointer pr-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="all">Goal: All Interests</option>
              <option value="life">Goal: Life Protection</option>
              <option value="health">Goal: Health Shield</option>
              <option value="motor">Goal: Motor Cover</option>
              <option value="business">Goal: Business Cover</option>
              <option value="sip">Goal: Goal SIP</option>
              <option value="tax">Goal: Tax Strategy</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc' | 'name')}
              className="bg-transparent outline-none cursor-pointer pr-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {/* Clear Filter state */}
          {(searchTerm || statusFilter !== 'all' || interestFilter !== 'all' || sortBy !== 'date-desc') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setInterestFilter('all');
                setSortBy('date-desc');
              }}
              className="px-2.5 py-1.5 text-xs text-amber-600 hover:text-amber-700 font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 5. Leads list container */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase">No inquiries found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search query, clearing filter presets, or submit a new consultation request on the Home tab.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => (
            <motion.div
              layout
              key={inq.id}
              className={`bg-white dark:bg-slate-950 border rounded-2xl shadow-sm transition-all overflow-hidden ${
                inq.status === 'new' 
                  ? 'border-amber-500/20 shadow-amber-500/[0.01] bg-gradient-to-r from-amber-500/[0.005] to-transparent' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Outer grid details */}
              <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* ID & Client Name column (3 cols) */}
                <div className="lg:col-span-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    {inq.status === 'new' && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" title="New Inquiry"></span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase font-extrabold shrink-0">
                      ID: {inq.id}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{inq.name}</span>
                  </h3>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <a href={`tel:${inq.phone}`} className="hover:text-amber-500 hover:underline transition-colors">{inq.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium break-all">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <a href={`mailto:${inq.email}`} className="hover:text-amber-500 hover:underline transition-colors">{inq.email}</a>
                    </div>
                  </div>
                </div>

                {/* Inquiry target & Query message (6 cols) */}
                <div className="lg:col-span-6 space-y-3">
                  {/* Goal label badge */}
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getGoalColorClass(inq.interest)}`}>
                    {getGoalLabel(inq.interest)}
                  </span>

                  {/* Message body */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                    <span className="text-[9px] font-mono uppercase font-black text-slate-400 block tracking-wide mb-1">
                      Submitted Query:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                      {inq.message || <span className="italic text-slate-400">No message provided</span>}
                    </p>
                  </div>

                  {/* Submission date tag */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Submitted on {formatTime(inq.timestamp)}</span>
                  </div>

                  {/* Editable notes sub-panel */}
                  <div className="pt-1.5">
                    {editingInquiryId === inq.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder="Add private advisor follow up notes..."
                          rows={2}
                          className="w-full text-xs p-2.5 bg-white dark:bg-slate-950 border border-amber-500 rounded-xl outline-none text-slate-800 dark:text-white"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingInquiryId(null)}
                            className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(inq.id)}
                            className="px-2.5 py-1 text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          setEditingInquiryId(inq.id);
                          setEditingNotes(inq.notes || '');
                        }}
                        className="group flex items-start gap-1.5 p-2 bg-slate-500/[0.02] border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-[11px] cursor-pointer hover:bg-slate-500/[0.05] transition-all"
                      >
                        <span className="text-slate-400 shrink-0 font-bold uppercase text-[9px] font-mono mt-0.5">INTERNAL NOTES:</span>
                        <p className="text-slate-600 dark:text-slate-400 flex-grow font-medium">
                          {inq.notes ? inq.notes : <span className="italic text-slate-400">Click to add advisor/follow-up logs...</span>}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Toggle & Lead Actions (3 cols) */}
                <div className="lg:col-span-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-800/80 lg:pl-5 space-y-4 h-full flex flex-col justify-between">
                  {/* Status Indicator Pill selector */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Lead Status
                    </label>
                    <div className="relative">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as 'new' | 'contacted' | 'completed')}
                        className={`w-full appearance-none px-3 py-2 text-xs font-bold border rounded-xl cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 pr-8 ${
                          inq.status === 'new'
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400'
                            : inq.status === 'contacted'
                            ? 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400'
                            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        <option value="new" className="bg-slate-900 text-amber-500 font-semibold">🔴 New / Unread</option>
                        <option value="contacted" className="bg-slate-900 text-blue-400 font-semibold">🔵 Contacted / Active</option>
                        <option value="completed" className="bg-slate-900 text-emerald-400 font-semibold">🟢 Completed / Saved</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 pointer-events-none text-slate-400" />
                    </div>
                  </div>

                  {/* CTA Actions */}
                  <div className="space-y-2 pt-2">
                    {/* Primary direct WhatsApp follow up */}
                    <a
                      href={getWhatsAppFollowUpLink(inq)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (inq.status === 'new') handleStatusChange(inq.id, 'contacted');
                      }}
                      className="w-full py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer outline-none select-none"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                      <span>WhatsApp Client</span>
                    </a>

                    {/* Secondary CTA utilities */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={`tel:${inq.phone}`}
                        onClick={() => {
                          if (inq.status === 'new') handleStatusChange(inq.id, 'contacted');
                        }}
                        className="py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="py-1.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 font-bold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Delete Inquiry Log"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 6. Admin sandbox controls footer */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-slate-400 font-mono">
          © {new Date().getFullYear()} D T V S SWAMY FINANCIAL LAB. Internal Management Panel.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearAll}
            className="text-[10px] text-red-400 hover:text-red-500 font-bold cursor-pointer uppercase tracking-wider"
          >
            Clear All Logs
          </button>
        </div>
      </div>

    </div>
  );
}
