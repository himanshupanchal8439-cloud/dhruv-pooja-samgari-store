import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="section">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <h2>Your Cart</h2>
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
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>
          Subtotal: <strong>₹{subtotal}</strong>
        </p>
        <Link to="/checkout" className="btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
}
