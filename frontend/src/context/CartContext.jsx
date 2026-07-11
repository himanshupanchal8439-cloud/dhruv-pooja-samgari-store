'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('cart', JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(product, quantity = 1, variant = null) {
    setItems((prev) => {
      const key = `${product._id}-${variant?.size || ''}-${variant?.color || ''}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          product: product._id,
          name: product.name,
          image: product.images?.[0],
          price: product.price,
          quantity,
          variant,
        },
      ];
    });
  }

  function updateQuantity(key, quantity) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)).filter((i) => i.quantity > 0));
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
