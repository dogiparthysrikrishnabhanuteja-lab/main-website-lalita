/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PiggyBank, 
  TrendingUp, 
  Sparkles, 
  Wallet, 
  ChevronDown, 
  ChevronUp, 
  LineChart, 
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import {
  FINANCIAL_LIMITS,
  clampValue,
  calculateSipDetails,
  calculateLumpsumDetails,
  calculateSwpDetails,
  generateCompoundingComparison,
  formatToINR,
  formatLargeShortValue
} from '../utils/financialUtils';

type CalculatorMode = 'sip' | 'lumpsum' | 'swp' | 'compounding';

export default function SipCalculator() {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<CalculatorMode>('sip');

  // Interactive display state for expanding detailed schedule schedule
  const [showDetailedSchedule, setShowDetailedSchedule] = useState<boolean>(false);

  // --- SIP State ---
  const [sipMonthly, setSipMonthly] = useState<number>(FINANCIAL_LIMITS.SIP.DEFAULT_MONTHLY);
  const [sipRate, setSipRate] = useState<number>(FINANCIAL_LIMITS.SIP.DEFAULT_RATE);
  const [sipYears, setSipYears] = useState<number>(FINANCIAL_LIMITS.SIP.DEFAULT_YEARS);
  const [isStepUpEnabled, setIsStepUpEnabled] = useState<boolean>(false);
  const [sipStepUp, setSipStepUp] = useState<number>(FINANCIAL_LIMITS.SIP.DEFAULT_STEP_UP);

  // --- Lumpsum State ---
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(FINANCIAL_LIMITS.LUMPSUM.DEFAULT_AMOUNT);
  const [lumpsumRate, setLumpsumRate] = useState<number>(FINANCIAL_LIMITS.LUMPSUM.DEFAULT_RATE);
  const [lumpsumYears, setLumpsumYears] = useState<number>(FINANCIAL_LIMITS.LUMPSUM.DEFAULT_YEARS);

  // --- SWP State ---
  const [swpCapital, setSwpCapital] = useState<number>(FINANCIAL_LIMITS.SWP.DEFAULT_CAPITAL);
  const [swpWithdrawal, setSwpWithdrawal] = useState<number>(FINANCIAL_LIMITS.SWP.DEFAULT_WITHDRAWAL);
  const [swpRate, setSwpRate] = useState<number>(FINANCIAL_LIMITS.SWP.DEFAULT_RATE);
  const [swpYears, setSwpYears] = useState<number>(FINANCIAL_LIMITS.SWP.DEFAULT_YEARS);

  // --- Compounding State ---
  const [compoundingMonthly, setCompoundingMonthly] = useState<number>(FINANCIAL_LIMITS.COMPOUNDING.DEFAULT_MONTHLY);
  const [compoundingRate, setCompoundingRate] = useState<number>(FINANCIAL_LIMITS.COMPOUNDING.DEFAULT_RATE);

  // --- Calculations Memoization ---
  const sipDetails = useMemo(() => {
    return calculateSipDetails(sipMonthly, sipRate, sipYears, isStepUpEnabled, sipStepUp);
  }, [sipMonthly, sipRate, sipYears, isStepUpEnabled, sipStepUp]);

  const lumpsumDetails = useMemo(() => {
    return calculateLumpsumDetails(lumpsumAmount, lumpsumRate, lumpsumYears);
  }, [lumpsumAmount, lumpsumRate, lumpsumYears]);

  const swpDetails = useMemo(() => {
    return calculateSwpDetails(swpCapital, swpWithdrawal, swpRate, swpYears);
  }, [swpCapital, swpWithdrawal, swpRate, swpYears]);

  const compoundingData = useMemo(() => {
    return generateCompoundingComparison(compoundingMonthly, compoundingRate);
  }, [compoundingMonthly, compoundingRate]);

  // Handle Tab changes (close schedule so it doesn't stay open with legacy data)
  const handleModeChange = useCallback((newMode: CalculatorMode) => {
    setMode(newMode);
    setShowDetailedSchedule(false);
  }, []);

  // --- Render helpers ---
  const activeBreakdownData = useMemo<any[]>(() => {
    if (mode === 'sip') {
      return sipDetails.yearlyBreakdown.map(item => ({
        year: `${item.year} ${language === 'en' ? 'Yr' : 'సం.'}`,
        "Invested Principal": item.invested,
        "Total Wealth": item.total,
        "Earnings": item.earnings,
      }));
    }
    if (mode === 'lumpsum') {
      return lumpsumDetails.yearlyBreakdown.map(item => ({
        year: `${item.year} ${language === 'en' ? 'Yr' : 'సం.'}`,
        "Invested Principal": item.invested,
        "Total Wealth": item.total,
        "Earnings": item.earnings,
      }));
    }
    if (mode === 'swp') {
      return swpDetails.yearlyBreakdown.map(item => ({
        year: `${item.year} ${language === 'en' ? 'Yr' : 'సం.'}`,
        "Remaining Balance": item.balance,
        "Withdrawn Capital": item.withdrawn,
      }));
    }
    return [];
  }, [mode, sipDetails, lumpsumDetails, swpDetails, language]);

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto selection:bg-amber-500/30">
      
      {/* Header section with brand advisor tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/25">
            <PiggyBank className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              {language === 'en' ? "Mutual Funds Calculator Suite" : "మ్యూచువల్ ఫండ్స్ క్యాలిక్యులేటర్"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'en' ? "Model structured wealth creation and periodic income pathways" : "నిర్ణీత సంపద సృష్టి మరియు ఆదాయ మార్గాలను అంచనా వేయండి"}
            </p>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-800 gap-0.5 shrink-0" role="tablist" aria-label="Calculator Modes">
          {[
            { id: 'sip', name: 'SIP' },
            { id: 'lumpsum', name: language === 'en' ? 'Lumpsum' : 'లంప్‌సమ్' },
            { id: 'swp', name: 'SWP' },
            { id: 'compounding', name: language === 'en' ? 'Early vs Late Start ⚡' : 'త్వరగా vs ఆలస్యంగా ⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleModeChange(tab.id as CalculatorMode)}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={mode === tab.id}
              aria-controls={`${tab.id}-panel`}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-amber-500 ${
                mode === tab.id
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* --- SIP TAB PANEL --- */}
        {mode === 'sip' && (
          <motion.div
            key="sip-panel"
            id="sip-panel"
            role="tabpanel"
            aria-labelledby="tab-sip"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Input range blocks & manual type fields */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Parameter 1: Monthly Investment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="sip-monthly" className="text-slate-300">
                    {language === 'en' ? "Monthly Contribution" : "నెలవారీ పెట్టుబడి"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[150px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <span className="text-amber-500 font-bold font-mono text-xs mr-1">₹</span>
                    <input
                      type="number"
                      id="sip-monthly-numeric"
                      value={sipMonthly || ''}
                      onChange={(e) => setSipMonthly(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setSipMonthly(prev => clampValue(prev, FINANCIAL_LIMITS.SIP.MIN_MONTHLY, FINANCIAL_LIMITS.SIP.MAX_MONTHLY))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <input
                  id="sip-monthly"
                  type="range"
                  min={FINANCIAL_LIMITS.SIP.MIN_MONTHLY}
                  max={FINANCIAL_LIMITS.SIP.MAX_MONTHLY}
                  step="500"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{formatToINR(FINANCIAL_LIMITS.SIP.MIN_MONTHLY)}</span>
                  <span>{formatToINR(500000)}</span>
                  <span>{formatToINR(FINANCIAL_LIMITS.SIP.MAX_MONTHLY)}</span>
                </div>
              </div>

              {/* Parameter 2: Expected CAGR */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="sip-rate" className="text-slate-300">
                    {language === 'en' ? "Expected Growth Rate (p.a.)" : "ఆశించిన వార్షిక లాభం (%)"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[100px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <input
                      type="number"
                      step="0.1"
                      id="sip-rate-numeric"
                      value={sipRate || ''}
                      onChange={(e) => setSipRate(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setSipRate(prev => clampValue(prev, FINANCIAL_LIMITS.SIP.MIN_RATE, FINANCIAL_LIMITS.SIP.MAX_RATE))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-amber-500 font-bold font-mono text-xs ml-1">%</span>
                  </div>
                </div>
                <input
                  id="sip-rate"
                  type="range"
                  min={FINANCIAL_LIMITS.SIP.MIN_RATE}
                  max={FINANCIAL_LIMITS.SIP.MAX_RATE}
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{FINANCIAL_LIMITS.SIP.MIN_RATE}%</span>
                  <span>12% ({language === 'en' ? 'Equity Normal' : 'ఈక్విటీ స్టాండర్డ్'})</span>
                  <span>{FINANCIAL_LIMITS.SIP.MAX_RATE}%</span>
                </div>
              </div>

              {/* Parameter 3: Investment Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="sip-years" className="text-slate-300">
                    {language === 'en' ? "Investment Tenure" : "పెట్టుబడి కాలవ్యవధి"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[120px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <input
                      type="number"
                      id="sip-years-numeric"
                      value={sipYears || ''}
                      onChange={(e) => setSipYears(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setSipYears(prev => clampValue(prev, FINANCIAL_LIMITS.SIP.MIN_YEARS, FINANCIAL_LIMITS.SIP.MAX_YEARS))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-amber-500 font-sans text-[10px] font-bold ml-1.5 text-slate-400">
                      {language === 'en' ? 'Yrs' : 'సం.'}
                    </span>
                  </div>
                </div>
                <input
                  id="sip-years"
                  type="range"
                  min={FINANCIAL_LIMITS.SIP.MIN_YEARS}
                  max={FINANCIAL_LIMITS.SIP.MAX_YEARS}
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 {language === 'en' ? 'Year' : 'సంవత్సరం'}</span>
                  <span>20 {language === 'en' ? 'Years' : 'సంవత్సరాలు'}</span>
                  <span>{FINANCIAL_LIMITS.SIP.MAX_YEARS} {language === 'en' ? 'Years' : 'సంవత్సరాలు'}</span>
                </div>
              </div>

              {/* Upgraded Step-up SIP Options Toggle & Controls */}
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="toggle-sip-stepup"
                      checked={isStepUpEnabled}
                      onChange={(e) => setIsStepUpEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 bg-slate-950 border-slate-800 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="toggle-sip-stepup" className="text-xs font-bold text-slate-200 select-none cursor-pointer flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {language === 'en' ? "Enable Annual Step-up SIP" : "వార్షిక స్టెప్-అప్ SIP ని సక్రియం చేయండి"}
                    </label>
                  </div>
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                    {language === 'en' ? "Wealth Booster" : "సంపద బూస్టర్"}
                  </span>
                </div>

                {isStepUpEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-2 border-t border-slate-800/60"
                  >
                    <div className="flex justify-between items-center text-xs font-medium">
                      <label htmlFor="sip-stepup" className="text-slate-300">
                        {language === 'en' ? "Annual Step-up Increment" : "వార్షిక పెంపుదల శాతం"}
                      </label>
                      <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 max-w-[80px]">
                        <input
                          type="number"
                          id="sip-stepup-numeric"
                          value={sipStepUp || ''}
                          onChange={(e) => setSipStepUp(e.target.value === '' ? 0 : Number(e.target.value))}
                          onBlur={() => setSipStepUp(prev => clampValue(prev, FINANCIAL_LIMITS.SIP.MIN_STEP_UP, FINANCIAL_LIMITS.SIP.MAX_STEP_UP))}
                          className="w-full bg-transparent text-amber-500 font-mono text-right text-xs font-bold border-none outline-none focus:ring-0 p-0"
                        />
                        <span className="text-amber-500 font-mono text-xs ml-1">%</span>
                      </div>
                    </div>
                    <input
                      id="sip-stepup"
                      type="range"
                      min={FINANCIAL_LIMITS.SIP.MIN_STEP_UP}
                      max={FINANCIAL_LIMITS.SIP.MAX_STEP_UP}
                      step="1"
                      value={sipStepUp}
                      onChange={(e) => setSipStepUp(Number(e.target.value))}
                      className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">
                      {language === 'en' 
                        ? "Increasing savings by 10% each year doubles the terminal corpus size over long periods with minimal cash flow friction."
                        : "ప్రతి సంవత్సరం పొదుపును 10% పెంచడం వల్ల మీ కాలపరిమితి పూర్తయ్యే సరికి నిధి రెట్టింపు అవుతుంది."}
                    </p>
                  </motion.div>
                )}
              </div>

            </div>

            {/* Calculations Display CARD */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    {language === 'en' ? "Total Contributions" : "మొత్తం మీ పెట్టుబడి"}
                  </p>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{formatToINR(sipDetails.totalInvested)}</h4>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    <span>{language === 'en' ? "Compounded Yield" : "అంచనా లాభాలు"}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold font-mono text-emerald-400">{formatToINR(sipDetails.estimatedReturns)}</h4>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] tracking-wider text-amber-500 uppercase font-bold mb-1">
                    {language === 'en' ? "Projected Total Value" : "మొత్తం నిధి విలువ"}
                  </p>
                  <h4 className="text-2xl font-black font-mono text-amber-400">{formatToINR(sipDetails.totalValue)}</h4>
                </div>
              </div>

              {/* Progress Composition bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.max(10, Math.min(90, (sipDetails.totalInvested / Math.max(1, sipDetails.totalValue)) * 100))}%` }} 
                    className="bg-amber-500 h-full transition-all duration-300"
                  />
                  <div className="flex-1 bg-emerald-500 h-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 font-medium font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> 
                    {language === 'en' ? "Principal" : "అసలు"}: {((sipDetails.totalInvested / Math.max(1, sipDetails.totalValue)) * 100).toFixed(0)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> 
                    {language === 'en' ? "Earnings" : "లాభం"}: {((sipDetails.estimatedReturns / Math.max(1, sipDetails.totalValue)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- LUMPSUM TAB PANEL --- */}
        {mode === 'lumpsum' && (
          <motion.div
            key="lumpsum-panel"
            id="lumpsum-panel"
            role="tabpanel"
            aria-labelledby="tab-lumpsum"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Input range blocks & manual input */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Parameter 1: Lump Sum Invested */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="lumpsum-amount" className="text-slate-300">
                    {language === 'en' ? "One-Time Lump Sum Invested" : "ఒకేసారి పెట్టిన పెట్టుబడి (Lumpsum)"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[170px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <span className="text-amber-500 font-bold font-mono text-xs mr-1">₹</span>
                    <input
                      type="number"
                      id="lumpsum-amount-numeric"
                      value={lumpsumAmount || ''}
                      onChange={(e) => setLumpsumAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setLumpsumAmount(prev => clampValue(prev, FINANCIAL_LIMITS.LUMPSUM.MIN_AMOUNT, FINANCIAL_LIMITS.LUMPSUM.MAX_AMOUNT))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <input
                  id="lumpsum-amount"
                  type="range"
                  min={FINANCIAL_LIMITS.LUMPSUM.MIN_AMOUNT}
                  max={FINANCIAL_LIMITS.LUMPSUM.MAX_AMOUNT}
                  step="5000"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{formatToINR(FINANCIAL_LIMITS.LUMPSUM.MIN_AMOUNT)}</span>
                  <span>{language === 'en' ? "₹50 Lakhs" : "₹50 లక్షలు"}</span>
                  <span>{formatToINR(FINANCIAL_LIMITS.LUMPSUM.MAX_AMOUNT)}</span>
                </div>
              </div>

              {/* Parameter 2: Annual CAGR */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="lumpsum-rate" className="text-slate-300">
                    {language === 'en' ? "Expected Annual CAGR (%)" : "ఆశించిన వార్షిక చక్రవడ్డీ రేటు (%)"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[100px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <input
                      type="number"
                      step="0.1"
                      id="lumpsum-rate-numeric"
                      value={lumpsumRate || ''}
                      onChange={(e) => setLumpsumRate(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setLumpsumRate(prev => clampValue(prev, FINANCIAL_LIMITS.LUMPSUM.MIN_RATE, FINANCIAL_LIMITS.LUMPSUM.MAX_RATE))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-amber-500 font-bold font-mono text-xs ml-1">%</span>
                  </div>
                </div>
                <input
                  id="lumpsum-rate"
                  type="range"
                  min={FINANCIAL_LIMITS.LUMPSUM.MIN_RATE}
                  max={FINANCIAL_LIMITS.LUMPSUM.MAX_RATE}
                  step="0.5"
                  value={lumpsumRate}
                  onChange={(e) => setLumpsumRate(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{FINANCIAL_LIMITS.LUMPSUM.MIN_RATE}%</span>
                  <span>12% ({language === 'en' ? 'Balanced' : 'సమతుల్యమైనది'})</span>
                  <span>{FINANCIAL_LIMITS.LUMPSUM.MAX_RATE}%</span>
                </div>
              </div>

              {/* Parameter 3: Investment Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="lumpsum-years" className="text-slate-300">
                    {language === 'en' ? "Investment Tenure" : "పెట్టుబడి కాలవ్యవధి"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[120px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <input
                      type="number"
                      id="lumpsum-years-numeric"
                      value={lumpsumYears || ''}
                      onChange={(e) => setLumpsumYears(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setLumpsumYears(prev => clampValue(prev, FINANCIAL_LIMITS.LUMPSUM.MIN_YEARS, FINANCIAL_LIMITS.LUMPSUM.MAX_YEARS))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-amber-500 font-sans text-[10px] font-bold ml-1.5 text-slate-400">
                      {language === 'en' ? 'Yrs' : 'సం.'}
                    </span>
                  </div>
                </div>
                <input
                  id="lumpsum-years"
                  type="range"
                  min={FINANCIAL_LIMITS.LUMPSUM.MIN_YEARS}
                  max={FINANCIAL_LIMITS.LUMPSUM.MAX_YEARS}
                  step="1"
                  value={lumpsumYears}
                  onChange={(e) => setLumpsumYears(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 {language === 'en' ? 'Year' : 'సంవత్సరం'}</span>
                  <span>20 {language === 'en' ? 'Years' : 'సంవత్సరాలు'}</span>
                  <span>{FINANCIAL_LIMITS.LUMPSUM.MAX_YEARS} {language === 'en' ? 'Years' : 'సంవత్సరాలు'}</span>
                </div>
              </div>
            </div>

            {/* Calculations Display CARD */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    {language === 'en' ? "Initial Premium Capital" : "ప్రారంభ అసలు పెట్టుబడి"}
                  </p>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{formatToINR(lumpsumDetails.totalInvested)}</h4>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    <span>{language === 'en' ? "Generational Compound Yield" : "మొత్తం చక్రవడ్డీ లాభాలు"}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold font-mono text-emerald-400">{formatToINR(lumpsumDetails.estimatedReturns)}</h4>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] tracking-wider text-amber-500 uppercase font-bold mb-1">
                    {language === 'en' ? "Projected Total Wealth" : "మొత్తం సృష్టించబడిన సంపద"}
                  </p>
                  <h4 className="text-2xl font-black font-mono text-amber-400">{formatToINR(lumpsumDetails.totalValue)}</h4>
                </div>
              </div>

              {/* Progress Composition bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.max(10, Math.min(90, (lumpsumDetails.totalInvested / Math.max(1, lumpsumDetails.totalValue)) * 100))}%` }} 
                    className="bg-amber-500 h-full transition-all duration-300"
                  />
                  <div className="flex-1 bg-emerald-500 h-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 font-medium font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> 
                    {language === 'en' ? "Principal" : "అసలు"}: {((lumpsumDetails.totalInvested / Math.max(1, lumpsumDetails.totalValue)) * 100).toFixed(0)}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> 
                    {language === 'en' ? "Earnings" : "లాభం"}: {((lumpsumDetails.estimatedReturns / Math.max(1, lumpsumDetails.totalValue)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- SWP TAB PANEL --- */}
        {mode === 'swp' && (
          <motion.div
            key="swp-panel"
            id="swp-panel"
            role="tabpanel"
            aria-labelledby="tab-swp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Input range blocks & manual types */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Parameter 1: Total Initial Capital */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="swp-capital" className="text-slate-300">
                    {language === 'en' ? "Total Mutual Capital Pool" : "మొత్తం అసలు నిధి (Capital Pool)"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[170px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <span className="text-amber-500 font-bold font-mono text-xs mr-1">₹</span>
                    <input
                      type="number"
                      id="swp-capital-numeric"
                      value={swpCapital || ''}
                      onChange={(e) => setSwpCapital(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setSwpCapital(prev => clampValue(prev, FINANCIAL_LIMITS.SWP.MIN_CAPITAL, FINANCIAL_LIMITS.SWP.MAX_CAPITAL))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <input
                  id="swp-capital"
                  type="range"
                  min={FINANCIAL_LIMITS.SWP.MIN_CAPITAL}
                  max={FINANCIAL_LIMITS.SWP.MAX_CAPITAL}
                  step="50000"
                  value={swpCapital}
                  onChange={(e) => setSwpCapital(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{formatToINR(FINANCIAL_LIMITS.SWP.MIN_CAPITAL)}</span>
                  <span>{language === 'en' ? "₹50 Lakhs" : "₹50 లక్షలు"}</span>
                  <span>{formatToINR(FINANCIAL_LIMITS.SWP.MAX_CAPITAL)}</span>
                </div>
              </div>

              {/* Parameter 2: Periodic Monthly Withdrawal */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label htmlFor="swp-withdrawal" className="text-slate-300">
                    {language === 'en' ? "Periodic Monthly Withdrawal" : "నెలవారీ ఉపసంహరణ మొత్తం (SWP)"}
                  </label>
                  <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 max-w-[150px] focus-within:border-amber-500/80 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                    <span className="text-amber-500 font-bold font-mono text-xs mr-1">₹</span>
                    <input
                      type="number"
                      id="swp-withdrawal-numeric"
                      value={swpWithdrawal || ''}
                      onChange={(e) => setSwpWithdrawal(e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={() => setSwpWithdrawal(prev => clampValue(prev, FINANCIAL_LIMITS.SWP.MIN_WITHDRAWAL, FINANCIAL_LIMITS.SWP.MAX_WITHDRAWAL))}
                      className="w-full bg-transparent text-amber-500 font-mono text-right text-sm font-bold border-none outline-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <input
                  id="swp-withdrawal"
                  type="range"
                  min={FINANCIAL_LIMITS.SWP.MIN_WITHDRAWAL}
                  max={FINANCIAL_LIMITS.SWP.MAX_WITHDRAWAL}
                  step="1000"
                  value={swpWithdrawal}
                  onChange={(e) => setSwpWithdrawal(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus-visible:ring-1 focus-visible:ring-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{formatToINR(FINANCIAL_LIMITS.SWP.MIN_WITHDRAWAL)}</span>
                  <span>{language === 'en' ? "₹1 Lakh" : "₹1 లక్ష"}</span>
                  <span>{formatToINR(FINANCIAL_LIMITS.SWP.MAX_WITHDRAWAL)}</span>
                </div>
              </div>

              {/* Sub-group layout for Rate & Tenure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Rate Slider & Manual Type */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                    <label htmlFor="swp-rate">{language === 'en' ? "Expected Returns (%)" : "ఆశించిన లాభం (%)"}</label>
                    <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 max-w-[80px]">
                      <input
                        type="number"
                        step="0.1"
                        id="swp-rate-numeric"
                        value={swpRate || ''}
                        onChange={(e) => setSwpRate(e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={() => setSwpRate(prev => clampValue(prev, FINANCIAL_LIMITS.SWP.MIN_RATE, FINANCIAL_LIMITS.SWP.MAX_RATE))}
                        className="w-full bg-transparent text-amber-500 font-mono text-right text-xs font-bold border-none outline-none focus:ring-0 p-0"
                      />
                      <span className="text-amber-500 font-mono text-xs ml-1">%</span>
                    </div>
                  </div>
                  <input
                    id="swp-rate"
                    type="range"
                    min={FINANCIAL_LIMITS.SWP.MIN_RATE}
                    max={FINANCIAL_LIMITS.SWP.MAX_RATE}
                    step="0.5"
                    value={swpRate}
                    onChange={(e) => setSwpRate(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Tenure Slider & Manual Type */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                    <label htmlFor="swp-years">{language === 'en' ? "Withdrawal Tenure" : "ఉపసంహరణ కాలవ్యవధి"}</label>
                    <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 max-w-[90px]">
                      <input
                        type="number"
                        id="swp-years-numeric"
                        value={swpYears || ''}
                        onChange={(e) => setSwpYears(e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={() => setSwpYears(prev => clampValue(prev, FINANCIAL_LIMITS.SWP.MIN_YEARS, FINANCIAL_LIMITS.SWP.MAX_YEARS))}
                        className="w-full bg-transparent text-amber-500 font-mono text-right text-xs font-bold border-none outline-none focus:ring-0 p-0"
                      />
                      <span className="text-slate-400 font-mono text-[10px] ml-1">{language === 'en' ? 'Yrs' : 'సం.'}</span>
                    </div>
                  </div>
                  <input
                    id="swp-years"
                    type="range"
                    min={FINANCIAL_LIMITS.SWP.MIN_YEARS}
                    max={FINANCIAL_LIMITS.SWP.MAX_YEARS}
                    step="1"
                    value={swpYears}
                    onChange={(e) => setSwpYears(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* Calculations Display CARD */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    {language === 'en' ? "Total Initial Nest-Egg" : "ప్రారంభ అసలు పెట్టుబడి నిధి"}
                  </p>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{formatToINR(swpDetails.totalInvested)}</h4>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    <span>{language === 'en' ? "Total Withdrawals Disbursed" : "మొత్తం వెనక్కి తీసుకున్న సొమ్ము"}</span>
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold font-mono text-emerald-400">{formatToINR(swpDetails.totalWithdrawn)}</h4>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] tracking-wider text-amber-550 uppercase font-bold mb-1">
                    {language === 'en' ? "Remaining Account Balance" : "మిగిలిన నిధి సంపద"}
                  </p>
                  <h4 className="text-2xl font-black font-mono text-amber-400">{formatToINR(swpDetails.finalBalance)}</h4>
                </div>
              </div>

              {/* Warnings or depletion metrics if the fund clears out quickly */}
              {swpDetails.isDepleted ? (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 text-rose-300 rounded-lg text-[11px] leading-relaxed">
                  {language === 'en' ? (
                    <>⚠️ Fund Depleted Early! Nest-egg capital was completely exhausted in <strong className="text-white font-semibold">{swpDetails.yearsLasted} years and {swpDetails.remainingMonthsLasted} months</strong>. Try enlarging starting Capital or reducing monthly withdrawals.</>
                  ) : (
                    <>⚠️ నిధి త్వరగా అయిపోయింది! ప్రారంభ అసలు నిధి <strong className="text-white font-semibold">{swpDetails.yearsLasted} సంవత్సరాలు మరియు {swpDetails.remainingMonthsLasted} నెలల్లో</strong> పూర్తిగా ఖర్చయింది. ప్రారంభ నిధిని పెంచడానికి లేదా నెలవారీ విత్‌డ్రాలను తగ్గించడానికి ప్రయత్నించండి.</>
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] leading-relaxed">
                  {language === 'en' ? (
                    <>✓ Safe Withdrawal Stream! Capital successfully sustains withdrawals throughout the entire <strong className="text-white font-semibold">{swpYears} Years</strong> period, leaving a compounding balance cushion.</>
                  ) : (
                    <>✓ సురక్షితమైన ఉపసంహరణ విధానం! ఎంచుకున్న <strong className="text-white font-semibold">{swpYears} సంవత్సరాల</strong> పాటు ఈ నిధి విజయవంతంగా నెలవారీ ఆదాయాన్ని అందిస్తూ, చివరికి అదనపు సంపదను కూడా మిగులుస్తుంది.</>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* --- COMPOUNDING OPPORTUNITY COST TAB PANEL --- */}
        {mode === 'compounding' && (
          <motion.div
            key="compounding-panel"
            id="compounding-panel"
            role="tabpanel"
            aria-labelledby="tab-compounding"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders on Left Side */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-500 font-mono tracking-wider uppercase mb-2">
                    {language === 'en' ? "The Opportunity Cost of Delay" : "ఆలస్యం చేయడం వల్ల కలిగే భారీ నష్టం"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {language === 'en' ? (
                      <>Compare starting to save at age <strong className="text-emerald-400">25</strong> (Early) vs. age <strong className="text-amber-500">35</strong> (Late). Both save the exact same monthly amount until retirement at <strong className="text-white">60</strong>. See how a brief 10-year headstart expands final corpus values by more than 300%.</>
                    ) : (
                      <>వయస్సు <strong className="text-emerald-400">25</strong> సంవత్సరాల నుండే పొదుపు చేయడం (త్వరగా) మరియు <strong className="text-amber-500">35</strong> సంవత్సరాల వయస్సులో ప్రారంభించడం (ఆలస్యంగా) మధ్య వ్యత్యాసాన్ని పోల్చండి. ఇద్దరూ రిటైర్మెంట్ వయస్సు <strong className="text-white">60</strong> వచ్చే వరకు నెలకు ఒకే మొత్తాన్ని పొదుపు చేస్తారు. కేవలం ఈ 10 సంవత్సరాల త్వరగా ప్రారంభం మీ చివరి నిధిని 300% కంటే ఎక్కువగా ఎలా పెంచుతుందో చూడండి.</>
                    )}
                  </p>
                </div>

                {/* Contribution field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <label htmlFor="compounding-monthly" className="text-slate-300 font-sans">
                      {language === 'en' ? "Monthly Contribution" : "నెలవారీ పెట్టుబడి"}
                    </label>
                    <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 max-w-[120px]">
                      <span className="text-amber-500 font-bold font-mono text-xs mr-1">₹</span>
                      <input
                        type="number"
                        id="compounding-monthly-numeric"
                        value={compoundingMonthly || ''}
                        onChange={(e) => setCompoundingMonthly(e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={() => setCompoundingMonthly(prev => clampValue(prev, FINANCIAL_LIMITS.COMPOUNDING.MIN_MONTHLY, FINANCIAL_LIMITS.COMPOUNDING.MAX_MONTHLY))}
                        className="w-full bg-transparent text-amber-500 font-mono text-right text-xs font-bold border-none outline-none focus:ring-0 p-0"
                      />
                    </div>
                  </div>
                  <input
                    id="compounding-monthly"
                    type="range"
                    min={FINANCIAL_LIMITS.COMPOUNDING.MIN_MONTHLY}
                    max={FINANCIAL_LIMITS.COMPOUNDING.MAX_MONTHLY}
                    step="1000"
                    value={compoundingMonthly}
                    onChange={(e) => setCompoundingMonthly(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{formatToINR(FINANCIAL_LIMITS.COMPOUNDING.MIN_MONTHLY)}</span>
                    <span>{formatToINR(FINANCIAL_LIMITS.COMPOUNDING.MAX_MONTHLY)}</span>
                  </div>
                </div>

                {/* CAGR field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <label htmlFor="compounding-rate" className="text-slate-300 font-sans">
                      {language === 'en' ? "Expected CAGR (%)" : "ఆశించిన వార్షిక చక్రవడ్డీ రేటు (%)"}
                    </label>
                    <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 max-w-[80px]">
                      <input
                        type="number"
                        step="0.1"
                        id="compounding-rate-numeric"
                        value={compoundingRate || ''}
                        onChange={(e) => setCompoundingRate(e.target.value === '' ? 0 : Number(e.target.value))}
                        onBlur={() => setCompoundingRate(prev => clampValue(prev, FINANCIAL_LIMITS.COMPOUNDING.MIN_RATE, FINANCIAL_LIMITS.COMPOUNDING.MAX_RATE))}
                        className="w-full bg-transparent text-amber-500 font-mono text-right text-xs font-bold border-none outline-none focus:ring-0 p-0"
                      />
                      <span className="text-amber-500 font-mono text-xs ml-1">%</span>
                    </div>
                  </div>
                  <input
                    id="compounding-rate"
                    type="range"
                    min={FINANCIAL_LIMITS.COMPOUNDING.MIN_RATE}
                    max={FINANCIAL_LIMITS.COMPOUNDING.MAX_RATE}
                    step="0.5"
                    value={compoundingRate}
                    onChange={(e) => setCompoundingRate(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{FINANCIAL_LIMITS.COMPOUNDING.MIN_RATE}%</span>
                    <span>12% ({language === 'en' ? 'Balanced Equity' : 'సమతుల్య ఈక్విటీ'})</span>
                    <span>{FINANCIAL_LIMITS.COMPOUNDING.MAX_RATE}%</span>
                  </div>
                </div>
              </div>

              {/* Chart on Right Side */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                    {language === 'en' ? "Wealth Growth Comparison Timeline" : "సంపద వృద్ధి పోలిక కాలరేఖ"}
                  </h4>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold uppercase border border-emerald-500/20">Recharts Engine</span>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={compoundingData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorEarly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="age" stroke="#94a3b8" fontSize={9} tickFormatter={(v) => language === 'en' ? v : v.replace('Yrs', 'సం.')} />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(v) => formatLargeShortValue(v, language)}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        labelStyle={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '10px' }}
                        itemStyle={{ color: '#fff', fontSize: '11px', padding: '1px 0' }}
                        labelFormatter={(label) => language === 'en' ? label : String(label).replace('Yrs', 'సంవత్సరాలు')}
                        formatter={(value) => [formatToINR(Number(value)), ""]}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        iconSize={8}
                      />
                      <Area 
                        name={language === 'en' ? "Early Starter (Age 25)" : "త్వరగా ప్రారంభించిన వారు (వయస్సు 25)"} 
                        type="monotone" 
                        dataKey="Early Starter (Start @ 25)" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorEarly)" 
                      />
                      <Area 
                        name={language === 'en' ? "Late Starter (Age 35)" : "ఆలస్యంగా ప్రారంభించిన వారు (వయస్సు 35)"} 
                        type="monotone" 
                        dataKey="Late Starter (Start @ 35)" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorLate)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Columns layout (row based) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="block text-[10px] font-mono tracking-wider text-emerald-400 font-extrabold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {language === 'en' ? "1. Early Starter (25-60)" : "1. త్వరగా ప్రారంభించిన వారు (25-60)"}
                </span>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400">{language === 'en' ? "Estimated Retirement Wealth" : "రిటైర్మెంట్ నాటికి అంచనా నిధి"}:</p>
                  <h5 className="text-xl font-bold font-mono text-slate-100">
                    {formatToINR(compoundingData[7]["Early Starter (Start @ 25)"])}
                  </h5>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  <span>{language === 'en' ? "Invested" : "పెట్టుబడి"}: {formatToINR(compoundingData[7]["Early Invested"])}</span>
                  <span>{language === 'en' ? "Gains" : "లాభం"}: {formatToINR(Math.max(0, compoundingData[7]["Early Starter (Start @ 25)"] - compoundingData[7]["Early Invested"]))}</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="block text-[10px] font-mono tracking-wider text-amber-500 font-extrabold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> {language === 'en' ? "2. Late Starter (35-60)" : "2. ఆలస్యంగా ప్రారంభించిన వారు (35-60)"}
                </span>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400">{language === 'en' ? "Estimated Retirement Wealth" : "రిటైర్మెంట్ నాటికి అంచనా నిధి"}:</p>
                  <h5 className="text-xl font-bold font-mono text-slate-100">
                    {formatToINR(compoundingData[7]["Late Starter (Start @ 35)"])}
                  </h5>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  <span>{language === 'en' ? "Invested" : "పెట్టుబడి"}: {formatToINR(compoundingData[7]["Late Invested"])}</span>
                  <span>{language === 'en' ? "Gains" : "లాభం"}: {formatToINR(Math.max(0, compoundingData[7]["Late Starter (Start @ 35)"] - compoundingData[7]["Late Invested"]))}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-600/10 to-slate-950 border border-amber-600/20 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] font-mono tracking-widest text-amber-500 font-extrabold uppercase">
                    {language === 'en' ? "THE COMPOUNDING PREMIUM" : "చక్రవడ్డీ అదనపు ప్రయోజనం"}
                  </span>
                  <p className="text-[10px] text-slate-300 leading-normal mt-1">
                    {language === 'en' ? (
                      <>By starting just 10 years earlier, your final corpus expands by over <strong>3x more wealth</strong>, yielding an Early Advantage dividend of:</>
                    ) : (
                      <>కేవలం 10 సంవత్సరాలు ముందుగా ప్రారంభించడం ద్వారా, మీ మొత్తం నిధి <strong>3 రెట్లు అధిక సంపదగా</strong> మారుతుంది. దీనివల్ల పొందే అదనపు లాభం:</>
                    )}
                  </p>
                </div>
                <div className="pt-2">
                  <h5 className="text-2xl font-black font-mono text-amber-400">
                    {formatToINR(
                      compoundingData[7]["Early Starter (Start @ 25)"] - compoundingData[7]["Late Starter (Start @ 35)"]
                    )}
                  </h5>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-amber-750 font-bold block mt-0.5">
                    {language === 'en' ? "Net Wealth Advantage" : "నికర అదనపు సంపద ప్రయోజనం"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REUSABLE COLLAPSIBLE YEARLY BREAKDOWN & AREA CHART TIMELINE --- */}
      {mode !== 'compounding' && (
        <div className="mt-8 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setShowDetailedSchedule(prev => !prev)}
            aria-expanded={showDetailedSchedule}
            className="w-full flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white rounded-xl transition-all font-bold text-xs cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
          >
            <span className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-amber-500" />
              {showDetailedSchedule 
                ? (language === 'en' ? "Hide Detailed Projections & Breakdown Schedule" : "వివరణాత్మక పట్టిక మరియు చార్ట్ దాచండి")
                : (language === 'en' ? "Show Detailed Projections Timeline & Year-by-Year Schedule 📊" : "వివరణాత్మక కాలక్రమం మరియు సంవత్సరాల వారీ పట్టిక చూడండి 📊")
              }
            </span>
            {showDetailedSchedule ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence>
            {showDetailedSchedule && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-6 pt-5"
              >
                {/* 1. Sub-tab Visualization Area Chart */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5">
                  <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 mb-4">
                    {language === 'en' ? "Growth Timeline Projection Chart" : "సంపద వృద్ధి అంచనా గ్రాఫ్"}
                  </h4>
                  <div className="h-56 sm:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={activeBreakdownData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={9} 
                          tickFormatter={(v) => formatLargeShortValue(v, language)}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                          labelStyle={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '10px' }}
                          itemStyle={{ color: '#fff', fontSize: '11px', padding: '1px 0' }}
                          formatter={(value) => [formatToINR(Number(value)), ""]}
                        />
                        <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '8px' }} iconSize={8} />
                        {mode === 'swp' ? (
                          <>
                            <Area 
                              name={language === 'en' ? "Remaining Nest-Egg Balance" : "మిగిలిన నిధి సంపద"} 
                              type="monotone" 
                              dataKey="Remaining Balance" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorTotal)" 
                            />
                            <Area 
                              name={language === 'en' ? "Cumulative Withdrawals" : "మొత్తం వెనక్కి తీసుకున్న సొమ్ము"} 
                              type="monotone" 
                              dataKey="Withdrawn Capital" 
                              stroke="#f59e0b" 
                              strokeWidth={1.5}
                              fillOpacity={1} 
                              fill="url(#colorPrincipal)" 
                              strokeDasharray="4 4"
                            />
                          </>
                        ) : (
                          <>
                            <Area 
                              name={language === 'en' ? "Projected Total Value" : "మొత్తం నిధి విలువ"} 
                              type="monotone" 
                              dataKey="Total Wealth" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorTotal)" 
                            />
                            <Area 
                              name={language === 'en' ? "Total Contributions" : "మొత్తం పెట్టుబడి"} 
                              type="monotone" 
                              dataKey="Invested Principal" 
                              stroke="#f59e0b" 
                              strokeWidth={1.5}
                              fillOpacity={1} 
                              fill="url(#colorPrincipal)" 
                            />
                          </>
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Structured Table Matrix */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                      {language === 'en' ? "Structured Amortization Table" : "సంవత్సరాల వారీ వివరణాత్మక విశ్లేషణ పట్టిక"}
                    </span>
                    <span className="text-[9px] text-amber-500 font-mono font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {language === 'en' ? "Compounded Annually" : "వార్షిక గణన పద్ధతి"}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850">
                    <table className="w-full text-left text-xs font-mono" role="table">
                      <thead className="bg-slate-950 text-slate-400 sticky top-0 text-[10px] tracking-wider uppercase border-b border-slate-800/80">
                        {mode === 'swp' ? (
                          <tr>
                            <th className="p-3">{language === 'en' ? "Year" : "సంవత్సరం"}</th>
                            <th className="p-3 text-right">{language === 'en' ? "Cumulative Withdrawn" : "మొత్తం వెనక్కి తీసుకున్న సొమ్ము"}</th>
                            <th className="p-3 text-right">{language === 'en' ? "Closing Account Balance" : "చివరి నిధి సంపద"}</th>
                          </tr>
                        ) : (
                          <tr>
                            <th className="p-3">{language === 'en' ? "Year" : "సంవత్సరం"}</th>
                            <th className="p-3 text-right">{language === 'en' ? "Total Contributions" : "మొత్తం పెట్టుబడి"}</th>
                            <th className="p-3 text-right">{language === 'en' ? "Estimated Earnings" : "అంచనా లాభాలు"}</th>
                            <th className="p-3 text-right">{language === 'en' ? "Projected Total Value" : "మొత్తం నిధి విలువ"}</th>
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-300">
                        {mode === 'swp' ? (
                          swpDetails.yearlyBreakdown.map((row) => (
                            <tr key={row.year} className="hover:bg-slate-900/40 transition-colors">
                              <td className="p-3 font-bold text-slate-400">{row.year}</td>
                              <td className="p-3 text-right text-emerald-400">{formatToINR(row.withdrawn)}</td>
                              <td className="p-3 text-right font-bold text-amber-400">{formatToINR(row.balance)}</td>
                            </tr>
                          ))
                        ) : (
                          (mode === 'sip' ? sipDetails.yearlyBreakdown : lumpsumDetails.yearlyBreakdown).map((row) => (
                            <tr key={row.year} className="hover:bg-slate-900/40 transition-colors">
                              <td className="p-3 font-bold text-slate-400">{row.year}</td>
                              <td className="p-3 text-right">{formatToINR(row.invested)}</td>
                              <td className="p-3 text-right text-emerald-400">{formatToINR(row.earnings)}</td>
                              <td className="p-3 text-right font-bold text-amber-400">{formatToINR(row.total)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Brand Disclaimer / Expert Guidance Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          {language === 'en' ? (
            <>Note: Simulated compounding dynamics represent mathematical frameworks based on selected CAGR variables. Real-world returns depend on fund choice, market performance, and taxes. Coordinate a secure payout system with Chief Advisor <strong className="text-amber-400">D T V S SWAMY</strong> to build an optimum blueprint.</>
          ) : (
            <>గమనిక: ఈ చక్రవడ్డీ గణనలు కేవలం ఎంచుకున్న CAGR శాతాల ఆధారంగా లెక్కించబడిన గణిత నమూనాలు. వాస్తవ లాభాలు మార్కెట్ పరిస్థితులు, ఎంచుకునే ఫండ్స్ మరియు పన్నులపై ఆధారపడి ఉంటాయి. మీ అవసరాలకు తగిన ఆర్థిక ప్రణాళికను రూపొందించుకోవడానికి ప్రధాన సలహాదారు <strong className="text-amber-400">డి టి వి ఎస్ స్వామి</strong> గారిని సంప్రదించండి.</>
          )}
        </p>
      </div>
    </div>
  );
}
