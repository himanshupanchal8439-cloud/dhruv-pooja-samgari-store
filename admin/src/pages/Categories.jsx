import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyForm = { name: '', slug: '', description: '', image: '' };

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/categories').then((res) => setCategories(res.data));
  }

  useEffect(load, []);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/uploads', data);
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  }

  function startEdit(c) {
    setEditingId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image: c.image || '' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function remove(id) {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    load();
  }

  return (
    <div>
      <h1>Categories</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
        <div className="form-grid">
          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }));
            }}
          />
          <input placeholder="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>

        <div className="image-upload-section">
          <label className="image-upload-btn">
            {uploading ? 'Uploading...' : '+ Upload Image'}
            <input type="file" accept="image/*" hidden onChange={handleFileUpload} disabled={uploading} />
          </label>
          <input placeholder="Or paste image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>

        {form.image && (
          <div className="image-preview-row">
            <div className="image-preview-item">
              <img src={form.image} alt="" />
              <button type="button" onClick={() => setForm({ ...form, image: '' })} aria-label="Remove image">
                ✕
              </button>
            </div>
          </div>
        )}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="cta-btn">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" className="link-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>
                {c.image && <img className="admin-table-thumb" src={c.image} alt="" />}
              </td>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c.productCount ?? 0}</td>
              <td>
                <button className="link-btn" onClick={() => startEdit(c)}>
                  Edit
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
