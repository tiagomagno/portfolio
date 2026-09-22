'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';
import { Check, Send } from 'lucide-react';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const SUCCESS_AUTO_RETURN_SECONDS = 5;

// Seção de fundo escuro (contraste proposital com o resto do site, que é claro) —
// tons de texto próprios em vez das variáveis pensadas pra fundo claro.
const TEXT_ON_DARK = '#ffffff';
const TEXT_ON_DARK_DIM = 'rgba(255,255,255,0.75)';
const TEXT_ON_DARK_MUTED = 'rgba(255,255,255,0.55)';
const BORDER_ON_DARK = 'rgba(255,255,255,0.15)';

/** Formata "5592981168163" como "+55 92 98116-8163" — best-effort, só pra exibição. */
function formatWhatsapp(digits: string): string {
  const m = digits.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
  if (!m) return digits;
  return `+${m[1]} ${m[2]} ${m[3]}-${m[4]}`;
}

export default function Contact({ recipientEmail }: { recipientEmail: string }) {
  const { t } = useLang();
  const { contactEmail, whatsappNumber, linkedinUrl } = useSiteSettings();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [secondsLeft, setSecondsLeft] = useState(SUCCESS_AUTO_RETURN_SECONDS);

  // Depois de enviar, volta sozinho pro formulário em alguns segundos — o botão
  // "Enviar outra mensagem" continua disponível pra quem não quiser esperar.
  useEffect(() => {
    if (status !== 'success') return;
    setSecondsLeft(SUCCESS_AUTO_RETURN_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setStatus('idle');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');

    const formData = new FormData(form);
    // Persiste no admin pra alimentar o pipeline de leads — não bloqueia o envio se falhar.
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }),
    }).catch(() => {});

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      style={{
        background: SURFACE.footer,
        paddingTop: 'calc(var(--section-pad-y) + 32px)',
        paddingBottom: 'var(--section-pad-y)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '32px 32px 0 0',
      }}
    >

      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <FadeIn delay={0.1} direction="right">
          <div className="contact-left-col">
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              {t('contact.eyebrow')}
            </span>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: TEXT_ON_DARK,
                lineHeight: 1.05,
                margin: '0 0 24px',
                whiteSpace: 'pre-line',
              }}
            >
              {t('contact.heading')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: TEXT_ON_DARK_DIM, lineHeight: 1.7, maxWidth: '400px', margin: '0 0 40px' }}>
              {t('contact.subtitle')}
            </p>
            <div className="contact-info-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  E-MAIL
                </span>
                <span style={{ color: TEXT_ON_DARK_DIM, fontSize: 'var(--fs-body-lg)' }}>{contactEmail}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  WHATSAPP
                </span>
                <span style={{ color: TEXT_ON_DARK_DIM, fontSize: 'var(--fs-body-lg)' }}>{formatWhatsapp(whatsappNumber)}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  LINKEDIN
                </span>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_ON_DARK_DIM, fontSize: 'var(--fs-body-lg)', textDecoration: 'none' }}>
                  {linkedinUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
            </div>
          </div>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn delay={0.3} direction="left" style={{ height: '100%' }}>
          <div className="contact-form-card">
            <style>{`
              .contact-form-card {
                background: rgba(255,255,255,0.04);
                border: 1px solid ${BORDER_ON_DARK};
                border-radius: 20px;
                padding: 40px;
              }
              .contact-form-card input,
              .contact-form-card textarea {
                width: 100%;
                box-sizing: border-box;
                background: #ffffff;
                border: 1px solid var(--color-border);
                border-radius: 10px;
                padding: 12px 16px;
                color: #1a1a1a;
                font-size: var(--fs-body);
                font-family: inherit;
                outline: none;
              }
              .contact-form-card textarea {
                resize: none;
              }
              .contact-form-card input::placeholder,
              .contact-form-card textarea::placeholder {
                color: var(--color-text-muted);
              }
              @media (max-width: 767px) {
                .contact-form-card {
                  padding: 20px;
                }
                .contact-fields-grid {
                  grid-template-columns: 1fr !important;
                }
                .contact-left-col {
                  text-align: center !important;
                }
                .contact-left-col p {
                  margin-left: auto !important;
                  margin-right: auto !important;
                }
                .contact-info-list {
                  align-items: center !important;
                }
              }
            `}</style>
            {status === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '24px 0' }} role="status">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(34,197,94,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <Check size={22} color="#4ade80" />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: TEXT_ON_DARK, margin: 0 }}>
                  {t('contact.form.success')}
                </h3>
                <p style={{ fontSize: '13px', color: TEXT_ON_DARK_DIM, margin: 0 }}>
                  {t('contact.form.successDetail')}
                </p>

                <div style={{ width: '100%', marginTop: '16px' }}>
                  <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(secondsLeft / SUCCESS_AUTO_RETURN_SECONDS) * 100}%`,
                        background: 'var(--color-primary)',
                        borderRadius: '100px',
                        transition: 'width 1s linear',
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '11px', color: TEXT_ON_DARK_MUTED, margin: '8px 0 0' }}>
                    {t('contact.form.successCountdown').replace('{n}', String(secondsLeft))}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  style={{
                    marginTop: '4px',
                    background: 'transparent',
                    color: TEXT_ON_DARK,
                    fontWeight: 600,
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: `1px solid ${BORDER_ON_DARK}`,
                    cursor: 'pointer',
                  }}
                >
                  {t('contact.form.newMessage')}
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: TEXT_ON_DARK, margin: '0 0 4px' }}>
                  {t('contact.form.title')}
                </h3>
                <p style={{ fontSize: '13px', color: TEXT_ON_DARK_MUTED, margin: '0 0 24px' }}>
                  {t('contact.form.desc')}
                </p>
                <form
                  action={`https://formsubmit.co/${recipientEmail}`}
                  method="POST"
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_subject" value="Novo Lead via Portfólio!" />
                  <input type="hidden" name="_template" value="box" />

                  {/* Name + Email */}
                  <div className="contact-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { label: t('contact.form.name'), id: 'contact-name', name: 'name', type: 'text', placeholder: t('contact.form.namePlaceholder') },
                      { label: t('contact.form.email'), id: 'contact-email', name: 'email', type: 'email', placeholder: t('contact.form.emailPlaceholder') },
                    ].map(({ label, id, name, type, placeholder }) => (
                      <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor={id} style={{ fontSize: '10px', fontWeight: 700, color: TEXT_ON_DARK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {label}
                        </label>
                        <input id={id} type={type} name={name} autoComplete={name === 'name' ? 'name' : 'email'} placeholder={placeholder} required disabled={status === 'sending'} />
                      </div>
                    ))}
                  </div>

                  {/* Message */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="contact-message" style={{ fontSize: '10px', fontWeight: 700, color: TEXT_ON_DARK_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {t('contact.form.message')}
                    </label>
                    <textarea id="contact-message" name="message" rows={4} required placeholder={t('contact.form.messagePlaceholder')} disabled={status === 'sending'} />
                  </div>

                  {status === 'error' && (
                    <p role="alert" style={{ fontSize: '13px', color: '#ff8a8a', margin: 0 }}>
                      {t('contact.form.error')}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      background: 'var(--color-primary-text)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: status === 'sending' ? 'default' : 'pointer',
                      opacity: status === 'sending' ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
                    {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
                    {status !== 'sending' && <Send size={20} />}
                  </button>
                </form>
              </>
            )}
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
