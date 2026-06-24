/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  CartesianGrid,
  Legend 
} from 'recharts';
import { services, partners } from '../data/financial_data';
import PartnerLogo from './PartnerLogos';

const getBrandTheme = (name: string) => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes('tata aia')) {
    return { bg: 'from-amber-600 to-amber-800 bg-gradient-to-tr', text: 'text-white', abbrev: 'TA' };
  }
  if (lowercase.includes('tata aig')) {
    return { bg: 'from-amber-500 to-slate-800 bg-gradient-to-tr', text: 'text-white', abbrev: 'TG' };
  }
  if (lowercase.includes('icici prudential') || lowercase.includes('icici pru')) {
    return { bg: 'from-orange-500 to-orange-700 bg-gradient-to-tr', text: 'text-white', abbrev: 'IP' };
  }
  if (lowercase.includes('icici lombard')) {
    return { bg: 'from-red-500 to-red-700 bg-gradient-to-tr', text: 'text-white', abbrev: 'IL' };
  }
  if (lowercase.includes('hdfc life')) {
    return { bg: 'from-blue-600 to-slate-800 bg-gradient-to-tr', text: 'text-white', abbrev: 'HL' };
  }
  if (lowercase.includes('hdfc ergo')) {
    return { bg: 'from-indigo-600 to-slate-800 bg-gradient-to-tr', text: 'text-white', abbrev: 'HE' };
  }
  if (lowercase.includes('star health')) {
    return { bg: 'from-blue-500 to-indigo-650 bg-gradient-to-tr', text: 'text-white', abbrev: 'SH' };
  }
  if (lowercase.includes('care health')) {
    return { bg: 'from-emerald-500 to-teal-700 bg-gradient-to-tr', text: 'text-white', abbrev: 'CH' };
  }
  if (lowercase.includes('niva bupa')) {
    return { bg: 'from-cyan-500 to-teal-700 bg-gradient-to-tr', text: 'text-white', abbrev: 'NB' };
  }
  if (lowercase.includes('prudent')) {
    return { bg: 'from-purple-600 to-indigo-700 bg-gradient-to-tr', text: 'text-white', abbrev: 'PF' };
  }
  return { bg: 'from-slate-650 to-slate-800 bg-gradient-to-tr', text: 'text-white', abbrev: 'FI' };
};

interface ServicesViewProps {
  onNavigateToFaqCategory: (cat: 'life' | 'health' | 'auto' | 'general' | 'investments') => void;
  onNavigateToContact: (prefilledMsg?: string) => void;
}

