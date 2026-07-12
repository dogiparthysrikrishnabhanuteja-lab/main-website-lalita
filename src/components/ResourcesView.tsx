/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Sparkles, ArrowUpRight, BookOpen, Search, X, HelpCircle } from 'lucide-react';
import SipCalculator from './SipCalculator';
import { useLanguage } from '../context/LanguageContext';

interface ResourcesViewProps {
  onSetContactMessage: (msg: string) => void;
  onNavigateToFaqCategory: (cat: 'life' | 'health' | 'auto' | 'general' | 'investments' | 'tax') => void;
}

export default function ResourcesView({ onSetContactMessage, onNavigateToFaqCategory }: ResourcesViewProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const localizedGlossaryTerms = GLOSSARY_TERMS.map(item => {
    if (language === 'en') return item;
    let term = item.term;
    let definition = item.definition;
    let tag = item.tag;
    let importance = item.importance;

    if (item.term === "Sum Assured") {
      term = "Sum Assured (కనీస బీమా మొత్తం)";
      definition = "పాలసీదారునికి ఏదైనా ప్రమాదం జరిగినప్పుడు వారి కుటుంబ సభ్యులకు అందే కనీస హామీ మొత్తం. ఇది మీ కుటుంబానికి లభించే ఆర్థిక రక్షణ కవచం.";
      tag = "జీవిత భద్రతా ప్రమాణం";
      importance = "ఆధారపడిన కుటుంబ సభ్యులను అప్పుల నుండి మరియు ఆకస్మిక ఆదాయ నష్టం నుండి రక్షిస్తుంది.";
    } else if (item.term === "Systematic Investment Plan (SIP)") {
      term = "SIP (క్రమబద్ధమైన పెట్టుబడి)";
      definition = "ప్రతినెలా లేదా ప్రతి మూడు నెలలకు ఒక నిర్ణీత మొత్తాన్ని మ్యూచువల్ ఫండ్స్‌లో పెట్టుబడి పెట్టే విధానం. ఇది దీర్ఘకాలంలో చక్రవడ్డీ ద్వారా అధిక సంపదను సృష్టిస్తుంది.";
      tag = "సంపద వృద్ధి";
      importance = "మార్కెట్ హెచ్చుతగ్గుల నష్టాలను తగ్గిస్తూ స్థిరమైన లాభాలను అందిస్తుంది.";
    } else if (item.term === "Zero Depreciation Add-on") {
      term = "Zero Depreciation (తరుగుదల లేని వాహన బీమా)";
      definition = "వాహన క్లెయిమ్ సమయంలో విడిభాగాల తరుగుదలను (Metal, Fiber, Glass) పరిగణించకుండా పూర్తి ఖర్చును బీమా సంస్థ చెల్లించే నిబంధన.";
      tag = "వాహన రక్షణ";
      importance = "ప్రమాదం జరిగినప్పుడు స్వంత చేతి నుండి పెట్టే ఖర్చును చాలావరకు తగ్గిస్తుంది.";
    } else if (item.term === "Super Top-Up Medicare Plan") {
      term = "Super Top-Up (అదనపు ఆరోగ్య బీమా)";
      definition = "వైద్య ఖర్చులు మీ సాధారణ బీమా పరిమితిని దాటినప్పుడు అత్యంత తక్కువ ప్రీమియంతో భారీ వైద్య కవరేజీని అందించే ప్లాన్.";
      tag = "అత్యవసర ఆరోగ్య రక్షణ";
      importance = "తక్కువ ఖర్చుతో వైద్య రక్షణను ₹50 లక్షలు లేదా ₹1 కోటి వరకు పెంచుతుంది.";
    } else if (item.term === "No Claim Bonus renewal discount") {
      term = "No Claim Bonus (నో క్లెయిమ్ బోనస్)";
      definition = "పాలసీ వ్యవధిలో ఎటువంటి క్లెయిమ్ చేయనందుకు గాను, తదుపరి పాలసీ పునరుద్ధరణ (Renewal) ప్రీమియంలో లభించే ప్రత్యేక తగ్గింపు.";
      tag = "ప్రీమియం పొదుపు బహుమతి";
      importance = "పాలసీ ప్రీమియం ధరను 50% వరకు క్రమంగా తగ్గిస్తుంది.";
    } else if (item.term === "Maturity Payout Benefit") {
      term = "Maturity Benefit (గడువు తీరిన తర్వాత వచ్చే మొత్తం)";
      definition = "పాలసీ కాలపరిమితి విజయవంతంగా పూర్తయిన తర్వాత పాలసీదారునికి లభించే మొత్తం మరియు అదనపు బోనస్ ఆదాయం.";
      tag = "హామీతో కూడిన భద్రత";
      importance = "పిల్లల చదువులకు లేదా రిటైర్మెంట్ అవసరాలకు భరోసా ఇస్తుంది.";
    } else if (item.term === "NAV (Net Asset Value Pricing)") {
      term = "NAV (నికర ఆస్తి విలువ)";
      definition = "మ్యూచువల్ ఫండ్ యొక్క ఒక యూనిట్ ధర. ప్రతి రోజూ మార్కెట్ ముగిసిన తర్వాత దీని విలువను లెక్కిస్తారు.";
      tag = "యూనిట్ ధర సూచీ";
      importance = "మ్యూచువల్ ఫండ్‌ను కొనుగోలు చేయడానికి లేదా విక్రయించడానికి ప్రాతిపదికగా ఉపయోగపడుతుంది.";
    } else if (item.term === "Co-payment Clause") {
      term = "Co-payment (కో-పేమెంట్ నిబంధన)";
      definition = "వైద్య ఖర్చులలో కొంత శాతం (ఉదాహరణకు 10% లేదా 20%) పాలసీదారుడు స్వయంగా భరించాలని తెలిపే నిబంధన.";
      tag = "భాగస్వామ్య క్లెయిమ్";
      importance = "పాలసీ ప్రీమియంను తగ్గిస్తుంది కానీ చికిత్స సమయంలో కొంత స్వంత డబ్బు అవసరమవుతుంది.";
    } else if (item.term === "CAGR compound progress standard") {
      term = "CAGR (చక్రవడ్డీ వృద్ధి రేటు)";
      definition = "సంవత్సరాల కాలంలో మీ పెట్టుబడి సగటున ప్రతి సంవత్సరం ఎంత శాతం చొప్పున వృద్ధి చెందిందో చూపే ఒక ఖచ్చితమైన కొలమానం.";
      tag = "ఆర్థిక విశ్లేషణ లెక్కలు";
      importance = "వివిధ రకాల పెట్టుబడుల పనితీరును ఖచ్చితంగా పోల్చి చూసేందుకు సహాయపడుతుంది.";
    } else if (item.term === "Expense Ratio Management percentage") {
      term = "Expense Ratio (నిర్వహణ రుసుము)";
      definition = "మ్యూచువల్ ఫండ్ కంపెనీ మీ పెట్టుబడిని నిర్వహించినందుకు గాను సంవత్సరానికి వసూలు చేసే అతి తక్కువ నిర్వహణ రుసుము.";
      tag = "నిర్వహణ వ్యయ నిష్పత్తి";
      importance = "తక్కువ ఎక్స్‌పెన్స్ రేషియో ఉండటం వల్ల మీ చేతికి వచ్చే లాభాలు మెరుగ్గా ఉంటాయి.";
    }

    return { ...item, term, definition, tag, importance };
  });

  const filteredGlossaryTerms = localizedGlossaryTerms.filter((item) => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    const matchesQuery = 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.importance.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const localizedSuggestions = [
    {
      q: language === 'en' 
        ? "Which specific policies provide robust term security and family legacy protection?"
        : "కుటుంబ భద్రత కోసం ఎటువంటి టర్మ్ ఇన్సూరెన్స్ పాలసీలను ఎంచుకోవాలి?",
      action: () => onNavigateToFaqCategory('life'),
      tag: language === 'en' ? "Term Life" : "టర్మ్ లైఫ్"
    },
    {
      q: language === 'en'
        ? "How can I combine a base health policy with a Super Top-Up to save premium costs?"
        : "తక్కువ ప్రీమియంతో సూపర్ టాప్-అప్ ప్లాన్లను ఎలా ఉపయోగించాలి?",
      action: () => onNavigateToFaqCategory('health'),
      tag: language === 'en' ? "Health Mediclaim" : "ఆరోగ్య బీమా"
    },
    {
      q: language === 'en'
        ? "What is a Systematic Investment Plan (SIP) and how do compounding returns behave?"
        : "ఎస్‌ఐపీ (SIP) అంటే ఏమిటి? చక్రవడ్డీ లాభాలు ఎలా పనిచేస్తాయి?",
      action: () => {}, // Handled by active calculator focus
      tag: language === 'en' ? "Mutual Funds" : "మ్యూచువల్ ఫండ్స్"
    },
    {
      q: language === 'en'
        ? "What distinct benefits do TATA AIG Zero-Depreciation car policies hold?"
        : "టాటా AIG జీరో డిప్రిసియేషన్ వాహన బీమా ప్రయోజనాలు ఏమిటి?",
      action: () => onNavigateToFaqCategory('auto'),
      tag: language === 'en' ? "Vehicle Armor" : "వాహన రక్షణ"
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
          {language === 'en' ? "Wealth Simulators" : "ఆర్థిక క్యాలిక్యులేటర్లు"}
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white transition-colors">
          {language === 'en' ? "Interactive" : "ఇంటరాక్టివ్"}{' '}
          <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent font-display">
            {language === 'en' ? "Advisory Portals" : "ఆర్థిక విశ్లేషణ వేదిక"}
          </span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-655 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
          {language === 'en' 
            ? "Estimate investment growth rates, balance compound yields, and simulate retirement outflows using our interactive calculators."
            : "మా క్యాలిక్యులేటర్ల ద్వారా మీ పెట్టుబడుల వృద్ధి రేటును, చక్రవడ్డీ లాభాలను మరియు రిటైర్మెంట్ ఆదాయాలను అంచనా వేసుకోండి."}
        </p>
      </motion.div>

      {/* 2. Primary layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Suggestion Quick Starters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> {language === 'en' ? "Advisory Quick Starters" : "త్వరిత మార్గదర్శకాలు"}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-medium">
              {language === 'en' 
                ? "Click on any foundational priority to instantly explore deep FAQ items or utilize our precision compounding simulator."
                : "మీకు కావలసిన విభాగాన్ని ఎంచుకుని దానికి సంబంధించిన ప్రశ్నోత్తరాలను చూడండి లేదా ఎస్‌ఐపీ చక్రవడ్డీ క్యాలిక్యులేటర్‌ను ఉపయోగించండి."}
            </p>

            <div className="space-y-3 pt-2">
              {localizedSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={sug.action}
                  className="w-full text-left p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-amber-500/50 rounded-xl transition-all flex flex-col justify-between gap-2 cursor-pointer group outline-none shadow-sm"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-450 font-extrabold px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                      {sug.tag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors leading-relaxed font-semibold">
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
      <div className="border-t border-slate-200 dark:border-slate-800 pt-16 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-850 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
            <BookOpen className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> {language === 'en' ? "Educational Hub" : "ఆర్థిక విజ్ఞాన కేంద్రం"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {language === 'en' ? "Financial Literacy" : "ఆర్థిక పదకోశం"}{' '}
            <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent font-display">
              {language === 'en' ? "Glossary" : "(గ్లోసరీ)"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            {language === 'en'
              ? "Empower yourself with precise financial terminology. Demystify complex insurance and investment clauses to make safe, professional, and confident decisions."
              : "ఆర్థిక పదాల గురించి సరైన అవగాహన పెంచుకోండి. క్లిష్టమైన ఇన్సూరెన్స్ మరియు మ్యూచువల్ ఫండ్స్ నిబంధనలను సులభంగా అర్థం చేసుకుని సరైన నిర్ణయాలు తీసుకోండి."}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search bar and Filters container */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            
            {/* Search Input field */}
            <div className="relative w-full md:w-3/5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={language === 'en' ? "Search terms (e.g. SIP, Super Top-Up, Sum Assured...)" : "ఆర్థిక పదాల కోసం వెతకండి (ఉదా. SIP, సమ్ అష్యూర్డ్...)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-850 dark:text-slate-100 placeholder-slate-400"
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
                { id: 'all', label: language === 'en' ? 'All Terms' : 'అన్ని పదాలు' },
                { id: 'insurance', label: language === 'en' ? '🛡️ Insurance Vitals' : '🛡️ బీమా పదాలు' },
                { id: 'investment', label: language === 'en' ? '📈 Wealth Compounding' : '📈 పెట్టుబడి పదాలు' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none ${
                    activeFilter === pill.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-500/30 font-bold'
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
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/[0.03] transition-all" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[9px] uppercase font-mono tracking-widest font-black px-2.5 py-0.5 rounded-md border text-amber-800 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40">
                        {item.tag}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest font-mono font-black text-slate-400 dark:text-slate-500">
                        {item.category === 'insurance' 
                          ? (language === 'en' ? '🛡️ Protection Spec' : '🛡️ బీమా విభాగం') 
                          : (language === 'en' ? '📈 Wealth Builder' : '📈 పెట్టుబడి విభాగం')}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {item.term}
                    </h3>

                    <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans font-medium pt-0.5">
                      {item.definition}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-3 mt-1 text-[10.5px] text-slate-500 flex items-start gap-1.5 leading-normal">
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 shrink-0 text-[8.5px] tracking-wider uppercase font-mono mt-0.5">
                      {language === 'en' ? "Vital Goal:" : "లక్ష్యం:"}
                    </span>
                    <span className="font-sans font-medium text-slate-500 dark:text-slate-400">{item.importance}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Zero-state matches fallback view */}
            {filteredGlossaryTerms.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-12 px-6 text-center border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center justify-center space-y-2"
              >
                <HelpCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  {language === 'en' ? "No glossary items match your search" : "మీ శోధనకు తగిన ఫలితాలు లభించలేదు"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-sans font-medium">
                  {language === 'en' 
                    ? `No matching parameters found for "${searchQuery}". Try searching for standard words like "SIP", "Super", "No Claim", or "Sum".`
                    : `"${searchQuery}" కి సరిపోయే సమాచారం లేదు. దయచేసి "SIP", "Super", "No Claim" లేదా "Sum" వంటి సాధారణ పదాలతో ప్రయత్నించండి.`}
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                  className="mt-3 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-600 hover:text-white border border-amber-200 dark:border-amber-900/40 text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer outline-none"
                >
                  {language === 'en' ? "Clear search filters" : "శోధన ఫిల్టర్లను తొలగించండి"}
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
