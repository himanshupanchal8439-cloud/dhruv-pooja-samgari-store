'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { lang, switchLang, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="glass-nav-3d">
        <Link href="/" className="brand-3d">
          <span className="brand-title">Vasishtha Pooja</span>
          <span className="brand-sub">Samagri Store</span>
        </Link>

        <div className="nav-links-left">
          {categories.slice(0, 3).map((c) => (
            <Link key={c._id} href={`/products?category=${c._id}`} className="nav-chip">
              <i className="fa-solid fa-fire" /> {lang === 'hi' && c.nameHi ? c.nameHi : c.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="nav-item-3d nav-lang-toggle"
            onClick={() => switchLang(lang === 'en' ? 'hi' : 'en')}
            aria-label="Switch language"
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>

          <button className="nav-item-3d nav-icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Search">
            <i className="fa-solid fa-magnifying-glass" />
          </button>

          {user ? (
            <Link href="/account/profile" className="nav-item-3d nav-icon-btn nav-user-btn" aria-label="My Account">
              <i className="fa-regular fa-user" />
              <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link href="/login" className="nav-item-3d nav-icon-btn" aria-label="Login">
              <i className="fa-regular fa-user" />
            </Link>
          )}

          <Link href="/cart" className="btn-gold-3d cart-btn">
            <i className="fa-solid fa-bag-shopping" />
            <span className="cart-label">{t('cart')}</span>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {user && (
            <button className="nav-item-3d nav-icon-btn" onClick={logout} aria-label="Logout">
              <i className="fa-solid fa-arrow-right-from-bracket" />
            </button>
          )}
        </div>
      </nav>

      {menuOpen && (
        <form className="nav-search-drop" onSubmit={handleSearch}>
          <input
            type="text"
            autoFocus
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">{t('search')}</button>
        </form>
      )}
    </header>
  );
}
