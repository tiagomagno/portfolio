'use client';

import { useLang } from '@/context/LangContext';

export default function BriefingIntro() {
  const { t } = useLang();

  return (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <span
        style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--color-primary-text)',
        }}
      >
        {t('briefing.intro.eyebrow')}
      </span>
      <h1
        style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 900,
          color: 'var(--color-text)',
          lineHeight: 1.1,
          marginBottom: '16px',
        }}
      >
        {t('briefing.intro.title')}
      </h1>
      <p
        style={{
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: 'var(--color-text-dim)',
          lineHeight: 1.7,
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        {t('briefing.intro.text')}
      </p>
    </div>
  );
}
