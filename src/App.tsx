/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import FaqView from './components/FaqView';
import ResourcesView from './components/ResourcesView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

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

  const [faqInitialCategory, setFaqInitialCategory] = useState<'all' | 'life' | 'health' | 'auto' | 'general' | 'investments'>('all');
  const [preFilledMessage, setPreFilledMessage] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

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

  // Listen for browser hash anchors to trigger appropriate view mapping
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (['#life-insurance', '#health-insurance', '#car-insurance', '#general-insurance', '#mutual-funds'].some(h => hash.startsWith(h))) {
        setCurrentPage('services');
        setTimeout(() => {
          const srvElement = document.getElementById(hash.substring(1));
          if (srvElement) srvElement.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash.startsWith('#faq-')) {
        setCurrentPage('faq');
        const srvCategory = hash.split('-')[1] as any;
        if (['life', 'health', 'auto', 'general', 'investments'].includes(srvCategory)) {
          setFaqInitialCategory(srvCategory);
        }
      } else if (hash === '#resources') {
        setCurrentPage('resources');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#faq') {
        setCurrentPage('faq');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#services') {
        setCurrentPage('services');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (['#hero', '#about', '#why-choose-us', '#stats', '#awards', '#partners', '#testimonials', '#contact'].includes(hash)) {
        setCurrentPage('home');
        setTimeout(() => {
          const sectionEl = document.getElementById(hash.substring(1));
          if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set active view safely depending on custom routing hashes, but prevent default redirect to full-screen modules like resources on initial mount
    const initialHash = window.location.hash;
    if (initialHash && !['#resources', '#faq', '#services'].includes(initialHash)) {
      handleHashChange();
    } else {
      setCurrentPage('home');
      if (initialHash && ['#resources', '#faq', '#services'].includes(initialHash)) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch (error) {
          console.warn('replaceState blocked or failed:', error);
        }
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Monitor for pending section scrolls once target page loads
  useEffect(() => {
    if (pendingScroll) {
      let attempts = 0;
      const interval = setInterval(() => {
        const element = document.getElementById(pendingScroll);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setPendingScroll(null);
          clearInterval(interval);
        } else {
          attempts++;
          if (attempts > 15) { // abort after 1.5 seconds if element doesn't exist yet
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

    if (currentPage !== targetPage) {
      setPendingScroll(sectionId);
      setCurrentPage(targetPage);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigateToFaqCategory = (cat: 'life' | 'health' | 'auto' | 'general' | 'investments') => {
    setFaqInitialCategory(cat);
    setCurrentPage('faq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setCurrentPage={setCurrentPage}
        onScrollToSection={handleScrollToSection}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 2. Primary Page Router View */}
      <main className="flex-grow pt-16 overflow-hidden">
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
                  setCurrentPage('resources');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setCurrentPage={setCurrentPage}
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
