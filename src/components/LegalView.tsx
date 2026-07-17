/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle, Info, Lock, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

type Tab = 'privacy' | 'terms' | 'cookies';

export default function LegalView() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('privacy');

  useEffect(() => {
    // Scroll to top of the screen when loading legal view
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto-detect hash if deep linked
    const hash = window.location.hash;
    if (hash === '#privacy-policy') {
      setActiveTab('privacy');
    } else if (hash === '#terms-of-service') {
      setActiveTab('terms');
    } else if (hash === '#cookie-policy') {
      setActiveTab('cookies');
    }
  }, []);

  const handleTabChange = (tab: Tab, hash: string) => {
    setActiveTab(tab);
    window.history.replaceState({ page: 'legal', hash }, '', hash);
  };

  const handleBackToHome = () => {
    if (window.navigateToHash) {
      window.navigateToHash('#home');
    } else {
      window.location.hash = '#home';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16 md:py-20 transition-colors duration-300 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Back Button and Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase hover:text-amber-700 dark:hover:text-amber-300 transition-colors outline-none cursor-pointer group"
              aria-label="Back to Home Page"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {language === 'en' ? "Back to Home" : "హోమ్‌కి వెళ్ళండి"}
            </button>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white uppercase">
              {language === 'en' ? "Legal & Disclosures" : "చట్టపరమైన నిబంధనలు & వెల్లడింపులు"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              {language === 'en' ? "LALITA FINANCIAL SERVICES • CHIEF ADVISOR D T V S SWAMY" : "లలితా ఫైనాన్షియల్ సర్వీసెస్ • ప్రధాన సలహాదారు డి టి వి ఎస్ స్వామి"}
            </p>
          </div>
          
          {/* Quick Contact Box */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3 shadow-sm shrink-0">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {language === 'en' ? "Assurance Protocol" : "భద్రతా ప్రమాణం"}
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {language === 'en' ? "100% Secure & Confidential" : "100% సురక్షితం & గోప్యమైనది"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation Control */}
        <div className="flex border border-slate-200 dark:border-slate-800 p-1 rounded-xl bg-white dark:bg-slate-900/40 w-full sm:max-w-lg mx-auto" role="tablist">
          {[
            { id: 'privacy', labelEn: 'Privacy Policy', labelTe: 'గోప్యతా విధానం', hash: '#privacy-policy' },
            { id: 'terms', labelEn: 'Terms of Service', labelTe: 'సేవా నిబంధనలు', hash: '#terms-of-service' },
            { id: 'cookies', labelEn: 'Cookie Policy', labelTe: 'కుకీల విధానం', hash: '#cookie-policy' }
          ].map((tItem) => (
            <button
              key={tItem.id}
              role="tab"
              aria-selected={activeTab === tItem.id}
              onClick={() => handleTabChange(tItem.id as Tab, tItem.hash)}
              className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold tracking-tight rounded-lg transition-all cursor-pointer outline-none ${
                activeTab === tItem.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/15'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              {language === 'en' ? tItem.labelEn : tItem.labelTe}
            </button>
          ))}
        </div>

        {/* Dynamic content rendering with native transitions */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900/60 border border-slate-200/85 dark:border-slate-850/80 p-6 sm:p-10 rounded-2xl shadow-md"
        >
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed text-left font-sans">
              
              {/* Header section */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" /> {language === 'en' ? "Data Protection Shield" : "సమాచార రక్షణ కవచం"}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {language === 'en' ? "Privacy & Protection Policy" : "వ్యక్తిగత గోప్యతా & రక్షణ విధానం"}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {language === 'en' ? "Last Updated: July 2026 • Under MDRT Professional Integrity Code" : "చివరి సవరణ: జూలై 2026 • MDRT వృత్తిపరమైన నిజాయితీ నిబంధనల ప్రకారం"}
                </p>
              </div>

              {/* Details Paragraphs */}
              <div className="space-y-4">
                <p>
                  {language === 'en' ? (
                    "At Lalita Financial Services, founded and managed by MDRT Certified Chief Advisor Mr. D T V S SWAMY, we hold your absolute personal privacy as a lifelong covenant of trust. We recognize that financial parameters represent deeply confidential information. This Privacy Policy details how we collect, safeguard, and responsibly process your details."
                  ) : (
                    "లలితా ఫైనాన్షియల్ సర్వీసెస్ వద్ద, ఎండీఆర్‌టీ (MDRT) సర్టిఫైడ్ ప్రధాన సలహాదారు శ్రీ డి టి వి ఎస్ స్వామి గారిచే స్థాపించబడి మరియు నిర్వహించబడుతున్న ఈ సంస్థలో, మీ పూర్తి వ్యక్తిగత గోప్యతను మేము జీవితకాల నమ్మకంగా భావిస్తాము. మీ ఆర్థిక వివరాలు అత్యంత రహస్యమైనవని మేము గుర్తిస్తాము. మీ సమాచారాన్ని మేము ఎలా సేకరిస్తాము, భద్రపరుస్తాము మరియు బాధ్యతాయుతంగా ఉపయోగిస్తాము అనేది ఈ గోప్యతా విధానం వివరిస్తుంది."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  1. {language === 'en' ? "Information We Collect" : "మేము సేకరించే సమాచారం"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "When you submit a Personal Portfolio Consultation Request on our platform, we collect only the essential details necessary to contact you and configure custom compatibility parameters:"
                  ) : (
                    "మా ప్లాట్‌ఫారమ్‌లో మీరు వ్యక్తిగత పోర్ట్‌ఫోలియో సంప్రదింపు అభ్యర్థనను సమర్పించినప్పుడు, మిమ్మల్ని సంప్రదించడానికి మరియు మీ అవసరాలకు తగిన ఆర్థిక వ్యూహాలను రూపొందించడానికి అవసరమైన ముఖ్యమైన వివరాలను మాత్రమే మేము సేకరిస్తాము:"
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>{language === 'en' ? "Personal Identifiers:" : "వ్యక్తిగత గుర్తింపు వివరాలు:"}</strong> {language === 'en' ? "Your Full Name, Email Address, and Phone Number." : "మీ పూర్తి పేరు, ఈమెయిల్ చిరునామా మరియు ఫోన్ నంబర్."}</li>
                  <li><strong>{language === 'en' ? "Advisory Intent:" : "సలహా అవసరం విభాగం:"}</strong> {language === 'en' ? "Your chosen goals (e.g., Term Life, Cashless Health Covers, Goal-Based SIPs)." : "మీరు ఎంచుకున్న ప్రధాన లక్ష్యం (ఉదాహరణకు: జీవిత బీమా, క్యాష్‌లెస్‌ ఆరోగ్య బీమా, ఎస్‌ఐపీ చక్రవడ్డీ పెట్టుబడులు)."}</li>
                  <li><strong>{language === 'en' ? "Preferred Mode:" : "అనుకూలమైన సంప్రదింపు మార్గం:"}</strong> {language === 'en' ? "How you prefer to speak with our advisory desk (Voice Call, WhatsApp, In-Person)." : "మా సలహా విభాగంతో మాట్లాడటానికి మీరు ఇష్టపడే మార్గం (వాయిస్ కాల్, వాట్సాప్ లేదా నేరుగా కలవడం)."}</li>
                  <li><strong>{language === 'en' ? "Custom Queries:" : "నిర్దిష్ట ప్రశ్నలు:"}</strong> {language === 'en' ? "Any additional details or message parameters you optionally enter into the inquiry card." : "విచారణ ఫారమ్‌లో మీరు ఐచ్ఛికంగా రాసే ఏవైనా నిర్దిష్ట ప్రశ్నలు లేదా అదనపు సందేశాలు."}</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  2. {language === 'en' ? "How We Use Your Data" : "మీ సమాచారాన్ని మేము ఎలా ఉపయోగిస్తాము"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "We strictly utilize your data exclusively to service your advisory request. There are zero automated marketing call loops, and absolutely no data sharing with third-party promotional agencies. Your info is used solely to:"
                  ) : (
                    "మీ సంప్రదింపు అభ్యర్థనకు తగిన సేవలను అందించడానికి మాత్రమే మేము మీ వివరాలను ఉపయోగిస్తాము. ఎటువంటి అయాచిత మార్కెటింగ్ కాల్స్ చేయబడవు మరియు ప్రమోషనల్ ఏజెన్సీలతో సమాచారం పంచుకోబడదు. మీ సమాచారం కేవలం కింది వాటి కోసం ఉపయోగించబడుతుంది:"
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>{language === 'en' ? "Arrange a direct, personalized portfolio consultation." : "వ్యక్తిగత పోర్ట్‌ఫోలియో సలహా కోసం నేరుగా మిమ్మల్ని సంప్రదించడం."}</li>
                  <li>{language === 'en' ? "Formulate customized CAGR wealth projection metrics or coverage sums matching your cash flows." : "మీ ఆదాయ వ్యయాలకు సరిపోయే విధంగా జీవిత బీమా మొత్తం లేదా ఎస్‌ఐపీ చక్రవడ్డీ వృద్ధి అంచనాలను లెక్కించడం."}</li>
                  <li>{language === 'en' ? "Coordinate with licensed carrier desks (e.g., Tata AIA, Care Health, HDFC Life) to secure premium rates." : "మీకు తక్కువ ప్రీమియంతో అత్యుత్తమ ప్లాన్లను అందించడానికి మా భాగస్వామ్య కంపెనీల (ఉదా: టాటా AIA, కేర్ హెల్త్, హెచ్‌డిఎఫ్‌సి లైఫ్) ద్వారా కోట్స్ పొందడం."}</li>
                  <li>{language === 'en' ? "Provide swift, emergency hand-holding support during critical medical hospitalizations or vehicular damage surveys." : "వైద్య అత్యవసర సమయాల్లో క్యాష్‌లెస్‌ ఆసుపత్రుల వద్ద లేదా వాహన ప్రమాద సర్వే సమయాల్లో తక్షణ సహాయాన్ని అందించడం."}</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  3. {language === 'en' ? "Information Safeguards & Security" : "సమాచార భద్రతా చర్యలు"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "We implement robust server-side security architectures to ensure complete integrity. Personal inquiries are saved securely in our isolated local vault (managed via Advisor Portal). Absolutely no data is stored in vulnerable plain-text client formats."
                  ) : (
                    "మీ సమాచారానికి పూర్తి రక్షణ కల్పించడానికి మేము సురక్షితమైన సర్వర్-సైడ్ సెక్యూరిటీ పద్ధతులను ఉపయోగిస్తాము. మీ విచారణ సమాచారం మా సలహాదారుల సురక్షిత పోర్టల్ డేటాబేస్లో మాత్రమే భద్రంగా దాచబడుతుంది. ఎక్కడా బహిరంగంగా సేకరించబడదు."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  4. {language === 'en' ? "Third-Party Disclosures & Regulator Compliance" : "నియంత్రణ సంస్థల నిబంధనలు"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "Lalita Financial Services coordinates with official regulatory authorities. Financial disclosures and tax saving parameters adhere strictly to IRDAI (Insurance Regulatory and Development Authority of India) and AMFI (Association of Mutual Funds in India) guidelines. We only share details with partner insurance underwriting desks after your explicit approval."
                  ) : (
                    "లలితా ఫైనాన్షియల్ సర్వీసెస్ అధికారిక నియంత్రణ సంస్థల నిబంధనలను ఖచ్చితంగా పాటిస్తుంది. పన్ను ఆదా మరియు పెట్టుబడి నిబంధనలన్నీ ఐఆర్‌డీఏఐ (IRDAI) మరియు యాంఫీ (AMFI) మార్గదర్శకాల ప్రకారం అమలు చేయబడతాయి. మీ అనుమతితో మాత్రమే మీ వివరాలు బీమా కంపెనీల అండర్‌రైటింగ్ డెస్క్‌లకు పంపబడతాయి."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  5. {language === 'en' ? "Our Contact Integrity Desk" : "మా సంప్రదింపు డెస్క్"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "If you have any questions regarding your data, or would like to request immediate deletion of your consultation files from our active advisor system, please reach out to us:"
                  ) : (
                    "మీ సమాచారానికి సంబంధించి మీకు ఏవైనా సందేహాలు ఉన్నా లేదా మా సిస్టమ్ నుండి మీ విచారణ వివరాలను తొలగించవలసిందిగా కోరాలనుకున్నా, దయచేసి మమ్మల్ని సంప్రదించండి:"
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{language === 'en' ? "Email Desk" : "ఈమెయిల్ డెస్క్"}</p>
                      <a href="mailto:dogiparthysrikrishnabhanuteja@gmail.com" className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-500 break-all">dogiparthysrikrishna...</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{language === 'en' ? "Advisory Desk" : "కాల్ చేయండి"}</p>
                      <a href="tel:+919885539211" className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-500 font-mono">+91 98855 39211</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{language === 'en' ? "Corporate Hub" : "ప్రధాన కార్యాలయం"}</p>
                      <p className="text-xs font-semibold text-slate-850 dark:text-slate-250 leading-tight">
                        Vinukonda, AP, India - 522647
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed text-left font-sans">
              
              {/* Header section */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5" /> {language === 'en' ? "Advisory Covenants" : "సలహా సేవా నియమాలు"}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {language === 'en' ? "Terms of Service & Advisory Scope" : "సేవా నిబంధనలు & సలహా పరిధి"}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {language === 'en' ? "Strictly Aligned with IRDAI & AMFI Professional Codes" : "ఐఆర్‌డీఏఐ (IRDAI) & యాంఫీ (AMFI) వృత్తిపరమైన నిబంధనల ప్రకారం"}
                </p>
              </div>

              {/* Details Paragraphs */}
              <div className="space-y-4">
                <p>
                  {language === 'en' ? (
                    "By accessing this digital platform or coordinating consultation parameters with Mr. D T V S SWAMY and Lalita Financial Services, you acknowledge and agree to the following terms and guidelines outlining our professional advisory scope:"
                  ) : (
                    "ఈ వెబ్‌సైట్‌ను సందర్శించడం ద్వారా లేదా శ్రీ డి టి వి ఎస్ స్వామి మరియు లలితా ఫైనాన్షియల్ సర్వీసెస్ ద్వారా సలహాలు పొందడం ద్వారా, మా వృత్తిపరమైన సేవా పరిధిని వివరించే క్రింది నిబంధనలను మీరు అంగీకరించినట్లుగా పరిగణించబడుతుంది:"
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  1. {language === 'en' ? "Scope of Professional Advisory" : "ఆర్థిక సలహా పరిధి"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "Mr. D T V S Swamy is a licensed financial advisor qualified under prestigious global MDRT (Million Dollar Round Table) benchmarks. The consultation we provide is highly personalized to your documented cash flows, existing liabilities, and future financial milestones. We do not charge separate hourly or advisory consultation fees on this platform."
                  ) : (
                    "శ్రీ డి టి వి ఎస్ స్వామి గారు ప్రతిష్టాత్మక ప్రపంచ శ్రేణి ఎండీఆర్‌టీ (MDRT) ప్రమాణాల ప్రకారం అర్హత కలిగిన రిజిస్టర్డ్ ఫైనాన్షియల్ అడ్వైజర్. మేము అందించే సలహా పూర్తిగా మీ ఆదాయ వ్యయాలు, బాధ్యతలు మరియు భవిష్యత్తు లక్ష్యాల విశ్లేషణపై ఆధారపడి ఉంటుంది. ఈ వెబ్‌సైట్‌లో ఉచిత సంప్రదింపులకు ఎటువంటి రుసుము వసూలు చేయబడదు."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  2. {language === 'en' ? "No Investment Guarantees" : "పెట్టుబడుల మార్కెట్ హెచ్చరిక"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "While our Goal-Based Systematic Investment Plan (SIP) calculators use realistic compounding projections and historical CAGR parameters (e.g., 12% to 15% equity index performance), mutual fund investments are subject to market risks. Past performance is not a guaranteed metric of future yields. Read all scheme-related booklets thoroughly before investing."
                  ) : (
                    "మా వెబ్‌సైట్‌లోని సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్ (SIP) క్యాలిక్యులేటర్లు చారిత్రక చక్రవృద్ధి వృద్ధి రేటు (CAGR) పారామితుల ఆధారంగా (ఉదాహరణకు 12% నుండి 15% వార్షిక వృద్ధి) అంచనాలను చూపుతాయి. మ్యూచువల్ ఫండ్ పెట్టుబడులు మార్కెట్ ఒడిదుడుకులకు లోబడి ఉంటాయి. గత పనితీరు భవిష్యత్తు లాభాలకు పూర్తి హామీ కాదు. పెట్టుబడి పెట్టే ముందు నిబంధనల పత్రాలను పూర్తిగా చదవండి."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  3. {language === 'en' ? "Duty of Disclosure & Utmost Good Faith" : "ఖచ్చితమైన వెల్లడి బాధ్యత (Utmost Good Faith)"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "In accordance with the insurance principle of 'Uberrimae Fidei' (Utmost Good Faith), you are under a strict duty to disclose all material facts—such as actual medical history, existing illness treatments, exact tobacco/smoking habits, and current vehicular damages—truthfully. Any non-disclosure or misstatement can lead to the cancellation of policy benefits or rejection of future claims by the partner insurance carrier."
                  ) : (
                    "భారతీయ బీమా చట్టాల ప్రకారం 'అట్మోస్ట్ గుడ్ ఫెయిత్' (నిజాయితీతో కూడిన వెల్లడి) సూత్రం ఆధారంగా, మీ నిజమైన ఆరోగ్య చరిత్ర, చికిత్స వివరాలు, అలవాట్లు మరియు వాహన నష్టాలకు సంబంధించిన అన్ని వివరాలను తప్పులు లేకుండా తెలియజేయడం మీ బాధ్యత. ఏ విషయాన్నైనా దాచడం లేదా తప్పుగా చెప్పడం వల్ల భవిష్యత్తులో క్లెయిమ్‌లను బీమా కంపెనీ తిరస్కరించే అవకాశం ఉంటుంది."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  4. {language === 'en' ? "Disclaimer of Liability" : "బాధ్యత పరిమితి"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "Lalita Financial Services serves as an expert advisory facilitator. The actual contract of protection or underwriting is executed directly between you (the policyholder) and the respective partner insurance company (e.g., Tata AIA, Care Health, TATA AIG). Claims approval is determined solely by the insurer's underwriting guidelines."
                  ) : (
                    "లలితా ఫైనాన్షియల్ సర్వీసెస్ ఆర్థిక సలహాదారుగా మరియు క్లెయిమ్స్ పరిష్కారానికి మార్గదర్శిగా వ్యవహరిస్తుంది. అసలు బీమా ఒప్పందం మరియు క్లెయిమ్ మంజూరు అనేవి పూర్తిగా సంబంధిత కంపెనీ (ఉదాహరణకు: టాటా AIA, కేర్ హెల్త్) యొక్క నిబంధనలు మరియు వారి అండర్‌రైటింగ్ మార్గదర్శకాల ప్రకారం మాత్రమే జరుగుతాయి."
                  )}
                </p>

              </div>

            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed text-left font-sans">
              
              {/* Header section */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5" /> {language === 'en' ? "Cookie Disclosures" : "కుకీల వినియోగం"}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {language === 'en' ? "Cookie & Local Storage Policy" : "కుకీలు & లోకల్ స్టోరేజ్ విధానం"}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {language === 'en' ? "Zero Tracking • Zero Conflicting Advertising Pixels" : "ఎటువంటి అయాచిత ట్రాకింగ్ లేదు • పూర్తి భద్రత"}
                </p>
              </div>

              {/* Details Paragraphs */}
              <div className="space-y-4">
                <p>
                  {language === 'en' ? (
                    "We strongly believe in clean, transparent digital experiences. Our platform utilizes absolutely zero personal tracking cookies, no intrusive social-media advertising pixels (like Meta Pixel), and no commercial telemetry systems."
                  ) : (
                    "మేము స్వచ్ఛమైన, స్పష్టమైన డిజిటల్ అనుభవాలను విశ్వసిస్తాము. మా వెబ్‌సైట్ ఎటువంటి ప్రమోషనల్ ట్రాకింగ్ కుకీలను లేదా మూడవ పక్షాల ప్రకటనల కోడ్‌లను (ఉదా: మెటా పిక్సెల్) ఉపయోగించదు."
                  )}
                </p>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  1. {language === 'en' ? "How We Use Storage" : "లోకల్ స్టోరేజీని మేము ఎలా ఉపయోగిస్తాము"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "We use your browser's local standard storage exclusively to save your functional preferences so you do not have to reset them on every visit. This includes only:"
                  ) : (
                    "వెబ్‌సైట్‌ను మరింత సులభంగా ఉపయోగించడానికి మీ బ్రౌజర్ యొక్క లోకల్ స్టోరేజీని మాత్రమే మేము ఉపయోగిస్తాము. ఇందులో ఈ క్రింది వివరాలు మాత్రమే ఉంటాయి:"
                  )}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                  <li><strong>{language === 'en' ? "Language Selection:" : "భాషా ఎంపిక:"}</strong> {language === 'en' ? "Remembers if you prefer English ('en') or Telugu ('te') interface." : "మీరు ఎంచుకున్న భాష (ఇంగ్లీష్ లేదా తెలుగు) గుర్తుంచుకుంటుంది."}</li>
                  <li><strong>{language === 'en' ? "Theme Preferences:" : "లైట్/డార్క్ మోడ్:"}</strong> {language === 'en' ? "Remembers if you prefer Light Mode or Dark Mode layout." : "మీరు ఎంచుకున్న థీమ్ (లైట్ మోడ్ లేదా డార్క్ మోడ్) గుర్తుంచుకుంటుంది."}</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white pt-2">
                  2. {language === 'en' ? "How to Clear Storage" : "స్టోరేజీని ఎలా రీసెట్ చేయాలి"}
                </h3>
                <p>
                  {language === 'en' ? (
                    "If you wish to remove these preferences, you can clear your browser's history or cookie/local storage at any time. This will simply return the platform layout and language to the standard defaults."
                  ) : (
                    "మీరు ఈ వివరాలను తొలగించాలనుకుంటే, మీ బ్రౌజర్ హిస్టరీని లేదా క్యాచీని ఎప్పుడైనా క్లియర్ చేయవచ్చు. దీని ద్వారా వెబ్‌సైట్ మళ్ళీ మొదటి సాధారణ భాషా సెట్టింగ్స్‌కి మారుతుంది."
                  )}
                </p>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl flex items-start gap-3 mt-4 text-xs">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="text-left leading-relaxed">
                    <strong className="font-bold block mb-0.5">{language === 'en' ? "100% Tracking Free Guarantee" : "100% ట్రాకింగ్ రహిత హామీ"}</strong>
                    {language === 'en' 
                      ? "Your digital footprint is completely safe. We do not sell, rent, or trade user traffic patterns with any ad brokers or third parties."
                      : "మీ డిజిటల్ భద్రతకు పూర్తి రక్షణ ఉంటుంది. మేము ఎటువంటి యూజర్ సమాచారాన్ని గానీ, ట్రాఫిక్ గణాంకాలను గానీ ఏ ఇతర ప్రకటనల సంస్థలతో పంచుకోము."}
                  </div>
                </div>

              </div>

            </div>
          )}
        </motion.div>
        
        {/* Call to Action to speak with Swamy */}
        <div className="text-center pt-4">
          <button
            onClick={handleBackToHome}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 font-bold text-white text-sm rounded-xl transition-all shadow-md hover:shadow-lg outline-none cursor-pointer"
          >
            {language === 'en' ? "Return to Home Page" : "హోమ్ పేజీకి తిరిగి వెళ్ళండి"}
          </button>
        </div>

      </div>
    </div>
  );
}
