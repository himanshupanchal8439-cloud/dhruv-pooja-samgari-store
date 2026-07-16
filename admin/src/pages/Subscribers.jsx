import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);

  function load() {
    api.get('/subscribers').then((res) => setSubscribers(res.data));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm('Delete this subscriber?')) return;
    await api.delete(`/subscribers/${id}`);
    load();
  }

  return (
    <div>
      <h1>Subscribers ({subscribers.length})</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="link-btn" onClick={() => handleDelete(s._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subscribers.length === 0 && <p>No subscribers yet.</p>}
    </div>
  );
}
