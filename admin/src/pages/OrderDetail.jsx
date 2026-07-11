import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order #{order._id.slice(-6)}</h1>
      <p className={`status status-${order.status}`}>{order.status}</p>
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
      <p>Subtotal: ₹{order.subtotal}</p>
      <p>Discount: ₹{order.discount}</p>
      <p>Shipping: ₹{order.shippingFee}</p>
      <p>
        <strong>Total: ₹{order.total}</strong>
      </p>
      <h3>Shipping Address</h3>
      <p>
        {order.shippingAddress?.line1}, {order.shippingAddress?.line2}, {order.shippingAddress?.city},{' '}
        {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
        <br />
        Phone: {order.shippingAddress?.phone}
      </p>
    </div>
  );
}
