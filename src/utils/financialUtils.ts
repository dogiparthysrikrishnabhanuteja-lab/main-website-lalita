/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Financial Calculation Constants and Limits
export const FINANCIAL_LIMITS = {
  SIP: {
    MIN_MONTHLY: 100,
    MAX_MONTHLY: 1000000, // 10 Lakhs
    DEFAULT_MONTHLY: 5000,
    MIN_RATE: 0,
    MAX_RATE: 50,
    DEFAULT_RATE: 12,
    MIN_YEARS: 1,
    MAX_YEARS: 40,
    DEFAULT_YEARS: 15,
    MIN_STEP_UP: 1,
    MAX_STEP_UP: 50,
    DEFAULT_STEP_UP: 10,
  },
  LUMPSUM: {
    MIN_AMOUNT: 1000,
    MAX_AMOUNT: 100000000, // 10 Crores
    DEFAULT_AMOUNT: 100000,
    MIN_RATE: 0,
    MAX_RATE: 50,
    DEFAULT_RATE: 12,
    MIN_YEARS: 1,
    MAX_YEARS: 40,
    DEFAULT_YEARS: 15,
  },
  SWP: {
    MIN_CAPITAL: 10000,
    MAX_CAPITAL: 100000000, // 10 Crores
    DEFAULT_CAPITAL: 2000000,
    MIN_WITHDRAWAL: 500,
    MAX_WITHDRAWAL: 1000000, // 10 Lakhs
    DEFAULT_WITHDRAWAL: 15000,
    MIN_RATE: 0,
    MAX_RATE: 50,
    DEFAULT_RATE: 8,
    MIN_YEARS: 1,
    MAX_YEARS: 40,
    DEFAULT_YEARS: 15,
  },
  COMPOUNDING: {
    MIN_MONTHLY: 500,
    MAX_MONTHLY: 500000,
    DEFAULT_MONTHLY: 5000,
    MIN_RATE: 0,
    MAX_RATE: 50,
    DEFAULT_RATE: 12,
  }
};

/**
 * Safely parse and clamp a numeric input value to a specified range.
 * Handles NaN, Infinity, negative values, and empty text gracefully.
 */
export function clampValue(value: number | string | undefined, min: number, max: number, defaultValue = min): number {
  if (value === undefined || value === null) return defaultValue;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(parsed) || !isFinite(parsed)) return defaultValue;
  return Math.min(Math.max(parsed, min), max);
}

// SIP Output Structure
export interface SipCalculationResult {
  totalInvested: number;
  totalValue: number;
  estimatedReturns: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    earnings: number;
    total: number;
  }>;
}

/**
 * Calculates SIP details, with optional annual step-up.
 * Compounding occurs monthly, contributions at the beginning of each month (annuity due).
 */
export function calculateSipDetails(
  monthlyInvestmentInput: number,
  annualRateInput: number,
  yearsInput: number,
  isStepUpEnabled = false,
  stepUpPercentInput = 10
): SipCalculationResult {
  const monthlyInvestment = clampValue(monthlyInvestmentInput, FINANCIAL_LIMITS.SIP.MIN_MONTHLY, FINANCIAL_LIMITS.SIP.MAX_MONTHLY, FINANCIAL_LIMITS.SIP.DEFAULT_MONTHLY);
  const annualRate = clampValue(annualRateInput, FINANCIAL_LIMITS.SIP.MIN_RATE, FINANCIAL_LIMITS.SIP.MAX_RATE, FINANCIAL_LIMITS.SIP.DEFAULT_RATE);
  const years = clampValue(yearsInput, FINANCIAL_LIMITS.SIP.MIN_YEARS, FINANCIAL_LIMITS.SIP.MAX_YEARS, FINANCIAL_LIMITS.SIP.DEFAULT_YEARS);
  const stepUpPercent = clampValue(stepUpPercentInput, FINANCIAL_LIMITS.SIP.MIN_STEP_UP, FINANCIAL_LIMITS.SIP.MAX_STEP_UP, FINANCIAL_LIMITS.SIP.DEFAULT_STEP_UP);

  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  let totalValue = 0;
  let totalInvested = 0;
  const yearlyBreakdown: SipCalculationResult['yearlyBreakdown'] = [];

  // Track invested and total value year-by-year to build precise charts/tables
  let currentYearInvested = 0;
  let currentMonthlyContribution = monthlyInvestment;

  for (let m = 1; m <= months; m++) {
    // Annual Step-up check (occurs at the start of year 2, 3, etc.)
    if (isStepUpEnabled && m > 1 && (m - 1) % 12 === 0) {
      currentMonthlyContribution = currentMonthlyContribution * (1 + stepUpPercent / 100);
    }

    // Accumulate monthly investment
    totalInvested += currentMonthlyContribution;
    currentYearInvested += currentMonthlyContribution;

    // Compounding math: contribution is deposited at start of month (Annuity Due)
    if (monthlyRate === 0) {
      totalValue += currentMonthlyContribution;
    } else {
      totalValue = (totalValue + currentMonthlyContribution) * (1 + monthlyRate);
    }

    // Save yearly snapshots
    if (m % 12 === 0) {
      const yearNum = m / 12;
      yearlyBreakdown.push({
        year: yearNum,
        invested: Math.round(totalInvested),
        earnings: Math.max(0, Math.round(totalValue - totalInvested)),
        total: Math.round(totalValue)
      });
    }
  }

  const roundedTotalValue = Math.round(totalValue);
  const roundedTotalInvested = Math.round(totalInvested);
  const estimatedReturns = Math.max(0, roundedTotalValue - roundedTotalInvested);

  return {
    totalInvested: roundedTotalInvested,
    totalValue: roundedTotalValue,
    estimatedReturns,
    yearlyBreakdown
  };
}

