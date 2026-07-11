import { useEffect, useState } from 'react';
import Editor, { EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList, BtnLink, BtnClearFormatting, Separator, HtmlButton } from 'react-simple-wysiwyg';
import api from '../api/client';

const emptyForm = {
  title: '',
  slug: '',
  language: 'en',
  translationSlug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  isPublished: true,
  metaTitle: '',
  metaDescription: '',
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/blog/admin/all').then((res) => setPosts(res.data));
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
      setForm((f) => ({ ...f, coverImage: res.data.url }));
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
        await api.put(`/blog/${editingId}`, form);
      } else {
        await api.post('/blog', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  }

  async function startEdit(p) {
    const res = await api.get(`/blog/admin/${p._id}`);
    const post = res.data;
    setEditingId(post._id);
    setForm({
      title: post.title,
      slug: post.slug,
      language: post.language,
      translationSlug: post.translationSlug || '',
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
      isPublished: post.isPublished,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function remove(id) {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/blog/${id}`);
    load();
  }

  return (
    <div>
      <h1>Blog</h1>

      {!showForm && (
        <button className="cta-btn" onClick={startNew}>
          + New Post
        </button>
      )}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Post' : 'New Post'}</h3>
          <div className="form-grid">
            <input
              placeholder="Title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: editingId ? f.slug : slugify(title) }));
              }}
            />
            <input placeholder="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            <input
              placeholder="Translation slug (optional, link to Hindi/English version)"
              value={form.translationSlug}
              onChange={(e) => setForm({ ...form, translationSlug: e.target.value })}
            />
          </div>

          <div className="image-upload-section">
            <label className="image-upload-btn">
              {uploading ? 'Uploading...' : '+ Upload Cover Image'}
              <input type="file" accept="image/*" hidden onChange={handleFileUpload} disabled={uploading} />
            </label>
            <input
              placeholder="Or paste image URL"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            />
          </div>

          {form.coverImage && (
            <div className="image-preview-row">
              <div className="image-preview-item">
                <img src={form.coverImage} alt="" />
                <button type="button" onClick={() => setForm({ ...form, coverImage: '' })} aria-label="Remove image">
                  ✕
                </button>
              </div>
            </div>
          )}

          <textarea
            placeholder="Excerpt (short summary shown on blog listing)"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />

          <EditorProvider>
            <Editor
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              containerProps={{ style: { minHeight: '260px' } }}
            >
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <Separator />
                <BtnBulletList />
                <BtnNumberedList />
                <Separator />
                <BtnLink />
                <BtnClearFormatting />
                <HtmlButton />
              </Toolbar>
            </Editor>
          </EditorProvider>

          <div className="form-grid">
            <input
              placeholder="Meta Title (SEO, optional)"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />
            <input
              placeholder="Meta Description (SEO, optional)"
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            Published
          </label>

          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="cta-btn">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" className="link-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Language</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p._id}>
              <td>{p.coverImage && <img className="admin-table-thumb" src={p.coverImage} alt="" />}</td>
              <td>{p.title}</td>
              <td>{p.language === 'hi' ? 'Hindi' : 'English'}</td>
              <td>{p.isPublished ? 'Published' : 'Draft'}</td>
              <td>
                <button className="link-btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="link-btn danger" onClick={() => remove(p._id)}>
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
