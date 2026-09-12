'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';

export default function PortfolioHero() {
  const { t } = useLang();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '72px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '25%',
          width: '800px',
          height: '400px',
          background: 'var(--color-primary)',
          opacity: 0.06,
          filter: 'blur(150px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div
        className="section-container"
        style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '68px 24px 60px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <Link href="/" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(26,26,26,0.65)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t('breadcrumb.home')}
          </Link>
          <span style={{ fontSize: '10px', color: 'rgba(244,108,28,0.4)' }}>›</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary-text)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t('breadcrumb.portfolio')}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '620px' }}>
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: 'var(--color-primary-text)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '14px',
              }}
            >
              {t('portfolioPage.eyebrow')}
            </span>
            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 900,
                color: '#1a1a1a',
                lineHeight: 1.05,
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {t('portfolioPage.heading')}
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: 'rgba(26,26,26,1)', lineHeight: 1.8, maxWidth: '380px', margin: 0 }}>
            {t('portfolioPage.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
