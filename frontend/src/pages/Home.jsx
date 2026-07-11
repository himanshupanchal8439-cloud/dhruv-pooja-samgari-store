import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GaneshaHero from '../components/GaneshaHero';
import SectionAura from '../components/SectionAura';
import ProductCard from '../components/ProductCard';
import AstrologySection from '../components/AstrologySection';
import AwardsSection from '../components/AwardsSection';
import api from '../api/client';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
    api.get('/products?limit=8').then((res) => setProducts(res.data.products));
  }, []);

  useEffect(() => {
    if (!products.length) return;
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
      <GaneshaHero />

      <section className="category-section">
        <SectionAura />
        <div className="section">
          <div className="sacred-heading">
            <h2>Shop by Category</h2>
            <div className="sacred-divider" />
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <Link key={c._id} to={`/products?category=${c._id}`} className="category-item">
                <i className="fa-solid fa-fire" /> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="category-section hero-bg">
        <SectionAura dark />
        <div className="section">
          <div className="sacred-heading">
            <h2>Sacred Collections</h2>
            <div className="sacred-divider" />
          </div>
          <div className="product-grid" id="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <AstrologySection />
      <AwardsSection />
    </>
  );
}
