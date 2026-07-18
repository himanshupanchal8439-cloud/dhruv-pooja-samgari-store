'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { festivals2026 } from '../utils/festivals2026';
import {
  getVedicSnapshot, rashiNames, rashiNamesHi,
  tithiNames, tithiNamesHi, specialTithiHi,
  sunTimes, fmt,
} from '../utils/panchangCalc';

const DEFAULT_LOCATION = { lat: 28.6139, lon: 77.209 };

// Vrat rules keyed by tithiIndex (0-29, Shukla 0-14 then Krishna 15-29)
const VRAT_BY_TITHI = {
  3: { key: 'vinayakaChaturthi' },
  10: { key: 'ekadashi' },
  12: { key: 'pradosh' },
  14: { key: 'purnimaVrat' },
  18: { key: 'sankashtiChaturthi' },
  25: { key: 'ekadashi' },
  27: { key: 'pradosh' },
  29: { key: 'amavasyaVrat' },
};

function vikramSamvatYear(date) {
  // Hindu New Year (Chaitra Shukla Pratipada) 2026 falls on 2026-03-19.
  // Approximation valid for the current year; update alongside festivals2026.js.
  const cutover = new Date('2026-03-19');
  return date >= cutover ? date.getFullYear() + 57 : date.getFullYear() + 56;
}

function computeFestivalsData(lang) {
  const now = new Date();
  const isHi = lang === 'hi';
  const snap = getVedicSnapshot(now);

  const vrat = VRAT_BY_TITHI[snap.tithiIndex];

  const { sunrise, sunset } = sunTimes(now, DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
  const dayLen = sunset - sunrise;
  const midday = sunrise + dayLen / 2;
  const muhurta = dayLen / 15;
  const abhijit = snap.weekday === 3 ? null : `${fmt(midday - muhurta / 2)} – ${fmt(midday + muhurta / 2)}`;

  const displayTithi = isHi
    ? specialTithiHi[snap.tithi] || tithiNamesHi[snap.tithiIndex % 15]
    : snap.tithi;

  const todayStr = now.toISOString().slice(0, 10);
  const upcoming = festivals2026.filter((f) => f.date >= todayStr).slice(0, 5);
  const next = upcoming[0] || null;
  const daysUntilNext = next
    ? Math.round((new Date(next.date) - new Date(todayStr)) / 86400000)
    : null;

  return {
    vikramSamvat: vikramSamvatYear(now),
    tithi: displayTithi,
    sunRashi: isHi ? rashiNamesHi[snap.sunRashiIndex] : rashiNames[snap.sunRashiIndex],
    moonRashi: isHi ? rashiNamesHi[snap.moonRashiIndex] : rashiNames[snap.moonRashiIndex],
    abhijit,
    vrat,
    upcoming,
    next,
    daysUntilNext,
  };
}

export default function FestivalsSection() {
  const { t, lang } = useLanguage();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(computeFestivalsData(lang));
    const timer = setInterval(() => setData(computeFestivalsData(lang)), 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [lang]);

  if (!data) return null;
  const isHi = lang === 'hi';

  return (
    <section className="festivals-section">
      <div className="section">
        <div className="sacred-heading">
          <h4 className="awards-eyebrow">{t('festivalsEyebrow')}</h4>
          <h2>{t('festivalsHeading')}</h2>
          <div className="sacred-divider" />
        </div>

        <div className="festivals-grid">
          <Link href="/panchang" className="festival-card">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-moon festival-card-icon" />
            </div>
            <h3>{t('panchangCardTitle')}</h3>
            <p className="festival-card-value">{data.tithi}</p>
            <span className="festival-card-link">{t('viewFullPanchang')} →</span>
          </Link>

          <div className="festival-card">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-calendar-days festival-card-icon" />
            </div>
            <h3>{t('calendarCardTitle')}</h3>
            <p className="festival-card-value">
              {t('vikramSamvat')} {data.vikramSamvat}
            </p>
          </div>

          <div className="festival-card">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-hands-praying festival-card-icon" />
            </div>
            <h3>{t('muhuratCardTitle')}</h3>
            <span className="festival-card-hint">{t('abhijitLabel')}</span>
            <p className="festival-card-value">{data.abhijit || t('notObservedBudhvaar')}</p>
          </div>

          <div className="festival-card">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-om festival-card-icon" />
            </div>
            <h3>{t('vratCardTitle')}</h3>
            <p className="festival-card-value">
              {data.vrat ? t(data.vrat.key) : t('noMajorVratToday')}
            </p>
          </div>

          <div className="festival-card festival-card-wide">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-gift festival-card-icon" />
            </div>
            <h3>{t('festivalsCardTitle')}</h3>
            {data.next ? (
              <>
                <p className="festival-card-value">
                  {isHi ? data.next.nameHi : data.next.name} —{' '}
                  {data.daysUntilNext === 0 ? t('today') : `${t('inDays')} ${data.daysUntilNext} ${t('daysWord')}`}
                </p>
                <ul className="festival-upcoming-list">
                  {data.upcoming.map((f) => (
                    <li key={f.date}>
                      <span>{isHi ? f.nameHi : f.name}</span>
                      <span>{new Date(f.date).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="festival-card-value">{t('noUpcomingFestivals')}</p>
            )}
          </div>

          <div className="festival-card">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-globe festival-card-icon" />
            </div>
            <h3>{t('planetsCardTitle')}</h3>
            <div className="festival-planet-row">
              <span className="festival-card-hint">{t('sunRashi')}</span>
              <span className="festival-card-value">{data.sunRashi}</span>
            </div>
            <div className="festival-planet-row">
              <span className="festival-card-hint">{t('moonRashi')}</span>
              <span className="festival-card-value">{data.moonRashi}</span>
            </div>
          </div>

          <div className="festival-card festival-card-wide">
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-star-and-crescent festival-card-icon" />
            </div>
            <h3>{t('jyotishCardTitle')}</h3>
            <div className="festival-jyotish-links">
              <Link href="/kundli">{t('janamKundli')}</Link>
              <Link href="/kundli-matching">{t('kundliMatching')}</Link>
              <Link href="/daily-horoscope">{t('dailyHoroscope')}</Link>
              <a href="#talk-to-astrologer">{t('talkToAstrologer')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
