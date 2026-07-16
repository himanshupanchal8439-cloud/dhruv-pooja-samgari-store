'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionAura from './SectionAura';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

export default function HomeSections({ categories, products }) {
  const { t, lang } = useLanguage();
  useEffect(() => {
    if (!products.length) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('#product-grid .product-card', {
        scrollTrigger: { trigger: '#product-grid', start: 'top 80%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
      });
    });
    return () => ctx.revert();
  }, [products]);

  return (
    <>
      <section className="category-section">
        <SectionAura />
        <div className="section">
          <div className="sacred-heading">
            <h2>{t('shopByCategory')}</h2>
            <div className="sacred-divider" />
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <Link key={c._id} href={`/products?category=${c._id}`} className="category-item">
                <i className="fa-solid fa-fire" /> {lang === 'hi' && c.nameHi ? c.nameHi : c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="category-section hero-bg">
        <SectionAura dark />
        <div className="section">
          <div className="sacred-heading">
            <h2>{t('sacredCollections')}</h2>
            <div className="sacred-divider" />
          </div>
          <div className="product-grid" id="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
