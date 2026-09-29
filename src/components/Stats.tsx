'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function Stats() {
  const { t } = useLang();

  const stats = [
    { value: t('hero.stat2.value'), label: t('hero.stat2.label') },
    { value: t('about.badge.number'), label: t('about.badge.label') },
    { value: t('stats.stat4.value'), label: t('stats.stat4.label') },
  ];

  return (
    <section id="stats" style={{ background: SURFACE.raised, padding: '64px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .stats-grid > div {
            border-left: 1px solid var(--color-border);
            padding-left: 24px;
          }
          .stats-grid > div:first-child {
            border-left: none;
            padding-left: 0;
          }
          @media (max-width: 700px) {
            .stats-grid { gap: 12px; }
            .stats-grid > div { padding-left: 12px; }
            .stats-grid > div:first-child { padding-left: 0; }
          }
        `}</style>

        <div className="stats-grid">
          {stats.map((s) => (
            <FadeIn key={s.label}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: 'var(--color-primary-text)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '8px',
                  }}
                >
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
