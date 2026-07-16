'use client';

import { useLanguage } from '../context/LanguageContext';

export default function PolicyContent({ headingKey, introKey, sectionCount, prefix }) {
  const { t } = useLanguage();
  const sections = Array.from({ length: sectionCount }, (_, i) => i + 1);

  return (
    <>
      <div className="sacred-heading">
        <h2>{t(headingKey)}</h2>
        <div className="sacred-divider" />
      </div>
      <div className="policy-content">
        <p className="policy-intro">{t(introKey)}</p>
        {sections.map((n) => (
          <div key={n} className="policy-section">
            <h3>{t(`${prefix}S${n}h`)}</h3>
            <p>{t(`${prefix}S${n}b`)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