export default function ServicesView({ onNavigateToFaqCategory, onNavigateToContact }: ServicesViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);
  
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
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
          Comprehensive Suites
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white transition-colors">
          Our Protection & <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">Investment Suites</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
          Horizontal multi-layered systematic structures for comprehensive assets security and prime generational compounding wealth.
        </p>
      </motion.div>

      {/* 2. Bento Grid of Services -> Reformatted to luxurious Row layouts */}
      <div className="space-y-10 max-w-6xl mx-auto">
        {services.map((srv, idx) => (
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
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-wide">{srv.title}</h3>
                    <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 uppercase tracking-widest font-bold font-mono">{srv.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans pt-1">
                  {srv.description}
                </p>
              </div>

              {/* Partners Tags */}
              <div className="space-y-2 pt-2">
                <span className="text-slate-500 font-mono font-bold text-[10px] uppercase tracking-wider block">Authorized Insurance Platforms:</span>
                <div className="flex flex-wrap gap-1.5 justify-start">
                  {srv.partners.map((p, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-white border border-slate-250 hover:border-amber-500/20 rounded font-mono text-[9px] text-amber-800 font-bold uppercase tracking-wider transition-all"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* COMPOUND INTEREST TRAJECTORY FOR MUTUAL FUNDS */}
              {srv.id === 'mutual-funds' && (
                <div className="mt-4 border-t border-slate-200 pt-5 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" /> Power of Compounding over Time
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-lg mt-0.5 font-medium">
                        Visualizing a steady monthly SIP of ₹10,000 compounding at 12% Expected CAGR over 10, 20, and 30-year live horizons to verify early advantages.
                      </p>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center animate-pulse">
                      {/* Chart Skeleton wrapper with shimmer */}
                      <div className="sm:col-span-8 bg-slate-100 border border-slate-200/50 rounded-xl p-4 h-48 w-full flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-center">
                          <div className="h-3 w-1/4 bg-slate-200 rounded" />
                          <div className="flex gap-2">
                            <div className="h-2 w-8 bg-slate-200 rounded" />
                            <div className="h-2 w-12 bg-slate-200 rounded" />
                          </div>
                        </div>
                        {/* Static stylized placeholder blocks mimicking chart nodes */}
                        <div className="absolute inset-x-6 bottom-4 top-12 flex items-end justify-between gap-2.5">
                          <div className="h-4 w-full bg-slate-200/60 rounded-md" />
                          <div className="h-10 w-full bg-slate-200/70 rounded-md" />
                          <div className="h-16 w-full bg-slate-200/80 rounded-md" />
                          <div className="h-24 w-full bg-slate-200/80 rounded-md" />
                          <div className="h-32 w-full bg-slate-200/70 rounded-md" />
                          <div className="h-36 w-full bg-slate-200/60 rounded-md" />
                          <div className="h-40 w-full bg-slate-200/50 rounded-md" />
                        </div>
                      </div>

                      {/* Side outcomes Skeleton panel */}
                      <div className="sm:col-span-4 space-y-2">
                        <div className="bg-slate-50/80 border border-slate-200/40 p-2.5 h-[52px] rounded-lg flex flex-col justify-center space-y-2">
                          <div className="h-2 w-2/5 bg-slate-200 rounded" />
                          <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                        </div>
                        <div className="bg-slate-50/80 border border-slate-200/40 p-2.5 h-[52px] rounded-lg flex flex-col justify-center space-y-2">
                          <div className="h-2 w-2/5 bg-slate-200 rounded" />
                          <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                        </div>
                        <div className="bg-slate-50/80 border border-slate-200/40 p-2.5 h-[52px] rounded-lg flex flex-col justify-center space-y-2">
                          <div className="h-2 w-2/5 bg-slate-200 rounded" />
                          <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 bg-white border border-slate-200 rounded-xl p-3 h-48 w-full">
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
                        <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-left">
                          <span className="block text-[8px] font-mono text-emerald-800 uppercase tracking-widest font-bold">10 Years Outcome</span>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-xs font-bold text-slate-800">₹23.2 Lakhs</span>
                            <span className="text-[9px] text-emerald-700 font-medium">Inv: ₹12L</span>
                          </div>
                        </div>
                        <div className="bg-teal-50 border border-teal-100 p-2.5 rounded-lg text-left">
                          <span className="block text-[8px] font-mono text-teal-800 uppercase tracking-widest font-bold">20 Years Outcome</span>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-xs font-bold text-slate-800">₹99.9 Lakhs</span>
                            <span className="text-[9px] text-teal-700 font-medium">Inv: ₹24L</span>
                          </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-left">
                          <span className="block text-[8px] font-mono text-amber-800 uppercase tracking-widest font-bold">30 Years Outcome</span>
                          <div className="flex justify-between items-baseline mt-0.5">
                            <span className="text-xs font-bold text-slate-800">₹3.53 Crores</span>
                            <span className="text-[9px] text-amber-700 font-medium">Inv: ₹36L</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Inclusions List & Action Buttons */}
            <div className="lg:w-5/12 bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shrink-0 space-y-5 shadow-sm">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Core Features included</span>
                <div className="space-y-2">
                  {srv.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onNavigateToFaqCategory(srv.category)}
                  className="w-full py-3 text-center text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-amber-800 hover:text-white flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-600 border border-amber-200 hover:border-amber-600 rounded-lg transition-all cursor-pointer outline-none shadow-sm min-h-[44px]"
                >
                  Explore FAQ Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <button
                  onClick={() => onNavigateToContact(`Hello Mr. Swamy, I am interested in your financial advisory for "${srv.title}". Please set up an evaluation callback.`)}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-850 transition-colors cursor-pointer outline-none flex items-center justify-center gap-1 py-3 sm:py-2 min-h-[44px]"
                >
                  Request a callback & quote
                </button>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* 3. Associated Partners & Platforms Row */}
      <div className="border-t border-slate-200 pt-16 mt-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 block">Our Advisory Coverage & Providers</span>
          <h2 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">Authorized Insurance & Asset Management Platforms</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto leading-normal">
            We represent India's leading insurance and mutual fund providers to verify, customize, and deliver prime packages.
          </p>
        </div>

        <div className="w-full py-6 bg-slate-50/50 rounded-2xl border border-slate-200 px-4">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 bg-white border border-slate-200/50 py-2 px-3.5 rounded-xl w-[180px] sm:w-[215px] h-[52px] animate-pulse"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-slate-200 rounded w-5/6" />
                    <div className="h-2 bg-slate-100 rounded w-2/5" />
                  </div>
                </div>
              ))
            ) : (
              partners.map((part, idx) => (
                <div 
                  key={idx} 
                  title={part.name}
                  className="flex items-center justify-center p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl w-[170px] sm:w-[200px] h-14 shrink-0 group hover:border-amber-500/35 dark:hover:border-amber-500/45 hover:shadow-[0_8px_24px_rgba(217,119,6,0.06)] grayscale hover:grayscale-0 opacity-65 hover:opacity-100 transition-all duration-500 cursor-pointer"
                >
                  <PartnerLogo name={part.name} className="h-7 sm:h-8 w-auto" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
