'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'hi' || saved === 'en') setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  function switchLang(next) {
    setLang(next);
    localStorage.setItem('lang', next);
  }

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  return <LanguageContext.Provider value={{ lang, switchLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
