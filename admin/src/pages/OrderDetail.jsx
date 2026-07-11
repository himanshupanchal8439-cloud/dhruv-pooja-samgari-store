import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  function load() {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }

  useEffect(load, [id]);

  async function updateStatus(status) {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } finally {
      setUpdating(false);
    }
  }

  if (!order) return <p>Loading...</p>;

  const address = order.shippingAddress || {};
  const addressLines = [address.line1, address.line2, address.city, address.state].filter(Boolean).join(', ');

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <h1>Order #{order._id.slice(-6)}</h1>
          <span className={`status status-${order.status}`}>{order.status}</span>
        </div>
        <label className="order-status-control">
          Update Status
          <select value={order.status} disabled={updating} onChange={(e) => updateStatus(e.target.value)}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="order-detail-grid">
        <div className="admin-card">
          <h3>Items</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h3>Order Summary</h3>
          <div className="order-summary-lines">
            <div>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div>
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div>
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="order-summary-total">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          <h3>Shipping Address</h3>
          <p className="order-address">
            {addressLines}
            {address.pincode ? ` - ${address.pincode}` : ''}
            <br />
            Phone: {address.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
