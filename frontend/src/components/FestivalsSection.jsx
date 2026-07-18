'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { festivals2026 } from '../utils/festivals2026';
import {
  getVedicSnapshot, rashiNames, rashiNamesHi, masaNames, masaNamesHi,
  tithiNames, tithiNamesHi, pakshaHi, specialTithiHi,
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

  const tithiName = isHi
    ? specialTithiHi[snap.tithi] || tithiNamesHi[snap.tithiIndex % 15]
    : snap.tithi;
  const pakshaName = isHi ? pakshaHi[snap.paksha] : snap.paksha;

  const todayStr = now.toISOString().slice(0, 10);
  const upcoming = festivals2026.filter((f) => f.date >= todayStr);
  const next = upcoming[0] || null;
  const daysUntilNext = next
    ? Math.round((new Date(next.date) - new Date(todayStr)) / 86400000)
    : null;

  return {
    vikramSamvat: vikramSamvatYear(now),
    masa: isHi ? masaNamesHi[snap.sunRashiIndex] : masaNames[snap.sunRashiIndex],
    tithiName,
    pakshaName,
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
  const [showAllFestivals, setShowAllFestivals] = useState(false);

  useEffect(() => {
    setData(computeFestivalsData(lang));
    const timer = setInterval(() => setData(computeFestivalsData(lang)), 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [lang]);

  if (!data) return null;
  const isHi = lang === 'hi';
  const restFestivals = data.upcoming.slice(1);
  const visibleFestivals = showAllFestivals ? restFestivals : restFestivals.slice(0, 3);

  return (
    <section className="festivals-section">
      <div className="section">
        <div className="festivals-header">
          <p className="festivals-eyebrow">
            <i className="fa-solid fa-om" /> {t('festivalsEyebrow')} <i className="fa-solid fa-om" />
          </p>
          <h2 className="festivals-heading">{t('festivalsHeading')}</h2>
          <div className="festivals-divider">
            <span className="festivals-divider-line" />
            <span className="festivals-divider-dot small" />
            <span className="festivals-divider-dot" />
            <span className="festivals-divider-dot small" />
            <span className="festivals-divider-line" />
          </div>
        </div>

        <div className="festivals-grid">
          {/* Panchang */}
          <Link href="/panchang" className="festival-card">
            <i className="fa-solid fa-moon festival-card-bg-icon" />
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-moon" />
            </div>
            <h3 className="festival-card-label">{t('panchangCardTitle')}</h3>
            <p className="festival-card-title-value">{data.tithiName}</p>
            <p className="festival-card-subvalue">{data.pakshaName}</p>
            <span className="festival-card-link">
              {t('viewFullPanchang')} <i className="fa-solid fa-arrow-right" />
            </span>
          </Link>

          {/* Hindu Calendar */}
          <div className="festival-card">
            <i className="fa-solid fa-calendar-days festival-card-bg-icon" />
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-calendar-days" />
            </div>
            <h3 className="festival-card-label">{t('calendarCardTitle')}</h3>
            <p className="festival-card-title-value">
              {t('vikramSamvat')} {data.vikramSamvat}
            </p>
            <p className="festival-card-subvalue">
              {data.masa} {t('masaWord')}
            </p>
          </div>

          {/* Muhurat */}
          <div className="festival-card">
            <i className="fa-solid fa-sun festival-card-bg-icon" />
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-hands-praying" />
            </div>
            <h3 className="festival-card-label">{t('muhuratCardTitle')}</h3>
            <span className="festival-muhurat-badge">{t('abhijitLabel')}</span>
            <p className="festival-muhurat-time">{data.abhijit || t('notObservedBudhvaar')}</p>
          </div>

          {/* Vrat & Upavas */}
          <div className="festival-card">
            <i className="fa-solid fa-leaf festival-card-bg-icon" />
            <div className="festival-card-icon-badge">
              <i className="fa-solid fa-spa" />
            </div>
            <h3 className="festival-card-label">{t('vratCardTitle')}</h3>
            <p className="festival-vrat-text">
              {data.vrat ? t(data.vrat.key) : t('noMajorVratToday')}
            </p>
          </div>

          {/* Festivals (wide) */}
          <div className="festival-card festival-card-wide festival-card-plain">
            <div className="festival-section-header">
              <div className="festival-header-icon festival-header-icon-red">
                <i className="fa-solid fa-gift" />
              </div>
              <h3 className="festival-section-title">{t('festivalsCardTitle')}</h3>
            </div>

            {data.next ? (
              <>
                <div className="festival-featured-box">
                  <div className="festival-featured-glow" />
                  <div className="festival-featured-row">
                    <div>
                      <h4 className="festival-featured-name">{isHi ? data.next.nameHi : data.next.name}</h4>
                      <p className="festival-featured-countdown">
                        <span className="festival-pulse-dot">
                          <span className="festival-pulse-ping" />
                          <span className="festival-pulse-core" />
                        </span>
                        {data.daysUntilNext === 0 ? t('today') : `${t('inDays')} ${data.daysUntilNext} ${t('daysWord')}`}
                      </p>
                    </div>
                    <div className="festival-featured-date-badge">
                      <span className="festival-featured-day">{new Date(data.next.date).getDate()}</span>
                      <span className="festival-featured-month">
                        {new Date(data.next.date).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>

                {visibleFestivals.length > 0 && (
                  <div className="festival-list">
                    {visibleFestivals.map((f, i) => (
                      <div key={f.date}>
                        <div className="festival-list-item">
                          <div className="festival-list-item-left">
                            <span className="festival-list-dot" />
                            <span className="festival-list-name">{isHi ? f.nameHi : f.name}</span>
                          </div>
                          <span className="festival-list-date">
                            {new Date(f.date).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short' }).toUpperCase()}
                          </span>
                        </div>
                        {i < visibleFestivals.length - 1 && <div className="festival-list-divider" />}
                      </div>
                    ))}
                  </div>
                )}

                {restFestivals.length > 3 && (
                  <button className="festival-view-all-btn" onClick={() => setShowAllFestivals((v) => !v)}>
                    <i className="fa-solid fa-calendar-days" />
                    {showAllFestivals ? t('showLess') : t('viewAllFestivals')}
                  </button>
                )}
              </>
            ) : (
              <p className="festival-vrat-text">{t('noUpcomingFestivals')}</p>
            )}
          </div>

          {/* Planets */}
          <div className="festival-card festival-card-plain">
            <div className="festival-section-header">
              <div className="festival-header-icon festival-header-icon-amber">
                <i className="fa-solid fa-globe" />
              </div>
              <h3 className="festival-section-title">{t('planetsCardTitle')}</h3>
            </div>

            <div className="festival-planet-mini-card festival-planet-sun">
              <div className="festival-planet-mini-left">
                <div className="festival-planet-mini-icon festival-planet-mini-icon-sun">
                  <i className="fa-solid fa-sun" />
                </div>
                <span className="festival-planet-mini-label">{t('sunRashi')}</span>
              </div>
              <span className="festival-planet-mini-value">{data.sunRashi}</span>
            </div>

            <div className="festival-planet-mini-card festival-planet-moon">
              <div className="festival-planet-mini-left">
                <div className="festival-planet-mini-icon festival-planet-mini-icon-moon">
                  <i className="fa-solid fa-moon" />
                </div>
                <span className="festival-planet-mini-label">{t('moonRashi')}</span>
              </div>
              <span className="festival-planet-mini-value">{data.moonRashi}</span>
            </div>
          </div>

          {/* Jyotish */}
          <div className="festival-card festival-card-plain">
            <div className="festival-section-header">
              <div className="festival-header-icon festival-header-icon-purple">
                <i className="fa-solid fa-star-and-crescent" />
              </div>
              <h3 className="festival-section-title">{t('jyotishCardTitle')}</h3>
            </div>

            <div className="festival-service-list">
              <Link href="/kundli" className="festival-service-item">
                <span>
                  <i className="fa-solid fa-scroll" /> {t('janamKundli')}
                </span>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <Link href="/kundli-matching" className="festival-service-item">
                <span>
                  <i className="fa-solid fa-people-arrows" /> {t('kundliMatching')}
                </span>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <Link href="/daily-horoscope" className="festival-service-item">
                <span>
                  <i className="fa-solid fa-star" /> {t('dailyHoroscope')}
                </span>
                <i className="fa-solid fa-chevron-right" />
              </Link>
              <a href="#talk-to-astrologer" className="festival-cta-button">
                <i className="fa-solid fa-headset" /> {t('talkToAstrologer')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
