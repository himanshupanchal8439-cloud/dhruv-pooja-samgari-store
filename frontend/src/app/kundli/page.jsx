'use client';

import { useEffect, useRef, useState } from 'react';

const zodiacSigns = [
  { key: 'Makar', name: 'Makar (Capricorn)', from: [12, 22], to: [1, 19], element: 'Earth', lord: 'Shani (Saturn)', trait: 'Disciplined, practical and ambitious. You value structure and long-term goals.' },
  { key: 'Kumbh', name: 'Kumbh (Aquarius)', from: [1, 20], to: [2, 18], element: 'Air', lord: 'Shani (Saturn)', trait: 'Independent, visionary and humanitarian. You think ahead of your time.' },
  { key: 'Meen', name: 'Meen (Pisces)', from: [2, 19], to: [3, 20], element: 'Water', lord: 'Guru (Jupiter)', trait: 'Compassionate, intuitive and artistic. You feel deeply and dream big.' },
  { key: 'Mesh', name: 'Mesh (Aries)', from: [3, 21], to: [4, 19], element: 'Fire', lord: 'Mangal (Mars)', trait: 'Bold, energetic and a natural leader. You act first and think later.' },
  { key: 'Vrishabh', name: 'Vrishabh (Taurus)', from: [4, 20], to: [5, 20], element: 'Earth', lord: 'Shukra (Venus)', trait: 'Grounded, patient and loyal. You seek comfort, beauty and stability.' },
  { key: 'Mithun', name: 'Mithun (Gemini)', from: [5, 21], to: [6, 20], element: 'Air', lord: 'Budh (Mercury)', trait: 'Curious, witty and adaptable. You thrive on communication and variety.' },
  { key: 'Kark', name: 'Kark (Cancer)', from: [6, 21], to: [7, 22], element: 'Water', lord: 'Chandra (Moon)', trait: 'Nurturing, emotional and protective. Home and family mean everything to you.' },
  { key: 'Simha', name: 'Simha (Leo)', from: [7, 23], to: [8, 22], element: 'Fire', lord: 'Surya (Sun)', trait: 'Confident, generous and dramatic. You were born to shine and lead.' },
  { key: 'Kanya', name: 'Kanya (Virgo)', from: [8, 23], to: [9, 22], element: 'Earth', lord: 'Budh (Mercury)', trait: 'Analytical, meticulous and helpful. You find purpose in service and precision.' },
  { key: 'Tula', name: 'Tula (Libra)', from: [9, 23], to: [10, 22], element: 'Air', lord: 'Shukra (Venus)', trait: 'Diplomatic, fair-minded and charming. You seek harmony and partnership.' },
  { key: 'Vrishchik', name: 'Vrishchik (Scorpio)', from: [10, 23], to: [11, 21], element: 'Water', lord: 'Mangal (Mars)', trait: 'Intense, passionate and resilient. You transform through every challenge.' },
  { key: 'Dhanu', name: 'Dhanu (Sagittarius)', from: [11, 22], to: [12, 21], element: 'Fire', lord: 'Guru (Jupiter)', trait: 'Adventurous, optimistic and philosophical. You are always chasing the horizon.' },
];

const houseNames = [
  'Self & Personality',
  'Wealth & Family',
  'Courage & Siblings',
  'Home & Mother',
  'Intelligence & Children',
  'Health & Enemies',
  'Partnership & Marriage',
  'Transformation & Longevity',
  'Fortune & Dharma',
  'Career & Status',
  'Gains & Aspirations',
  'Loss & Liberation',
];

// Fixed South-Indian style chart layout: 12 outer cells in a 4x4 grid, center 2x2 left open.
const chartLayout = [
  { key: 'Meen', row: 1, col: 1 },
  { key: 'Mesh', row: 1, col: 2 },
  { key: 'Vrishabh', row: 1, col: 3 },
  { key: 'Mithun', row: 1, col: 4 },
  { key: 'Kark', row: 2, col: 4 },
  { key: 'Simha', row: 3, col: 4 },
  { key: 'Kanya', row: 4, col: 4 },
  { key: 'Tula', row: 4, col: 3 },
  { key: 'Vrishchik', row: 4, col: 2 },
  { key: 'Dhanu', row: 4, col: 1 },
  { key: 'Makar', row: 3, col: 1 },
  { key: 'Kumbh', row: 2, col: 1 },
];

