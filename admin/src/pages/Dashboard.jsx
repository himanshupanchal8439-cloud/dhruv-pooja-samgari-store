import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>
        <div className="stat-card">
          <span>Revenue</span>
          <strong>₹{stats.totalRevenue}</strong>
        </div>
        <div className="stat-card">
          <span>Customers</span>
          <strong>{stats.totalCustomers}</strong>
        </div>
        <div className="stat-card">
          <span>Low Stock Items</span>
          <strong>{stats.lowStockProducts.length}</strong>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <section>
          <h2>Low Stock Alerts</h2>
          <ul className="alert-list">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id}>
                {p.name} — {p.stock} left
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>Recent Orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((o) => (
              <tr key={o._id}>
                <td>
                  <Link to={`/orders/${o._id}`}>#{o._id.slice(-6)}</Link>
                </td>
                <td>{o.user?.name}</td>
                <td>₹{o.total}</td>
                <td className={`status status-${o.status}`}>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
