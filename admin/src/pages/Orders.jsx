import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    api.get(`/orders?status=${statusFilter}`).then((res) => setOrders(res.data.orders));
  }

  useEffect(load, [statusFilter]);

  async function updateStatus(id, status) {
    await api.put(`/orders/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <h1>Orders</h1>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>
                <Link to={`/orders/${o._id}`}>#{o._id.slice(-6)}</Link>
              </td>
              <td>{o.user?.name}</td>
              <td>{o.items.length}</td>
              <td>₹{o.total}</td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