const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

const grahas = [
  { key: 'Su', name: 'Surya (Sun)' },
  { key: 'Mo', name: 'Chandra (Moon)' },
  { key: 'Ma', name: 'Mangal (Mars)' },
  { key: 'Me', name: 'Budh (Mercury)' },
  { key: 'Ju', name: 'Guru (Jupiter)' },
  { key: 'Ve', name: 'Shukra (Venus)' },
  { key: 'Sa', name: 'Shani (Saturn)' },
  { key: 'Ra', name: 'Rahu' },
  { key: 'Ke', name: 'Ketu' },
];

function getSign(month, day) {
  return zodiacSigns.find(({ from, to }) => {
    if (from[0] === to[0]) return month === from[0] && day >= from[1] && day <= to[1];
    if (month === from[0]) return day >= from[1];
    if (month === to[0]) return day <= to[1];
    return false;
  });
}

function formatTime(hour, minute, period) {
  if (!hour || minute === '') return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function dayOfYear(year, month, day) {
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000);
}

function buildChart(form, signIndex) {
  const seedBase = `${form.name}-${form.dob}-${form.hour}-${form.minute}-${form.period}`;
  const placements = {};

  grahas.forEach((g, i) => {
    let signIdx;
    if (g.key === 'Su') {
      signIdx = signIndex;
    } else {
      const h = hashSeed(seedBase + g.key + i);
      signIdx = h % 12;
    }
    const signKey = zodiacSigns[signIdx].key;
    if (!placements[signKey]) placements[signKey] = [];
    placements[signKey].push(g.key);
  });

  return placements;
}

