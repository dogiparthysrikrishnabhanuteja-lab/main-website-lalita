/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapPin, Clock, Facebook, MessageSquare, Linkedin } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Footer({ setCurrentPage, onScrollToSection }: FooterProps) {
  
  const handleLinkClick = (page: string, hashId?: string) => {
    const targetHash = hashId ? `#${hashId}` : `#${page}`;
    if (window.location.hash === targetHash) {
      setCurrentPage(page);
      if (hashId) {
        setTimeout(() => {
          const element = document.getElementById(hashId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (window.navigateToHash) {
        window.navigateToHash(targetHash);
      } else {
        window.location.hash = targetHash;
      }
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand & MDRT description */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-lg font-display tracking-wide uppercase">D T V S SWAMY</h4>
            <p className="text-sm leading-relaxed text-slate-350">
              MDRT Advisor. Providing insightful, objective, and ethical financial protection, health systems, and compounding wealth strategies for families and business owners.
            </p>
            <div className="flex items-center gap-3 pt-3">
              <a 
                href="https://wa.me/919885539211" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 flex items-center justify-center transition-all cursor-pointer outline-none"
                aria-label="Connect on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-all cursor-not-allowed"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 flex items-center justify-center transition-all cursor-not-allowed"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick('home', 'about')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('services')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('resources')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  Calculators
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('faq')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('home', 'contact')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>


          {/* Column 4: Reach Swamy (Contact details & office hours) */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-2 font-display">Reach Our Office</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed text-slate-300 font-sans">
                Flat No. 101, Golden Park Apartment, Tarakarama Nagar, Karempudi Road, VINUKONDA - 522647, Palnadu Dist.
              </span>
            </div>
            <div className="flex items-start gap-2 font-mono text-xs text-slate-300">
              <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href="tel:+919885539211" className="hover:text-amber-400 transition-colors font-semibold">+91 9885539211</a>
                <a href="tel:+917799322556" className="hover:text-amber-400 transition-colors font-semibold">+91 7799322556</a>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs pt-2 border-t border-slate-800">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-300">Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p className="text-red-400 font-bold">Sunday: Rest Closed</p>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Border / Credentials Section */}
        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-mono font-semibold">
            © 2026 Lalita Financial Advisory. Registered Chief Life Planner Hub.
          </p>
          <p className="text-slate-500 max-w-2xl leading-relaxed font-sans">
            Represented associations include ICICI Prudential, Tata AIA Life, HDFC Life, Care Health, Niva Bupa, Star Health, TATA AIG, HDFC Ergo, Kotak Life, Bajaj Life, Axis Max Life, and Prudent corporate platforms.
          </p>
        </div>
      </div>
    </footer>
  );
}