// Lumpsum Output Structure
export interface LumpsumCalculationResult {
  totalInvested: number;
  totalValue: number;
  estimatedReturns: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    earnings: number;
    total: number;
  }>;
}

/**
 * Calculates Lumpsum growth over a period of years, compounded annually.
 */
export function calculateLumpsumDetails(
  initialAmountInput: number,
  annualRateInput: number,
  yearsInput: number
): LumpsumCalculationResult {
  const initialAmount = clampValue(initialAmountInput, FINANCIAL_LIMITS.LUMPSUM.MIN_AMOUNT, FINANCIAL_LIMITS.LUMPSUM.MAX_AMOUNT, FINANCIAL_LIMITS.LUMPSUM.DEFAULT_AMOUNT);
  const annualRate = clampValue(annualRateInput, FINANCIAL_LIMITS.LUMPSUM.MIN_RATE, FINANCIAL_LIMITS.LUMPSUM.MAX_RATE, FINANCIAL_LIMITS.LUMPSUM.DEFAULT_RATE);
  const years = clampValue(yearsInput, FINANCIAL_LIMITS.LUMPSUM.MIN_YEARS, FINANCIAL_LIMITS.LUMPSUM.MAX_YEARS, FINANCIAL_LIMITS.LUMPSUM.DEFAULT_YEARS);

  const yearlyBreakdown: LumpsumCalculationResult['yearlyBreakdown'] = [];

  for (let y = 1; y <= years; y++) {
    const valueAtYear = initialAmount * Math.pow(1 + annualRate / 100, y);
    yearlyBreakdown.push({
      year: y,
      invested: initialAmount,
      earnings: Math.max(0, Math.round(valueAtYear - initialAmount)),
      total: Math.round(valueAtYear)
    });
  }

  const totalValue = initialAmount * Math.pow(1 + annualRate / 100, years);
  const roundedTotalValue = Math.round(totalValue);
  const estimatedReturns = Math.max(0, roundedTotalValue - initialAmount);

  return {
    totalInvested: initialAmount,
    totalValue: roundedTotalValue,
    estimatedReturns,
    yearlyBreakdown
  };
}

// SWP Output Structure
export interface SwpCalculationResult {
  totalInvested: number;
  totalWithdrawn: number;
  finalBalance: number;
  monthsLasted: number;
  yearsLasted: number;
  remainingMonthsLasted: number;
  isDepleted: boolean;
  yearlyBreakdown: Array<{
    year: number;
    withdrawn: number;
    balance: number;
  }>;
}

/**
 * Calculates SWP details, tracing capital decumulation month by month.
 */
