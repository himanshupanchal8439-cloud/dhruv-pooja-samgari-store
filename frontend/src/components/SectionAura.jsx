export default function SectionAura({ dark = false }) {
  const strokeColor = dark ? 'rgba(212, 175, 55, 0.75)' : 'rgba(212, 175, 55, 0.4)';
  const fillColor = dark ? 'rgba(212,175,55,0.22)' : 'rgba(212,175,55,0.1)';

  return (
    <div className={`section-scene ${dark ? 'section-scene-dark' : ''}`}>
      <div className="divine-aura small" />
      <svg className="mandala-layer spin-slow" viewBox="0 0 100 100">
        <g stroke={strokeColor} strokeWidth="0.5" fill="none">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="35" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="25" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" opacity="0.3" />
          <path d="M50 15 Q60 30 50 45 Q40 30 50 15 Z" fill={fillColor} />
          <path d="M50 85 Q60 70 50 55 Q40 70 50 85 Z" fill={fillColor} />
          <path d="M15 50 Q30 60 45 50 Q30 40 15 50 Z" fill={fillColor} />
          <path d="M85 50 Q70 60 55 50 Q70 40 85 50 Z" fill={fillColor} />
        </g>
      </svg>
    </div>
  );
}
