/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { ArrowUp, MessageSquare, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import FaqView from './components/FaqView';
import ResourcesView from './components/ResourcesView';

declare global {
  interface Window {
    navigateToHash?: (hash: string) => void;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const getPageFromHash = (hash: string): string => {
    if (!hash || hash === '#' || hash === '#home') return 'home';
    if (hash === '#resources') return 'resources';
    if (hash.startsWith('#faq')) return 'faq';
    if (hash.startsWith('#services') || ['#life-insurance', '#health-insurance', '#car-insurance', '#general-insurance', '#mutual-funds'].some(h => hash.startsWith(h))) return 'services';
    if (['#hero', '#about', '#why-choose-us', '#stats', '#awards', '#partners', '#testimonials', '#contact'].includes(hash)) return 'home';
    return 'home';
  };

  const [faqInitialCategory, setFaqInitialCategory] = useState<'all' | 'life' | 'health' | 'auto' | 'general' | 'investments' | 'tax'>('all');
  const [preFilledMessage, setPreFilledMessage] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  const updateStateForPageAndHash = (targetPage: string, hash: string, sectionIdFromState?: string | null) => {
    setCurrentPage(targetPage);
    
    if (targetPage === 'faq') {
      if (hash.startsWith('#faq-')) {
        const cat = hash.split('-')[1] as any;
        if (['life', 'health', 'auto', 'general', 'investments', 'tax'].includes(cat)) {
          setFaqInitialCategory(cat);
        }
      } else {
        setFaqInitialCategory('all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (targetPage === 'services') {
      if (sectionIdFromState) {
        setPendingScroll(sectionIdFromState);
      } else if (hash && hash !== '#services') {
        const sectionId = hash.substring(1);
        setPendingScroll(sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (targetPage === 'home') {
      if (sectionIdFromState) {
        setPendingScroll(sectionIdFromState);
      } else if (hash && hash !== '#home' && hash !== '#') {
        const sectionId = hash.substring(1);
        setPendingScroll(sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (targetPage === 'resources') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateTo = (targetPage: string, hash: string, replace: boolean = false) => {
    const page = targetPage || getPageFromHash(hash);
    
    let targetSectionId: string | null = null;
    if (hash && hash.startsWith('#') && hash !== '#' && hash !== '#home' && hash !== '#services' && hash !== '#faq' && hash !== '#resources') {
      targetSectionId = hash.substring(1);
    }
    
    // Explicit state validation to avoid duplicate history states
    const currentState = window.history.state;
    if (currentState && currentState.page === page && currentState.hash === hash && currentState.sectionId === targetSectionId && !replace) {
      updateStateForPageAndHash(page, hash, targetSectionId);
      return;
    }

    updateStateForPageAndHash(page, hash, targetSectionId);

    const state = { page, hash, sectionId: targetSectionId };
    const url = hash ? `${window.location.pathname}${hash}` : window.location.pathname;
    try {
      if (replace) {
        window.history.replaceState(state, '', url);
      } else {
        window.history.pushState(state, '', url);
      }
    } catch (e) {
      console.warn('History navigation failed:', e);
    }
  };

  // Keep a ref to avoid closure issues with navigateTo
  const navigateToRef = useRef(navigateTo);
  useEffect(() => {
    navigateToRef.current = navigateTo;
  });

  // Global navigator function definition
  useEffect(() => {
    window.navigateToHash = (hash: string) => {
      const page = getPageFromHash(hash);
      navigateToRef.current(page, hash, false);
    };
    return () => {
      delete window.navigateToHash;
    };
  }, []);

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Monitor scroll for back-to-top buttons
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle HTML5 History popstate event robustly
  useEffect(() => {
    const initialHash = window.location.hash;
    const initialPage = getPageFromHash(initialHash);
    
    let initialSectionId: string | null = null;
    if (initialHash && initialHash.startsWith('#') && initialHash !== '#' && initialHash !== '#home' && initialHash !== '#services' && initialHash !== '#faq' && initialHash !== '#resources') {
      initialSectionId = initialHash.substring(1);
    }

    // Always seed initial history state so browser back works reliably from deep link
    if (!window.history.state) {
      window.history.replaceState({ page: initialPage, hash: initialHash, sectionId: initialSectionId }, '', window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state === 'object' && 'page' in event.state) {
        const page = event.state.page;
        const hash = event.state.hash || '';
        const sectionId = event.state.sectionId || null;
        if (['home', 'services', 'faq', 'resources'].includes(page)) {
          updateStateForPageAndHash(page, hash, sectionId);
        } else {
          const fallbackPage = getPageFromHash(window.location.hash);
          updateStateForPageAndHash(fallbackPage, window.location.hash, null);
        }
      } else {
        const fallbackPage = getPageFromHash(window.location.hash);
        updateStateForPageAndHash(fallbackPage, window.location.hash, null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for native hash changes defensively
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const targetPage = getPageFromHash(hash);
      const currentState = window.history.state;

      let sectionId: string | null = null;
      if (hash && hash.startsWith('#') && hash !== '#' && hash !== '#home' && hash !== '#services' && hash !== '#faq' && hash !== '#resources') {
        sectionId = hash.substring(1);
      }

      // Avoid double pushing if history state is already in sync with the current URL
      if (currentState && currentState.page === targetPage && currentState.hash === hash && currentState.sectionId === sectionId) {
        return;
      }

      updateStateForPageAndHash(targetPage, hash, sectionId);
      try {
        window.history.replaceState({ page: targetPage, hash, sectionId }, '', window.location.href);
      } catch (e) {
        console.warn('replaceState on hashchange failed:', e);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial routing securely on mount
    const initialHash = window.location.hash;
    const initialPage = getPageFromHash(initialHash);
    let initialSectionId: string | null = null;
    if (initialHash && initialHash.startsWith('#') && initialHash !== '#' && initialHash !== '#home' && initialHash !== '#services' && initialHash !== '#faq' && initialHash !== '#resources') {
      initialSectionId = initialHash.substring(1);
    }
    updateStateForPageAndHash(initialPage, initialHash, initialSectionId);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle pending scrolling logic with header offset and layout transition delay
  useEffect(() => {
    if (pendingScroll) {
      let attempts = 0;
      const interval = setInterval(() => {
        const element = document.getElementById(pendingScroll);
        if (element) {
          // Allow layout transition animations (like page entries) to settle
          setTimeout(() => {
            const headerOffset = 110; // Fixed header/navbar height offset
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 150);
          setPendingScroll(null);
          clearInterval(interval);
        } else {
          attempts++;
          if (attempts > 15) {
            setPendingScroll(null);
            clearInterval(interval);
          }
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentPage, pendingScroll]);

  const handleScrollToSection = (sectionId: string) => {
    const servicesSections = ['life-insurance', 'health-insurance', 'car-insurance', 'general-insurance', 'mutual-funds'];
    const targetPage = servicesSections.includes(sectionId) ? 'services' : 'home';

    navigateTo(targetPage, `#${sectionId}`, false);
  };

  const handleNavigateToFaqCategory = (cat: 'life' | 'health' | 'auto' | 'general' | 'investments' | 'tax', scrollOffset: number = 120) => {
    setFaqInitialCategory(cat);
    navigateTo('faq', `#faq-${cat}`, false);
  };

  const handlePageChange = (page: string) => {
    navigateTo(page, '', false);
  };

  const handleNavigateToContact = (msg?: string) => {
    if (msg) {
      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/919885539211?text=${encoded}`, '_blank');
    } else {
      handleScrollToSection('contact');
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Header & Navigation Menu */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        onScrollToSection={handleScrollToSection}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 2. Primary Page Router View */}
      <main className="flex-grow pt-16 w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <HomeView 
                preFilledMessage={preFilledMessage}
                setPreFilledMessage={setPreFilledMessage}
                onNavigateToResources={() => {
                  window.location.hash = '#resources';
                }}
              />
            </motion.div>
          )}

          {currentPage === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <ServicesView 
                onNavigateToFaqCategory={handleNavigateToFaqCategory}
                onNavigateToContact={handleNavigateToContact}
              />
            </motion.div>
          )}

          {currentPage === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FaqView 
                initialCategoryFilter={faqInitialCategory}
                onCategoryChange={setFaqInitialCategory}
              />
            </motion.div>
          )}

          {currentPage === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ResourcesView 
                onSetContactMessage={handleNavigateToContact}
                onNavigateToFaqCategory={handleNavigateToFaqCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Consistent Footers */}
      <Footer 
        setCurrentPage={handlePageChange}
        onScrollToSection={handleScrollToSection}
      />

      {/* Floating Speed Dials & Quick Links */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3.5 z-50">
        
        {/* Floating Quick Contact CTA (appears on scroll to drive conversions) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.a 
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ type: 'spring', damping: 18, stiffness: 150 }}
              href="https://wa.me/919885539211?text=Hello%20Mr.%20D%20T%20V%20S%20SWAMY,%20I'm%20interested%20in%20your%20financial%20advisory%20services." 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-xl shadow-[#25D366]/20 hover:shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer outline-none select-none"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 fill-white text-[#25D366]" />
              <span className="text-[11px] font-black uppercase tracking-wider font-display shrink-0">Quick Contact</span>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
              </span>
            </motion.a>
          )}
        </AnimatePresence>

        {/* Back To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleBackToTop}
              className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-amber-500 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer outline-none flex items-center justify-center"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
