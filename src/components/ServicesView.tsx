/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, User2, Car, Umbrella, PiggyBank, 
  CheckCircle2, ArrowRight, Sparkles, Sliders, HelpCircle, TrendingUp, DollarSign, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { services, partners } from '../data/financial_data';
import { useLanguage } from '../context/LanguageContext';
import PartnerLogo from './PartnerLogos';

interface ServicesViewProps {
  onNavigateToFaqCategory: (cat: 'life' | 'health' | 'auto' | 'general' | 'investments' | 'tax') => void;
  onNavigateToContact: (prefilledMsg?: string) => void;
}

export default function ServicesView({ onNavigateToFaqCategory, onNavigateToContact }: ServicesViewProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const partnersSectionRef = React.useRef<HTMLDivElement>(null);
  const [hasPreloadedLogos, setHasPreloadedLogos] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasPreloadedLogos) {
          setHasPreloadedLogos(true);
          // Preload official partner logos
          partners.forEach((partner) => {
            const url = partner.officialLogoUrl || partner.logoUrl;
            if (url) {
              const img = new Image();
              img.src = url;
            }
          });
        }
      },
      {
        rootMargin: '200px',
        threshold: 0
      }
    );

    const currentRef = partnersSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasPreloadedLogos]);
  
  const getIcon = (name: string) => {
    switch (name) {
      case 'heart': return <Heart className="w-6 h-6 text-amber-600" />;
      case 'doctor': return <User2 className="w-6 h-6 text-amber-600" />;
      case 'car': return <Car className="w-6 h-6 text-amber-600" />;
      case 'umbrella': return <Umbrella className="w-6 h-6 text-amber-600" />;
      default: return <PiggyBank className="w-6 h-6 text-amber-600" />;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const localizedServices = services.map(srv => {
    if (language === 'en') return srv;
    let title = srv.title;
    let subtitle = srv.subtitle;
    let description = srv.description;
    let bullets = srv.bullets;

    if (srv.id === 'life-insurance') {
      title = 'జీవిత బీమా';
      subtitle = 'సంపద పరిరక్షణ & కుటుంబ వారసత్వం';
      description = 'మీ కుటుంబ సభ్యులకు పూర్తి మనశ్శాంతిని మరియు దీర్ఘకాలిక భద్రతను అందించండి. శక్తివంతమైన టర్మ్ ఇన్సూరెన్స్, గ్యారెంటీ ఆదాయ పథకాలు మరియు రిటైర్మెంట్ పోర్ట్‌ఫోలియోలను ఇక్కడ పొందండి.';
      bullets = [
        'అత్యధిక సమ్ అష్యూర్డ్ టర్మ్ లైఫ్ సెక్యూరిటీ',
        'గ్యారెంటీ గల నెలవారీ/రెగ్యులర్ ఆదాయ ప్లాన్లు',
        'ఎండోమెంట్ & క్యాపిటల్ సేఫ్‌గార్డ్ పోర్ట్‌ఫోలియోలు'
      ];
    } else if (srv.id === 'health-insurance') {
      title = 'ఆరోగ్య బీమా';
      subtitle = 'సంపూర్ణ వైద్య సంరక్షణ భద్రత';
      description = 'ఆసుపత్రి ఖర్చుల నుండి మీ కుటుంబ బడ్జెట్‌ను రక్షించండి. నగదు రహిత చికిత్స (Cashless Network), ప్రాణాంతక వ్యాధుల కవరేజ్ (Critical Illness) మరియు దీర్ఘకాలిక వ్యాధుల మినహాయింపు ప్రయోజనాలు పొందండి.';
      bullets = [
        'యూనివర్సల్ ఫ్యామిలీ ఫ్లోటర్ పాలసీలు',
        'టాప్-అప్ మరియు సూపర్ టాప్-అప్ ప్లాన్లు',
        'క్రిటికల్ ఇల్‌నెస్ డయాగ్నోస్టిక్ క్యాపిటల్ షీల్డ్'
      ];
    } else if (srv.id === 'car-insurance') {
      title = 'వాహన బీమా పరిష్కారాలు';
      subtitle = 'బంపర్-టు-బంపర్ వాహన రక్షణ కవచం';
      description = 'పరిపూర్ణ వాహన రక్షణతో నమ్మకంగా డ్రైవ్ చేయండి. జీరో-డిప్రిసియేషన్ రిప్లేస్‌మెంట్ గ్యారెంటీలు, తక్షణ రోడ్‌సైడ్ సహాయం మరియు ఎటువంటి ఇబ్బంది లేని క్లెయిమ్ సెటిల్మెంట్ ప్రయోజనాలు పొందండి.';
      bullets = [
        'జీరో-డిప్రిసియేషన్ రీప్లేస్‌మెంట్ కవర్స్',
        'థర్డ్-పార్టీ చట్టపరమైన బాధ్యతల రక్షణ',
        'తక్షణ 24/7 రోడ్‌సైడ్ సహాయం (RSA)'
      ];
    } else if (srv.id === 'general-insurance') {
      title = 'సాధారణ బీమా పరిష్కారాలు';
      subtitle = 'ఆస్తి, గృహ & వ్యాపార రక్షణ కవచం';
      description = 'సమగ్రమైన వాణిజ్య, పారిశ్రామిక మరియు గృహ ఆస్తుల రక్షణ. గృహ నిర్మాణాలు, వ్యక్తిగత ఆస్తులు, వ్యాపార సామగ్రి, అగ్నిప్రమాదాలు మరియు దొంగతనాల నుండి పూర్తి రక్షణ కవచాలు కేవలం టాటా AIG ద్వారా పొందండి.';
      bullets = [
        'సమగ్ర గృహ మరియు విలువైన వస్తువుల రక్షణ',
        'షాప్‌కీపర్స్ ప్యాకేజీ & చిన్న వ్యాపారాల రక్షణ',
        'పారిశ్రామిక అగ్నిప్రమాదం, దొంగతనం & పబ్లిక్ లయబిలిటీ కవర్స్'
      ];
    } else if (srv.id === 'mutual-funds') {
      title = 'మ్యూచువల్ ఫండ్స్ & పెట్టుబడులు';
      subtitle = 'లక్ష్య ఆధారిత చక్రవడ్డీ ప్రణాళికలు';
      description = 'సరైన ఆస్తి కేటాయింపు ద్వారా మీ దీర్ఘకాలిక సంపదను తెలివిగా పెంచుకోండి. పన్ను ఆదా (ELSS) ప్రయోజనాలతో పాటు చక్రవడ్డీ శక్తితో కూడిన బహుళ సంవత్సరాల పెట్టుబడి లక్ష్యాలను సమన్వయం చేసుకోండి.';
      bullets = [
        'క్రమశిక్షణతో కూడిన సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్స్ (SIP)',
        'క్రమబద్ధమైన విత్‌డ్రా ద్వారా నెలవారీ ఆదాయ మార్గాలు (SWP)',
        'ద్వంద్వ పన్ను పొదుపు మరియు వృద్ధి (ELSS) పోర్ట్‌ఫోలియోలు'
      ];
    }

    return { ...srv, title, subtitle, description, bullets };
  });

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Services Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-4 pt-16"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
          {language === 'en' ? "Comprehensive Suites" : "సమగ్ర రక్షణ ప్రణాళికలు"}
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white transition-colors">
          {language === 'en' ? "Our Protection &" : "మా బీమా రక్షణ &"}{' '}
          <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">
            {language === 'en' ? "Investment Suites" : "సంపద సృష్టి మార్గాలు"}
          </span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
          {language === 'en' 
            ? "Horizontal multi-layered systematic structures for comprehensive assets security and prime generational compounding wealth."
            : "ఆస్తుల రక్షణ కోసం మరియు భవిష్యత్ తరాలకు సంపదను అందించడం కోసం రూపొందించిన అధునాతన ప్రణాళికలు."}
        </p>
      </motion.div>

      {/* 2. Bento Grid of Services -> Reformatted to luxurious Row layouts */}
      <div className="space-y-10 max-w-6xl mx-auto">
        {localizedServices.map((srv, idx) => (
          <motion.div 
            key={srv.id}
            id={srv.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 20px 40px -15px rgba(217, 119, 6, 0.18), 0 0 20px 1px rgba(217, 119, 6, 0.08)",
              borderColor: "rgba(217, 119, 6, 0.45)"
            }}
            className="rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-6 sm:p-8 flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Background radial highlight */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/[0.03] transition-all" />

            {/* Left Column: Core Description & Partners */}
            <div className="flex-grow lg:w-7/12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-amber-500/30 transition-colors shrink-0 shadow-sm">
                    {getIcon(srv.iconName)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-wide">{srv.title}</h3>
                    <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 uppercase tracking-widest font-bold font-mono">{srv.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans pt-1 text-left">
                  {srv.description}
                </p>
              </div>

              {/* Partners Tags */}
              <div className="space-y-2 pt-2 text-left">
                <span className="text-slate-550 dark:text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider block">
                  {language === 'en' ? "Authorized Insurance Platforms:" : "అధికారిక సేవా భాగస్వాములు:"}
                </span>
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {srv.partners.map((p, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/20 rounded font-mono text-[9px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider transition-all"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* COMPOUND INTEREST TRAJECTORY FOR MUTUAL FUNDS */}
              {srv.id === 'mutual-funds' && (
                <div className="mt-4 border-t border-slate-200 dark:border-slate-800/80 pt-5 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" /> {language === 'en' ? "Power of Compounding over Time" : "కాలక్రమేణా చక్రవడ్డీ శక్తి"}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal max-w-lg mt-0.5 font-medium font-sans">
                        {language === 'en' 
                          ? "Visualizing a steady monthly SIP of ₹10,000 compounding at 12% Expected CAGR over 10, 20, and 30-year live horizons to verify early advantages."
                          : "నెలకు ₹10,000 చొప్పున చేసే స్థిరమైన ఎస్‌ఐపీ, 12% అంచనా వృద్ధి రేటుతో (CAGR) 10, 20 మరియు 30 సంవత్సరాలలో ఎంత సంపదను సృష్టిస్తుందో ఇక్కడ చూడవచ్చు."}
                      </p>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center animate-pulse">
                      {/* Chart Skeleton wrapper with shimmer */}
                      <div className="sm:col-span-8 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-4 h-48 w-full flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-center">
                          <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="flex gap-2">
                            <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                          </div>
                        </div>
                        <div className="absolute inset-x-6 bottom-4 top-12 flex items-end justify-between gap-2.5">
                          <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
                          <div className="h-10 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
                          <div className="h-16 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-md" />
                          <div className="h-24 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-md" />
                          <div className="h-32 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
                          <div className="h-36 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
                          <div className="h-40 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-md" />
                        </div>
                      </div>

                      {/* Side outcomes Skeleton panel */}
                      <div className="sm:col-span-4 space-y-2">
                        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/40 dark:border-slate-800/40 p-2.5 h-[52px] rounded-lg flex flex-col justify-center space-y-2">
                          <div className="h-2 w-2/5 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/40 dark:border-slate-800/40 p-2.5 h-[52px] rounded-lg flex flex-col justify-center space-y-2">
                          <div className="h-2 w-2/5 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/40 dark:border-slate-800/40 p-2.5 h-[52px] rounded-lg flex flex-col justify-center space-y-2">
                          <div className="h-2 w-2/5 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { year: '0 Yr', Invested: 0, FutureValue: 0 },
                              { year: '5 Yr', Invested: 600000, FutureValue: 824000 },
                              { year: '10 Yr', Invested: 1200000, FutureValue: 2323000 },
                              { year: '15 Yr', Invested: 1800000, FutureValue: 5045000 },
                              { year: '20 Yr', Invested: 2400000, FutureValue: 9991005 },
                              { year: '25 Yr', Invested: 3000000, FutureValue: 18976000 },
                              { year: '30 Yr', Invested: 3600000, FutureValue: 35299000 },
                            ]}
                            margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="year" fontSize={8} stroke="#64748b" />
                            <YAxis fontSize={8} stroke="#64748b" tickFormatter={(v) => v >= 10000000 ? `₹${(v/10000000).toFixed(1)} Cr` : `₹${v/100000} L`} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px' }}
                              labelStyle={{ fontWeight: 'bold', color: '#1e293b', fontSize: '10px' }}
                              itemStyle={{ fontSize: '10px', padding: '1px 0', color: '#0f172a' }}
                              formatter={(v) => [formatCurrency(Number(v)), 'Value']}
                            />
                            <Line 
                              name="Invested Amount" 
                              type="monotone" 
                              dataKey="Invested" 
                              stroke="#94a3b8" 
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                            />
                            <Line 
                              name="Wealth Value" 
                              type="monotone" 
                              dataKey="FutureValue" 
                              stroke="#10b981" 
                              strokeWidth={2.5} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="sm:col-span-4 space-y-2 font-display">
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-2.5 rounded-lg text-left">
                          <span className="block text-[8px] font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest font-bold">
                            {language === 'en' ? "10 Years Outcome" : "10 సంవత్సరాల ఫలితం"}
                          </span>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹23.2 Lakhs</span>
                            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-medium">
                              {language === 'en' ? "Inv: " : "పెట్టుబడి: "}₹12L
                            </span>
                          </div>
                        </div>
                        <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 p-2.5 rounded-lg text-left">
                          <span className="block text-[8px] font-mono text-teal-800 dark:text-teal-400 uppercase tracking-widest font-bold">
                            {language === 'en' ? "20 Years Outcome" : "20 సంవత్సరాల ఫలితం"}
                          </span>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹99.9 Lakhs</span>
                            <span className="text-[9px] text-teal-700 dark:text-teal-400 font-medium">
                              {language === 'en' ? "Inv: " : "పెట్టుబడి: "}₹24L
                            </span>
                          </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-2.5 rounded-lg text-left">
                          <span className="block text-[8px] font-mono text-amber-800 dark:text-amber-400 uppercase tracking-widest font-bold">
                            {language === 'en' ? "30 Years Outcome" : "30 సంవత్సరాల ఫలితం"}
                          </span>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">₹3.53 Crores</span>
                            <span className="text-[9px] text-amber-700 dark:text-amber-400 font-medium">
                              {language === 'en' ? "Inv: " : "పెట్టుబడి: "}₹36L
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Inclusions List & Action Buttons */}
            <div className="lg:w-5/12 bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between shrink-0 space-y-5 shadow-sm text-left">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 dark:text-slate-550">
                  {language === 'en' ? "Core Features included" : "చేర్చబడిన ప్రధాన రక్షణలు"}
                </span>
                <div className="space-y-2">
                  {srv.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigateToFaqCategory(srv.category)}
                  className="w-full py-3 text-center text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-amber-800 dark:text-amber-400 hover:text-white flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/35 hover:bg-amber-600 dark:hover:bg-amber-600 rounded-lg transition-all cursor-pointer outline-none shadow-sm min-h-[44px]"
                >
                  {language === 'en' ? "Explore FAQ Details" : "ప్రశ్నోత్తరాలు చూడండి"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <button
                  onClick={() => onNavigateToContact(
                    language === 'en' 
                      ? `Hello Mr. Swamy, I am interested in your financial advisory for "${srv.title}". Please set up an evaluation callback.` 
                      : `నమస్కారం స్వామి గారు, నేను మీ "${srv.title}" ఆర్థిక సలహా సేవలపై ఆసక్తిగా ఉన్నాను. దయచేసి నాకు తగిన సలహా అందించడానికి సంప్రదించగలరు.`
                  )}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer outline-none flex items-center justify-center gap-1 py-3 sm:py-2 min-h-[44px]"
                >
                  {language === 'en' ? "Request a callback & quote" : "సలహా లేదా కొటేషన్ కోసం అడగండి"}
                </button>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* 3. Associated Partners & Platforms Row */}
      <div ref={partnersSectionRef} className="border-t border-slate-200 dark:border-slate-800 pt-16 mt-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 block">
            {language === 'en' ? "Our Advisory Coverage & Providers" : "మా భాగస్వామ్య సేవా సంస్థలు"}
          </span>
          <h2 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            {language === 'en' ? "Authorized Insurance & Asset Management Platforms" : "అధికారిక బీమా & మ్యూచువల్ ఫండ్స్ వేదికలు"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-normal">
            {language === 'en' 
              ? "We represent India's leading insurance and mutual fund providers to verify, customize, and deliver prime packages."
              : "మీకు అత్యుత్తమ సేవలను అందించడానికి మేము భారతదేశంలోని ప్రముఖ బీమా మరియు మ్యూచువల్ ఫండ్ సంస్థలకు ప్రాతినిధ్యం వహిస్తున్నాము."}
          </p>
        </div>

        <div className="w-full py-6 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-slate-200 dark:border-slate-850 px-4">
          <div className="flex flex-wrap gap-2.5 sm:gap-4 justify-center items-center">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl w-[100px] xs:w-[110px] sm:w-[150px] md:w-[170px] h-[72px] sm:h-[90px] animate-pulse"
                >
                  <div className="h-7 sm:h-9 w-14 sm:w-24 bg-slate-200 dark:bg-slate-800 rounded-md mb-1.5" />
                  <div className="h-2 w-10 sm:w-16 bg-slate-100 dark:bg-slate-850 rounded-md" />
                </div>
              ))
            ) : (
              partners.map((part, idx) => (
                <div 
                  key={idx} 
                  title={part.name}
                  className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl w-[100px] xs:w-[110px] sm:w-[150px] md:w-[170px] h-[72px] sm:h-[90px] shrink-0 group hover:border-amber-500/35 dark:hover:border-amber-500/45 hover:shadow-[0_8px_24px_rgba(217,119,6,0.06)] grayscale hover:grayscale-0 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer"
                >
                  <div className="flex-1 flex items-center justify-center w-full min-h-0 px-1">
                    <PartnerLogo name={part.name} className="h-8 xs:h-9 sm:h-11 max-w-full object-contain" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-1 truncate max-w-full text-center uppercase block">
                    {part.fallback || part.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
