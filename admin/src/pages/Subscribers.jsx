import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    api.get('/subscribers').then((res) => setSubscribers(res.data));
  }, []);

  return (
    <div>
      <h1>Subscribers ({subscribers.length})</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed On</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {subscribers.length === 0 && <p>No subscribers yet.</p>}
    </div>
  );
}
