'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../api/client';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
  }, []);

  return (
    <section className="section">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <Link key={o._id} href={`/account/orders/${o._id}`} className="order-row">
              <span>#{o._id.slice(-6)}</span>
              <span>{o.items.length} items</span>
              <span>₹{o.total}</span>
              <span className={`status status-${o.status}`}>{o.status}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
