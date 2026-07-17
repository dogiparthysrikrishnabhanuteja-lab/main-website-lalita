/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ShieldCheck, UserCheck, Star, Award, Shield, Medal, Trophy, 
  Send, Phone, MapPin, ArrowRight, CheckCircle2, User, Sparkles
} from 'lucide-react';
import { awards, partners, testimonials } from '../data/financial_data';
import { useLanguage } from '../context/LanguageContext';
import PartnerLogo from './PartnerLogos';
import { InquiryService } from '../utils/inquiryService';

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
    return { bg: 'from-blue-500 to-indigo-600 bg-gradient-to-tr', text: 'text-white', abbrev: 'SH' };
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
  const { language, t } = useLanguage();

  // Contact Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.interest) {
      setSubmitStatus('error');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    setTimeout(() => {
      // Save submission data to InquiryService store
      try {
        InquiryService.saveInquiry({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
          message: formData.message
        });
      } catch (err) {
        console.error('Error saving consultation request:', err);
      }

      setSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
      setPreFilledMessage(''); // reset message
    }, 1500);
  };

  // State for stats counting simulation on intersection
  const [hasCounted, setHasCounted] = useState(false);
  const [counts, setCounts] = useState({ clients: 0, sumAssured: 0, experience: 0, retention: 0 });
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // State for logo skeleton initializing delay
  const [isLogosInitializing, setIsLogosInitializing] = useState(true);
  const partnersSectionRef = useRef<HTMLElement>(null);
  const [hasPreloadedLogos, setHasPreloadedLogos] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogosInitializing(false);
    }, 750);
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
            clientProgress += 4;
            if (clientProgress >= 200) {
              clientProgress = 200;
              clearInterval(clientInterval);
            }
            setCounts(prev => ({ ...prev, clients: clientProgress }));
          }, 30);

          const sumAssuredInterval = setInterval(() => {
            sumAssuredProgress += 2;
            if (sumAssuredProgress >= 120) {
              sumAssuredProgress = 120;
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

  const localizedTestimonials = testimonials.map(tItem => {
    if (language === 'en') return tItem;
    if (tItem.author.includes('Kumar')) {
      return {
        quote: "డి టి వి ఎస్ స్వామి గారు నా కుటుంబ ఆర్థిక భవిష్యత్తును సురక్షితం చేయడంలో ఎంతో సహాయపడ్డారు. ఆయన ఇచ్చే సలహాలు ఎల్లప్పుడూ స్పష్టంగా, పారదర్శకంగా మరియు మా నెలవారీ ఆదాయ వ్యయాలకు తగినట్లుగా ఉంటాయి. ఆయన వ్యక్తిగత శ్రద్ధ మరియు అంకితభావానికి నేను ఆయనను బాగా సిఫార్సు చేస్తున్నాను.",
        author: "డాక్టర్ ఎ. కుమార్",
        role: "సీనియర్ కన్సల్టెంట్ ఆర్కిటెక్ట్, హ్యాపీ ఫ్యామిలీ ప్రొటెక్షన్ క్లయింట్"
      };
    }
    if (tItem.author.includes('Srivalli')) {
      return {
        quote: "లలితా ఫైనాన్షియల్ అడ్వైజరీతో పని చేయడం వల్ల మా ఆరోగ్య బీమా రక్షణ మరియు పెట్టుబడుల ప్రక్రియ చాలా సులభంగా మారింది. మాకు లభించిన కార్ ఇన్సూరెన్స్, అత్యవసర వైద్య రక్షణ మరియు మా లక్ష్యాలకు సరిపోయే ఎస్‌ఐపీలు ఎంతో ఉపయోగపడ్డాయి. పూర్తి పారదర్శకమైన సలహాలు!",
        author: "శ్రీవల్లి దోగిపర్తి",
        role: "వ్యాపార యజమాని, కన్సాలిడేటెడ్ బిజినెస్ & ఫ్యామిలీ క్లయింట్"
      };
    }
    if (tItem.author.includes('Venkateswarlu')) {
      return {
        quote: "స్వామి గారు పన్ను ఆదా మరియు ఎల్ఎస్ఎస్ (ELSS) ద్వారా నా పొదుపును క్రమబద్ధీకరించిన తర్వాతే నా ఎస్‌ఐపీ పెట్టుబడులు నిజమైన ఫలితాన్నిచ్చాయి. ఆయన చూపే శ్రద్ధ, క్లెయిమ్ పరిష్కార వేగం మరియు సానుభూతి ఆయన ఎండీఆర్‌టీ (MDRT) హోదాకు పూర్తి తగినవి.",
        author: "జి. వెంకటేశ్వర్లు",
        role: "రిటైర్మెంట్ ప్లానర్ మరియు హెచ్ఎన్ఐ (HNW) ఇన్వెస్టర్"
      };
    }
    return tItem;
  });

  const localizedAwards = awards.map(a => {
    if (language === 'en') return a;
    let title = a.title;
    if (a.title === '1.5 MDRT Qualifier') title = '1.5 MDRT క్వాలిఫైయర్';
    if (a.title === 'MDRT Advisor') title = 'MDRT సలహాదారు';
    if (a.title === 'Bronze Club Member') title = 'బ్రాంజ్ క్లబ్ సభ్యుడు';
    if (a.title === 'Bronze Plus Club Member') title = 'బ్రాంజ్ ప్లస్ క్లబ్ సభ్యుడు';
    if (a.title === 'Quarter MDRT Leader') title = 'క్వార్టర్ MDRT లీడర్';
    
    let company = a.company;
    if (a.company.includes('Tata AIA')) company = 'టాటా AIA లైఫ్ ఇన్సూరెన్స్';
    if (a.company.includes('Care Health')) company = 'కేర్ హెల్త్ ఇన్సూరెన్స్';
    if (a.company.includes('Tata AIG')) company = 'టాటా AIG జనరల్ ఇన్సూరెన్స్';

    let year = a.year;
    if (a.year === 'JFM 2027') year = 'జెఎఫ్ఎమ్ 2027';

    return { ...a, title, company, year };
  });

  return (
    <div className="space-y-20 sm:space-y-28 pb-12 overflow-hidden bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section 
        id="hero" 
        ref={heroRef}
        className="scroll-mt-28 relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-amber-50/50 via-slate-50/20 to-white dark:from-slate-950 dark:via-slate-900/20 dark:to-slate-950"
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(120%_120%_at_50%_10%,_transparent_40%,_rgba(217,119,6,0.06)_100%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '12s' }} /> {t("MDRT CERTIFIED CHIEF ADVISOR")}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight font-display text-slate-900 dark:text-white leading-tight">
              {language === 'en' ? (
                <>
                  Guiding Your Path to{' '}
                  <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">
                    Financial Prosperity
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">
                    ఆర్థిక సుసంపన్నత
                  </span>{' '}
                  వైపు మీ ప్రస్థానానికి సరైన మార్గదర్శకత్వం
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              {language === 'en' 
                ? "Expert, transparent, and ethical advisory in Life & Health Insurance, General Protection, and Mutual Fund Investments."
                : "జీవిత & ఆరోగ్య బీమా, సాధారణ రక్షణ మరియు మ్యూచువల్ ఫండ్ పెట్టుబడులలో నిపుణులైన, పారదర్శకమైన మరియు నైతికమైన సలహా."}
            </p>

            <p className="text-xs sm:text-sm font-mono tracking-wider text-amber-700 dark:text-amber-400 uppercase font-bold">
              {language === 'en' 
                ? "Your Trustworthy Advisor for Comprehensive Wealth Protection." 
                : "సమగ్ర సంపద రక్షణ కోసం మీ నమ్మకమైన సలహాదారు."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 font-bold text-white rounded-xl transition-all shadow-xl shadow-amber-600/15 flex items-center gap-2 group cursor-pointer outline-none w-full sm:w-auto justify-center"
              >
                {t("Get in Touch")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={onNavigateToResources}
                className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 dark:border-slate-600 transition-all w-full sm:w-auto cursor-pointer outline-none flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> {t("Financial Calculators")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating background blur effects */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
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
                <p className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                  {language === 'en' ? "MDRT Status Qualified" : "MDRT హోదా గుర్తింపు పొందిన"}
                </p>
                <p className="text-white text-base font-extrabold mt-0.5">
                  {language === 'en' ? "TATA AIA TOP ADVISOR PANEL" : "టాటా AIA టాప్ అడ్వైజర్ ప్యానెల్"}
                </p>
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
              <span className="text-xs font-bold font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                {language === 'en' ? "Expert Heritage" : "అనుభవజ్ఞుడైన సలహాదారు"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white transition-colors">
                {language === 'en' ? "Trustee D T V S SWAMY" : "సలహాదారు డి టి వి ఎస్ స్వామి"}
              </h2>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {language === 'en'
                ? "With a deep-seated passion for financial empowerment, I am dedicated to providing insightful, transparent, and ethical financial advice. My journey in the Indian financial sector is driven by a singular mission: to help individuals and families navigate the complexities of financial planning with extreme safety and unwavering confidence."
                : "ఆర్థిక సాధికారతపై ఉన్న లోతైన ఆసక్తితో, నేను పారదర్శకమైన మరియు నైతికమైన ఆర్థిక సలహాలను అందించడానికి కట్టుబడి ఉన్నాను. భారతీయ ఆర్థిక రంగంలో నా ప్రయాణం ఒకే ఒక లక్ష్యంతో సాగుతోంది: వ్యక్తులు మరియు కుటుంబాలు తమ ఆర్థిక ప్రణాళికలను పూర్తి రక్షణతో మరియు నమ్మకంతో నిర్మించుకునేలా సహాయపడటం."}
            </p>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {language === 'en'
                ? "I believe in a strictly structured analytical blueprint. We scrutinize details like assets, existing dependencies, debt horizons, and timeline goals to model perfect protection strategies. Whether securing your family’s standard-of-living index or optimizing systematic investment yields, my loyalty is to serve as your dependable advocate."
                : "నేను ఖచ్చితమైన విశ్లేషణాత్మక విధానాన్ని నమ్ముతాను. ఆస్తులు, అప్పులు, కుటుంబ బాధ్యతలు మరియు భవిష్యత్తు లక్ష్యాల వంటి అన్ని వివరాలను పరిశీలించి సరైన రక్షణ వ్యూహాలను రూపొందిస్తాము. మీ కుటుంబ జీవిత ప్రమాణాలను రక్షించడమైనా లేదా పెట్టుబడులపై గరిష్ట లాభాలను పొందడమైనా, మీకు నమ్మకమైన సలహాదారుగా నిలబడటమే నా విధి."}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/35 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-mono flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> {language === 'en' ? "MDRT ADVISOR" : "MDRT సలహాదారు"}
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5 font-semibold">
                <UserCheck className="w-4 h-4 text-emerald-600" /> {language === 'en' ? "SEAMLESS CLAIMS ADVOCATE" : "క్లెయిమ్స్ పరిష్కార సహాయకుడు"}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION WITH SCROLL-UP CARD EFFECT */}
      <section id="why-choose-us" className="scroll-mt-28 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/60 py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <span className="text-xs font-bold font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase">
              {language === 'en' ? "Core Values" : "ముఖ్య విలువలు"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              {language === 'en' ? "Why Partner With Swamy?" : "స్వామి గారితో ఎందుకు భాగస్వామ్యం కావాలి?"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {language === 'en' 
                ? "Four foundational pillars structured to hold your long-term prosperity safe." 
                : "మీ దీర్ఘకాలిక శ్రేయస్సును సురక్షితంగా ఉంచడానికి రూపొందించిన నాలుగు పునాది స్తంభాలు."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                t: language === 'en' ? "Tailored Strategy Formulation" : "వ్యక్తిగత ఆర్థిక వ్యూహాలు",
                d: language === 'en' 
                  ? "Individually formulated protection routes precisely matched to your wealth horizons and risk metrics."
                  : "మీ సంపద పరిధులు మరియు రిస్క్ ప్రమాణాలకు సరిగ్గా సరిపోయే విధంగా రూపొందించిన రక్షణ మార్గాలు.",
                i: <User className="w-5 h-5 text-amber-600" />
              },
              {
                t: language === 'en' ? "Authentic Ethical Standard" : "నిజమైన నైతిక విలువలు",
                d: language === 'en'
                  ? "Completely transparent advisory parameters, protecting your dependents above all product targets."
                  : "పూర్తిగా పారదర్శకమైన సలహాలు, ఎటువంటి స్వార్థ ప్రయోజనాలు లేకుండా మీ కుటుంబ రక్షణకే ప్రథమ ప్రాధాన్యత.",
                i: <Shield className="w-5 h-5 text-amber-600" />
              },
              {
                t: language === 'en' ? "MDRT Level Excellence" : "MDRT స్థాయి నైపుణ్యం",
                d: language === 'en'
                  ? "Elite certified global underwriting standards and consecutive industrial qualifications."
                  : "ప్రపంచ స్థాయి గుర్తింపు పొందిన ప్రమాణాలు మరియు నిరంతర పారిశ్రామిక నైపుణ్యాలు.",
                i: <Award className="w-5 h-5 text-amber-600" />
              },
              {
                t: language === 'en' ? "High-Touch Claimant Stand" : "క్లెయిమ్స్ సమయాల్లో తోడుగా",
                d: language === 'en'
                  ? "Standing directly as your emergency advocate during vital claimant settlements and cash flows."
                  : "అत्यవసర క్లెయిమ్ సెటిల్మెంట్ల సమయంలో మీ కుటుంబానికి నేరుగా అండగా నిలబడటం.",
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
        className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 relative"
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
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> {language === 'en' ? "Transparent Social Proof" : "పారదర్శక నమ్మకం"}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-display text-white leading-tight">
              {language === 'en' ? (
                <>
                  Our <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Key Impact</span> in Numbers
                </>
              ) : (
                <>
                  మా <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">ప్రగతి ప్రస్థానం</span> - అంకెల్లో
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
              {language === 'en' 
                ? "We started our advisory in 2022. Within a span of a few years, we have protected hundreds of lives, secured vast household capitals, and delivered unwavering claims resolution."
                : "మేము 2022 లో మా సేవలను ప్రారంభించాము. కొన్ని సంవత్సరాల కాలంలోనే, మేము వందలాది జీవితాలకు రక్షణ కల్పించాము, గృహ మూలధనాన్ని సురక్షితం చేసాము మరియు స్థిరమైన క్లెయిమ్‌లను పరిష్కరించాము."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pt-4">
            {[
              { 
                value: counts.clients, 
                label: language === 'en' ? "Happy Clients Protected" : "సురక్షితమైన ఆనంద కుటుంబాలు", 
                suffix: "+", 
                desc: language === 'en' ? "Secured heads of families and wealth portfolios" : "कुटुంబ యజమానులు మరియు సంపద పోర్ట్‌ఫోలియోలకు రక్షణ",
                icon: <UserCheck className="w-6 h-6 text-amber-400" />
              },
              { 
                value: `₹${counts.sumAssured}`, 
                label: language === 'en' ? "Total Sum Assured" : "మొత్తం రక్షణ కవచం (సమ్ అష్యూర్డ్)", 
                suffix: " Cr+", 
                desc: language === 'en' ? "Value of life & medical safety nets deployed" : "అందించిన జీవిత & ఆరోగ్య భద్రత విలువ",
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
              },
              { 
                value: counts.experience, 
                label: language === 'en' ? "Years of Dedication" : "నిరంతర సేవా కాలం", 
                suffix: language === 'en' ? " Years" : " సంవత్సరాలు", 
                desc: language === 'en' ? "Established in 2022 under strict ethical standards" : "కఠినమైన నైతిక ప్రమాణాలతో 2022 లో స్థాపించబడింది",
                icon: <Star className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '20s' }} />
              },
              { 
                value: counts.retention, 
                label: language === 'en' ? "Persistency / Retentivity" : "పాలసీల పునరుద్ధరణ రేటు", 
                suffix: "%", 
                desc: language === 'en' ? "Consecutive premium renewals reflecting high trust" : "అత్యధిక విశ్వసనీయతకు నిదర్శనంగా నిలిచే ప్రీమియంల పునరుద్ధరణ",
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
      <section id="awards" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 py-10 sm:py-16 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="text-xs font-bold font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">
            {language === 'en' ? "Recognized Standards" : "గుర్తింపు పొందిన ప్రమాణాలు"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white transition-colors">
            {language === 'en' ? "Trust & Honors" : "విశ్వసనీయత & గౌరవాలు"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'en'
              ? "Continuous industrial merits highlighting consecutive commitments to secure household capitals."
              : "గృహ మూలధనాన్ని సురక్షితం చేయడానికి మేము చూపే నిరంతర నిబద్ధతకు గుర్తింపుగా లభించిన గౌరవాలు."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {localizedAwards.map((aw, idx) => (
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
      <section id="partners" ref={partnersSectionRef} className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 space-y-6 sm:space-y-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-2"
        >
          <span className="text-xs font-bold font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">
            {language === 'en' ? "Trusted Collaborations" : "విశ్వసనీయ సహకారాలు"}
          </span>
          <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
            {language === 'en' ? "Authorized Portfolios & Platforms" : "అధికారిక సంస్థలు & వేదికలు"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {language === 'en'
              ? "Directly authorized integrations and advisory partnerships under top-tier national underwriters."
              : "దేశంలోని అగ్రశ్రేణి బీమా సంస్థలతో మాకున్న అధికారిక సలహా భాగస్వామ్యాలు."}
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
          <div className="relative w-full overflow-hidden py-4 select-none flex items-center justify-start min-h-[120px] sm:min-h-[150px]" style={{ display: 'flex' }}>
            {/* Linear gradient fade overlays for a premium, high-contrast fade look */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

            {isLogosInitializing ? (
              <div className="flex gap-8 sm:gap-12 items-center w-full justify-center overflow-hidden py-2" style={{ display: 'flex' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <div 
                    key={`shimmer-${num}`}
                    className="flex flex-col items-center justify-center shrink-0 w-28 sm:w-44 h-20 sm:h-24 bg-slate-900/40 border border-slate-800/60 rounded-xl relative overflow-hidden"
                    style={{ display: 'flex' }}
                  >
                    {/* Shimmer sweep animation overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" 
                      style={{ animation: 'shimmer 1.5s infinite' }}
                    />
                    <div className="h-6 sm:h-8 w-16 sm:w-24 bg-slate-800/65 rounded-md mb-1.5" />
                    <div className="h-2 w-10 sm:w-16 bg-slate-800/45 rounded-md" />
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
                      className="flex flex-col items-center justify-center shrink-0 grayscale brightness-125 hover:grayscale-0 hover:brightness-100 opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer px-3 w-28 sm:w-44 h-20 sm:h-24"
                      style={{ display: 'flex' }}
                    >
                      <div className="h-10 sm:h-14 w-24 sm:w-40 flex items-center justify-center" style={{ display: 'flex' }}>
                        <PartnerLogo name={part.name} logoUrl={part.logoUrl} officialLogoUrl={part.officialLogoUrl} className="h-9 sm:h-12 w-auto max-w-full object-contain block" />
                      </div>
                      <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-1 truncate max-w-full uppercase">
                        {part.fallback || part.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sibling Container 2 (Identical Copy for seamless infinite looping flow) */}
                <div className="flex gap-12 sm:gap-16 items-center shrink-0 pr-12 sm:pr-16" aria-hidden="true" style={{ display: 'flex' }}>
                  {partners.map((part, idx) => (
                    <div 
                      key={`marquee2-${idx}`} 
                      title={part.name}
                      className="flex flex-col items-center justify-center shrink-0 grayscale brightness-125 hover:grayscale-0 hover:brightness-100 opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer px-3 w-28 sm:w-44 h-20 sm:h-24"
                      style={{ display: 'flex' }}
                    >
                      <div className="h-10 sm:h-14 w-24 sm:w-40 flex items-center justify-center" style={{ display: 'flex' }}>
                        <PartnerLogo name={part.name} logoUrl={part.logoUrl} officialLogoUrl={part.officialLogoUrl} className="h-9 sm:h-12 w-auto max-w-full object-contain block" />
                      </div>
                      <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-1 truncate max-w-full uppercase">
                        {part.fallback || part.name}
                      </span>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-slate-800 hover:border-amber-500 text-white hover:text-amber-400 font-semibold text-xs tracking-wider uppercase rounded-lg transition-all duration-300 shadow-md hover:shadow-amber-500/10 cursor-pointer text-left outline-none"
            >
              {language === 'en' ? "See Solutions" : "సేవలను చూడండి"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 7. CLIENT SUCCESS STORIES */}
      <section id="testimonials" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 py-10 sm:py-16 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="text-xs font-bold font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">
            {language === 'en' ? "Valid Experience" : "వినియోగదారుల అభిప్రాయాలు"}
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white transition-colors">
            {language === 'en' ? "Client Success Stories" : "మా క్లయింట్ల విజయగాథలు"}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {localizedTestimonials.map((tItem, idx) => (
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
                "{tItem.quote}"
              </p>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide">{tItem.author}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{tItem.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. ELITE CONTACT & PERSONAL CONSULTATION PORTAL */}
      <section 
        id="contact" 
        className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 relative"
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
          <span className="text-xs font-mono uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400">
            {language === 'en' ? "Advisory Evaluation" : "ఆర్థిక విశ్లేషణ"}
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white transition-colors">
            {language === 'en' ? "Let's Secure Your Future" : "మీ భవిష్యత్తును సురక్షితం చేసుకోండి"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {language === 'en' 
              ? "Reach out directly to schedule a face-to-face evaluation or a direct professional strategy call. We analyze your health and life safety limits with absolute transparent accuracy."
              : "ప్రత్యేక ఆర్థిక వ్యూహాల చర్చ కోసం మమ్మల్ని నేరుగా సంప్రదించండి. మేము మీ జీవిత మరియు ఆరోగ్య భద్రతా అవసరాలను పూర్తి పారదర్శకతతో విశ్లేషిస్తాము."}
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Hotline Card */}
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
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                    {language === 'en' ? "Hotline Contacts" : "హాట్‌లైన్ నంబర్లు"}
                  </h4>
                  <p className="text-base sm:text-lg font-black text-white mt-1">+91 98855 39211</p>
                  <p className="text-xs font-semibold text-slate-400 font-mono">+91 77993 22556</p>
                </div>
              </div>
              <a 
                href="tel:+919885539211"
                className="mt-4 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs text-center uppercase tracking-wider rounded-lg transition-all"
              >
                {language === 'en' ? "Call Primary Hotline" : "ముఖ్య హాట్‌లైన్‌కు కాల్ చేయండి"}
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
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                    {language === 'en' ? "Corporate Location" : "కార్పొరేట్ కార్యాలయం"}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5 font-medium">
                    {language === 'en' ? (
                      <>
                        Flat No. 101, Golden Park Apartment,<br />
                        Tarakarama Nagar, Karempudi Road,<br />
                        VINUKONDA - 522647, Palnadu Dist.
                      </>
                    ) : (
                      <>
                        ఫ్లాట్ నెం. 101, గోల్డెన్ పార్క్ అపార్ట్‌మెంట్,<br />
                        తారకరామ నగర్, కారెంపూడి రోడ్,<br />
                        వినుకొండ - 522647, పల్నాడు జిల్లా.
                      </>
                    )}
                  </p>
                </div>
              </div>
              <a 
                href="https://maps.google.com/?q=Vinukonda+Palnadu+District+Andhra+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs text-center uppercase tracking-wider rounded-lg border border-slate-700 transition-all"
              >
                {language === 'en' ? "View Google Maps" : "గూగుల్ మ్యాప్స్ లో చూడండి"}
              </a>
            </motion.div>

          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 bg-slate-900 dark:bg-slate-900/90 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6"
          >
            {/* Form Title & Description */}
            <div className="text-left space-y-1">
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                {language === 'en' ? "Schedule Free Consultation" : "ఉచిత సలహా సంప్రదింపులను బుక్ చేయండి"}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'en' 
                  ? "Provide your metrics below and Swamy will reach out to schedule an absolute conflict-free session." 
                  : "క్రింది వివరాలను అందించండి మరియు స్వామి గారు మీతో ఉచిత సమావేశాన్ని ఏర్పాటు చేస్తారు."}
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="form-name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {t("Your Full Name")} <span className="text-amber-500">*</span>
                </label>
                <input
                  id="form-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? "Enter your full name" : "మీ పూర్తి పేరు నమోదు చేయండి"}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              {/* Phone and Email in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="form-phone" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    {t("Phone Number")}
                  </label>
                  <input
                    id="form-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? "+91 XXXXX XXXXX" : "+91 XXXXX XXXXX"}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    {t("Email Address")} <span className="text-amber-500">*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? "name@example.com" : "name@example.com"}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

              </div>

              {/* Insurance Interest Dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="form-interest" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {t("Primary Goal of Consultation")} <span className="text-amber-500">*</span>
                </label>
                <select
                  id="form-interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-950 text-slate-500">{t("Select a Goal")}</option>
                  <option value="life" className="bg-slate-950 text-white">{t("Life Insurance & Family Protection")}</option>
                  <option value="health" className="bg-slate-950 text-white">{t("Health & Cashless Hospitalization")}</option>
                  <option value="motor" className="bg-slate-950 text-white">{t("Motor/Vehicle Comprehensive Shield")}</option>
                  <option value="business" className="bg-slate-950 text-white">{t("Business Assets & Fire/Burglary Covers")}</option>
                  <option value="sip" className="bg-slate-950 text-white">{t("Goal-Based SIP & Mutual Funds compounding")}</option>
                  <option value="tax" className="bg-slate-950 text-white">{t("Tax Savings Strategies (80C / 80D)")}</option>
                </select>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label htmlFor="form-message" className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {t("Write Your Specific Query (Optional)")} <span className="text-amber-500">*</span>
                </label>
                <textarea
                  id="form-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? "Detail your specific goals, existing assets, or questions..." : "మీ నిర్దిష్ట ప్రశ్నలు లేదా ఆర్థిక లక్ష్యాల వివరాలను ఇక్కడ తెలపండి..."}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Status messages and Submit button */}
              <div className="pt-2 space-y-3">
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium"
                  >
                    {t("An error occurred. Please try again.")}
                  </motion.div>
                )}

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium"
                  >
                    {t("Thank you! Your request has been sent successfully.")}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-600/10 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer outline-none"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("Submitting request...")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("Submit Consultation Request")}
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>

        </div>

        {/* Advisory trust response notice */}
        <div className="relative z-10 max-w-xl mx-auto mt-8 bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-600 font-extrabold tracking-wider block">
            {language === 'en' ? "Advisory Excellence Standard" : "విశిష్ట సలహా ప్రమాణాలు"}
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {language === 'en' 
              ? "All personal messages directly through hotlines or WhatsApp receive direct evaluation from D T V S SWAMY within standard working hours."
              : "హాట్‌లైన్లు లేదా వాట్సాప్ ద్వారా వచ్చే సందేశాలకు శ్రీ డి టి వి ఎస్ స్వామి గారు స్వయంగా స్పందించి తగిన సలహాలను అందిస్తారు."}
          </p>
        </div>
      </section>

    </div>
  );
}
