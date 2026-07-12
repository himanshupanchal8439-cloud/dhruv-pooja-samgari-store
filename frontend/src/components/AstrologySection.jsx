'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const services = [
  {
    icon: 'fa-scroll',
    title: 'Janam Kundli',
    text: 'Get your detailed birth chart with accurate planetary positions and personalized life predictions.',
    cta: 'Generate Free',
    link: '/kundli',
  },
  {
    icon: 'fa-heart',
    title: 'Kundli Matching',
    text: 'Check 36 Gunas for marriage. Ensure a harmonious and prosperous married life based on Vedic astrology.',
    cta: 'Match Now',
    link: '/kundli-matching',
  },
  {
    icon: 'fa-star-and-crescent',
    title: 'Daily Horoscope',
    text: 'Read your free daily, weekly, and yearly astrological predictions based on your moon sign.',
    cta: 'Read Today',
    link: '/daily-horoscope',
  },
];

// Astrologers are available 6:00 AM – 10:00 PM IST
function isLiveNowIST() {
  const istHour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }).format(new Date())
  );
  return istHour >= 6 && istHour < 22;
}

export default function AstrologySection() {
  const starsRef = useRef();
  const sectionRef = useRef();
  const cardRefs = useRef([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(isLiveNowIST());
    const timer = setInterval(() => setIsLive(isLiveNowIST()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = starsRef.current;
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 1.5}s`);
      container.appendChild(star);
    }

    const ctx = gsap.context(() => {
      gsap.from('.astro-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.astro-card', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        y: 80,
        opacity: 0,
        rotationX: 15,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.2)',
      });

      gsap.from('.astro-banner', {
        scrollTrigger: { trigger: sectionRef.current, start: 'bottom 80%' },
        scale: 0.95,
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power2.out',
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      container.innerHTML = '';
    };
  }, []);

  function handleTilt(e, i) {
    const card = cardRefs.current[i];
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    gsap.killTweensOf(card);
    gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.3, ease: 'power1.out', overwrite: true });
  }

  function resetTilt(i) {
    const card = cardRefs.current[i];
    gsap.killTweensOf(card);
    gsap.set(card, { rotationX: 0, rotationY: 0 });
  }

  return (
    <section className="astro-section" ref={sectionRef}>
      <div className="astro-stars" ref={starsRef} />
      <svg className="astro-zodiac" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <path
          d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16 M26 8 L74 92 M8 26 L92 74 M8 74 L92 26 M26 92 L74 8"
          stroke="currentColor"
          strokeWidth="0.1"
        />
      </svg>

      <div className="astro-inner">
        <div className="astro-header">
          <h3 className="astro-eyebrow">
            <i className="fa-solid fa-moon" /> Cosmic Guidance
          </h3>
          <h2 className="astro-title">Vedic Astrology Services</h2>
          <p className="astro-desc">
            Unlock the secrets of your stars. Connect with premium verified astrologers and discover your true life
            path through authentic Vedic science.
          </p>
        </div>

        <div className="astro-grid">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="astro-card"
              ref={(el) => (cardRefs.current[i] = el)}
              onMouseMove={(e) => handleTilt(e, i)}
              onMouseLeave={() => resetTilt(i)}
            >
              <div className="mystic-glow" />
              <div className="astro-card-content">
                <div className="astro-icon">
                  <i className={`fa-solid ${s.icon}`} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.link ? (
                  <Link href={s.link} className="astro-link">
                    {s.cta} <i className="fa-solid fa-arrow-right" />
                  </Link>
                ) : (
                  <button className="astro-link">
                    {s.cta} <i className="fa-solid fa-arrow-right" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="astro-banner">
          <div className="astro-banner-text">
            {isLive ? (
              <span className="astro-live-badge">
                <span className="astro-live-dot" /> Live Now
              </span>
            ) : (
              <span className="astro-live-badge astro-live-badge-offline">
                <i className="fa-regular fa-clock" /> Available 6 AM – 10 PM
              </span>
            )}
            <h3>Talk to Premium Astrologer</h3>
            <p className="astro-astrologer-name">
              Pandit Avnish Sharma <span>· Vedic Jyotish Expert</span>
            </p>
            <p>
              Get instant guidance for your Career, Marriage, and Wealth from India's top verified Vedic experts.
              First consultation at a special divine introductory price.
            </p>
            <div className="astro-banner-actions">
              <a href="tel:+919876543210" className="btn-astro">
                <i className="fa-solid fa-phone" /> Call Now
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-astro btn-astro-outline">
                <i className="fa-solid fa-comment-dots" /> Chat Now
              </a>
            </div>
          </div>

          <div className="astro-banner-image">
            <img src="/images/astrologer.png" alt="Vedic Astrologer" />
          </div>

          <div className="astro-badge-visual">
            <div className="astro-spin-ring">
              <div className="astro-spin-ring-inner">
                <i className="fa-solid fa-hands-holding-circle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
