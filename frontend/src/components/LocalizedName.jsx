'use client';

import { useLanguage } from '../context/LanguageContext';

// Picks the Hindi variant of a DB-backed name when the UI is in Hindi.
export default function LocalizedName({ en, hi }) {
  const { lang } = useLanguage();
  return lang === 'hi' && hi ? hi : en;
}
