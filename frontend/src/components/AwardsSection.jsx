'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

export default function AwardsSection() {
  const sectionRef = useRef();
  const { t } = useLanguage();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!preview) return;
    function handleKey(e) {
      if (e.key === 'Escape') setPreview(null);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [preview]);

  const awards = [
    {
      key: 'brandOfYear',
      type: 'image',
      image: '/images/star-icon-award-2022.png',
      title: t('brandOfYear'),
      text: t('brandOfYearText'),
    },
    {
      key: 'annualGala',
      type: 'video',
      poster: 'https://loremflickr.com/600/400/celebration,event?lock=303',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      title: t('annualGala'),
      text: t('annualGalaText'),
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.gallery-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="awards-section" ref={sectionRef}>
      <div className="section">
        <div className="sacred-heading">
          <h4 className="awards-eyebrow">{t('recognitions')}</h4>
          <h2>{t('trustHeading')}</h2>
          <div className="sacred-divider" />
        </div>

        <div className="awards-grid">
          {awards.map((a) => (
            <div
              key={a.key}
              className="gallery-card"
              onClick={() => setPreview(a)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setPreview(a)}
            >
              <div className="gallery-media">
                {a.type === 'video' ? (
                  <video autoPlay loop muted playsInline poster={a.poster}>
                    <source src={a.src} type="video/mp4" />
                  </video>
                ) : (
                  <img src={a.image} alt={a.title} loading="lazy" />
                )}
              </div>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      {preview && (
        <div className="image-preview-overlay award-preview-overlay" onClick={() => setPreview(null)}>
          <button className="image-preview-close" onClick={() => setPreview(null)} aria-label="Close preview">
            ✕
          </button>
          <div className="award-preview-card" onClick={(e) => e.stopPropagation()}>
            {preview.type === 'video' ? (
              <video controls autoPlay loop poster={preview.poster}>
                <source src={preview.src} type="video/mp4" />
              </video>
            ) : (
              <img src={preview.image} alt={preview.title} />
            )}
            <h3>{preview.title}</h3>
            <p>{preview.text}</p>
          </div>
        </div>
      )}
    </section>
  );
}
