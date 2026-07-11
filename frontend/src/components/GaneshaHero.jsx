'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function GaneshaHero() {
  const sceneRef = useRef();
  const mandalaRef = useRef();
  const ganeshaRef = useRef();
  const heroRef = useRef();
  const particlesRef = useRef();

  useEffect(() => {
    gsap.set(mandalaRef.current, { scale: 0.8, opacity: 0, rotation: -45 });
    gsap.set(ganeshaRef.current, { scale: 0.5, opacity: 0, y: 50 });

    const tl = gsap.timeline();
    tl.to(mandalaRef.current, { opacity: 0.4, scale: 1, rotation: 0, duration: 2, ease: 'power3.out' })
      .to(ganeshaRef.current, { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'back.out(1.2)' }, '-=1.5')
      .to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to('.hero-title', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
      .to('.hero-subtitle', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
      .to('.hero-cta', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.6');

    gsap.to(mandalaRef.current, { rotation: 360, duration: 40, repeat: -1, ease: 'none' });
    gsap.to(ganeshaRef.current, { y: -15, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    function handleMouseMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(mandalaRef.current, {
        x: -x * 30,
        y: -y * 30,
        rotationX: -y * 10,
        rotationY: x * 10,
        duration: 1.5,
        ease: 'power2.out',
      });

      gsap.to(ganeshaRef.current, {
        x: x * 40,
        rotationX: y * 15,
        rotationY: -x * 15,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(heroRef.current, {
        x: x * 20,
        y: y * 20,
        duration: 1.2,
        ease: 'power2.out',
      });
    }

    window.addEventListener('mousemove', handleMouseMove);

    const container = particlesRef.current;
    const particles = [];
    for (let i = 0; i < 24; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      container.appendChild(particle);
      particles.push(particle);
      animateParticle(particle);
    }

    function animateParticle(particle) {
      const startX = Math.random() * window.innerWidth;
      const startY = container.offsetHeight + 50;
      const endX = startX + (Math.random() * 200 - 100);
      const duration = Math.random() * 5 + 5;
      const delay = Math.random() * 5;

      gsap.fromTo(
        particle,
        { x: startX, y: startY, opacity: 0, scale: 0 },
        {
          x: endX,
          y: -50,
          opacity: Math.random() * 0.5 + 0.2,
          scale: Math.random() * 1.5 + 0.5,
          duration,
          delay,
          ease: 'none',
          onComplete: () => {
            gsap.to(particle, { opacity: 0, duration: 1, onComplete: () => animateParticle(particle) });
          },
        }
      );
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      particles.forEach((p) => gsap.killTweensOf(p));
      container.innerHTML = '';
    };
  }, []);

  return (
    <section className="ganesha-hero">
      <div className="scene-container" ref={sceneRef}>
        <div className="divine-aura" />

        <svg className="mandala-layer" ref={mandalaRef} viewBox="0 0 100 100">
          <g stroke="rgba(212, 175, 55, 0.4)" strokeWidth="0.5" fill="none">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="35" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="25" />
            <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" opacity="0.3" />
            <path d="M50 15 Q60 30 50 45 Q40 30 50 15 Z" fill="rgba(212,175,55,0.1)" />
            <path d="M50 85 Q60 70 50 55 Q40 70 50 85 Z" fill="rgba(212,175,55,0.1)" />
            <path d="M15 50 Q30 60 45 50 Q30 40 15 50 Z" fill="rgba(212,175,55,0.1)" />
            <path d="M85 50 Q70 60 55 50 Q70 40 85 50 Z" fill="rgba(212,175,55,0.1)" />
          </g>
        </svg>

        <svg className="ganesha-layer" ref={ganeshaRef} viewBox="0 0 200 250">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFDF73" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#997A15" />
            </linearGradient>
          </defs>
          <g stroke="url(#goldGrad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M80 60 L100 20 L120 60 Z" fill="rgba(212,175,55,0.2)" />
            <path d="M70 75 Q100 50 130 75" />
            <circle cx="100" cy="40" r="5" fill="#FFDF73" />
            <path d="M75 80 C 40 70, 20 100, 50 130 C 60 140, 75 120, 85 105" />
            <path d="M125 80 C 160 70, 180 100, 150 130 C 140 140, 125 120, 115 105" />
            <path d="M85 90 C 85 90, 100 110, 115 90" />
            <circle cx="90" cy="100" r="2" fill="#FFDF73" />
            <circle cx="110" cy="100" r="2" fill="#FFDF73" />
            <path d="M95 110 Q 95 160, 70 170 Q 55 175, 60 190 Q 70 200, 95 190 Q 110 180, 110 140 L 105 110" />
            <path d="M85 130 L 75 145 L 82 145" />
            <path d="M115 130 L 130 150 L 118 150" />
            <path d="M95 70 Q 100 80, 105 70" strokeWidth="2" />
            <circle cx="100" cy="63" r="1.5" fill="#FFDF73" stroke="none" />
          </g>
        </svg>

        <div className="particles-container" ref={particlesRef} />
      </div>

      <div className="hero-content" ref={heroRef}>
        <h3 className="hero-eyebrow">|| Shree Ganeshay Namah ||</h3>
        <h2 className="hero-title">
          Awaken Your <br /> Inner Divinity
        </h2>
        <p className="hero-subtitle">
          Experience the purity of authentic rituals with our handcrafted premium idols, sacred yantras, and pure
          puja samagri.
        </p>
        <Link href="/products" className="hero-cta btn-gold-3d">
          Shop Sacred Collection <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
