'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.phone);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <section className="section auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <i className="fa-solid fa-om" />
        </div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us to shop authentic puja essentials with ease.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" placeholder="Password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary auth-submit" type="submit">
            Register
          </button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
