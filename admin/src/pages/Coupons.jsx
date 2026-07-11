import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyForm = { code: '', discountType: 'percent', discountValue: '', minOrderValue: '', maxUses: '', expiresAt: '' };

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  function load() {
    api.get('/coupons').then((res) => setCoupons(res.data));
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/coupons', {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  }

  async function toggleActive(coupon) {
    await api.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this coupon?')) return;
    await api.delete(`/coupons/${id}`);
    load();
  }

  return (
    <div>
      <h1>Coupons</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input placeholder="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>
          <input type="number" placeholder="Discount value" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          <input type="number" placeholder="Min order value" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
          <input type="number" placeholder="Max uses" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="cta-btn">
          Create Coupon
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Used</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td>{c.code}</td>
              <td>{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
              <td>
                {c.usedCount}
                {c.maxUses ? ` / ${c.maxUses}` : ''}
              </td>
              <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
              <td>{c.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button className="link-btn" onClick={() => toggleActive(c)}>
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="link-btn danger" onClick={() => remove(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
