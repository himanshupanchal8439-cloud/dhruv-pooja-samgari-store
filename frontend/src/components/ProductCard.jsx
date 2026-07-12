'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const cardRef = useRef();
  const { t } = useLanguage();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  function handleMouseMove(e) {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    gsap.to(cardRef.current, {
      rotationY: (x - 0.5) * 20,
      rotationX: (0.5 - y) * 20,
      duration: 0.2,
    });
  }

  function handleMouseLeave() {
    gsap.to(cardRef.current, { rotationY: 0, rotationX: 0, duration: 0.5 });
  }

  return (
    <div className="product-card" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="card-inner">
        <div className="img-container">
          {hasDiscount && <span className="discount-badge">-{discountPercent}%</span>}
          <img src={product.images?.[0] || 'https://loremflickr.com/600/400/puja'} alt={product.name} loading="lazy" />
        </div>
        <div className="card-text">
          <h3>{product.name}</h3>
          <div className="card-price-row">
            <span className="price">₹{product.price}</span>
            {hasDiscount && <span className="mrp">₹{product.compareAtPrice}</span>}
          </div>
          <p>{product.description}</p>
        </div>
        <Link href={`/products/${product.slug}`} className="btn-premium">
          {t('viewDetails')}
        </Link>
      </div>
    </div>
  );
}
