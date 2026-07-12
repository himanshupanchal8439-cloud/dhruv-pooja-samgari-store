'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Login() {
  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const { login, sendOtp, verifyOtp } = useAuth();
  const { t } = useLanguage();
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
        <h2>{t('welcomeBack')}</h2>
        <p className="auth-subtitle">{t('loginSubtitle')}</p>

        <div className="auth-mode-tabs">
          <button type="button" className={mode === 'password' ? 'active' : ''} onClick={() => switchMode('password')}>
            {t('password')}
          </button>
          <button type="button" className={mode === 'otp' ? 'active' : ''} onClick={() => switchMode('otp')}>
            {t('otpTab')}
          </button>
        </div>

        {mode === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="auth-form">
            <input type="email" placeholder={t('email')} required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder={t('password')} required value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button className="btn-primary auth-submit" type="submit">
              {t('loginBtn')}
            </button>
          </form>
        ) : otpStep === 'email' ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <input type="email" placeholder={t('email')} required value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button className="btn-primary auth-submit" type="submit" disabled={sending}>
              {sending ? t('sending') : t('sendCode')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <p className="otp-sent-hint">
              {t('codeSentTo')} <strong>{email}</strong>
            </p>
            <input
              placeholder={t('enterCode')}
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && <p className="error">{error}</p>}
            <button className="btn-primary auth-submit" type="submit">
              {t('verifyLogin')}
            </button>
            <button type="button" className="link-btn otp-resend" onClick={() => setOtpStep('email')}>
              {t('changeEmail')}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          {t('newHere')} <Link href="/register">{t('createAccount')}</Link>
        </p>
      </div>
    </section>
  );
}
