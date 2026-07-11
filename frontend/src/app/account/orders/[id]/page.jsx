'use client';

import { use, useEffect, useState } from 'react';
import api from '../../../../api/client';

const trackSteps = [
  { key: 'pending', label: 'Order Placed', icon: 'fa-file-invoice' },
  { key: 'confirmed', label: 'Confirmed', icon: 'fa-circle-check' },
  { key: 'shipped', label: 'Shipped', icon: 'fa-truck-fast' },
  { key: 'delivered', label: 'Delivered', icon: 'fa-box-open' },
];

function OrderTracker({ status, createdAt }) {
  if (status === 'cancelled') {
    return (
      <div className="order-tracker order-tracker-cancelled">
        <i className="fa-solid fa-circle-xmark" />
        <span>This order was cancelled.</span>
      </div>
    );
  }

  const currentIndex = trackSteps.findIndex((s) => s.key === status);

  return (
    <div className="order-tracker">
      {trackSteps.map((step, i) => (
        <div key={step.key} className={`order-tracker-step ${i <= currentIndex ? 'done' : ''} ${i === currentIndex ? 'current' : ''}`}>
          <div className="order-tracker-icon">
            <i className={`fa-solid ${step.icon}`} />
          </div>
          <span className="order-tracker-label">{step.label}</span>
          {i === 0 && <span className="order-tracker-date">{new Date(createdAt).toLocaleDateString()}</span>}
          {i < trackSteps.length - 1 && <div className="order-tracker-line" />}
        </div>
      ))}
    </div>
  );
}

export default function OrderDetail({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p className="section page-loading">Loading...</p>;

  return (
    <section className="section">
      <h2>Order #{order._id.slice(-6)}</h2>
      <p className={`status status-${order.status}`}>{order.status}</p>

      <OrderTracker status={order.status} createdAt={order.createdAt} />

      <div className="order-items">
        {order.items.map((item, i) => (
          <div key={i} className="cart-item">
            <img src={item.image || 'https://loremflickr.com/500/500/puja'} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Qty: {item.quantity}</p>
              <p className="price">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <p>
        Total: <strong>₹{order.total}</strong>
      </p>
    </section>
  );
}
