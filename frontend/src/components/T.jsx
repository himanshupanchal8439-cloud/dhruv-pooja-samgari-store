'use client';

import { useLanguage } from '../context/LanguageContext';

// Renders a translated string inside Server Components: <T k="categories" />
export default function T({ k }) {
  const { t } = useLanguage();
  return t(k);
}
