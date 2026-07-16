'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function FaqAccordion() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(1);

  return (
    <>
      <div className="sacred-heading">
        <h4 className="awards-eyebrow">{t('faqEyebrow')}</h4>
        <h2>{t('faqHeading')}</h2>
        <div className="sacred-divider" />
      </div>

      <div className="faq-list">
        {faqKeys.map((n) => {
          const isOpen = openIndex === n;
          return (
            <div key={n} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenIndex(isOpen ? null : n)} aria-expanded={isOpen}>
                <span>{t(`faqQ${n}`)}</span>
                <i className="fa-solid fa-chevron-down faq-chevron" />
              </button>
              {isOpen && <p className="faq-answer">{t(`faqA${n}`)}</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}
