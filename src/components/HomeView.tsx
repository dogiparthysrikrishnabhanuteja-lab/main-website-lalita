/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ShieldCheck, UserCheck, Star, Award, Shield, Medal, Trophy, 
  Send, Phone, MapPin, ArrowRight, CheckCircle2, User, HelpCircle, Sparkles
} from 'lucide-react';
import { awards, partners, testimonials } from '../data/financial_data';
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
  return { bg: 'from-slate-500 to-slate-700 bg-gradient-to-tr', text: 'text-white', abbrev: 'FI' };
};

interface HomeViewProps {
  preFilledMessage: string;
  setPreFilledMessage: (msg: string) => void;
  onNavigateToResources: () => void;
}

export default function HomeView({ preFilledMessage, setPreFilledMessage, onNavigateToResources }: HomeViewProps) {
  // Contact Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Hero Parallax Elements via native Framer Motion
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Load prefilled message if changed
  useEffect(() => {
    if (preFilledMessage) {
      setFormData(prev => ({ ...prev, message: preFilledMessage }));
    }
  }, [preFilledMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    setTimeout(() => {
      setSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setPreFilledMessage(''); // reset message
    }, 1500);
  };

  // State for stats counting simulation on intersection
  const [hasCounted, setHasCounted] = useState(false);
  const [counts, setCounts] = useState({ clients: 0, sumAssured: 0, experience: 0, retention: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // State for logo skeleton initializing delay
  const [isLogosInitializing, setIsLogosInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogosInitializing(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCounted) {
          setHasCounted(true);
          
          let clientProgress = 0;
          let sumAssuredProgress = 0;
          let expProgress = 0;
          let retProgress = 0;

          const clientInterval = setInterval(() => {
            clientProgress += 10;
            if (clientProgress >= 500) {
              clientProgress = 500;
              clearInterval(clientInterval);
            }
            setCounts(prev => ({ ...prev, clients: clientProgress }));
          }, 30);

          const sumAssuredInterval = setInterval(() => {
            sumAssuredProgress += 5;
            if (sumAssuredProgress >= 250) {
              sumAssuredProgress = 250;
              clearInterval(sumAssuredInterval);
            }
            setCounts(prev => ({ ...prev, sumAssured: sumAssuredProgress }));
          }, 15);

          const expInterval = setInterval(() => {
            expProgress += 1;
            if (expProgress >= 4) { // Inceptioned in 2022 (2022 to 2026)
              expProgress = 4;
              clearInterval(expInterval);
            }
            setCounts(prev => ({ ...prev, experience: expProgress }));
          }, 150);

          const retInterval = setInterval(() => {
            retProgress += 2;
            if (retProgress >= 98) {
              retProgress = 98;
              clearInterval(retInterval);
            }
            setCounts(prev => ({ ...prev, retention: retProgress }));
          }, 20);
        }
      },
      { threshold: 0.25 }
    );

    const currentRef = statsSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasCounted]);

  const renderAwardIcon = (type: string) => {
    switch (type) {
      case 'star': return <Star className="w-5 h-5 text-amber-600" />;
      case 'shield': return <Shield className="w-5 h-5 text-amber-600" />;
      case 'medal': return <Medal className="w-5 h-5 text-amber-600" />;
      case 'award': return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Trophy className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-12 overflow-hidden bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section 
        id="hero" 
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-amber-50/50 via-slate-50/20 to-white dark:from-slate-950 dark:via-slate-900/20 dark:to-slate-950"
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(120%_120%_at_50%_10%,_transparent_40%,_rgba(217,119,6,0.06)_100%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '12s' }} /> MDRT Advisor
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight font-display text-slate-900 dark:text-white leading-tight">
              Guiding Your Path to{' '}
              <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">Financial Prosperity</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              Expert, transparent, and ethical advisory in Life & Health Insurance, General Protection, and Mutual Fund Investments.
            </p>

            <p className="text-xs sm:text-sm font-mono tracking-wider text-amber-700 dark:text-amber-400 uppercase font-bold">
              Your Trustworthy Advisor for Comprehensive Wealth Protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
              <a 
                href="#contact" 
                className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 font-bold text-white rounded-xl transition-all shadow-xl shadow-amber-600/15 flex items-center gap-2 group cursor-pointer outline-none w-full sm:w-auto justify-center"
              >
                Request a Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <button
                onClick={onNavigateToResources}
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 dark:border-slate-600 transition-all w-full sm:w-auto cursor-pointer outline-none flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> Launch Calculator Suite
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating background blur effects */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Avatar Image block */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative group"
          >
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 to-amber-200/20 rounded-2xl blur opacity-30 group-hover:opacity-45 transition-opacity duration-500" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-square sm:aspect-auto max-h-[500px] bg-slate-50 dark:bg-slate-900">
              <img 
                src="011163d8-a334-4ba8-a3ab-fe70eb73fdd4.png"
                alt="D T V S SWAMY, MDRT Advisor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 text-center">
                <p className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">MDRT Status Qualified</p>
                <p className="text-white text-base font-extrabold mt-0.5">TATA AIA TOP ADVISOR PANEL</p>
              </div>
            </div>
          </motion.div>

          {/* Bio text block */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase">Expert Heritage</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white transition-colors">
                Trustee D T V S SWAMY
              </h2>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              With a deep-seated passion for financial empowerment, I am dedicated to providing insightful, transparent, and ethical financial advice. My journey in the Indian financial sector is driven by a singular mission: to help individuals and families navigate the complexities of financial planning with extreme safety and unwavering confidence.
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              I believe in a strictly structured analytical blueprint. We scrutinize details like assets, existing dependencies, debt horizons, and timeline goals to model perfect protection strategies. Whether securing your family’s standard-of-living index or optimizing systematic investment yields, my loyalty is to serve as your dependable advocate.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/35 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-mono flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> MDRT ADVISOR
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5 font-semibold">
                <UserCheck className="w-4 h-4 text-emerald-600" /> SEAMLESS CLAIMS ADVOCATE
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION WITH SCROLL-UP CARD EFFECT */}
      <section id="why-choose-us" className="bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/60 py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <span className="text-xs font-bold font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase">Core Values</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white">Why Partner With Swamy?</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Four foundational pillars structured to hold your long-term prosperity safe.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                t: "Tailored Strategy Formulation",
                d: "Individually formulated protection routes precisely matched to your wealth horizons and risk metrics.",
                i: <User className="w-5 h-5 text-amber-600" />
              },
              {
                t: "Authentic Ethical Standard",
                d: "Completely transparent advisory parameters, protecting your dependents above all product targets.",
                i: <Shield className="w-5 h-5 text-amber-600" />
              },
              {
                t: "MDRT Level Excellence",
                d: "Elite certified global underwriting standards and consecutive industrial qualifications.",
                i: <Award className="w-5 h-5 text-amber-600" />
              },
              {
                t: "High-Touch Claimant Stand",
                d: "Standing directly as your emergency advocate during vital claimant settlements and cash flows.",
                i: <CheckCircle2 className="w-5 h-5 text-amber-600" />
              }
            ].map((p, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 dark:hover:border-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.06)] dark:hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] transition-all duration-300 space-y-4 group relative overflow-hidden cursor-default"
              >
                <div className="absolute right-0 bottom-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-xl w-fit group-hover:bg-amber-100 dark:group-hover:bg-amber-950/60 transition-colors">
                  {p.i}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{p.t}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{p.d}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. 'OUR IMPACT' STATISTICS SECTION */}
      <section 
        id="stats" 
        ref={statsSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 relative"
      >
        {/* Intense background glow to address the transition effects request */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 bg-slate-950/95 border border-slate-800 rounded-3xl p-6 sm:p-12 text-center space-y-8 sm:space-y-12 overflow-hidden shadow-[0_12px_48px_rgba(217,119,6,0.1)] dark:shadow-[0_12px_48px_rgba(217,119,6,0.15)]"
        >
          {/* Gold line accent */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-amber-600 to-yellow-500" />
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> Transparent Social Proof
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-display text-white leading-tight">
              Our <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Key Impact</span> in Numbers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
              We started our advisory in <b>2022</b>. Within a span of a few years, we have protected hundreds of lives, secured vast household capitals, and delivered unwavering claims resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pt-4">
            {[
              { 
                value: counts.clients, 
                label: "Happy Clients Protected", 
                suffix: "+", 
                desc: "Secured heads of families and wealth portfolios",
                icon: <UserCheck className="w-6 h-6 text-amber-400" />
              },
              { 
                value: `₹${counts.sumAssured}`, 
                label: "Total Sum Assured", 
                suffix: " Cr+", 
                desc: "Value of life & medical safety nets deployed",
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
              },
              { 
                value: counts.experience, 
                label: "Years of Dedication", 
                suffix: " Years", 
                desc: "Established in 2022 under strict ethical standards",
                icon: <Star className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '20s' }} />
              },
              { 
                value: counts.retention, 
                label: "Persistency / Retentivity", 
                suffix: "%", 
                desc: "Consecutive premium renewals reflecting high trust",
                icon: <Trophy className="w-6 h-6 text-yellow-400" />
              }
            ].map((st, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl text-center space-y-3 relative group transition-all duration-300 hover:border-amber-500/35 hover:bg-slate-900/90 hover:shadow-[0_12px_32px_rgba(217,119,6,0.12)]"
              >
                {/* Micro-glow for specific metrics */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/[0.02] rounded-2xl transition-colors duration-500 pointer-events-none" />

                <div className="mx-auto w-12 h-12 rounded-xl bg-slate-850 border border-slate-800/80 flex items-center justify-center shadow-inner group-hover:border-amber-500/20 group-hover:bg-slate-800 transition-colors">
                  {st.icon}
                </div>

                <div className="space-y-1">
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-mono group-hover:text-amber-400 transition-colors">
                    {st.value}{st.suffix}
                  </span>
                  <p className="text-xs text-slate-200 font-extrabold uppercase tracking-wider font-display">{st.label}</p>
                </div>

                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. AWARDS & RECOGNITIONS SECTION */}
      <section id="awards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 py-10 sm:py-16 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="text-xs font-bold font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">Recognized Standards</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white transition-colors">Trust & Honors</h2>
          <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400">Continuous industrial merits highlighting consecutive commitments to secure household capitals.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {awards.map((aw, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/35 dark:hover:border-amber-500/45 hover:shadow-[0_12px_32px_rgba(217,119,6,0.08)] dark:hover:shadow-[0_12px_32px_rgba(217,119,6,0.18)] transition-all duration-300 text-center flex flex-col justify-between group cursor-default"
            >
              <div className="space-y-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-500/5 flex items-center justify-center border border-amber-500/20 dark:border-amber-500/30 group-hover:bg-amber-600 dark:group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  {renderAwardIcon(aw.iconType)}
                </div>
                <div className="text-sm font-bold font-mono text-amber-700 dark:text-amber-400">{aw.year}</div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">{aw.title}</h4>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800/85 pt-2 font-semibold">{aw.company}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. ASSOCIATED PARTNERS LOGO MARQUEE */}
      <section id="partners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 space-y-6 sm:space-y-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-2"
        >
          <span className="text-xs font-bold font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">Trusted Collaborations</span>
          <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white">Authorized Portfolios & Platforms</h3>
          <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 max-w-lg mx-auto">
            Directly authorized integrations and advisory partnerships under top-tier national underwriters.
          </p>
        </motion.div>

        {/* AMD-Style Premium Trust Section: Solid dark canvas with a marquee of monochrome-to-color vector brand logos */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 bg-slate-950 border border-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        >
          {/* Atmospheric background glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-20 pointer-events-none" />

          {/* Seamless Infinite Marquee Scroll Window */}
          <div className="relative w-full overflow-hidden py-4 select-none flex items-center justify-start min-h-[96px] sm:min-h-[112px]" style={{ display: 'flex' }}>
            {/* Linear gradient fade overlays for a premium, high-contrast fade look */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

            {isLogosInitializing ? (
              <div className="flex gap-8 sm:gap-12 items-center w-full justify-center overflow-hidden py-2" style={{ display: 'flex' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <div 
                    key={`shimmer-${num}`}
                    className="flex flex-col items-center justify-center shrink-0 w-40 sm:w-48 h-14 sm:h-16 bg-slate-900/40 border border-slate-800/60 rounded-xl relative overflow-hidden"
                    style={{ display: 'flex' }}
                  >
                    {/* Shimmer sweep animation overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" 
                      style={{ animation: 'shimmer 1.5s infinite' }}
                    />
                    <div className="h-5 w-24 sm:w-28 bg-slate-800/65 rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="marquee-track flex gap-0 items-center shrink-0"
                style={{ display: 'flex' }}
              >
                {/* Sibling Container 1 */}
                <div className="flex gap-12 sm:gap-16 items-center shrink-0 pr-12 sm:pr-16" style={{ display: 'flex' }}>
                  {partners.map((part, idx) => (
                    <div 
                      key={`marquee1-${idx}`} 
                      title={part.name}
                      className="flex flex-col items-center justify-center shrink-0 grayscale brightness-125 hover:grayscale-0 hover:brightness-100 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer px-4 w-40 sm:w-48 h-14 sm:h-16"
                      style={{ display: 'flex' }}
                    >
                      <div className="h-10 sm:h-12 w-36 sm:w-44 flex items-center justify-center" style={{ display: 'flex' }}>
                        <PartnerLogo name={part.name} className="h-8 sm:h-10 w-32 sm:w-40 text-white block" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sibling Container 2 (Identical Copy for seamless infinite looping flow) */}
                <div className="flex gap-12 sm:gap-16 items-center shrink-0 pr-12 sm:pr-16" aria-hidden="true" style={{ display: 'flex' }}>
                  {partners.map((part, idx) => (
                    <div 
                      key={`marquee2-${idx}`} 
                      title={part.name}
                      className="flex flex-col items-center justify-center shrink-0 grayscale brightness-125 hover:grayscale-0 hover:brightness-100 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer px-4 w-40 sm:w-48 h-14 sm:h-16"
                      style={{ display: 'flex' }}
                    >
                      <div className="h-10 sm:h-12 w-36 sm:w-44 flex items-center justify-center" style={{ display: 'flex' }}>
                        <PartnerLogo name={part.name} className="h-8 sm:h-10 w-32 sm:w-40 text-white block" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Centered Action Button resembling AMD's "See How" button */}
          <div className="pt-10 border-t border-slate-900/60 mt-10 relative z-10">
            <button
              onClick={() => {
                if (window.navigateToHash) {
                  window.navigateToHash('#services');
                } else {
                  window.location.hash = '#services';
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-slate-800 hover:border-amber-500 text-white hover:text-amber-400 font-semibold text-xs tracking-wider uppercase rounded-lg transition-all duration-300 shadow-md hover:shadow-amber-500/10 cursor-pointer"
            >
              See Solutions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 7. CLIENT SUCCESS STORIES */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 py-10 sm:py-16 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="text-xs font-bold font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">Valid Experience</span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white transition-colors">Client Success Stories</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-amber-500/30 dark:hover:border-amber-500/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-amber-500 dark:text-amber-400 text-4xl font-serif leading-none absolute left-3 top-3 opacity-20">“</div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed relative z-10 font-sans">
                "{t.quote}"
              </p>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide">{t.author}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. ELITE CONTACT & PERSONAL CONSULTATION PORTAL */}
      <section 
        id="contact" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 relative"
      >
        {/* Glow backdrop to meet background glow request */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-center space-y-4 max-w-3xl mx-auto mb-10 sm:mb-12"
        >
          <span className="text-xs font-mono uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">Advisory Evaluation</span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white transition-colors">Let's Secure Your Future</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Reach out directly to schedule a face-to-face evaluation or a direct professional strategy call. We analyze your health and life safety limits with absolute transparent accuracy.
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          
          {/* Call Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Hotline Contacts</h4>
                <p className="text-base sm:text-lg font-black text-white mt-1">+91 98855 39211</p>
                <p className="text-xs font-semibold text-slate-400 font-mono">+91 77993 22556</p>
              </div>
            </div>
            <a 
              href="tel:+919885539211"
              className="mt-4 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs text-center uppercase tracking-wider rounded-lg transition-all"
            >
              Call Primary Hotline
            </a>
          </motion.div>

          {/* Address Location Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Corporate Location</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5 font-medium">
                  Flat No. 101, Golden Park Apartment,<br />
                  Tarakarama Nagar, Karempudi Road,<br />
                  VINUKONDA - 522647, Palnadu Dist.
                </p>
              </div>
            </div>
            <a 
              href="https://maps.google.com/?q=Vinukonda+Palnadu+District+Andhra+Pradesh"
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs text-center uppercase tracking-wider rounded-lg border border-slate-700 transition-all"
            >
              View Google Maps
            </a>
          </motion.div>

        </div>

        {/* Advisory trust response notice */}
        <div className="relative z-10 max-w-xl mx-auto mt-8 bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-600 font-extrabold tracking-wider block">Advisory Excellence Standard</span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">All personal messages directly through hotlines or WhatsApp receive direct evaluation from D T V S SWAMY within standard working hours.</p>
        </div>
      </section>

    </div>
  );
}