export function calculateSwpDetails(
  capitalInput: number,
  monthlyWithdrawalInput: number,
  annualRateInput: number,
  yearsInput: number
): SwpCalculationResult {
  const capital = clampValue(capitalInput, FINANCIAL_LIMITS.SWP.MIN_CAPITAL, FINANCIAL_LIMITS.SWP.MAX_CAPITAL, FINANCIAL_LIMITS.SWP.DEFAULT_CAPITAL);
  const monthlyWithdrawal = clampValue(monthlyWithdrawalInput, FINANCIAL_LIMITS.SWP.MIN_WITHDRAWAL, FINANCIAL_LIMITS.SWP.MAX_WITHDRAWAL, FINANCIAL_LIMITS.SWP.DEFAULT_WITHDRAWAL);
  const annualRate = clampValue(annualRateInput, FINANCIAL_LIMITS.SWP.MIN_RATE, FINANCIAL_LIMITS.SWP.MAX_RATE, FINANCIAL_LIMITS.SWP.DEFAULT_RATE);
  const years = clampValue(yearsInput, FINANCIAL_LIMITS.SWP.MIN_YEARS, FINANCIAL_LIMITS.SWP.MAX_YEARS, FINANCIAL_LIMITS.SWP.DEFAULT_YEARS);

  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  let currentBalance = capital;
  let totalWithdrawn = 0;
  let monthsLasted = 0;
  let isDepleted = false;

  const yearlyBreakdown: SwpCalculationResult['yearlyBreakdown'] = [];
  let yearlyWithdrawnAccumulator = 0;

  for (let m = 1; m <= months; m++) {
    if (currentBalance <= 0) {
      currentBalance = 0;
      isDepleted = true;
      // Snapshot remaining years as empty
      if (m % 12 === 0) {
        yearlyBreakdown.push({
          year: m / 12,
          withdrawn: Math.round(totalWithdrawn),
          balance: 0
        });
      }
      continue;
    }

    // Step 1: Accrue monthly interest on capital
    currentBalance = currentBalance * (1 + monthlyRate);

    // Step 2: Withdraw the specified amount
    if (currentBalance >= monthlyWithdrawal) {
      currentBalance -= monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      yearlyWithdrawnAccumulator += monthlyWithdrawal;
      monthsLasted++;
    } else {
      // Partially filled or empty balance
      totalWithdrawn += currentBalance;
      yearlyWithdrawnAccumulator += currentBalance;
      currentBalance = 0;
      monthsLasted++;
      isDepleted = true;
    }

    // Save yearly snap
    if (m % 12 === 0) {
      yearlyBreakdown.push({
        year: m / 12,
        withdrawn: Math.round(totalWithdrawn),
        balance: Math.round(currentBalance)
      });
      yearlyWithdrawnAccumulator = 0;
    }
  }

  // Handle fractional year remaining snapshot if depleted mid-year
  const yearsLasted = Math.floor(monthsLasted / 12);
  const remainingMonthsLasted = monthsLasted % 12;
  const fullyCompleted = monthsLasted === months;

  return {
    totalInvested: capital,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(currentBalance),
    monthsLasted,
    yearsLasted,
    remainingMonthsLasted,
    isDepleted: isDepleted && !fullyCompleted,
    yearlyBreakdown
  };
}

// Early vs Late Starter Snapshot Data Point
export interface CompoundingComparisonDataPoint {
  age: string;
  ageNum: number;
  "Early Starter (Start @ 25)": number;
  "Late Starter (Start @ 35)": number;
  "Early Invested": number;
  "Late Invested": number;
}

/**
 * Calculates the compounding comparison list from age 25 to 60.
 */
export function generateCompoundingComparison(
  monthlyContributionInput: number,
  annualRateInput: number
): CompoundingComparisonDataPoint[] {
  const monthlyContribution = clampValue(monthlyContributionInput, FINANCIAL_LIMITS.COMPOUNDING.MIN_MONTHLY, FINANCIAL_LIMITS.COMPOUNDING.MAX_MONTHLY, FINANCIAL_LIMITS.COMPOUNDING.DEFAULT_MONTHLY);
  const annualRate = clampValue(annualRateInput, FINANCIAL_LIMITS.COMPOUNDING.MIN_RATE, FINANCIAL_LIMITS.COMPOUNDING.MAX_RATE, FINANCIAL_LIMITS.COMPOUNDING.DEFAULT_RATE);

  const data: CompoundingComparisonDataPoint[] = [];
  const monthlyRate = annualRate / 12 / 100;

  for (let age = 25; age <= 60; age += 5) {
    // Early Starter starts at age 25
    const earlyMonths = (age - 25) * 12;
    let earlyValue = 0;
    let earlyInvested = monthlyContribution * earlyMonths;
    if (earlyMonths > 0) {
      if (monthlyRate === 0) {
        earlyValue = earlyInvested;
      } else {
        earlyValue = monthlyContribution * ((Math.pow(1 + monthlyRate, earlyMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      }
    }

    // Late Starter starts at age 35
    const lateMonths = Math.max(0, (age - 35) * 12);
    let lateValue = 0;
    let lateInvested = monthlyContribution * lateMonths;
    if (lateMonths > 0) {
      if (monthlyRate === 0) {
        lateValue = lateInvested;
      } else {
        lateValue = monthlyContribution * ((Math.pow(1 + monthlyRate, lateMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      }
    }

    data.push({
      age: `${age} Yrs`,
      ageNum: age,
      "Early Starter (Start @ 25)": Math.round(earlyValue),
      "Late Starter (Start @ 35)": Math.round(lateValue),
      "Early Invested": Math.round(earlyInvested),
      "Late Invested": Math.round(lateInvested),
    });
  }

  return data;
}

/**
 * Clean currency formatting standard for Indian Rupees.
 */
export function formatToINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

/**
 * Format numeric values into Indian short-scales (Lakhs, Crores) for charts.
 */
export function formatLargeShortValue(val: number, language: 'en' | 'te'): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  if (val >= 10000000) {
    const label = language === 'en' ? 'Cr' : 'కోటి';
    return `₹${(val / 10000000).toFixed(1)} ${label}`;
  }
  if (val >= 100000) {
    const label = language === 'en' ? 'L' : 'లక్షలు';
    return `₹${(val / 100000).toFixed(1)} ${label}`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(0)} K`;
  }
  return `₹${val}`;
}
