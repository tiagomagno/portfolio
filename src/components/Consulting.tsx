'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

const PILLARS = ['diagnostico', 'execucao', 'escala'] as const;

export default function Consulting() {
  const { t } = useLang();

  const CARDS = PILLARS.map((id) => ({
    id,
    label: t(`consulting.pillars.${id}.label`),
    title: t(`consulting.pillars.${id}.title`),
    desc: t(`consulting.pillars.${id}.desc`),
    items: [1, 2, 3].map((n) => t(`consulting.pillars.${id}.item${n}`)),
  }));

  return (
    <section id="consulting" style={{ background: SURFACE.raised, padding: '140px 0 96px' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <Link href="/" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(26,26,26,0.4)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t('breadcrumb.home')}
          </Link>
          <span style={{ fontSize: '10px', color: 'rgba(244,108,28,0.4)' }}>›</span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(26,26,26,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t('consulting.eyebrow')}
          </span>
        </div>

        <FadeIn delay={0.1}>
          <div style={{ maxWidth: '640px', marginBottom: '64px' }}>
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
              {t('consulting.eyebrow')}
            </span>
            <h1
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: '#1a1a1a',
                lineHeight: 1.1,
                margin: '0 0 20px',
                whiteSpace: 'pre-line',
              }}
            >
              {t('consulting.title')}
            </h1>
            <p
              style={{
                fontSize: 'var(--fs-body-lg)',
                lineHeight: 1.7,
                color: 'rgba(26,26,26,1)',
                margin: '0 0 32px',
              }}
            >
              {t('consulting.subtitle')}
            </p>
            <a
              href="/briefing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '15px 32px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              {t('consulting.cta')}
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </a>
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
            background: #ffffff;
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
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>0{i + 1}</span>
                    </div>
                    {!isLast && <div className="pillar-node-line" />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : '32px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: 'var(--color-primary)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      {card.label}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(26,26,26,1)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: '560px' }}>
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
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>
                            check
                          </span>
                          <span style={{ fontSize: '14px', color: 'rgba(26,26,26,1)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '80px', paddingTop: '64px' }}>
          <FadeIn delay={0.1}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(26px, 4.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, margin: '0 0 12px' }}>
                {t('consulting.closing.title')}
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(26,26,26,1)', lineHeight: 1.6, margin: '0 auto 28px', maxWidth: '440px' }}>
                {t('consulting.closing.text')}
              </p>
              <a
                href="/briefing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '18px 40px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                }}
              >
                {t('consulting.cta')}
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
