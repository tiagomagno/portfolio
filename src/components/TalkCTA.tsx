'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function TalkCTA() {
  const { t } = useLang();

  return (
    <section style={{ background: SURFACE.raised, padding: '48px 0 96px' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1} direction="up">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: 'var(--color-primary-text)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              {t('work.cta.eyebrow')}
            </span>
            <h3 style={{ fontSize: 'clamp(26px, 4.5vw, 48px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, margin: '0 0 12px', whiteSpace: 'nowrap' }}>
              {t('work.cta.title')}
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(26,26,26,1)', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: '440px' }}>
              {t('work.cta.text')}
            </p>
            <a
              href="/briefing"
              style={{
                display: 'inline-block',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '15px 32px',
                borderRadius: '10px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('work.cta.button')}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
