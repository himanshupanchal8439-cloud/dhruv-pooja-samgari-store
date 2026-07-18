'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  tithiNames, tithiNamesHi, nakshatraNames, nakshatraNamesHi,
  vaarNames, vaarNamesHi, pakshaHi, specialTithiHi,
  rahuSegment, yamaSegment, gulikaSegment,
  sunTimes, fmt, segmentRange, getVedicSnapshot,
} from '../utils/panchangCalc';

// Default location: New Delhi. Timings are in IST (Indian audience).
const DEFAULT_LOCATION = { lat: 28.6139, lon: 77.209, label: 'New Delhi' };

function computePanchang(lat, lon, lang, notObservedText) {
  const now = new Date();
  const { weekday, tithiIndex, tithi, paksha, nakshatraIndex } = getVedicSnapshot(now);

  const { sunrise, sunset } = sunTimes(now, lat, lon);
  const dayLen = sunset - sunrise;
  const midday = sunrise + dayLen / 2;
  const muhurta = dayLen / 15;

  const isHi = lang === 'hi';
  const displayTithi = isHi ? specialTithiHi[tithi] || tithiNamesHi[tithiIndex % 15] : tithi;
  const displayPaksha = isHi ? pakshaHi[paksha] : paksha;

  return {
    dateLabel: now.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    vaar: (isHi ? vaarNamesHi : vaarNames)[weekday],
    tithi: `${displayTithi} (${displayPaksha})`,
    nakshatra: isHi ? nakshatraNamesHi[nakshatraIndex] : nakshatraNames[nakshatraIndex],
    sunrise: fmt(sunrise),
    sunset: fmt(sunset),
    abhijit: weekday === 3 ? notObservedText : `${fmt(midday - muhurta / 2)} – ${fmt(midday + muhurta / 2)}`,
    rahuKaal: segmentRange(sunrise, sunset, rahuSegment[weekday]),
    yamaganda: segmentRange(sunrise, sunset, yamaSegment[weekday]),
    gulika: segmentRange(sunrise, sunset, gulikaSegment[weekday]),
  };
}

async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
    const data = await res.json();
    const a = data.address || {};
    return a.city || a.town || a.village || a.county || a.state_district || a.state || 'Your Location';
  } catch {
    return 'Your Location';
  }
}

export default function PanchangSection() {
  const { t, lang } = useLanguage();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [p, setP] = useState(null);
  const [locStatus, setLocStatus] = useState('default'); // default | detecting | detected | denied

  function applyPosition(pos) {
    const { latitude, longitude } = pos.coords;
    reverseGeocode(latitude, longitude).then((label) => {
      setLocation({ lat: latitude, lon: longitude, label });
      setLocStatus('detected');
    });
  }

  function requestLocation() {
    if (!navigator.geolocation) return;
    setLocStatus('detecting');
    navigator.geolocation.getCurrentPosition(applyPosition, () => setLocStatus('denied'), {
      timeout: 10000,
      maximumAge: 600000,
    });
  }

  useEffect(() => {
    // This section now also serves as the standalone /panchang page. Next.js's
    // scroll-to-top on navigation doesn't always fire reliably, so force it —
    // otherwise a user clicking in from far down another page lands scrolled
    // partway down (sometimes as far as the footer).
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // If the user already granted permission earlier, use it silently (no popup)
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((res) => {
          if (res.state === 'granted') requestLocation();
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const notObserved = t('notObservedBudhvaar');
    setP(computePanchang(location.lat, location.lon, lang, notObserved));
    const timer = setInterval(() => setP(computePanchang(location.lat, location.lon, lang, notObserved)), 10 * 60 * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, lang]);

  if (!p) return null;

  return (
    <section className="panchang-section" id="panchang">
      <div className="section">
        <div className="sacred-heading">
          <h4 className="awards-eyebrow">{t('panchangEyebrow')}</h4>
          <h2>{t('panchangHeading')}</h2>
          <div className="sacred-divider" />
          <p className="panchang-date">
            {p.dateLabel} · {p.vaar} · <i className="fa-solid fa-location-dot" />{' '}
            {locStatus === 'detected' ? location.label : t('newDelhi')}
          </p>
          {locStatus !== 'detected' && (
            <button className="panchang-location-btn" onClick={requestLocation} disabled={locStatus === 'detecting'}>
              <i className="fa-solid fa-crosshairs" />{' '}
              {locStatus === 'detecting'
                ? t('detectingLocation')
                : locStatus === 'denied'
                  ? t('locationBlocked')
                  : t('useMyLocation')}
            </button>
          )}
        </div>

        <div className="panchang-grid">
          <div className="panchang-card">
            <i className="fa-solid fa-moon" />
            <span>{t('tithiLabel')}</span>
            <strong>{p.tithi}</strong>
          </div>
          <div className="panchang-card">
            <i className="fa-solid fa-star" />
            <span>{t('nakshatraLabel')}</span>
            <strong>{p.nakshatra}</strong>
          </div>
          <div className="panchang-card">
            <i className="fa-solid fa-sun" />
            <span>{t('suryodayLabel')}</span>
            <strong>{p.sunrise}</strong>
          </div>
          <div className="panchang-card">
            <i className="fa-solid fa-cloud-sun" />
            <span>{t('suryastLabel')}</span>
            <strong>{p.sunset}</strong>
          </div>
          <div className="panchang-card panchang-card-good">
            <i className="fa-solid fa-hands-praying" />
            <span>{t('abhijitLabel')}</span>
            <strong>{p.abhijit}</strong>
          </div>
          <div className="panchang-card panchang-card-bad">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>{t('rahuKaalLabel')}</span>
            <strong>{p.rahuKaal}</strong>
          </div>
          <div className="panchang-card panchang-card-bad">
            <i className="fa-solid fa-circle-minus" />
            <span>{t('yamagandaLabel')}</span>
            <strong>{p.yamaganda}</strong>
          </div>
          <div className="panchang-card panchang-card-bad">
            <i className="fa-solid fa-hourglass-half" />
            <span>{t('gulikaKaalLabel')}</span>
            <strong>{p.gulika}</strong>
          </div>
        </div>

        <p className="panchang-note">
          {t('panchangNotePrefix')} {locStatus === 'detected' ? location.label : t('newDelhi')}.{' '}
          {t('panchangNoteSuffix')}
        </p>
      </div>
    </section>
  );
}
