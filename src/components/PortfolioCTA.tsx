'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { SURFACE } from '@/lib/surfaces';

export default function PortfolioCTA() {
  const { t } = useLang();

  return (
    <section style={{ background: SURFACE.base, padding: '80px 24px' }}>
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
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, margin: '0 0 20px', whiteSpace: 'pre-line' }}>
          {t('portfolioPage.cta.heading')}
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(26,26,26,1)', lineHeight: 1.7, margin: '0 0 36px' }}>
          {t('portfolioPage.cta.text')}
        </p>
        <Link
          href="/briefing"
          style={{
            display: 'inline-block',
            background: '#1a1a1a',
            color: '#fff',
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '16px 40px',
            borderRadius: '10px',
            textDecoration: 'none',
          }}
        >
          {t('portfolioPage.cta.button')}
        </Link>
      </div>
    </section>
  );
}
