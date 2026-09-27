'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

const STEPS = [1, 2, 3, 4, 5];

export default function Services() {
  const { t } = useLang();

  return (
    <section id="services" style={{ background: SURFACE.base, padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 32px;
          }
          @media (min-width: 1100px) {
            .process-steps { grid-template-columns: repeat(5, 1fr); gap: 24px; }
          }
        `}</style>

        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: '#1a1a1a',
                lineHeight: 1.1,
                margin: '0 0 16px',
                maxWidth: '900px',
              }}
            >
              {t('process.title')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body)', color: 'rgba(26,26,26,1)', lineHeight: 1.8, maxWidth: '480px', margin: 0 }}>
              {t('process.subtitle2')}
            </p>
          </div>
        </FadeIn>

        <div className="process-steps">
          {STEPS.map((n, i) => (
            <FadeIn key={n} delay={0.1 + i * 0.05} style={{ height: '100%' }}>
              <div className="process-step">
                <span
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--color-primary-text)',
                    letterSpacing: '0.06em',
                    marginBottom: '10px',
                  }}
                >
                  {String(n).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px' }}>
                  {t(`process.step${n}.title`)}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,1)', lineHeight: 1.65, margin: 0 }}>
                  {t(`process.step${n}.desc`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
