/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Sparkles, ArrowUpRight, BookOpen, Search, X, HelpCircle } from 'lucide-react';
import SipCalculator from './SipCalculator';

interface ResourcesViewProps {
  onSetContactMessage: (msg: string) => void;
  onNavigateToFaqCategory: (cat: 'life' | 'health' | 'auto' | 'general' | 'investments' | 'tax') => void;
}

export default function ResourcesView({ onSetContactMessage, onNavigateToFaqCategory }: ResourcesViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredGlossaryTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    const matchesQuery = 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.importance.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const suggestions = [
    {
      q: "Which specific policies provide robust term security and family legacy protection?",
      action: () => onNavigateToFaqCategory('life'),
      tag: "Term Life"
    },
    {
      q: "How can I combine a base health policy with a Super Top-Up to save premium costs?",
      action: () => onNavigateToFaqCategory('health'),
      tag: "Health Mediclaim"
    },
    {
      q: "What is a Systematic Investment Plan (SIP) and how do compounding returns behave?",
      action: () => {}, // Handled by active calculator focus
      tag: "Mutual Funds"
    },
    {
      q: "What distinct benefits do TATA AIG Zero-Depreciation car policies hold?",
      action: () => onNavigateToFaqCategory('auto'),
      tag: "Vehicle Armor"
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 selection:bg-amber-500/20">
      
      {/* 1. Header Area styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-4 pt-16"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
          Wealth Simulators
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white transition-colors">
          Interactive <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent font-display">Advisory Portals</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
          Estimate investment growth rates, balance compound yields, and simulate retirement outflows using our interactive calculators.
        </p>
      </motion.div>

      {/* 2. Primary layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Suggestion Quick Starters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 font-display tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Advisory Quick Starters
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Click on any foundational priority to instantly explore deep FAQ items or utilize our precision compounding simulator.
            </p>

            <div className="space-y-3 pt-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={sug.action}
                  className="w-full text-left p-3.5 bg-white border border-slate-200/80 hover:border-amber-500/50 rounded-xl transition-all flex flex-col justify-between gap-2 cursor-pointer group outline-none"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-amber-700 font-extrabold px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100">
                      {sug.tag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                  <span className="text-xs text-slate-700 group-hover:text-slate-950 transition-colors leading-relaxed">
                    {sug.q}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Render Active Calculator directly */}
        <div className="lg:col-span-8">
          <SipCalculator />
        </div>

      </div>

      {/* 3. Financial Literacy Section: Interactive, Searchable Glossary */}
      <div className="border-t border-slate-200 pt-16 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold uppercase tracking-widest rounded-full">
            <BookOpen className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> Educational Hub
          </div>
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-slate-900">
            Financial Literacy <span className="gold-gradient-light font-display">Glossary</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            Empower yourself with precise financial terminology. Demystify complex insurance and investment clauses to make safe, professional, and confident decisions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search bar and Filters container */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shadow-sm">
            
            {/* Search Input field */}
            <div className="relative w-full md:w-3/5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search terms (e.g. SIP, Super Top-Up, Sum Assured...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-850 placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end shrink-0">
              {[
                { id: 'all', label: 'All Terms' },
                { id: 'insurance', label: '🛡️ Insurance Vitals' },
                { id: 'investment', label: '📈 Wealth Compounding' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none ${
                    activeFilter === pill.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-500/30 font-bold'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

          </div>

          {/* Grid Layout of glossary terms */}
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
          >
            <AnimatePresence mode="popLayout">
              {filteredGlossaryTerms.map((item) => (
                <motion.div
                  layout
                  key={item.term}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 30px -10px rgba(217, 119, 6, 0.15), 0 0 15px rgba(217, 119, 6, 0.04)",
                    borderColor: "rgba(217, 119, 6, 0.4)"
                  }}
                  className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/[0.03] transition-all" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[9px] uppercase font-mono tracking-widest font-black px-2.5 py-0.5 rounded-md border text-amber-800 bg-amber-50 border-amber-100">
                        {item.tag}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest font-mono font-black text-slate-400">
                        {item.category === 'insurance' ? '🛡️ Protection Spec' : '📈 Wealth Builder'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors">
                      {item.term}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium pt-0.5">
                      {item.definition}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/50 pt-3 mt-1 text-[10.5px] text-slate-500 flex items-start gap-1.5 leading-normal">
                    <span className="font-extrabold text-amber-600 shrink-0 text-[8.5px] tracking-wider uppercase font-mono mt-0.5">Vital Goal:</span>
                    <span className="font-sans font-medium text-slate-500">{item.importance}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Zero-state matches fallback view */}
            {filteredGlossaryTerms.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-12 px-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center space-y-2"
              >
                <HelpCircle className="w-8 h-8 text-amber-600" />
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wide">No glossary items match your search</h4>
                <p className="text-xs text-slate-500 max-w-sm font-sans">No matching parameters found for "{searchQuery}". Try searching for standard words like "SIP", "Super", "No Claim", or "Sum".</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                  className="mt-3 px-4 py-2 bg-amber-50 hover:bg-amber-600 hover:text-white border border-amber-200 hover:border-amber-600 text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer outline-none"
                >
                  Clear search filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  );
}

// Financial Literacy Term glossary definitions
interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'insurance' | 'investment';
  tag: string;
  importance: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Sum Assured",
    definition: "The guaranteed legal coverage amount that the life insurance policyholder's beneficiaries receive in the event of an insured claim. It represents the solid cash boundary of your family protection.",
    category: "insurance",
    tag: "Life Safety Limit",
    importance: "Protects dependent family members from long-term liabilities and sudden loss of income."
  },
  {
    term: "Systematic Investment Plan (SIP)",
    definition: "A steady compounding facility to commit a fixed monetary amount periodically (monthly or quarterly) into mutual funds. It maximizes potential through average-costing over long horizons.",
    category: "investment",
    tag: "Wealth Compounding",
    importance: "Averages out volatile market highs and lows automatically without timing stress."
  },
  {
    term: "Zero Depreciation Add-on",
    definition: "An essential motor protection bumper clause where the insurer settles parts replacements (metal, fiber, glass) at full asset price during claims, bypassing standard mechanical age deductions.",
    category: "insurance",
    tag: "Vehicle Armour",
    importance: "Limits out-of-pocket settlement charges to just basic deductibles during damages."
  },
  {
    term: "Super Top-Up Medicare Plan",
    definition: "A cost-saving helper health setup that activates once your cumulative hospital bills cross a defined self-funded threshold, delivering massive coverage additions at a fraction of basic premium fees.",
    category: "insurance",
    tag: "Emergency Healthcare",
    importance: "Expands safety limits up to ₹50L or ₹1Cr for high-risk procedures cheaply."
  },
  {
    term: "No Claim Bonus renewal discount",
    definition: "A compounding renewal prize discount offered to vehicle or health policyholders for going a full continuous policy cycle without registering any active claim requests.",
    category: "insurance",
    tag: "Premium Savings Reward",
    importance: "Brings down your consecutive yearly protection costs by up to 50% systematically."
  },
  {
    term: "Maturity Payout Benefit",
    definition: "The designated structural capital returned back to the investment-insurance buyer upon completing end-of-term cycles, delivering financial reward and life protection.",
    category: "insurance",
    tag: "Guaranteed Preservation",
    importance: "Ensures return-of-capital or bonus yields for long-term childhood education or retirement values."
  },
  {
    term: "NAV (Net Asset Value Pricing)",
    definition: "The absolute per-unit monetary pricing rate of a mutual fund portfolio, recalculated at each commercial business day close by netting market asset values and scheme units.",
    category: "investment",
    tag: "Tracking Pricing Value",
    importance: "Serves as the precise buying or selling unit price tag for investor purchase and redemption limits."
  },
  {
    term: "Co-payment Clause",
    definition: "A condition stating that the health policy owner will directly cover a set pre-determined percentage of all approved treatment billing costs, while the insurer handles the balance.",
    category: "insurance",
    tag: "Shared Healthcare Claims",
    importance: "Reduces annual policy buying premiums but introduces direct private cash requirements during hospital visits."
  },
  {
    term: "CAGR compound progress standard",
    definition: "Compound Annual Growth Rate represents the exact smoothed annual return rate required for your capital assets to expand from base amounts to final levels over multiple years.",
    category: "investment",
    tag: "Advisory Math Analysis",
    importance: "Perfectly compares performance indicators of investment assets over matching years."
  },
  {
    term: "Expense Ratio Management percentage",
    definition: "The global yearly administration and operating premium charge levied by mutual fund programs to actively manage files, expressed as a exact index percentage.",
    category: "investment",
    tag: "Operational fees Efficiency",
    importance: "Directly relates to final asset yields, where lower costs equal higher dynamic compound value."
  }
];
