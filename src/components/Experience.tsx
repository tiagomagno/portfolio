'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function Experience() {
  const { t } = useLang();

  const items = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    period: t(`experience.item${n}.period`),
    location: t(`experience.item${n}.location`),
    role: t(`experience.item${n}.role`),
    company: t(`experience.item${n}.company`),
    desc: t(`experience.item${n}.desc`),
  }));

  return (
    <section id="experience" style={{ background: SURFACE.raised, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'min(85vw, 1320px)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 24px;
            flex-wrap: wrap;
            margin-bottom: 48px;
          }
          .experience-row { transition: background 0.15s; }
          .experience-row:hover { background: rgba(26,26,26,0.04); }
          @media (max-width: 700px) {
            .experience-row { grid-template-columns: 1fr !important; }
            .experience-row > div:last-child { text-align: left !important; margin-top: 12px; }
          }
        `}</style>

        <div className="experience-header">
          <div>
            <div
              style={{
                display: 'inline-block',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(26,26,26,0.7)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {t('experience.eyebrow')}
            </div>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, margin: 0, maxWidth: '480px' }}>
              {t('experience.title')}
            </h2>
          </div>
          <p style={{ fontSize: 'var(--fs-body)', color: 'rgba(26,26,26,0.64)', lineHeight: 1.7, maxWidth: '320px', margin: 0 }}>
            {t('experience.subtitle')}
          </p>
        </div>

        <div>
          {items.map((item, i) => (
            <FadeIn key={i} delay={0.03 * i}>
              <div
                className="experience-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '24px',
                  alignItems: 'center',
                  padding: '24px 20px',
                  borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>
                    {item.role} <span style={{ color: 'rgba(26,26,26,0.62)', fontWeight: 500 }}>— {item.company}</span>
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.64)', lineHeight: 1.65, margin: 0, maxWidth: '720px' }}>
                    {item.desc}
                  </p>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)' }}>{item.period}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.45)' }}>{item.location}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
