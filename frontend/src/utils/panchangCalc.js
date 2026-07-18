// Shared Vedic almanac math — simplified astronomical approximations (not a full
// ephemeris library). Used by the Panchang and Festivals home sections so both
// stay consistent instead of duplicating the formulas.

export const IST_OFFSET_MIN = 330;

export const tithiNames = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
];
export const tithiNamesHi = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी',
  'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी',
];

export const nakshatraNames = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
export const nakshatraNamesHi = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'अश्लेषा',
  'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपदा',
  'उत्तरा भाद्रपदा', 'रेवती',
];

export const vaarNames = ['Ravivaar', 'Somvaar', 'Mangalvaar', 'Budhvaar', 'Guruvaar', 'Shukravaar', 'Shanivaar'];
export const vaarNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
export const pakshaHi = { 'Shukla Paksha': 'शुक्ल पक्ष', 'Krishna Paksha': 'कृष्ण पक्ष' };
export const specialTithiHi = { Purnima: 'पूर्णिमा', Amavasya: 'अमावस्या' };

// Sidereal zodiac (Rashi), starting at 0° Mesh
export const rashiNames = [
  'Mesh', 'Vrishabh', 'Mithun', 'Kark', 'Simha', 'Kanya',
  'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbh', 'Meen',
];
export const rashiNamesHi = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

// 1-indexed segment (of 8 day-parts) per weekday, Sunday first
export const rahuSegment = [8, 2, 7, 5, 6, 4, 3];
export const yamaSegment = [5, 4, 3, 2, 1, 7, 6];
export const gulikaSegment = [7, 6, 5, 4, 3, 2, 1];

export const deg = Math.PI / 180;
export const norm360 = (x) => ((x % 360) + 360) % 360;

export function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

export function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M = norm360(357.52911 + 35999.05029 * T);
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(M * deg) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * deg) +
    0.000289 * Math.sin(3 * M * deg);
  return norm360(L0 + C);
}

export function moonLongitude(jd) {
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
export function ayanamsa(date) {
  return 23.85 + 0.0139667 * (date.getFullYear() - 2000);
}

// NOAA simplified sunrise/sunset, returns IST minutes from midnight
export function sunTimes(date, lat, lon) {
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

export function fmt(minutes) {
  const m = Math.round(minutes);
  let h = Math.floor(m / 60) % 24;
  const mm = String(m % 60).padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mm} ${period}`;
}

export function segmentRange(sunrise, sunset, index1) {
  const part = (sunset - sunrise) / 8;
  const start = sunrise + part * (index1 - 1);
  return `${fmt(start)} – ${fmt(start + part)}`;
}

// Core tithi/nakshatra/rashi state for a given moment — the shared basis for
// both the Panchang section and the Festivals section's Vrat/Planets cards.
export function getVedicSnapshot(date = new Date()) {
  const jd = julianDay(date);
  const sun = sunLongitude(jd);
  const moon = moonLongitude(jd);

  const diff = norm360(moon - sun);
  const tithiIndex = Math.floor(diff / 12); // 0..29
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  let tithi;
  if (tithiIndex === 14) tithi = 'Purnima';
  else if (tithiIndex === 29) tithi = 'Amavasya';
  else tithi = tithiNames[tithiIndex % 15];

  const ayan = ayanamsa(date);
  const siderealMoon = norm360(moon - ayan);
  const siderealSun = norm360(sun - ayan);
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
  const moonRashiIndex = Math.floor(siderealMoon / 30);
  const sunRashiIndex = Math.floor(siderealSun / 30);

  return {
    weekday: date.getDay(),
    tithiIndex,
    tithi,
    paksha,
    nakshatraIndex,
    moonRashiIndex,
    sunRashiIndex,
  };
}
