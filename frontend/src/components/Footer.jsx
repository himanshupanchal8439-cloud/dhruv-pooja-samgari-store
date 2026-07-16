'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLanguage();

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="footer-brand">Vasishtha Pooja Samagri</h2>
            <p>{t('footerDesc')}</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-twitter" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('sacredCollections')}</h4>
            <ul>
              <li>
                <Link href="/products">{t('templeIdols')}</Link>
              </li>
              <li>
                <Link href="/products">{t('rudrakshaMalas')}</Link>
              </li>
              <li>
                <Link href="/products">{t('divineSamagri')}</Link>
              </li>
              <li>
                <Link href="/products">{t('astrologyServices')}</Link>
              </li>
              <li>
                <Link href="/blog">{t('pujaGuides')}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('support')}</h4>
            <ul>
              <li>
                <Link href="/account/orders">{t('trackOrder')}</Link>
              </li>
              <li>
                <a href="#">{t('shippingPolicy')}</a>
              </li>
              <li>
                <Link href="/faq">{t('faq')}</Link>
              </li>
              <li>
                <a href="#">{t('contactUs')}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('spiritualInsights')}</h4>
            <p>{t('insightsDesc')}</p>
            <form className="footer-newsletter" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">{subscribed ? t('subscribed') : t('subscribe')}</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {t('storeName')}. {t('rights')}
          </p>
          <div className="footer-legal">
            <a href="#">{t('privacy')}</a>
            <a href="#">{t('terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
