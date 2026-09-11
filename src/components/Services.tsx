'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function Services() {
  const { t } = useLang();

  const CARDS = [
    { phase: 'discover', title: t('process.phases.discover.label'), subtitle: t('process.phases.discover.subtitle'), tagline: t('process.phases.discover.tagline') },
    { phase: 'design', title: t('process.phases.design.label'), subtitle: t('process.phases.design.subtitle'), tagline: t('process.phases.design.tagline') },
    { phase: 'develop', title: t('process.phases.develop.label'), subtitle: t('process.phases.develop.subtitle'), tagline: t('process.phases.develop.tagline') },
    { phase: 'deploy', title: t('process.phases.deploy.label'), subtitle: t('process.phases.deploy.subtitle'), tagline: t('process.phases.deploy.tagline') },
  ] as const;

  return (
    <section id="services" style={{ background: SURFACE.base, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '48px' }}>
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '14px',
              }}
            >
              {t('process.eyebrow')}
            </span>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: '#1a1a1a',
                lineHeight: 1.1,
                margin: '0 0 16px',
              }}
            >
              {t('process.title')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body)', color: 'rgba(26,26,26,1)', lineHeight: 1.8, maxWidth: '480px', margin: 0 }}>
              {t('process.subtitle2')}
            </p>
          </div>
        </FadeIn>

        <style>{`
          .process-timeline-row {
            display: flex;
            gap: 24px;
          }
          .process-node-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
          }
          .process-node-circle {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #ffffff;
            border: 1px solid var(--color-border);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .process-node-line {
            width: 2px;
            flex: 1;
            min-height: 24px;
            background: var(--color-border);
            margin: 8px 0;
          }
          .process-content {
            flex: 1;
            min-width: 0;
          }
          .process-items-list {
            border-top: 1px solid var(--color-border);
            padding: 4px 0;
          }
          .process-item-row {
            padding: 14px 0;
            border-bottom: 1px solid var(--color-border);
          }
          .process-item-row:last-child {
            border-bottom: none;
          }
          @media (min-width: 901px) {
            .process-items-list {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 28px;
              border-top: none;
              padding: 8px 0 0;
            }
            .process-item-row {
              padding: 16px 0 0;
              border-bottom: none;
              border-top: 2px solid var(--color-border);
            }
          }
          @media (max-width: 600px) {
            .process-timeline-row { gap: 16px; }
            .process-node-circle { width: 44px; height: 44px; }
          }
        `}</style>

        <div>
          {CARDS.map((card, i) => {
            const isLast = i === CARDS.length - 1;
            return (
              <FadeIn key={card.phase} delay={0.1 + i * 0.05}>
                <div className="process-timeline-row">
                  <div className="process-node-col">
                    <div className="process-node-circle">
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>0{i + 1}</span>
                    </div>
                    {!isLast && <div className="process-node-line" />}
                  </div>

                  <div className="process-content" style={{ paddingBottom: isLast ? 0 : '32px' }}>
                    <div>
                      <div style={{ padding: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{card.title}</h3>
                          <span style={{ fontSize: '12px', color: 'rgba(26,26,26,1)' }}>{card.subtitle}</span>
                        </div>
                        <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'rgba(26,26,26,1)', lineHeight: 1.65, margin: 0 }}>
                          {card.tagline}
                        </p>
                      </div>

                      <div className="process-items-list">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="process-item-row">
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  color: 'var(--color-primary)',
                                  letterSpacing: '0.06em',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {t(`process.${card.phase}.item${n}.tag`)}
                              </span>
                              <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.3)' }}>•</span>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
                                {t(`process.${card.phase}.item${n}.title`)}
                              </span>
                            </div>
                            <p style={{ fontSize: '14px', color: 'rgba(26,26,26,1)', lineHeight: 1.5, margin: 0 }}>
                              {t(`process.${card.phase}.item${n}.desc`)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
