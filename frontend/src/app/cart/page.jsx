'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <section className="section">
        <h2>{t('emptyCart')}</h2>
        <Link href="/products" className="btn-primary">
          {t('continueShopping')}
        </Link>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <h2>{t('yourCart')}</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.key} className="cart-item">
            <img src={item.image || 'https://loremflickr.com/500/500/puja'} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              {item.variant && (
                <p>
                  {item.variant.size} {item.variant.color}
                </p>
              )}
              <p className="price">₹{item.price}</p>
            </div>
            <div className="qty-select">
              <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
            </div>
            <button className="link-btn" onClick={() => removeItem(item.key)}>
              {t('remove')}
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>
          {t('subtotal')}: <strong>₹{subtotal}</strong>
        </p>
        <Link href="/checkout" className="btn-primary">
          {t('proceedCheckout')}
        </Link>
      </div>
    </section>
  );
}
