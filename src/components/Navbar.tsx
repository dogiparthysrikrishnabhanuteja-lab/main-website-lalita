/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Award, Star, ShieldAlert, Sparkles, MessageCircle, PhoneCall, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onScrollToSection: (sectionId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, onScrollToSection, theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100; // mathematically exact 100% progress tracking
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string, sectionId?: string) => {
    setIsOpen(false);
    setDropdownOpen(false);
    
    if (sectionId) {
      onScrollToSection(sectionId);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/85 dark:border-slate-800/85 py-3 shadow-md' 
          : 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm py-4 border-b border-slate-100 dark:border-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand / Company name formatted elegantly as TWO lines to support user intent perfectly */}
          <button 
            onClick={() => handleNavClick('home', 'hero')}
            className="flex items-center gap-3 text-left group cursor-pointer outline-none shrink-0"
          >
            <div className="h-10 w-1 bg-amber-500 rounded-full shrink-0 group-hover:scale-y-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-900 dark:text-white font-display group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors uppercase leading-none">
                Lalita Financial
              </span>
              <span className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-600 dark:text-amber-400 font-display group-hover:text-amber-500 transition-colors uppercase leading-none mt-1">
                Services
              </span>
              <span className="text-[9px] tracking-wider text-slate-500 dark:text-slate-400 font-mono font-bold leading-none mt-1 uppercase whitespace-nowrap">
                D T V S Swamy • MDRT Advisor
              </span>
            </div>
          </button>

          {/* Desktop Navigation - Rearranged, with increased font size & robust dark-mode coloring */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home', 'hero')}
              className={`px-3 py-2 text-[15px] xl:text-[16px] font-extrabold transition-colors cursor-pointer outline-none touch-target whitespace-nowrap ${
                currentPage === 'home' 
                  ? 'text-amber-600 dark:text-amber-400 font-black' 
                  : 'text-slate-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              Home
            </button>

            {/* Dropdown Services Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('services')}
                className={`px-3 py-2 text-[15px] xl:text-[16px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer outline-none touch-target whitespace-nowrap ${
                  currentPage === 'services' 
                    ? 'text-amber-600 dark:text-amber-400 font-black' 
                    : 'text-slate-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                Services <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-slate-400" />
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-1 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl"
                  >
                    {[
                      { l: 'Life Insurance Solutions', h: 'life-insurance' },
                      { l: 'Health Insurance Systems', h: 'health-insurance' },
                      { l: 'Motor Insurance Coverage', h: 'car-insurance' },
                      { l: 'General Insurance Solutions', h: 'general-insurance' },
                      { l: 'Mutual Funds & Wealth', h: 'mutual-funds' },
                    ].map((srv, idx) => (
                      <button
                        key={idx}
                        onClick={() => { handleNavClick('services', srv.h); setDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-amber-600 dark:hover:text-amber-400 transition-colors justify-start outline-none cursor-pointer font-bold whitespace-nowrap"
                      >
                        {srv.l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavClick('resources')}
              className={`px-3 py-2 text-[15px] xl:text-[16px] font-extrabold transition-colors cursor-pointer outline-none touch-target whitespace-nowrap ${
                currentPage === 'resources' 
                  ? 'text-amber-600 dark:text-amber-400 font-black' 
                  : 'text-slate-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              Resources
            </button>

            {/* Dropdown About Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('home', 'about')}
                className={`px-3 py-2 text-[15px] xl:text-[16px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer outline-none touch-target whitespace-nowrap ${
                  currentPage === 'home' && (window.location.hash === '#about' || window.location.hash === '#stats')
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-slate-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                About <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-slate-400" />
              </button>
              
              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-1 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl"
                  >
                    <button
                      onClick={() => { handleNavClick('home', 'about'); setAboutDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-amber-600 dark:hover:text-amber-400 transition-colors justify-start outline-none cursor-pointer font-bold whitespace-nowrap"
                    >
                      About Swamy
                    </button>
                    <button
                      onClick={() => { handleNavClick('home', 'stats'); setAboutDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-amber-600 dark:hover:text-amber-400 transition-colors justify-start outline-none cursor-pointer font-bold whitespace-nowrap"
                    >
                      Our Impact & Stats
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavClick('faq')}
              className={`px-3 py-2 text-[15px] xl:text-[16px] font-extrabold transition-colors cursor-pointer outline-none touch-target whitespace-nowrap ${
                currentPage === 'faq' 
                  ? 'text-amber-600 dark:text-amber-400 font-black' 
                  : 'text-slate-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Right Hand Call to Action Indicator / Simplified layout, moved Contact into extreme right CTA to guarantee zero double line navigation items text wrapping! */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-full transition-all cursor-pointer outline-none touch-target"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500 animate-[spin_10s_linear_infinite]" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => handleNavClick('home', 'contact')}
              className="px-4.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all outline-none cursor-pointer flex items-center gap-2 shadow-md shadow-amber-600/10 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" /> Book Call
            </button>
          </div>

          {/* Hamburger Mobile Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg outline-none cursor-pointer touch-target"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950 z-[99] xl:hidden"
            />            {/* Slide-In Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-[290px] sm:w-[340px] bg-white dark:bg-slate-900 h-screen z-[100] shadow-2xl xl:hidden flex flex-col border-l border-slate-100 dark:border-slate-800"
            >
              {/* Drawer Side Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-extrabold tracking-widest text-slate-900 dark:text-white font-display uppercase leading-tight">
                    Lalita Financial
                  </span>
                  <span className="text-[9px] tracking-wider text-slate-500 dark:text-slate-400 font-mono font-bold leading-normal uppercase">
                    D T V S SWAMY • MDRT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors cursor-pointer outline-none"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer outline-none"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto px-5 py-6 space-y-4 font-display">
                <button
                  onClick={() => handleNavClick('home', 'hero')}
                  className={`w-full text-left py-2 text-sm font-extrabold flex items-center justify-between transition-colors ${
                    currentPage === 'home' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('home', 'about')}
                  className="w-full text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavClick('home', 'stats')}
                  className="w-full text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Our Impact
                </button>

                {/* Submenu for Services */}
                <div className="py-2.5 border-t border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full text-left flex items-center justify-between text-[11px] font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase font-extrabold outline-none cursor-pointer"
                  >
                    <span>Services</span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1.5 pl-2 pt-1 overflow-hidden"
                      >
                        {[
                          { l: 'Life Insurance Solutions', h: 'life-insurance' },
                          { l: 'Health Insurance Systems', h: 'health-insurance' },
                          { l: 'Motor Insurance Protection', h: 'car-insurance' },
                          { l: 'General Insurance Solutions', h: 'general-insurance' },
                          { l: 'Mutual Funds & Compounding', h: 'mutual-funds' },
                        ].map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleNavClick('services', s.h)}
                            className="w-full text-left pl-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block font-semibold"
                          >
                            • {s.l}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => handleNavClick('faq')}
                  className={`w-full text-left py-2 text-sm font-medium hover:text-amber-600 dark:hover:text-amber-400 transition-colors ${
                    currentPage === 'faq' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  FAQ
                </button>

                <button
                  onClick={() => handleNavClick('resources')}
                  className={`w-full text-left py-2 text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    currentPage === 'resources' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" /> Resources
                </button>

                <button
                  onClick={() => handleNavClick('home', 'contact')}
                  className="w-full text-left py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-t border-slate-100 dark:border-slate-800 pt-3"
                >
                  Contact
                </button>
              </div>

              {/* Drawer Footer Status block */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shrink-0 text-center space-y-1.5">
                <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-700 dark:text-slate-300 block">D T V S SWAMY • MDRT ADVISOR</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono block">Call: +91 98855 39211</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Thin, Animated Gold Scroll Progress Bar at the very top of the viewport (active on all scrollable pages) */}
      <div 
        style={{ width: `${scrollProgress}%` }} 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 transition-all duration-75 ease-out z-[9999] shadow-[0_1px_8px_rgba(245,158,11,0.5)]"
      />

      {/* Subtle floating desktop percentage tooltip indicator drop down near the progress bar */}
      <div className="hidden md:flex fixed top-[3px] right-6 z-[9999] pointer-events-none select-none">
        <div className="bg-slate-900 border-b border-x border-slate-850/80 text-amber-500 font-mono text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-b-md shadow-md shadow-slate-900/10 flex items-center gap-1.5 transition-all duration-150">
          <span className="text-slate-400">READ PROGRESS</span>
          <span className="text-white bg-amber-600/20 px-1 py-0.2 rounded text-[8px]">{Math.round(scrollProgress)}%</span>
        </div>
      </div>
    </header>
  );
}
