import { useEffect, useRef, useState } from 'react';

function PlaceInput({ value, onChange }) {
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
        placeholder="City, State"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && (loading || suggestions.length > 0) && (
        <ul className="kundli-place-suggestions">
          {loading && <li className="kundli-place-loading">Searching...</li>}
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
  { key: 'varna', name: 'Varna', max: 1, about: 'Spiritual compatibility & ego balance' },
  { key: 'vashya', name: 'Vashya', max: 2, about: 'Mutual control & attraction' },
  { key: 'tara', name: 'Tara', max: 3, about: 'Health & wellbeing of the couple' },
  { key: 'yoni', name: 'Yoni', max: 4, about: 'Physical & intimate compatibility' },
  { key: 'grahaMaitri', name: 'Graha Maitri', max: 5, about: 'Mental compatibility & friendship' },
  { key: 'gana', name: 'Gana', max: 6, about: 'Temperament & nature match' },
  { key: 'bhakoot', name: 'Bhakoot', max: 7, about: 'Love, family growth & prosperity' },
  { key: 'nadi', name: 'Nadi', max: 8, about: 'Health of offspring & genetic compatibility' },
];

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
            <i className="fa-solid fa-heart" /> Free Reading
          </h3>
          <h2 className="astro-title">Kundli Matching</h2>
          <p className="astro-desc">
            Enter both partners' birth details to see an illustrative Ashtakoota (36 Guna) compatibility score. For a
            complete Vedic matching report with Mangal Dosha and remedies, connect with our verified astrologers.
          </p>
        </div>

        {!result ? (
          <form className="kundli-form match-form" onSubmit={handleSubmit}>
            <div className="match-columns">
              <fieldset className="match-fieldset">
                <legend><i className="fa-solid fa-mars" /> Groom's Details</legend>
                <input
                  placeholder="Groom's Name"
                  required
                  value={boy.name}
                  onChange={(e) => setBoy({ ...boy, name: e.target.value })}
                />
                <label>
                  Date of Birth
                  <input type="date" required value={boy.dob} onChange={(e) => setBoy({ ...boy, dob: e.target.value })} />
                </label>
                <label>
                  Place of Birth (optional)
                  <PlaceInput value={boy.place} onChange={(v) => setBoy({ ...boy, place: v })} />
                </label>
              </fieldset>

              <fieldset className="match-fieldset">
                <legend><i className="fa-solid fa-venus" /> Bride's Details</legend>
                <input
                  placeholder="Bride's Name"
                  required
                  value={girl.name}
                  onChange={(e) => setGirl({ ...girl, name: e.target.value })}
                />
                <label>
                  Date of Birth
                  <input type="date" required value={girl.dob} onChange={(e) => setGirl({ ...girl, dob: e.target.value })} />
                </label>
                <label>
                  Place of Birth (optional)
                  <PlaceInput value={girl.place} onChange={(v) => setGirl({ ...girl, place: v })} />
                </label>
              </fieldset>
            </div>

            <button type="submit" className="btn-astro kundli-submit">
              <i className="fa-solid fa-heart-circle-check" /> Check Compatibility
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
                    <span>Groom's Place of Birth</span>
                    <strong>{result.boy.place}</strong>
                  </div>
                )}
                {result.girl.place && (
                  <div className="kundli-stat kundli-stat-wide">
                    <span>Bride's Place of Birth</span>
                    <strong>{result.girl.place}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="match-score-ring">
              <div className="match-score-number">{result.total}</div>
              <div className="match-score-max">/ {totalMax} Gunas</div>
            </div>

            <div className={`match-verdict match-verdict-${result.verdict.tone}`}>{result.verdict.label}</div>
            <p className="kundli-trait">{result.verdict.text}</p>

            <h4 className="kundli-section-title">Ashtakoota Breakdown</h4>
            <div className="match-koota-list">
              {result.breakdown.map((k) => (
                <div key={k.key} className="match-koota-row">
                  <div className="match-koota-info">
                    <span className="match-koota-name">{k.name}</span>
                    <span className="match-koota-about">{k.about}</span>
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

            <p className="kundli-disclaimer">
              This score is generated using simplified illustrative logic based on the names and dates entered — it is
              not calculated from real nakshatra/rashi positions. For an authentic Ashtakoota Guna Milan with Mangal
              Dosha analysis, talk to one of our verified astrologers.
            </p>
            <div className="kundli-result-actions">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-astro">
                <i className="fa-solid fa-comment-dots" /> Talk to Astrologer
              </a>
              <button className="btn-astro btn-astro-outline" onClick={reset}>
                Check Another Match
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
