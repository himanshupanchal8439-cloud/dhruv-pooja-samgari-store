import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <section className="section auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <i className="fa-solid fa-om" />
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to continue your spiritual journey with us.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary auth-submit" type="submit">
            Login
          </button>
        </form>
        <p className="auth-footer-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
