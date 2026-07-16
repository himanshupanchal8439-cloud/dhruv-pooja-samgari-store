'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

export default function ContactForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <div className="sacred-heading">
        <h2>{t('contactHeading')}</h2>
        <div className="sacred-divider" />
      </div>

      <div className="contact-page-content">
        <p className="policy-intro">{t('contactIntro')}</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            {t('contactNameLabel')}
            <input
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            {t('contactEmailLabel')}
            <input
              type="email"
              required
              maxLength={200}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            {t('contactMessageLabel')}
            <textarea
              required
              maxLength={2000}
              rows={6}
              placeholder={t('contactMessagePlaceholder')}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>

          <button className="btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? t('contactSending') : t('contactSend')}
          </button>

          {status === 'success' && <p className="contact-form-msg contact-form-success">{t('contactSuccess')}</p>}
          {status === 'error' && <p className="contact-form-msg contact-form-error">{t('contactError')}</p>}
        </form>

        <p className="contact-email-line">
          {t('contactEmailUs')} <a href="mailto:sharmadhruv8392@gmail.com">sharmadhruv8392@gmail.com</a>
        </p>
      </div>
    </>
  );
}
