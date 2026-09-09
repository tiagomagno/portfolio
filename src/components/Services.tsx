'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function Services() {
  const { t } = useLang();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false, 3: false });

  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

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
              {t('process.title.p1')} <span>{t('process.title.highlight')}</span>
            </h2>
            <p style={{ fontSize: 'var(--fs-body)', color: 'rgba(26,26,26,0.62)', lineHeight: 1.8, maxWidth: '480px', margin: 0 }}>
              {t('process.subtitle2')}
            </p>
          </div>
        </FadeIn>

        <style>{`
          .process-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
          }
          @media (max-width: 900px) {
            .process-grid { grid-template-columns: 1fr 1fr; }
          }
          @media (max-width: 600px) {
            .process-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="process-grid">
          {CARDS.map((card, i) => (
            <FadeIn key={card.phase} delay={0.15 + i * 0.05} style={{ height: '100%' }}>
              <div style={{ background: SURFACE.processCard, border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>0{i + 1}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{card.title}</h3>
                    <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.62)' }}>{card.subtitle}</span>
                  </div>
                  <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'rgba(26,26,26,0.62)', lineHeight: 1.65, margin: 0 }}>
                    {card.tagline}
                  </p>
                  <button
                    onClick={() => toggle(i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      alignSelf: 'flex-start',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                    }}
                  >
                    {expanded[i] ? `— ${t('process.close')}` : `+ ${t('process.open')}`}
                  </button>
                </div>

                {expanded[i] && (
                  <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        style={{
                          background: 'rgba(244,108,28,0.06)',
                          borderLeft: '2px solid var(--color-primary)',
                          borderRadius: '0 10px 10px 0',
                          padding: '12px 14px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            letterSpacing: '0.08em',
                            display: 'block',
                            marginBottom: '3px',
                          }}
                        >
                          {t(`process.${card.phase}.item${n}.tag`)}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'block' }}>
                          {t(`process.${card.phase}.item${n}.title`)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.62)', lineHeight: 1.5, display: 'block', marginTop: '2px' }}>
                          {t(`process.${card.phase}.item${n}.desc`)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
