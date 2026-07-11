import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/activity-logs').then((res) => setLogs(res.data.logs));
  }, []);

  return (
    <div>
      <h1>Activity Logs</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Admin</th>
            <th>Action</th>
            <th>Path</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id}>
              <td>{l.admin?.name}</td>
              <td>{l.action}</td>
              <td>{l.details?.path}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
