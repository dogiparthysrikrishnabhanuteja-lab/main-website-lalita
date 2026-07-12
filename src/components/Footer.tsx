/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapPin, Clock, Facebook, MessageSquare, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Footer({ setCurrentPage, onScrollToSection }: FooterProps) {
  const { language, t } = useLanguage();
  
  const handleLinkClick = (page: string, hashId?: string) => {
    if (hashId) {
      onScrollToSection(hashId);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand & MDRT description */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-lg font-display tracking-wide uppercase">
              {language === 'en' ? "D T V S SWAMY" : "డి టి వి ఎస్ స్వామి"}
            </h4>
            <p className="text-sm leading-relaxed text-slate-400">
              {t("Trusted Insurance & Wealth Portfolios tailored to your actual cash flows by MDRT Advisor D T V S Swamy.")}
            </p>
            <div className="flex items-center gap-3 pt-3">
              <a 
                href="https://wa.me/919885539211" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 flex items-center justify-center transition-all cursor-pointer outline-none border border-[#25D366]/20"
                aria-label="Connect on WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-4 font-display">
              {t("Quick Links")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleLinkClick('home')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  {t("Home")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('home', 'about')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  {t("About")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('services')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  {t("Services")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('resources')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  {t("Resources")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('faq')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  {t("FAQ")}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('home', 'contact')} 
                  className="hover:text-amber-400 text-slate-300 transition-colors text-left outline-none cursor-pointer"
                >
                  {t("Contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Reach Swamy (Contact details & office hours) */}
          <div className="space-y-3.5 text-sm">
            <h4 className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-2 font-display">
              {t("Contact Details")}
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed text-slate-300 font-sans">
                {language === 'en' 
                  ? "Flat No. 101, Golden Park Apartment, Tarakarama Nagar, Karempudi Road, VINUKONDA - 522647, Palnadu Dist." 
                  : "ఫ్లాట్ నెం. 101, గోల్డెన్ పార్క్ అపార్ట్‌మెంట్, తారకరామ నగర్, కారెంపూడి రోడ్, వినుకొండ - 522647, పల్నాడు జిల్లా."}
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
                <p className="text-slate-300">
                  {language === 'en' ? "Mon - Sat: 9:00 AM - 6:00 PM" : "సోమ - శని: ఉదయం 9:00 - సాయంత్రం 6:00"}
                </p>
                <p className="text-red-400 font-bold">
                  {language === 'en' ? "Sunday: Closed" : "ఆదివారం: సెలవు"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Border / Credentials Section */}
        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-mono font-semibold">
            {language === 'en' 
              ? "© 2026 Lalita Financial Advisory. Registered Chief Life Planner Hub." 
              : "© 2026 లలితా ఫైనాన్షియల్ అడ్వైజరీ. రిజిస్టర్డ్ చీఫ్ లైఫ్ ప్లానర్ హబ్."}
          </p>
          <p className="text-slate-500 max-w-2xl leading-relaxed font-sans">
            {language === 'en' 
              ? "Represented associations include ICICI Prudential, Tata AIA Life, HDFC Life, Care Health, Niva Bupa, Star Health, TATA AIG, HDFC Ergo, Kotak Life, Bajaj Life, Axis Max Life, and Prudent corporate platforms." 
              : "మేము ఐసిఐసిఐ ప్రుడెన్షియల్, టాటా ఎఐఎ లైఫ్, హెచ్‌డిఎఫ్‌సి లైఫ్, కేర్ హెల్త్, నివా బుపా, స్టార్ హెల్త్, టాటా ఎఐజి, హెచ్‌డిఎఫ్‌సి ఎర్గో, కోటక్ లైఫ్, బజాజ్ లైఫ్, యాక్సిస్ మ్యాక్స్ లైఫ్ మరియు ప్రుడెంట్ వంటి అగ్రశ్రేణి సంస్థలతో అనుబంధం కలిగి ఉన్నాము."}
          </p>
        </div>
      </div>
    </footer>
  );
}