export default function Kundli() {
  const [form, setForm] = useState({ name: '', dob: '', hour: '', minute: '', period: 'AM', place: '' });
  const [result, setResult] = useState(null);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeLoading, setPlaceLoading] = useState(false);
  const debounceRef = useRef(null);

  function handlePlaceChange(value) {
    setForm({ ...form, place: value });
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 3) {
      setPlaceSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setPlaceLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setPlaceSuggestions(data);
      } catch {
        setPlaceSuggestions([]);
      } finally {
        setPlaceLoading(false);
      }
    }, 400);
  }

  function selectPlace(suggestion) {
    setForm({ ...form, place: suggestion.display_name });
    setPlaceSuggestions([]);
    setShowSuggestions(false);
  }

  useEffect(() => () => debounceRef.current && clearTimeout(debounceRef.current), []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.dob) return;
    const [year, month, day] = form.dob.split('-').map(Number);
    const signIndex = zodiacSigns.findIndex((s) => s === getSign(month, day));
    const sign = zodiacSigns[signIndex];
    const doy = dayOfYear(year, month, day);
    const nakshatra = nakshatras[doy % 27];
    const placements = buildChart(form, signIndex);
    setResult({ ...form, sign, signIndex, year, nakshatra, placements, time: formatTime(form.hour, form.minute, form.period) });
  }

  function reset() {
    setResult(null);
    setForm({ name: '', dob: '', hour: '', minute: '', period: 'AM', place: '' });
    setPlaceSuggestions([]);
  }

  return (
    <section className="kundli-page">
      <div className="kundli-inner">
        <div className="astro-header">
          <h3 className="astro-eyebrow">
            <i className="fa-solid fa-scroll" /> Free Reading
          </h3>
          <h2 className="astro-title">Janam Kundli</h2>
          <p className="astro-desc">
            Enter your birth details to see your illustrative Vedic birth chart. For an astronomically precise
            Kundli with exact planetary positions and dasha, connect with our verified astrologers.
          </p>
        </div>

        {!result ? (
          <form className="kundli-form" onSubmit={handleSubmit}>
            <input
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="kundli-form-row">
              <label>
                Date of Birth
                <input type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </label>
              <label>
                Time of Birth (optional)
                <div className="kundli-time-row">
                  <select value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })}>
                    <option value="">HH</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select value={form.minute} onChange={(e) => setForm({ ...form, minute: e.target.value })}>
                    <option value="">MM</option>
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </label>
            </div>
            <div className="kundli-place-wrap">
              <input
                placeholder="Place of Birth (optional)"
                value={form.place}
                onChange={(e) => handlePlaceChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
              />
              {showSuggestions && (placeLoading || placeSuggestions.length > 0) && (
                <ul className="kundli-place-suggestions">
                  {placeLoading && <li className="kundli-place-loading">Searching...</li>}
                  {!placeLoading &&
                    placeSuggestions.map((s) => (
                      <li key={s.place_id} onMouseDown={() => selectPlace(s)}>
                        <i className="fa-solid fa-location-dot" /> {s.display_name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <button type="submit" className="btn-astro kundli-submit">
              <i className="fa-solid fa-star" /> Generate My Kundli
            </button>
          </form>
        ) : (
          <div className="kundli-full-result">
            <div className="kundli-result-badge">
              <i className="fa-solid fa-sun" />
            </div>
            <h3>
              {result.name ? `${result.name}'s` : 'Your'} Rashi is {result.sign?.name}
            </h3>

            <div className="kundli-stats">
              <div className="kundli-stat">
                <span>Element</span>
                <strong>{result.sign?.element}</strong>
              </div>
              <div className="kundli-stat">
                <span>Rashi Lord</span>
                <strong>{result.sign?.lord}</strong>
              </div>
              <div className="kundli-stat">
                <span>Nakshatra</span>
                <strong>{result.nakshatra}</strong>
              </div>
              <div className="kundli-stat">
                <span>Date of Birth</span>
                <strong>{result.dob}</strong>
              </div>
              {result.time && (
                <div className="kundli-stat">
                  <span>Time of Birth</span>
                  <strong>{result.time}</strong>
                </div>
              )}
              {result.place && (
                <div className="kundli-stat kundli-stat-wide">
                  <span>Place of Birth</span>
                  <strong>{result.place}</strong>
                </div>
              )}
            </div>

            <h4 className="kundli-section-title">Birth Chart (Rashi Chakra)</h4>
            <div className="kundli-chart">
              {chartLayout.map((cell) => {
                const isLagna = cell.key === result.sign.key;
                const planetsHere = result.placements[cell.key] || [];
                return (
                  <div
                    key={cell.key}
                    className={`kundli-chart-cell ${isLagna ? 'lagna' : ''}`}
                    style={{ gridRow: cell.row, gridColumn: cell.col }}
                  >
                    <span className="kundli-chart-sign">{cell.key}</span>
                    {isLagna && <span className="kundli-chart-lagna-tag">LAGNA</span>}
                    <div className="kundli-chart-planets">
                      {planetsHere.map((p) => (
                        <span key={p} className="kundli-chart-planet">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="kundli-chart-center">
                <i className="fa-solid fa-om" />
              </div>
            </div>
            <p className="kundli-chart-legend">
              Su Surya · Mo Chandra · Ma Mangal · Me Budh · Ju Guru · Ve Shukra · Sa Shani · Ra Rahu · Ke Ketu
            </p>

            <h4 className="kundli-section-title">Houses Overview</h4>
            <div className="kundli-houses">
              {houseNames.map((h, i) => (
                <div key={h} className="kundli-house">
                  <span className="kundli-house-number">{i + 1}</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <h4 className="kundli-section-title">Your Nature</h4>
            <p className="kundli-trait">{result.sign?.trait}</p>

            <p className="kundli-disclaimer">
              This chart is generated using your Sun sign for illustration and simplified logic for planetary
              placement — it is not calculated from real astronomical ephemeris data. For an astronomically accurate
              Vedic Janam Kundli with nakshatra pada, dasha and yogas based on your exact birth time and place, talk
              to one of our verified astrologers.
            </p>
            <div className="kundli-result-actions">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-astro">
                <i className="fa-solid fa-comment-dots" /> Talk to Astrologer
              </a>
              <button className="btn-astro btn-astro-outline" onClick={reset}>
                Check Another
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
