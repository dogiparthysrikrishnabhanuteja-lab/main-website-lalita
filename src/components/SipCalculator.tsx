/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PiggyBank, TrendingUp, Sparkles, HelpCircle, ArrowRightLeft, DollarSign, Wallet } from 'lucide-react';
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

type CalculatorMode = 'sip' | 'lumpsum' | 'swp' | 'compounding';

export default function SipCalculator() {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<CalculatorMode>('sip');

  // Common or specific State parameters
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(15);

  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
  const [lumpsumRate, setLumpsumRate] = useState<number>(12);
  const [lumpsumYears, setLumpsumYears] = useState<number>(15);

  const [swpCapital, setSwpCapital] = useState<number>(2000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState<number>(15000);
  const [swpRate, setSwpRate] = useState<number>(8);
  const [swpYears, setSwpYears] = useState<number>(15);

  const [compoundingMonthly, setCompoundingMonthly] = useState<number>(5000);
  const [compoundingRate, setCompoundingRate] = useState<number>(12);

  // Helper inside SipCalculator to format large values on Y Axis as Lakhs/Crores
  const formatLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(1)} Cr`;
    }
    if (val >= 100000) {
      return `₹${Math.round(val / 100000)} L`;
    }
    return `₹${val}`;
  };

  // Math simulation for Early vs Late compound interest over age milestones (25 to 60)
  const generateComparisonData = () => {
    const data = [];
    const monthlyRate = compoundingRate / 12 / 100;
    
    for (let age = 25; age <= 60; age += 5) {
      // Early Starter starts at age 25
      const earlyMonths = (age - 25) * 12;
      let earlyValue = 0;
      let earlyInvested = compoundingMonthly * earlyMonths;
      if (earlyMonths > 0) {
        if (monthlyRate === 0) {
          earlyValue = earlyInvested;
        } else {
          earlyValue = compoundingMonthly * ((Math.pow(1 + monthlyRate, earlyMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        }
      }

      // Late Starter starts at age 35
      const lateMonths = Math.max(0, (age - 35) * 12);
      let lateValue = 0;
      let lateInvested = compoundingMonthly * lateMonths;
      if (lateMonths > 0) {
        if (monthlyRate === 0) {
          lateValue = lateInvested;
        } else {
          lateValue = compoundingMonthly * ((Math.pow(1 + monthlyRate, lateMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        }
      }

      data.push({
        age: `${age} Yrs`,
        "Early Starter (Start @ 25)": Math.round(earlyValue),
        "Late Starter (Start @ 35)": Math.round(lateValue),
        "Early Invested": earlyInvested,
        "Late Invested": lateInvested,
      });
    }
    return data;
  };

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Math computation for SIP
  const calculateSIPDetails = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const totalInvested = sipMonthly * months;
    
    if (monthlyRate === 0) {
      return { totalInvested, totalValue: totalInvested, estimatedReturns: 0 };
    }

    const totalValue = sipMonthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const estimatedReturns = Math.max(0, Math.round(totalValue - totalInvested));

    return {
      totalInvested,
      totalValue: Math.round(totalValue),
      estimatedReturns
    };
  };

  // 2. Math computation for Lumpsum
  const calculateLumpsumDetails = () => {
    const totalInvested = lumpsumAmount;
    const totalValue = lumpsumAmount * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
    const estimatedReturns = Math.max(0, Math.round(totalValue - totalInvested));

    return {
      totalInvested,
      totalValue: Math.round(totalValue),
      estimatedReturns
    };
  };

  // 3. Math computation for SWP
  const calculateSWPDetails = () => {
    const monthlyRate = swpRate / 12 / 100;
    const months = swpYears * 12;
    
    let currentBalance = swpCapital;
    let totalWithdrawn = 0;
    let monthsLasted = 0;
    let isDepleted = false;

    for (let i = 0; i < months; i++) {
      if (currentBalance <= 0) {
        isDepleted = true;
        break;
      }
      // Accrue monthly return segment
      currentBalance = currentBalance * (1 + monthlyRate);
      // Perform withdrawal
      if (currentBalance >= swpWithdrawal) {
        currentBalance -= swpWithdrawal;
        totalWithdrawn += swpWithdrawal;
        monthsLasted++;
      } else {
        totalWithdrawn += currentBalance;
        currentBalance = 0;
        monthsLasted++;
        isDepleted = true;
      }
    }

    return {
      totalInvested: swpCapital,
      totalWithdrawn: Math.round(totalWithdrawn),
      finalBalance: Math.round(currentBalance),
      monthsLasted,
      isDepleted,
      yearsLasted: Math.floor(monthsLasted / 12),
      remainingMonthsLasted: monthsLasted % 12
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto">
      
      {/* Dynamic Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/25">
            <PiggyBank className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              {language === 'en' ? "Mutual Funds Calculator Suite" : "మ్యూచువల్ ఫండ్స్ క్యాలిక్యులేటర్"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'en' ? "Model structured wealth creation and periodic income pathways" : "నిర్ణీత సంపద సృష్టి మరియు ఆదాయ మార్గాలను అంచనా వేయండి"}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto gap-0.5 shrink-0">
          {[
            { id: 'sip', name: 'SIP' },
            { id: 'lumpsum', name: language === 'en' ? 'Lumpsum' : 'లంప్‌సమ్' },
            { id: 'swp', name: 'SWP' },
            { id: 'compounding', name: language === 'en' ? 'Early vs Late Start ⚡' : 'త్వరగా vs ఆలస్యంగా ⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as CalculatorMode)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer outline-none ${
                mode === tab.id
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'sip' && (
          <motion.div
            key="sip-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Input range blocks */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Monthly Contribution</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{formatCurrency(sipMonthly)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹500</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Expected Growth Rate (p.a.)</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{sipRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1%</span>
                  <span>12% (Equity Standard)</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Investment Tenure</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{sipYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 Year</span>
                  <span>20 Years</span>
                  <span>40 Years</span>
                </div>
              </div>
            </div>

            {/* Calculations Display */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">Total Contributions</p>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{formatCurrency(calculateSIPDetails().totalInvested)}</h4>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    <span>Compounded Yield</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold font-mono text-emerald-400">{formatCurrency(calculateSIPDetails().estimatedReturns)}</h4>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] tracking-wider text-amber-500 uppercase font-bold mb-1">Projected Total Value</p>
                  <h4 className="text-2xl font-black font-mono text-amber-400">{formatCurrency(calculateSIPDetails().totalValue)}</h4>
                </div>
              </div>

              {/* Progress Composition bar */}
              <div className="mt-8 space-y-2">
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.max(15, (calculateSIPDetails().totalInvested / calculateSIPDetails().totalValue) * 100)}%` }} 
                    className="bg-amber-500 h-full transition-all duration-300"
                  />
                  <div className="flex-1 bg-emerald-500 h-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-200 font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> Principal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> Earnings</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'lumpsum' && (
          <motion.div
            key="lumpsum-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Input range blocks */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">One-Time Lump Sum Invested</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{formatCurrency(lumpsumAmount)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="5000000"
                  step="5000"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹5k</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Expected Annual CAGR (%)</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{lumpsumRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={lumpsumRate}
                  onChange={(e) => setLumpsumRate(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1%</span>
                  <span>12% (Balanced)</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Investment tenure</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{lumpsumYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={lumpsumYears}
                  onChange={(e) => setLumpsumYears(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 Year</span>
                  <span>20 Years</span>
                  <span>40 Years</span>
                </div>
              </div>
            </div>

            {/* Calculations Display */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">Initial Premium Capital</p>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{formatCurrency(calculateLumpsumDetails().totalInvested)}</h4>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    <span>Generational Compound Yield</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold font-mono text-emerald-400">{formatCurrency(calculateLumpsumDetails().estimatedReturns)}</h4>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] tracking-wider text-amber-500 uppercase font-bold mb-1">Projected Total Wealth</p>
                  <h4 className="text-2xl font-black font-mono text-amber-400">{formatCurrency(calculateLumpsumDetails().totalValue)}</h4>
                </div>
              </div>

              {/* Progress Composition bar */}
              <div className="mt-8 space-y-2">
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.max(15, (calculateLumpsumDetails().totalInvested / calculateLumpsumDetails().totalValue) * 100)}%` }} 
                    className="bg-amber-500 h-full transition-all duration-300"
                  />
                  <div className="flex-1 bg-emerald-500 h-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-200 font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> Principal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> Earnings</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {mode === 'swp' && (
          <motion.div
            key="swp-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Input range blocks */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Total Mutual Loan Capital Pool</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{formatCurrency(swpCapital)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="50000"
                  value={swpCapital}
                  onChange={(e) => setSwpCapital(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹50k</span>
                  <span>₹50 Lakhs</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-300">Periodic Monthly Withdrawal</span>
                  <span className="text-amber-500 font-mono text-base font-bold">{formatCurrency(swpWithdrawal)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="200000"
                  step="1000"
                  value={swpWithdrawal}
                  onChange={(e) => setSwpWithdrawal(Number(e.target.value))}
                  className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹1,000</span>
                  <span>₹1 Lakh</span>
                  <span>₹2 Lakhs / Mo</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                    <span>Expected Returns (%)</span>
                    <span className="text-amber-500 font-mono font-bold">{swpRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="18"
                    step="0.5"
                    value={swpRate}
                    onChange={(e) => setSwpRate(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                    <span>Withdrawal Tenure</span>
                    <span className="text-amber-500 font-mono font-bold">{swpYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={swpYears}
                    onChange={(e) => setSwpYears(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Display for SWP */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">Total Initial Nest-Egg</p>
                  <h4 className="text-lg font-bold font-mono text-slate-100">{formatCurrency(calculateSWPDetails().totalInvested)}</h4>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400 uppercase font-bold mb-1">
                    <span>Total Withdrawals Disbursed</span>
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold font-mono text-emerald-400">{formatCurrency(calculateSWPDetails().totalWithdrawn)}</h4>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] tracking-wider text-amber-550 uppercase font-bold mb-1">Remaining Account Balance</p>
                  <h4 className="text-2xl font-black font-mono text-amber-400">{formatCurrency(calculateSWPDetails().finalBalance)}</h4>
                </div>
              </div>

              {/* Warnings or depletion metrics if the fund clears out quickly */}
              {calculateSWPDetails().isDepleted ? (
                <div className="mt-6 p-3.5 bg-red-500/15 border border-red-500/30 text-rose-300 rounded-lg text-[11px] leading-relaxed">
                  ⚠️ Fund Depleted Early! Nest-egg capital was completely exhausted in <strong className="text-white font-semibold">{calculateSWPDetails().yearsLasted} years and {calculateSWPDetails().remainingMonthsLasted} months</strong>. Try enlarging starting Capital or reducing monthly withdrawals.
                </div>
              ) : (
                <div className="mt-6 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] leading-relaxed">
                  ✓ Safe Withdrawal Stream! Capital successfully sustains withdrawals throughout the entire <strong className="text-white font-semibold">{swpYears} Years</strong> period, leaving a compounding balance cushion.
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {mode === 'compounding' && (
          <motion.div
            key="compounding-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders on Left Side */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-500 font-mono tracking-wider uppercase mb-2">The Opportunity Cost</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Compare starting to save at age <strong className="text-emerald-400">25</strong> (Early) vs. age <strong className="text-amber-500">35</strong> (Late). Both save the exact same monthly amount until retirement at <strong className="text-white">60</strong>. See how a brief 10-year headstart expands final corpus values by more than 300%.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-300 font-sans">Monthly Contribution</span>
                    <span className="text-amber-500 font-mono text-sm font-bold">{formatCurrency(compoundingMonthly)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={compoundingMonthly}
                    onChange={(e) => setCompoundingMonthly(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹1,000</span>
                    <span>₹25,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-300 font-sans">Expected CAGR (%)</span>
                    <span className="text-amber-500 font-mono text-sm font-bold">{compoundingRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="18"
                    step="0.5"
                    value={compoundingRate}
                    onChange={(e) => setCompoundingRate(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>5%</span>
                    <span>12% (Balanced Equity)</span>
                    <span>18%</span>
                  </div>
                </div>
              </div>

              {/* Chart on Right Side */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">Wealth Growth Comparison Timeline</h4>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold uppercase border border-emerald-500/20">Recharts Engine</span>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={generateComparisonData()}
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
                      <XAxis dataKey="age" stroke="#94a3b8" fontSize={9} />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(v) => formatLakhs(v)}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        labelStyle={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '10px' }}
                        itemStyle={{ color: '#fff', fontSize: '11px', padding: '1px 0' }}
                        formatter={(value) => [formatCurrency(Number(value)), ""]}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        iconSize={8}
                      />
                      <Area 
                        name="Early Starter (Age 25)" 
                        type="monotone" 
                        dataKey="Early Starter (Start @ 25)" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorEarly)" 
                      />
                      <Area 
                        name="Late Starter (Age 35)" 
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
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> 1. Early Starter (25-60)
                </span>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400">Estimated Retirement Wealth:</p>
                  <h5 className="text-xl font-bold font-mono text-slate-100">
                    {formatCurrency(generateComparisonData()[7]["Early Starter (Start @ 25)"])}
                  </h5>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  <span>Invested: {formatCurrency(generateComparisonData()[7]["Early Invested"])}</span>
                  <span>Compound Gains: {formatCurrency(Math.max(0, generateComparisonData()[7]["Early Starter (Start @ 25)"] - generateComparisonData()[7]["Early Invested"]))}</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="block text-[10px] font-mono tracking-wider text-amber-500 font-extrabold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 2. Late Starter (35-60)
                </span>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400">Estimated Retirement Wealth:</p>
                  <h5 className="text-xl font-bold font-mono text-slate-100">
                    {formatCurrency(generateComparisonData()[7]["Late Starter (Start @ 35)"])}
                  </h5>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                  <span>Invested: {formatCurrency(generateComparisonData()[7]["Late Invested"])}</span>
                  <span>Compound Gains: {formatCurrency(Math.max(0, generateComparisonData()[7]["Late Starter (Start @ 35)"] - generateComparisonData()[7]["Late Invested"]))}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-600/10 to-slate-950 border border-amber-600/20 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] font-mono tracking-widest text-amber-500 font-extrabold uppercase">THE COMPOUNDING PREMIUM</span>
                  <p className="text-[10px] text-slate-300 leading-normal mt-1">
                    By starting just 10 years earlier, your final corpus expands by over <strong>3x more wealth</strong>, yielding an Early Advantage dividend of:
                  </p>
                </div>
                <div className="pt-2">
                  <h5 className="text-2xl font-black font-mono text-amber-400">
                    {formatCurrency(
                      generateComparisonData()[7]["Early Starter (Start @ 25)"] - generateComparisonData()[7]["Late Starter (Start @ 35)"]
                    )}
                  </h5>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-amber-700 font-bold block mt-0.5">Net Wealth Advantage</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-4 border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          Note: Simulated compounding dynamics represent mathematical frameworks based on selected CAGR variables. Real-world returns depend on fund choice, market performance, and taxes. Coordinate a secure payout system with Chief Advisor <strong className="text-amber-400">D T V S SWAMY</strong> to build an optimum blueprint.
        </p>
      </div>
    </div>
  );
}
