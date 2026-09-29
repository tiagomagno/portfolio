'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { Check } from 'lucide-react';

const PILLARS = ['diagnostico', 'execucao', 'escala'] as const;
// Cada pilar cobre uma fase do processo: Problema (Descobrir + Definir), Solução (Desenvolver + Entregar) e Evolução.
const PHASE_KEY = { diagnostico: 'case.phase.problem', execucao: 'case.phase.solution', escala: 'case.phase.evolution' } as const;

export default function Consulting() {
  const { t } = useLang();

  const CARDS = PILLARS.map((id) => ({
    id,
    label: t(`consulting.pillars.${id}.label`),
    phase: t(PHASE_KEY[id]),
    title: t(`consulting.pillars.${id}.title`),
    desc: t(`consulting.pillars.${id}.desc`),
    items: [1, 2, 3].map((n) => t(`consulting.pillars.${id}.item${n}`)),
  }));

  return (
    <section id="consulting" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div style={{ maxWidth: '680px', marginBottom: '56px' }}>
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
              {t('consulting.eyebrow')}
            </span>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: 0, whiteSpace: 'pre-line' }}>
              {t('consulting.title')}
            </h2>
          </div>
        </FadeIn>

        <style>{`
          .pillar-timeline-row {
            display: flex;
            gap: 24px;
          }
          .pillar-node-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
          }
          .pillar-node-circle {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #1a1a1a;
            border: 1px solid var(--color-border);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .pillar-node-line {
            width: 2px;
            flex: 1;
            min-height: 24px;
            background: var(--color-border);
            margin: 8px 0;
          }
          @media (max-width: 600px) {
            .pillar-timeline-row { gap: 16px; }
            .pillar-node-circle { width: 44px; height: 44px; }
          }
        `}</style>

        <div>
          {CARDS.map((card, i) => {
            const isLast = i === CARDS.length - 1;
            return (
              <FadeIn key={card.id} delay={0.1 + i * 0.05}>
                <div className="pillar-timeline-row">
                  <div className="pillar-node-col">
                    <div className="pillar-node-circle">
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary-text)' }}>0{i + 1}</span>
                    </div>
                    {!isLast && <div className="pillar-node-line" />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : '32px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: 'var(--color-primary-text)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {card.label}
                      <span style={{ marginLeft: '10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', padding: '2px 9px' }}>
                        {card.phase}
                      </span>
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: '560px' }}>
                      {card.desc}
                    </p>

                    <div style={{ borderTop: '1px solid var(--color-border)' }}>
                      {card.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '14px 0',
                            borderBottom: idx < card.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                          }}
                        >
                          <Check size={16} color="var(--color-primary-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
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
