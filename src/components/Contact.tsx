'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';

export default function Contact() {
    const { t } = useLang();
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus('success');
                setForm({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const getButtonText = () => {
        if (status === 'sending') return t('contact.form.sending');
        if (status === 'success') return t('contact.form.success');
        if (status === 'error') return t('contact.form.error');
        return t('contact.form.submit');
    };

    const getButtonClass = () => {
        if (status === 'success') return 'btn btn-primary btn-full btn-success';
        if (status === 'error') return 'btn btn-primary btn-full btn-error';
        return 'btn btn-primary btn-full';
    };

    return (
        <section className="section contact-section" id="contact">
            <div className="container">
                <h2 className="section-title contact-title">{t('contact.title')}</h2>
                <p className="section-subtitle contact-subtitle">{t('contact.subtitle')}</p>

                <div className="contact-grid">
                    <div className="contact-info">
                        <h3 className="contact-heading">{t('contact.heading')}</h3>
                        <p className="contact-text">{t('contact.text')}</p>

                        <div className="social-links">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Behance">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                                </svg>
                            </a>
                            <a href="mailto:tiago@example.com" className="social-link" aria-label="Email">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <form id="contactForm" onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">{t('contact.form.name')}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                disabled={status === 'sending'}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">{t('contact.form.email')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={status === 'sending'}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">{t('contact.form.message')}</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                value={form.message}
                                onChange={handleChange}
                                required
                                disabled={status === 'sending'}
                            ></textarea>
                        </div>

                        <button type="submit" className={getButtonClass()} disabled={status === 'sending'}>
                            {getButtonText()}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
