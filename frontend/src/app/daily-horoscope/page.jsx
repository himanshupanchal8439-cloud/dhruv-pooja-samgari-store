'use client';

import { useState } from 'react';

const signs = [
  { key: 'Mesh', name: 'Mesh (Aries)', icon: 'fa-fire', dates: 'Mar 21 - Apr 19' },
  { key: 'Vrishabh', name: 'Vrishabh (Taurus)', icon: 'fa-mountain', dates: 'Apr 20 - May 20' },
  { key: 'Mithun', name: 'Mithun (Gemini)', icon: 'fa-people-arrows', dates: 'May 21 - Jun 20' },
  { key: 'Kark', name: 'Kark (Cancer)', icon: 'fa-moon', dates: 'Jun 21 - Jul 22' },
  { key: 'Simha', name: 'Simha (Leo)', icon: 'fa-sun', dates: 'Jul 23 - Aug 22' },
  { key: 'Kanya', name: 'Kanya (Virgo)', icon: 'fa-leaf', dates: 'Aug 23 - Sep 22' },
  { key: 'Tula', name: 'Tula (Libra)', icon: 'fa-scale-balanced', dates: 'Sep 23 - Oct 22' },
  { key: 'Vrishchik', name: 'Vrishchik (Scorpio)', icon: 'fa-bolt', dates: 'Oct 23 - Nov 21' },
  { key: 'Dhanu', name: 'Dhanu (Sagittarius)', icon: 'fa-bullseye', dates: 'Nov 22 - Dec 21' },
  { key: 'Makar', name: 'Makar (Capricorn)', icon: 'fa-chess-king', dates: 'Dec 22 - Jan 19' },
  { key: 'Kumbh', name: 'Kumbh (Aquarius)', icon: 'fa-water', dates: 'Jan 20 - Feb 18' },
  { key: 'Meen', name: 'Meen (Pisces)', icon: 'fa-fish', dates: 'Feb 19 - Mar 20' },
];

const luckyColors = ['Gold', 'Crimson Red', 'Emerald Green', 'Royal Blue', 'Ivory White', 'Saffron', 'Lavender', 'Copper', 'Silver', 'Maroon', 'Turquoise', 'Peach'];

const loveLines = [
  'A meaningful conversation strengthens a close bond today.',
  'Single? An unexpected connection may spark your interest.',
  'Patience with a loved one brings lasting harmony.',
  'Express your feelings openly — honesty deepens trust today.',
];

const careerLines = [
  'A pending task finally moves forward with clarity.',
  'Your ideas gain attention from someone influential.',
  'Focus on details today; small errors are easy to avoid.',
  'Collaboration brings better results than working solo.',
];

const healthLines = [
  'Energy levels are high — a good day for exercise.',
  'Prioritize rest; avoid overexertion in the evening.',
  'Mindful eating keeps you feeling balanced today.',
  'A short walk clears your mind and lifts your mood.',
];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function buildHoroscope(signKey) {
  const seed = `${signKey}-${todayKey()}`;
  const h = hashSeed(seed);
  const rating = (h % 5) + 1;
  return {
    love: loveLines[h % loveLines.length],
    career: careerLines[(h >> 2) % careerLines.length],
    health: healthLines[(h >> 4) % healthLines.length],
    luckyColor: luckyColors[h % luckyColors.length],
    luckyNumber: (h % 9) + 1,
    rating,
  };
}

function formatToday() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DailyHoroscope() {
  const [selected, setSelected] = useState(null);
  const reading = selected ? buildHoroscope(selected.key) : null;

  return (
    <section className="kundli-page">
      <div className="kundli-inner">
        <div className="astro-header">
          <h3 className="astro-eyebrow">
            <i className="fa-solid fa-star-and-crescent" /> Free Reading
          </h3>
          <h2 className="astro-title">Daily Horoscope</h2>
          <p className="astro-desc">Select your zodiac sign to read today's predictions — {formatToday()}.</p>
        </div>

        <div className="horo-sign-grid">
          {signs.map((s) => (
            <button
              key={s.key}
              className={`horo-sign-card ${selected?.key === s.key ? 'active' : ''}`}
              onClick={() => setSelected(s)}
            >
              <i className={`fa-solid ${s.icon}`} />
              <span className="horo-sign-name">{s.key}</span>
              <span className="horo-sign-dates">{s.dates}</span>
            </button>
          ))}
        </div>

        {reading && (
          <div className="kundli-full-result horo-result">
            <div className="kundli-result-badge">
              <i className={`fa-solid ${selected.icon}`} />
            </div>
            <h3>{selected.name}</h3>
            <p className="horo-date">{formatToday()}</p>

            <div className="horo-rating">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} className={`fa-solid fa-star ${i < reading.rating ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="horo-blocks">
              <div className="horo-block">
                <span className="horo-block-icon"><i className="fa-solid fa-heart" /></span>
                <div>
                  <h5>Love</h5>
                  <p>{reading.love}</p>
                </div>
              </div>
              <div className="horo-block">
                <span className="horo-block-icon"><i className="fa-solid fa-briefcase" /></span>
                <div>
                  <h5>Career</h5>
                  <p>{reading.career}</p>
                </div>
              </div>
              <div className="horo-block">
                <span className="horo-block-icon"><i className="fa-solid fa-heart-pulse" /></span>
                <div>
                  <h5>Health</h5>
                  <p>{reading.health}</p>
                </div>
              </div>
            </div>

            <div className="kundli-stats">
              <div className="kundli-stat">
                <span>Lucky Color</span>
                <strong>{reading.luckyColor}</strong>
              </div>
              <div className="kundli-stat">
                <span>Lucky Number</span>
                <strong>{reading.luckyNumber}</strong>
              </div>
            </div>

            <p className="kundli-disclaimer">
              This is a generalised sun-sign reading for entertainment purposes. For personalised predictions based on
              your exact birth chart, talk to one of our verified astrologers.
            </p>
            <div className="kundli-result-actions">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-astro">
                <i className="fa-solid fa-comment-dots" /> Talk to Astrologer
              </a>
              <button className="btn-astro btn-astro-outline" onClick={() => setSelected(null)}>
                Choose Another Sign
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
