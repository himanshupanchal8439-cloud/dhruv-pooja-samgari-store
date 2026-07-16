'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Default location: New Delhi. Timings are in IST (Indian audience).
const DEFAULT_LOCATION = { lat: 28.6139, lon: 77.209, label: 'New Delhi' };
const IST_OFFSET_MIN = 330;

const tithiNames = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
];
const tithiNamesHi = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी',
  'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी',
];

const nakshatraNames = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
const nakshatraNamesHi = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'अश्लेषा',
  'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपदा',
  'उत्तरा भाद्रपदा', 'रेवती',
];

const vaarNames = ['Ravivaar', 'Somvaar', 'Mangalvaar', 'Budhvaar', 'Guruvaar', 'Shukravaar', 'Shanivaar'];
const vaarNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const pakshaHi = { 'Shukla Paksha': 'शुक्ल पक्ष', 'Krishna Paksha': 'कृष्ण पक्ष' };
const specialTithiHi = { Purnima: 'पूर्णिमा', Amavasya: 'अमावस्या' };

// 1-indexed segment (of 8 day-parts) per weekday, Sunday first
const rahuSegment = [8, 2, 7, 5, 6, 4, 3];
const yamaSegment = [5, 4, 3, 2, 1, 7, 6];
const gulikaSegment = [7, 6, 5, 4, 3, 2, 1];

const deg = Math.PI / 180;
const norm360 = (x) => ((x % 360) + 360) % 360;

function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M = norm360(357.52911 + 35999.05029 * T);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(M * deg) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * deg) +
    0.000289 * Math.sin(3 * M * deg);
  return norm360(L0 + C);
}

function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm360(218.3164477 + 481267.88123421 * T);
  const D = norm360(297.8501921 + 445267.1114034 * T);
  const M = norm360(357.5291092 + 35999.0502909 * T);
  const Mp = norm360(134.9633964 + 477198.8675055 * T);
  const F = norm360(93.272095 + 483202.0175233 * T);

  const lon =
    Lp +
    6.288774 * Math.sin(Mp * deg) +
    1.274027 * Math.sin((2 * D - Mp) * deg) +
    0.658314 * Math.sin(2 * D * deg) +
    0.213618 * Math.sin(2 * Mp * deg) -
    0.185116 * Math.sin(M * deg) -
    0.114332 * Math.sin(2 * F * deg) +
    0.058793 * Math.sin((2 * D - 2 * Mp) * deg) +
    0.057066 * Math.sin((2 * D - M - Mp) * deg) +
    0.053322 * Math.sin((2 * D + Mp) * deg) +
    0.045758 * Math.sin((2 * D - M) * deg);
  return norm360(lon);
}

// Lahiri ayanamsa approximation
function ayanamsa(date) {
  return 23.85 + 0.0139667 * (date.getFullYear() - 2000);
}

// NOAA simplified sunrise/sunset, returns IST minutes from midnight
function sunTimes(date, lat, lon) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  const g = ((2 * Math.PI) / 365) * (dayOfYear - 1 + 0.5);

  const eqtime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g);

  const haCos = Math.cos(90.833 * deg) / (Math.cos(lat * deg) * Math.cos(decl)) - Math.tan(lat * deg) * Math.tan(decl);
  const ha = Math.acos(Math.min(1, Math.max(-1, haCos))) / deg;

  const sunriseUTC = 720 - 4 * (lon + ha) - eqtime;
  const sunsetUTC = 720 - 4 * (lon - ha) - eqtime;
  return { sunrise: sunriseUTC + IST_OFFSET_MIN, sunset: sunsetUTC + IST_OFFSET_MIN };
}

function fmt(minutes) {
  const m = Math.round(minutes);
  let h = Math.floor(m / 60) % 24;
  const mm = String(m % 60).padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mm} ${period}`;
}

function segmentRange(sunrise, sunset, index1) {
  const part = (sunset - sunrise) / 8;
  const start = sunrise + part * (index1 - 1);
  return `${fmt(start)} – ${fmt(start + part)}`;
}

function computePanchang(lat, lon, lang, notObservedText) {
  const now = new Date();
  const jd = julianDay(now);

  const sun = sunLongitude(jd);
  const moon = moonLongitude(jd);

  const diff = norm360(moon - sun);
  const tithiIndex = Math.floor(diff / 12); // 0..29
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  let tithi;
  if (tithiIndex === 14) tithi = 'Purnima';
  else if (tithiIndex === 29) tithi = 'Amavasya';
  else tithi = tithiNames[tithiIndex % 15];

  const siderealMoon = norm360(moon - ayanamsa(now));
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
  const nakshatra = nakshatraNames[nakshatraIndex];

  const { sunrise, sunset } = sunTimes(now, lat, lon);
  const dayLen = sunset - sunrise;
  const midday = sunrise + dayLen / 2;
  const muhurta = dayLen / 15;
  const weekday = now.getDay();

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
    nakshatra: isHi ? nakshatraNamesHi[nakshatraIndex] : nakshatra,
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
    <section className="panchang-section">
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
