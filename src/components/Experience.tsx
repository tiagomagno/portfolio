'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

// Agrupamento por período pra visão em colunas no desktop. Os índices referem-se
// a `items` (item1..item7 = mais recente -> mais antigo).
const COLUMNS = [
  { range: '2003 ~ 2010', indices: [6, 5] },
  { range: '2011 ~ 2016', indices: [4, 3] },
  { range: '2016 ~ 2025', indices: [2, 1, 0] },
];

export default function Experience() {
  const { t } = useLang();

  const items = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    period: t(`experience.item${n}.period`),
    location: t(`experience.item${n}.location`),
    role: t(`experience.item${n}.role`),
    company: t(`experience.item${n}.company`),
    desc: t(`experience.item${n}.desc`),
  }));

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const renderRow = (i: number, isLast: boolean) => {
    const item = items[i];
    const isOpen = !!expanded[i];
    return (
      <div
        className="experience-row"
        onClick={() => toggle(i)}
        style={{
          cursor: 'pointer',
          padding: '26px 0',
          borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
            {item.role} <span style={{ color: 'rgba(26,26,26,1)', fontWeight: 500 }}>— {item.company}</span>
          </h3>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '18px',
              color: 'rgba(26,26,26,0.4)',
              flexShrink: 0,
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >
            expand_more
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>{item.period}</span>
          <span style={{ fontSize: '11px', color: 'rgba(26,26,26,0.5)' }}>{item.location}</span>
        </div>
        {isOpen && (
          <p style={{ fontSize: '13px', color: 'rgba(26,26,26,1)', lineHeight: 1.65, margin: '10px 0 0' }}>
            {item.desc}
          </p>
        )}
      </div>
    );
  };

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
          .experience-columns { display: none; }
          .experience-flat { display: block; }
          @media (min-width: 701px) {
            .experience-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
            .experience-flat { display: none; }
          }
        `}</style>

        <div className="experience-header">
          <div>
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

        {/* Desktop: 3 colunas agrupadas por período */}
        <div className="experience-columns">
          {COLUMNS.map((col) => (
            <div key={col.range}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(26,26,26,0.5)', marginBottom: '4px' }}>
                {col.range}
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)' }}>
                {col.indices.map((idx, j) => (
                  <FadeIn key={idx} delay={0.03 * j}>
                    {renderRow(idx, j === col.indices.length - 1)}
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: lista única, igual ao formato atual */}
        <div className="experience-flat">
          {items.map((_, i) => (
            <FadeIn key={i} delay={0.03 * i}>
              {renderRow(i, i === items.length - 1)}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
