'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

// Só os 3 marcos mais alinhados ao posicionamento atual (Product Design para
// empresas e times de produto) ficam na home — item1/2/3 = mais recentes.
// A trajetória completa (FUCAPI, Luna, ITJC, ICON) fica só no LinkedIn.
const HIGHLIGHT_ITEMS = [1, 2, 3];

export default function Experience() {
  const { t } = useLang();

  const items = HIGHLIGHT_ITEMS.map((n) => ({
    period: t(`experience.item${n}.period`),
    location: t(`experience.item${n}.location`),
    role: t(`experience.item${n}.role`),
    company: t(`experience.item${n}.company`),
    desc: t(`experience.item${n}.desc`),
  }));

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <section id="experience" style={{ background: SURFACE.raised, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 24px;
            flex-wrap: wrap;
            margin-bottom: 72px;
          }
          .experience-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
          }
          .experience-row { border-bottom: 1px solid var(--color-border); }
          .experience-row[data-last="true"] { border-bottom: none; }
          @media (min-width: 701px) {
            .experience-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 48px;
              border-top: 1px solid var(--color-border);
            }
            .experience-row { border-bottom: none; padding-top: 24px !important; }
          }
        `}</style>

        <div className="experience-header">
          <div>
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
              {t('experience.eyebrow')}
            </span>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, margin: 0, maxWidth: '480px' }}>
              {t('experience.title')}
            </h2>
          </div>
          <p style={{ fontSize: 'var(--fs-body)', color: 'rgba(26,26,26,1)', lineHeight: 1.7, maxWidth: '320px', margin: 0 }}>
            {t('experience.subtitle')}
          </p>
        </div>

        <div className="experience-grid">
          {items.map((item, i) => {
            const isOpen = !!expanded[i];
            return (
              <FadeIn key={i} delay={0.05 * i}>
                <div
                  className="experience-row"
                  data-last={i === items.length - 1}
                  onClick={() => toggle(i)}
                  style={{ cursor: 'pointer', padding: '26px 0' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                      {item.role} <span style={{ color: 'rgba(26,26,26,1)', fontWeight: 500 }}>— {item.company}</span>
                    </h3>
                    <ChevronDown
                      size={18}
                      color="rgba(26,26,26,0.4)"
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.65)' }}>{item.period}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.65)' }}>{item.location}</span>
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '13px', color: 'rgba(26,26,26,1)', lineHeight: 1.65, margin: '10px 0 0' }}>
                      {item.desc}
                    </p>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2}>
          <a
            href="https://www.linkedin.com/in/tiagosmagno/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '40px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-primary-text)',
              padding: '13px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(26,26,26,0.15)',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            {t('experience.linkedinCta')}
            <ArrowUpRight size={16} />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
