import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  function load() {
    api.get(`/customers?search=${encodeURIComponent(search)}`).then((res) => setCustomers(res.data.customers));
  }

  useEffect(load, [search]);

  async function toggleBlock(customer) {
    await api.put(`/customers/${customer._id}/block`, { isBlocked: !customer.isBlocked });
    load();
  }

  return (
    <div>
      <h1>Customers</h1>
      <div className="table-search-wrap">
        <input className="table-search" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            {user.role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.isBlocked ? 'Blocked' : 'Active'}</td>
              {user.role === 'admin' && (
                <td>
                  <button className="link-btn" onClick={() => toggleBlock(c)}>
                    {c.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
