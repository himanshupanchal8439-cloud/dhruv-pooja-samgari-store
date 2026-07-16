import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get('/contact').then((res) => setMessages(res.data));
  }, []);

  return (
    <div>
      <h1>Contact Messages ({messages.length})</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td style={{ whiteSpace: 'pre-wrap' }}>{m.message}</td>
              <td>{new Date(m.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {messages.length === 0 && <p>No messages yet.</p>}
    </div>
  );
}
