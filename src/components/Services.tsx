'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

// Duas fases (problema e solução), quatro etapas. A evolução contínua fica como adendo.
const DIAMONDS = [
  { labelKey: 'process.diamond1', steps: [1, 2] },
  { labelKey: 'process.diamond2', steps: [3, 4] },
];

export default function Services() {
  const { t } = useLang();

  return (
    <section id="services" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .process-diamonds { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
          .process-diamond-head {
            display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
            font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
            color: var(--color-text-muted);
          }
          .process-diamond-head::after { content: ''; flex: 1; height: 1px; background: var(--color-border-subtle); }
          .process-diamond-steps { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .process-addendum {
            margin-top: 40px; padding: 24px 28px; border-radius: 20px; border: 1px dashed var(--color-border-subtle);
            display: grid; grid-template-columns: auto 1fr; gap: 6px 24px; align-items: baseline;
          }
          @media (max-width: 900px) {
            .process-diamonds { grid-template-columns: 1fr; gap: 40px; }
          }
          @media (max-width: 560px) {
            .process-diamond-steps { grid-template-columns: 1fr; }
            .process-addendum { grid-template-columns: 1fr; }
          }
        `}</style>

        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '48px' }}>
            <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
              {t('process.eyebrow')}
            </span>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: 'var(--color-text)',
                lineHeight: 1.1,
                margin: '0 0 16px',
                maxWidth: '900px',
              }}
            >
              {t('process.title')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-muted)', lineHeight: 1.8, maxWidth: '520px', margin: 0 }}>
              {t('process.subtitle2')}
            </p>
          </div>
        </FadeIn>

        <div className="process-diamonds">
          {DIAMONDS.map((diamond, d) => (
            <FadeIn key={diamond.labelKey} delay={0.1 + d * 0.1}>
              <div className="process-diamond-head">{t(diamond.labelKey)}</div>
              <div className="process-diamond-steps">
                {diamond.steps.map((n) => (
                  <div key={n} className="process-step">
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-text)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                      {String(n).padStart(2, '0')}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 10px' }}>
                      {t(`process.step${n}.title`)}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>
                      {t(`process.step${n}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="process-addendum">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{t('process.step5.title')}</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>{t('process.step5.desc')}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
