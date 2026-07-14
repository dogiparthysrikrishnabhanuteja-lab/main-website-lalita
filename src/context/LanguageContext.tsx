/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { uiTranslations, faqTranslations } from '../data/translations';

export type Language = 'en' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateFaq: (id: string, fallbackQuestion: string, fallbackAnswer: string) => { question: string; answer: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // Translate helper for UI strings
  const t = (key: string): string => {
    const trimmedKey = key ? key.trim() : '';
    const translation = uiTranslations[trimmedKey];
    if (translation) {
      return language === 'te' ? translation.te : translation.en;
    }
    return key; // Fallback to key if not translated
  };

  // Translate helper for FAQs
  const translateFaq = (id: string, fallbackQuestion: string, fallbackAnswer: string) => {
    if (language === 'te') {
      const trans = faqTranslations[id];
      if (trans) {
        return {
          question: trans.question,
          answer: trans.answer
        };
      }
    }
    return {
      question: fallbackQuestion,
      answer: fallbackAnswer
    };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateFaq }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
