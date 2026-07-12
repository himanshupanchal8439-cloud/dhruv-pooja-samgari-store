'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const { login, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendOtp(email);
      setOtpStep('code');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send code');
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    try {
      await verifyOtp(email, code);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    }
  }

  function switchMode(next) {
    setMode(next);
    setOtpStep('email');
    setCode('');
    setError('');
  }

  return (
    <section className="section auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <i className="fa-solid fa-om" />
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to continue your spiritual journey with us.</p>

        <div className="auth-mode-tabs">
          <button type="button" className={mode === 'password' ? 'active' : ''} onClick={() => switchMode('password')}>
            Password
          </button>
          <button type="button" className={mode === 'otp' ? 'active' : ''} onClick={() => switchMode('otp')}>
            Email OTP
          </button>
        </div>

        {mode === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="auth-form">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button className="btn-primary auth-submit" type="submit">
              Login
            </button>
          </form>
        ) : otpStep === 'email' ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button className="btn-primary auth-submit" type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send Login Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <p className="otp-sent-hint">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
            <input
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && <p className="error">{error}</p>}
            <button className="btn-primary auth-submit" type="submit">
              Verify &amp; Login
            </button>
            <button type="button" className="link-btn otp-resend" onClick={() => setOtpStep('email')}>
              Change email / resend code
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
