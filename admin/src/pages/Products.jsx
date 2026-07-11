import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  category: '',
  price: '',
  compareAtPrice: '',
  stock: '',
  images: '',
  videos: '',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  function loadProducts() {
    api.get(`/products?limit=100&search=${encodeURIComponent(search)}`).then((res) => setProducts(res.data.products));
  }

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const imageList = form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const videoList = form.videos ? form.videos.split(',').map((s) => s.trim()).filter(Boolean) : [];

  function setImageList(list) {
    setForm((f) => ({ ...f, images: list.join(', ') }));
  }

  function setVideoList(list) {
    setForm((f) => ({ ...f, videos: list.join(', ') }));
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('image', file);
        const res = await api.post('/uploads', data);
        uploadedUrls.push(res.data.url);
      }
      setImageList([...imageList, ...uploadedUrls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleVideoUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingVideo(true);
    setError('');
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('video', file);
        const res = await api.post('/uploads/video', data);
        uploadedUrls.push(res.data.url);
      }
      setVideoList([...videoList, ...uploadedUrls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Video upload failed');
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  }

  function removeImage(url) {
    setImageList(imageList.filter((u) => u !== url));
  }

  function removeVideo(url) {
    setVideoList(videoList.filter((u) => u !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      images: imageList,
      videos: videoList,
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      category: p.category?._id || '',
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      stock: p.stock,
      images: (p.images || []).join(', '),
      videos: (p.videos || []).join(', '),
    });
  }

  async function handleDelete(id) {
    if (!confirm('Deactivate this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  return (
    <div>
      <h1>Products</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <div className="form-grid">
          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input
            type="number"
            placeholder="MRP / Compare-at price (optional)"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
          />
          <input type="number" placeholder="Stock" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        {form.compareAtPrice && form.price && Number(form.compareAtPrice) > Number(form.price) && (
          <p className="discount-hint">
            {Math.round(((Number(form.compareAtPrice) - Number(form.price)) / Number(form.compareAtPrice)) * 100)}% discount will be shown to customers
          </p>
        )}

        <div className="image-upload-section">
          <label className="image-upload-btn">
            {uploading ? 'Uploading...' : '+ Upload Images'}
            <input type="file" accept="image/*" multiple hidden onChange={handleFileUpload} disabled={uploading} />
          </label>
          <input
            placeholder="Or paste image URLs (comma separated)"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
          />
        </div>

        {imageList.length > 0 && (
          <div className="image-preview-row">
            {imageList.map((url) => (
              <div key={url} className="image-preview-item">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeImage(url)} aria-label="Remove image">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="image-upload-section">
          <label className="image-upload-btn">
            {uploadingVideo ? 'Uploading...' : '+ Upload Videos'}
            <input type="file" accept="video/mp4,video/webm,video/quicktime" multiple hidden onChange={handleVideoUpload} disabled={uploadingVideo} />
          </label>
          <input
            placeholder="Or paste video URLs (comma separated)"
            value={form.videos}
            onChange={(e) => setForm({ ...form, videos: e.target.value })}
          />
        </div>

        {videoList.length > 0 && (
          <div className="image-preview-row">
            {videoList.map((url) => (
              <div key={url} className="image-preview-item video-preview-item">
                <video src={url} muted />
                <button type="button" onClick={() => removeVideo(url)} aria-label="Remove video">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="cta-btn">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-search-wrap">
        <input className="table-search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category?.name}</td>
              <td>
                ₹{p.price}
                {p.compareAtPrice > p.price && <span className="mrp-strike"> ₹{p.compareAtPrice}</span>}
              </td>
              <td>
                {p.compareAtPrice > p.price
                  ? `${Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% off`
                  : '—'}
              </td>
              <td>{p.stock}</td>
              <td>
                <button className="link-btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="link-btn danger" onClick={() => handleDelete(p._id)}>
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
