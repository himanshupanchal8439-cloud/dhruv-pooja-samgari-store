'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

function PlaceInput({ value, onChange, cityStatePlaceholder, searchingText }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => () => debounceRef.current && clearTimeout(debounceRef.current), []);

  function handleChange(next) {
    onChange(next);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (next.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(next)}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  function selectPlace(suggestion) {
    onChange(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  return (
    <div className="kundli-place-wrap">
      <input
        placeholder={cityStatePlaceholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && (loading || suggestions.length > 0) && (
        <ul className="kundli-place-suggestions">
          {loading && <li className="kundli-place-loading">{searchingText}</li>}
          {!loading &&
            suggestions.map((s) => (
              <li key={s.place_id} onMouseDown={() => selectPlace(s)}>
                <i className="fa-solid fa-location-dot" /> {s.display_name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

const kootas = [
  { key: 'varna', name: 'Varna', nameHi: 'वर्ण', max: 1, about: 'Spiritual compatibility & ego balance', aboutHi: 'आध्यात्मिक अनुकूलता और अहं संतुलन' },
  { key: 'vashya', name: 'Vashya', nameHi: 'वश्य', max: 2, about: 'Mutual control & attraction', aboutHi: 'पारस्परिक नियंत्रण और आकर्षण' },
  { key: 'tara', name: 'Tara', nameHi: 'तारा', max: 3, about: 'Health & wellbeing of the couple', aboutHi: 'दंपति का स्वास्थ्य और कल्याण' },
  { key: 'yoni', name: 'Yoni', nameHi: 'योनि', max: 4, about: 'Physical & intimate compatibility', aboutHi: 'शारीरिक और अंतरंग अनुकूलता' },
  { key: 'grahaMaitri', name: 'Graha Maitri', nameHi: 'ग्रह मैत्री', max: 5, about: 'Mental compatibility & friendship', aboutHi: 'मानसिक अनुकूलता और मित्रता' },
  { key: 'gana', name: 'Gana', nameHi: 'गण', max: 6, about: 'Temperament & nature match', aboutHi: 'स्वभाव और प्रकृति मिलान' },
  { key: 'bhakoot', name: 'Bhakoot', nameHi: 'भकूट', max: 7, about: 'Love, family growth & prosperity', aboutHi: 'प्रेम, पारिवारिक वृद्धि और समृद्धि' },
  { key: 'nadi', name: 'Nadi', nameHi: 'नाड़ी', max: 8, about: 'Health of offspring & genetic compatibility', aboutHi: 'संतान का स्वास्थ्य और आनुवंशिक अनुकूलता' },
];

const verdictTextHi = {
  excellent: 'सितारे मजबूत सामंजस्य, आपसी सम्मान और समृद्ध साथ जीवन का संकेत देते हैं।',
  good: 'अच्छी अनुकूलता के साथ एक अनुकूल गठबंधन। समझ के साथ छोटे मतभेद सुलझाए जा सकते हैं।',
  average: 'यह मिलान संभव है लेकिन आपसी प्रयास, धैर्य और संभवतः उपचारात्मक मार्गदर्शन से लाभान्वित होता है।',
  low: 'उल्लेखनीय मतभेद संकेतित हैं। आगे बढ़ने से पहले किसी ज्योतिषी से विस्तृत परामर्श की सलाह दी जाती है।',
};

const verdictLabelHi = {
  excellent: 'उत्कृष्ट मिलान',
  good: 'अच्छा मिलान',
  average: 'औसत मिलान',
  low: 'सावधानीपूर्वक समीक्षा आवश्यक',
};

const totalMax = kootas.reduce((sum, k) => sum + k.max, 0);

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function buildMilan(boy, girl) {
  const seedBase = `${boy.name}-${boy.dob}-${girl.name}-${girl.dob}`;
  const breakdown = kootas.map((k, i) => {
    const h = hashSeed(seedBase + k.key + i);
    const score = h % (k.max + 1);
    return { ...k, score };
  });
  const total = breakdown.reduce((sum, k) => sum + k.score, 0);
  return { breakdown, total };
}

function verdictFor(total) {
  const pct = total / totalMax;
  if (pct >= 0.75) return { label: 'Excellent Match', tone: 'excellent', text: 'The stars indicate strong harmony, mutual respect and a prosperous life together.' };
  if (pct >= 0.55) return { label: 'Good Match', tone: 'good', text: 'A favourable alliance with good compatibility. Minor differences can be worked through with understanding.' };
  if (pct >= 0.4) return { label: 'Average Match', tone: 'average', text: 'The match is workable but benefits from mutual effort, patience and possibly remedial guidance.' };
  return { label: 'Needs Careful Review', tone: 'low', text: 'Notable differences are indicated. We recommend a detailed consultation with an astrologer before proceeding.' };
}

const emptyPerson = { name: '', dob: '', time: '', place: '' };

export default function KundliMatching() {
  const { t, lang } = useLanguage();
  const isHi = lang === 'hi';
  const [boy, setBoy] = useState(emptyPerson);
  const [girl, setGirl] = useState(emptyPerson);
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!boy.dob || !girl.dob) return;
    const milan = buildMilan(boy, girl);
    setResult({ boy, girl, ...milan, verdict: verdictFor(milan.total) });
  }

  function reset() {
    setResult(null);
    setBoy(emptyPerson);
    setGirl(emptyPerson);
  }

  return (
    <section className="kundli-page">
      <div className="kundli-inner">
        <div className="astro-header">
          <h3 className="astro-eyebrow">
            <i className="fa-solid fa-heart" /> {t('freeReading')}
          </h3>
          <h2 className="astro-title">{t('kundliMatching')}</h2>
          <p className="astro-desc">{t('kundliMatchingDesc')}</p>
        </div>

        {!result ? (
          <form className="kundli-form match-form" onSubmit={handleSubmit}>
            <div className="match-columns">
              <fieldset className="match-fieldset">
                <legend><i className="fa-solid fa-mars" /> {t('groomsDetails')}</legend>
                <input
                  placeholder={t('groomsNamePlaceholder')}
                  required
                  value={boy.name}
                  onChange={(e) => setBoy({ ...boy, name: e.target.value })}
                />
                <label>
                  {t('dateOfBirth')}
                  <input type="date" required value={boy.dob} onChange={(e) => setBoy({ ...boy, dob: e.target.value })} />
                </label>
                <label>
                  {t('placeOfBirthOptional')}
                  <PlaceInput
                    value={boy.place}
                    onChange={(v) => setBoy({ ...boy, place: v })}
                    cityStatePlaceholder={t('placeOfBirthCityState')}
                    searchingText={t('searchingPlaces')}
                  />
                </label>
              </fieldset>

              <fieldset className="match-fieldset">
                <legend><i className="fa-solid fa-venus" /> {t('bridesDetails')}</legend>
                <input
                  placeholder={t('bridesNamePlaceholder')}
                  required
                  value={girl.name}
                  onChange={(e) => setGirl({ ...girl, name: e.target.value })}
                />
                <label>
                  {t('dateOfBirth')}
                  <input type="date" required value={girl.dob} onChange={(e) => setGirl({ ...girl, dob: e.target.value })} />
                </label>
                <label>
                  {t('placeOfBirthOptional')}
                  <PlaceInput
                    value={girl.place}
                    onChange={(v) => setGirl({ ...girl, place: v })}
                    cityStatePlaceholder={t('placeOfBirthCityState')}
                    searchingText={t('searchingPlaces')}
                  />
                </label>
              </fieldset>
            </div>

            <button type="submit" className="btn-astro kundli-submit">
              <i className="fa-solid fa-heart-circle-check" /> {t('checkCompatibilityBtn')}
            </button>
          </form>
        ) : (
          <div className="kundli-full-result">
            <div className="kundli-result-badge">
              <i className="fa-solid fa-heart" />
            </div>
            <h3>
              {result.boy.name} &amp; {result.girl.name}
            </h3>

            {(result.boy.place || result.girl.place) && (
              <div className="kundli-stats">
                {result.boy.place && (
                  <div className="kundli-stat kundli-stat-wide">
                    <span>{t('groomsPlaceOfBirth')}</span>
                    <strong>{result.boy.place}</strong>
                  </div>
                )}
                {result.girl.place && (
                  <div className="kundli-stat kundli-stat-wide">
                    <span>{t('bridesPlaceOfBirth')}</span>
                    <strong>{result.girl.place}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="match-score-ring">
              <div className="match-score-number">{result.total}</div>
              <div className="match-score-max">/ {totalMax} {isHi ? t('gunasWord') : 'Gunas'}</div>
            </div>

            <div className={`match-verdict match-verdict-${result.verdict.tone}`}>
              {isHi ? verdictLabelHi[result.verdict.tone] : result.verdict.label}
            </div>
            <p className="kundli-trait">{isHi ? verdictTextHi[result.verdict.tone] : result.verdict.text}</p>

            <h4 className="kundli-section-title">{t('ashtakootaBreakdownTitle')}</h4>
            <div className="match-koota-list">
              {result.breakdown.map((k) => (
                <div key={k.key} className="match-koota-row">
                  <div className="match-koota-info">
                    <span className="match-koota-name">{isHi ? k.nameHi : k.name}</span>
                    <span className="match-koota-about">{isHi ? k.aboutHi : k.about}</span>
                  </div>
                  <div className="match-koota-bar">
                    <div className="match-koota-bar-fill" style={{ width: `${(k.score / k.max) * 100}%` }} />
                  </div>
                  <span className="match-koota-score">
                    {k.score}/{k.max}
                  </span>
                </div>
              ))}
            </div>

            <p className="kundli-disclaimer">{t('kundliMatchingDisclaimer')}</p>
            <div className="kundli-result-actions">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-astro">
                <i className="fa-solid fa-comment-dots" /> {t('talkToAstrologer')}
              </a>
              <button className="btn-astro btn-astro-outline" onClick={reset}>
                {t('checkAnotherMatch')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
