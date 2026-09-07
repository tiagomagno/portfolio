'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

export default function Manifesto() {
  const { t } = useLang();

  return (
    <section style={{ background: '#0e0e0e', padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'min(85vw, 1320px)', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <FadeIn delay={0.1}>
        <p
          style={{
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 300,
            color: '#a8a29e',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {t('belief.p1')}{' '}
          <strong style={{ color: '#fff', fontWeight: 700 }}>{t('belief.highlight1')}</strong> {t('belief.p2')}{' '}
          <strong style={{ color: '#fff', fontWeight: 700 }}>{t('belief.highlight2')}</strong> {t('belief.p3')}
        </p>
        </FadeIn>

        <FadeIn delay={0.2}>
        <div style={{ marginTop: '40px' }}>
          <a
            href="#services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#ff5625',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {t('manifesto.link')}
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>south</span>
          </a>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

