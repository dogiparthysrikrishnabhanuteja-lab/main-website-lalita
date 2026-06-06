/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Search, ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import { faqs } from '../data/faqs';
import { FAQ } from '../types';

interface FaqViewProps {
  initialCategoryFilter?: 'all' | 'life' | 'health' | 'auto' | 'general' | 'investments';
}

export default function FaqView({ initialCategoryFilter = 'all' }: FaqViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'life' | 'health' | 'auto' | 'general' | 'investments'>(initialCategoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Sync category filter if changed externally
  useEffect(() => {
    setSelectedCategory(initialCategoryFilter);
    setSearchQuery('');
    setExpandedFaqId(null);
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

  return (
    <div className="space-y-12 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white text-slate-800">
      
      {/* 1. Header description */}
      <div className="text-center space-y-4 pt-16">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold uppercase tracking-widest rounded-full">
          Knowledge Bank
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-slate-900">
          Frequently <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Asked Questions</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
          Unlock quick answers, transparent parameters, and expert insights on diverse coverage options instantly.
        </p>
      </div>

      {/* 2. Search & Categories Panel block */}
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
          <input 
            type="text" 
            placeholder="Search questions or keyword answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-600 focus:bg-white outline-none rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition-colors"
          />
        </div>

        {/* Categories Tab Pill slider */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setExpandedFaqId(null);
              }}
              className={`px-4 py-1.5 text-xs text-nowrap rounded-lg border font-bold transition-all cursor-pointer outline-none ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-655/15'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Accordions Container */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq: FAQ) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <motion.div 
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-xl bg-white border border-slate-205 hover:border-slate-300 transition-colors"
              >
                {/* Accordion Head */}
                <button
                  onClick={() => handleToggleFaq(faq.id)}
                  className="w-full text-left px-5 py-4 cursor-pointer flex items-center justify-between gap-4 select-none outline-none group bg-slate-50/50"
                >
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors leading-relaxed flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-amber-600' : ''
                    }`} 
                  />
                </button>

                {/* Accordion Content Panel (Using standard CSS for maximum reliability with react 19) */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[500px] border-t border-slate-200' : 'max-h-0'
                  }`}
                >
                  <div className="px-5 py-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed font-sans space-y-3">
                    <p>{faq.answer}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Checked Under Category: {categories.find(c => c.value === faq.category)?.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center p-12 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto opacity-65 animate-bounce" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-slate-850">No questions match your filter</h5>
              <p className="text-xs text-slate-500">Try adjusting your keyword typing or clearing the active search filter.</p>
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-1.5 text-xs font-mono font-bold bg-slate-900 text-white rounded-lg cursor-pointer outline-none"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
