'use client';

import { ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import WhatsappIcon from './ui/WhatsappIcon';

// Mesmo formato do CTA da home: botão principal (briefing) + botão verde do WhatsApp, mesma altura.
export default function PortfolioCTA() {
  const { t } = useLang();
  const { whatsappNumber } = useSiteSettings();

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '52px',
    boxSizing: 'border-box' as const,
    padding: '0 32px',
    border: '1px solid transparent',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <section style={{ background: 'transparent', padding: 'var(--section-pad-y) 24px' }}>
      <style>{`
        @media (max-width: 640px) { .pcta-btns { flex-direction: column; } .pcta-btns a { width: 100%; } }
      `}</style>
      <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <span
          style={{
            fontSize: 'var(--fs-eyebrow)',
            fontWeight: 700,
            color: 'var(--color-primary-text)',
            letterSpacing: 'var(--ls-eyebrow)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '20px',
          }}
        >
          {t('portfolioPage.cta.eyebrow')}
        </span>
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.15, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
          {t('portfolioPage.cta.heading')}
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 auto 32px', maxWidth: '560px' }}>
          {t('portfolioPage.cta.text')}
        </p>
        <div className="pcta-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/briefing" className="cta-primary" style={{ ...base, background: 'var(--color-primary-text-hover)', color: '#fff' }}>
            {t('portfolioPage.cta.button')}
            <ArrowRight size={16} />
          </a>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ ...base, background: '#25D366', color: '#062b14' }}>
            <WhatsappIcon size={18} />
            {t('work.cta.button')}
          </a>
        </div>
      </div>
    </section>
  );
}
