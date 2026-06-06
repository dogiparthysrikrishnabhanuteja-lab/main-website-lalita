/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Partner, Testimonial, ServiceElement } from '../types';

export const awards: Award[] = [
  {
    year: '2025',
    title: '1.5 MDRT Qualifier',
    company: 'Tata AIA Life Insurance',
    iconType: 'star'
  },
  {
    year: '2026',
    title: 'MDRT Advisor',
    company: 'Tata AIA Life Insurance',
    iconType: 'shield'
  },
  {
    year: '2026',
    title: 'Bronze Club Member',
    company: 'Care Health Insurance',
    iconType: 'medal'
  },
  {
    year: '2026',
    title: 'Bronze Plus Club Member',
    company: 'Tata AIG General Insurance',
    iconType: 'award'
  },
  {
    year: 'JFM 2027',
    title: 'Quarter MDRT Leader',
    company: 'Tata AIA Life Insurance',
    iconType: 'trophy'
  }
];

export const partners: Partner[] = [
  {
    name: 'TATA AIA Life Insurance',
    logoUrl: 'https://logo.clearbit.com/tataaia.com?size=150&format=png',
    fallback: 'Tata AIA Life'
  },
  {
    name: 'ICICI Prudential',
    logoUrl: 'https://logo.clearbit.com/icicipruamc.com?size=150&format=png',
    fallback: 'ICICI Prudential'
  },
  {
    name: 'HDFC Life',
    logoUrl: 'https://logo.clearbit.com/hdfclife.com?size=150&format=png',
    fallback: 'HDFC Life'
  },
  {
    name: 'Star Health Insurance',
    logoUrl: 'https://logo.clearbit.com/starhealth.in?size=150&format=png',
    fallback: 'Star Health'
  },
  {
    name: 'Care Health Insurance',
    logoUrl: 'https://logo.clearbit.com/careinsurance.com?size=150&format=png',
    fallback: 'Care Health'
  },
  {
    name: 'TATA AIG General Insurance',
    logoUrl: 'https://logo.clearbit.com/tataaig.com?size=150&format=png',
    fallback: 'TATA AIG'
  },
  {
    name: 'ICICI Lombard',
    logoUrl: 'https://logo.clearbit.com/icicilombard.com?size=150&format=png',
    fallback: 'ICICI Lombard'
  },
  {
    name: 'Niva Bupa Health',
    logoUrl: 'https://logo.clearbit.com/nivabupa.com?size=150&format=png',
    fallback: 'Niva Bupa'
  },
  {
    name: 'HDFC Ergo',
    logoUrl: 'https://logo.clearbit.com/hdfcergo.com?size=150&format=png',
    fallback: 'HDFC Ergo'
  },
  {
    name: 'Prudent Mutual Funds',
    logoUrl: 'https://logo.clearbit.com/prudentcorporate.com?size=150&format=png',
    fallback: 'Prudent FP'
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "D T V S SWAMY has been instrumental in securing my family's financial future. His advice is always exceptionally clear, perfectly objective, and completely aligned with our personal cash flows. I highly recommend him for his high-touch personal commitment.",
    author: "Dr. A. Kumar",
    role: "Senior Consultant Architect, Happy Family Protection client"
  },
  {
    quote: "Working with Lalita Financial Advisory has completely simplified our health care coverage and asset investments. We obtained zero-depreciation car security, critical medical protection, and an index compounding SIP matching our goals. Absolute transparent advice!",
    author: "Srivalli Dogiparthy",
    role: "Business Owner, Consolidated Business & Family Client"
  },
  {
    quote: "My SIP compounding trajectory became transparent and reliable only when Swamy restructured my tax obligations and savings parameters under ELSS. His MDRT status is fully earned by the extreme care, prompt claims resolution, and empathy he displays.",
    author: "G. Venkateswarlu",
    role: "Retirement Planner and High-Net-Worth Investor"
  }
];

export const services: ServiceElement[] = [
  {
    id: 'life-insurance',
    title: 'Life Insurance',
    subtitle: 'Wealth Preservation & Family Legacy',
    iconName: 'heart',
    description: 'Ensure ultimate peace of mind and long-term liquidity for your dependants. Access robust term protections, endowment guaranteed schemes, and retirement income portfolios.',
    bullets: [
      'High Sum-Assured Term Life Security',
      'Guaranteed Regular Income Plans',
      'Endowment & Capital Safeguard Portfolios'
    ],
    partners: ['ICICI PRUDENTIAL', 'TATA AIA LIFE', 'HDFC LIFE', 'KOTAK LIFE', 'BAJAJ LIFE', 'AXIS MAX LIFE'],
    category: 'life'
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance',
    subtitle: 'Absolute Medical Care Security',
    iconName: 'doctor',
    description: 'Shield household budgets from skyrocketing hospital bills. Access prime cashless networks, critical illness lump-sum coverage, and pre-existing illness waivers.',
    bullets: [
      'Universal Family Floater Coverage Protocols',
      'Top-Up and Super Top-Up Enhancers',
      'Critical Illness Diagnostic Capital Shield'
    ],
    partners: ['MANIPAL CIGNA', 'CARE HEALTH', 'HDFC ERGO', 'TATA AIG', 'NIVA BUPA HEALTH', 'ADITYA BIRLA', 'ICICI LOMBARD', 'STAR HEALTH'],
    category: 'health'
  },
  {
    id: 'car-insurance',
    title: 'Motor Insurance Solutions',
    subtitle: 'Bumper-to-Bumper Vehicular Shield',
    iconName: 'car',
    description: 'Drive confidently with all-inclusive motor security. Get zero-depreciation replacement guarantees, immediate spot roadside assessments, and hassle-free claimant settlement.',
    bullets: [
      'Zero-Depreciation Replacement Security Covers',
      'Robust Third-Party Legal Liability Shielding',
      'Immediate 24/7 Roadside Mechanical Breakdown Aid'
    ],
    partners: ['TATA AIG', 'HDFC GENERAL INSURANCE', 'ICICI LOMBARD', 'ROYAL SUNDARAM', 'GODIGIT', 'LIBERTY'],
    category: 'auto'
  },
  {
    id: 'general-insurance',
    title: 'General Insurance Solutions',
    subtitle: 'Asset, Property & Business Armor',
    iconName: 'umbrella',
    description: 'Complete commercial, industrial, and residential asset protection frameworks. Secure vital physical structures, home property, shopkeepers assets, fire & burglary liabilities, and custom enterprise shields exclusively through TATA AIG.',
    bullets: [
      'Comprehensive Home & Valuable Inventory Safeguards',
      'Shopkeepers Package & Small Business Protection',
      'Industrial Fire, Burglary & Public Liability Covers'
    ],
    partners: ['TATA AIG'],
    category: 'general'
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & Investments',
    subtitle: 'Goal-Based Compounding blueprints',
    iconName: 'piggy',
    description: 'Expand your long-term capital intelligently using professional asset allocations. Coordinate multi-year compounding targets under structured tax-saver setups.',
    bullets: [
      'Disciplined Systematic Investment Plans (SIP)',
      'Systematic Withdrawal (SWP) Income Streams',
      'Dual Tax-Savings and Growth (ELSS) Portfolios'
    ],
    partners: ['Prudent Platform', 'FundzBazaar Wealth Engines'],
    category: 'investments'
  }
];
