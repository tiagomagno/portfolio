'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function TalkCTA() {
  const { t } = useLang();

  return (
    <section style={{ background: SURFACE.raised, padding: '64px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1} direction="up">
          <div
            style={{
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
              margin: '0 auto',
              background: SURFACE.subtle,
              borderRadius: '24px',
              padding: '48px 32px',
            }}
          >
            <h3 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.15, margin: '0 0 12px' }}>
              {t('work.cta.title')}
            </h3>
            <p style={{ fontSize: '16px', color: 'var(--color-text)', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: '560px' }}>
              {t('work.cta.text')}
            </p>
            <a
              href="#contact"
              className="cta-primary"
              style={{
                display: 'inline-block',
                background: 'var(--color-primary-text)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                padding: '15px 32px',
                borderRadius: '999px',
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
