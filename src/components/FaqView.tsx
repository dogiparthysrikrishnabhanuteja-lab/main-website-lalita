/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Sparkles, 
  AlertCircle, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  Bot
} from 'lucide-react';
import { faqs } from '../data/faqs';
import { FAQ } from '../types';

interface FaqViewProps {
  initialCategoryFilter?: 'all' | 'life' | 'health' | 'auto' | 'general' | 'investments';
}

type TabType = 'explorer' | 'assistant';

export default function FaqView({ initialCategoryFilter = 'all' }: FaqViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('explorer');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'life' | 'health' | 'auto' | 'general' | 'investments'>(initialCategoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  // Sync category filter if changed externally and scroll the selected FAQ question into view immediately on load
  useEffect(() => {
    setSelectedCategory(initialCategoryFilter);
    setSearchQuery('');
    
    if (initialCategoryFilter && initialCategoryFilter !== 'all') {
      // Find the first FAQ of this category to expand it and focus user attention
      const firstFaqOfCategory = faqs.find(faq => faq.category === initialCategoryFilter);
      if (firstFaqOfCategory) {
        setExpandedFaqId(firstFaqOfCategory.id);
        
        let attempts = 0;
        const interval = setInterval(() => {
          const faqElement = document.getElementById(`faq-card-${firstFaqOfCategory.id}`);
          if (faqElement) {
            // Using modern native scrollIntoView with scroll-mt-28 on the element is 100% stable across all device viewport changes
            faqElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            clearInterval(interval);
          } else {
            attempts++;
            if (attempts > 15) { // 1.5 seconds maximum fallback timeout
              if (questionsRef.current) {
                questionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              clearInterval(interval);
            }
          }
        }, 100);
        
        return () => clearInterval(interval);
      } else {
        setExpandedFaqId(null);
      }
    } else {
      setExpandedFaqId(null);
    }
  }, [initialCategoryFilter]);

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'life', label: 'Life Legacy' },
    { value: 'health', label: 'Health Care' },
    { value: 'auto', label: 'Motor Vehicle' },
    { value: 'general', label: 'General Insurance' },
    { value: 'investments', label: 'Mutual Funds & SIPs' }
  ] as const;

  const handleToggleFaq = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Keyboard navigation for categories (Arrow keys)
  const handleCategoryKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = categories.findIndex(cat => cat.value === selectedCategory);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % categories.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + categories.length) % categories.length;
    } else {
      return;
    }

    const nextValue = categories[nextIndex].value;
    setSelectedCategory(nextValue);
    setExpandedFaqId(null);

    // Focus the newly active category button
    const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (buttons[nextIndex]) {
      buttons[nextIndex].focus();
    }
  };

  // Framer Motion variants
  const categoriesContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const categoryButtonVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 110, 
        damping: 14 
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 110, 
        damping: 16 
      } 
    }
  };

  // ==========================================
  // STATE FOR TAB B: INTERACTIVE ADVISOR ASSISTANT ("ASK SWAMY")
  // ==========================================
  interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    suggestions?: string[];
    faqMatch?: FAQ;
  }

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste! I am your Lalita Financial Advisor Assistant. I am here to help you navigate our comprehensive Knowledge Bank. Ask me anything, or click one of our popular quick inquiries below:',
      suggestions: [
        'How does SIP compounding work?',
        'What is the ideal term cover formula?',
        'What is the Free-Look/cooling-off period?',
        'Tell me about Super Top-Up Health cover',
        'How does the No Claim Bonus work?'
      ]
    }
  ]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAssistantTyping]);

  const processAssistantReply = (userQuery: string) => {
    setIsAssistantTyping(true);

    setTimeout(() => {
      const queryLower = userQuery.toLowerCase();
      
      // Attempt local keyword matching across the faq database
      let bestMatch: FAQ | undefined = undefined;
      let highestScore = 0;

      faqs.forEach(faq => {
        let score = 0;
        const questionWords = faq.question.toLowerCase().split(/\s+/);
        const answerWords = faq.answer.toLowerCase().split(/\s+/);
        const queryWords = queryLower.split(/\s+/);

        queryWords.forEach(word => {
          if (word.length < 3) return; // skip short words
          if (questionWords.some(qw => qw.includes(word))) score += 5;
          if (answerWords.some(aw => aw.includes(word))) score += 2;
        });

        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      });

      let responseText = '';
      let matchObj: FAQ | undefined = undefined;
      let newSuggestions: string[] = [];

      if (bestMatch && highestScore >= 4) {
        matchObj = bestMatch;
        responseText = `Excellent question. Let me fetch the verified guidelines regarding "${bestMatch.question}":\n\n${bestMatch.answer}`;
        newSuggestions = faqs
          .filter(f => f.category === bestMatch?.category && f.id !== bestMatch?.id)
          .slice(0, 3)
          .map(f => f.question);
      } else {
        // Fallback responses
        if (queryLower.includes('tax') || queryLower.includes('80c') || queryLower.includes('80d') || queryLower.includes('saving')) {
          responseText = "Under the Indian Income Tax Act, premiums paid for Life Insurance are deductible under Section 80C (up to ₹1.5 Lakhs), while Health Insurance premiums qualify under Section 80D (up to ₹25,000 for self/family and ₹50,000 for senior citizen parents). ELSS mutual funds also qualify under 80C and offer excellent compounding growth potential.";
          newSuggestions = ['Are benefits from life insurance tax-exempt?', 'Under which sections can I claim tax tax benefits on my health insurance?', 'What is an ELSS fund?'];
        } else if (queryLower.includes('claim') || queryLower.includes('settle') || queryLower.includes('emergency')) {
          responseText = "In case of emergencies, please report claims within 24 hours. Keep photos/videos of damages, file a police FIR immediately for burglary or major motor incidents, and gather medical summaries or original death certificates. Our expert hub at Lalita Financial Services personally facilitates and monitors your claim submission from end to end.";
          newSuggestions = ['What is the immediate procedure to lodge a claim during emergencies?', 'What are the essential documents needed to submit a claim?'];
        } else {
          responseText = `I couldn't find a direct match for "${userQuery}" in our regulatory policy bank. However, Lalita Financial Services supports custom advisory portfolios. Here are a few related items from our knowledge bank you can ask about:`;
          newSuggestions = [
            'What is the ideal term insurance sum assured?',
            'What is a Family Floater policy?',
            'How often should I review my investment portfolio?'
          ];
        }
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'assistant',
          text: responseText,
          suggestions: newSuggestions.length > 0 ? newSuggestions : undefined,
          faqMatch: matchObj
        }
      ]);
      setIsAssistantTyping(false);
    }, 1000);
  };

  const handleSendChat = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    processAssistantReply(textToSend);
  };

  return (
    <div className="space-y-12 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Header description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-4 pt-12"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
          Knowledge Bank
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white transition-colors">
          Frequently <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-yellow-300 bg-clip-text text-transparent">Asked Questions</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed font-sans">
          Unlock quick answers, transparent parameters, and expert insights on diverse coverage options instantly.
        </p>
      </motion.div>

      {/* Global Search Input bar at the top */}
      <div ref={questionsRef} className="relative max-w-2xl mx-auto scroll-mt-24">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 dark:text-amber-400" />
        <input 
          type="text" 
          placeholder="Search questions or keyword answers across all categories..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // Auto switch to explorer tab if user starts typing while on assistant tab
            if (activeTab !== 'explorer' && e.target.value.trim() !== '') {
              setActiveTab('explorer');
            }
          }}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-amber-600 focus:bg-white dark:focus:bg-slate-950 outline-none rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm focus:shadow-md"
        />
      </div>

      {/* Interactive Tabs Navigator */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all outline-none cursor-pointer ${
            activeTab === 'explorer'
              ? 'bg-white dark:bg-slate-950 text-amber-700 dark:text-amber-400 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>FAQ Bank</span>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all outline-none cursor-pointer ${
            activeTab === 'assistant'
              ? 'bg-white dark:bg-slate-950 text-amber-700 dark:text-amber-400 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>Ask Assistant</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB A: CLASSIC FAQ EXPLORER PANEL                        */}
      {/* ========================================================= */}
      {activeTab === 'explorer' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Categories Tab Pill slider with slide-in staggered animation */}
          <div className="space-y-6">
            <motion.div 
              role="tablist"
              aria-label="FAQ Categories"
              variants={categoriesContainerVariants}
              initial="hidden"
              animate="show"
              onKeyDown={handleCategoryKeyDown}
              className="flex flex-wrap items-center justify-center gap-2 outline-none"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  variants={categoryButtonVariants}
                  role="tab"
                  aria-selected={selectedCategory === cat.value}
                  aria-controls="faq-list"
                  id={`category-tab-${cat.value}`}
                  tabIndex={selectedCategory === cat.value ? 0 : -1}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setExpandedFaqId(null);
                  }}
                  className={`px-4 py-1.5 text-xs text-nowrap rounded-lg border font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    selectedCategory === cat.value
                      ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/15'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Accordions Container */}
          <div id="faq-list" role="feed" aria-busy="false" className="space-y-4">
            {filteredFaqs.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {filteredFaqs.map((faq: FAQ) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <motion.div 
                      key={faq.id}
                      id={`faq-card-${faq.id}`}
                      layout="position"
                      variants={cardVariants}
                      className="overflow-hidden rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-300 shadow-sm scroll-mt-28"
                    >
                      {/* Accordion Head with proper HTML5 button semantics and ARIA-expanded */}
                      <button
                        id={`faq-btn-${faq.id}`}
                        aria-expanded={isExpanded}
                        aria-controls={`faq-content-${faq.id}`}
                        onClick={() => handleToggleFaq(faq.id)}
                        className="w-full text-left px-5 py-4 cursor-pointer flex items-center justify-between gap-4 select-none outline-none group bg-slate-50/40 dark:bg-slate-900/10 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
                      >
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-relaxed flex items-start gap-2.5">
                          <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                          }`} 
                        />
                      </button>

                      {/* Accordion Content Panel with clean Framer Motion height expansion & screen reader region */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div 
                              id={`faq-content-${faq.id}`}
                              role="region"
                              aria-labelledby={`faq-btn-${faq.id}`}
                              className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-950/20 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans space-y-3 animate-fadeIn"
                            >
                              <p className="whitespace-pre-line">{faq.answer}</p>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                                <Sparkles className="w-3.5 h-3.5" /> Checked Under Category: {categories.find(c => c.value === faq.category)?.label}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center p-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto opacity-65 animate-bounce" />
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-850 dark:text-slate-200">No questions match your filter</h5>
                  <p className="text-xs text-slate-500">Try adjusting your keyword typing or clearing the active search filter.</p>
                </div>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-1.5 text-xs font-mono font-bold bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-white rounded-lg cursor-pointer outline-none transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* TAB B: ADVISOR INTERACTIVE ASSISTANT ("ASK SWAMY")        */}
      {/* ========================================================= */}
      {activeTab === 'assistant' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl bg-slate-50 dark:bg-slate-900/40 flex flex-col h-[520px]"
        >
          {/* Chat Header */}
          <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-slate-850 dark:text-white">Sri Swamy</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                Live Advisor Assistant
              </p>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-2">
                  <div 
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-amber-600 text-white rounded-tr-none shadow-md shadow-amber-600/10 font-bold'
                        : 'bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-tl-none text-slate-700 dark:text-slate-300 font-sans'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Curated Matching Tag inside Chat Bubble */}
                  {msg.faqMatch && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" /> Reference ID: {msg.faqMatch.id.toUpperCase()}
                    </div>
                  )}

                  {/* Inline click suggestions */}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={`sug-${sIdx}`}
                          onClick={() => handleSendChat(sug)}
                          className="px-3 py-1 bg-white hover:bg-amber-50 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 dark:hover:border-amber-500/30 text-[11px] text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 font-bold rounded-lg cursor-pointer transition-all duration-300 shadow-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAssistantTyping && (
              <div className="flex gap-3 max-w-[50%]">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Inputs */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat(chatInput);
            }}
            className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex gap-2"
          >
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything (e.g., tax saving, claim steps, term formula)..."
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-amber-600 focus:bg-white dark:focus:bg-slate-950 outline-none rounded-xl text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer outline-none shadow-md shadow-amber-600/15 shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}

    </div>
  );
}
