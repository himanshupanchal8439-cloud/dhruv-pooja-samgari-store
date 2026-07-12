'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

const awards = [
  {
    type: 'image',
    image: 'https://loremflickr.com/600/400/trophy,award?lock=302',
    title: 'Brand of the Year',
    text: 'Voted #1 in spiritual commerce category.',
  },
  {
    type: 'video',
    poster: 'https://loremflickr.com/600/400/celebration,event?lock=303',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Annual Gala 2025',
    text: 'Highlight reel from our recent award ceremony.',
  },
];

export default function AwardsSection() {
  const sectionRef = useRef();
  const { t } = useLanguage();

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
            <div key={a.title} className="gallery-card">
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
    </section>
  );
}
