'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

function IntersectionDiagram() {
  const { t } = useLang();
  const label = { fontSize: 17, fontWeight: 700, fill: 'var(--color-text)', textAnchor: 'middle' as const };

  return (
    <svg viewBox="0 0 480 456" width="100%" height="100%" style={{ display: 'block' }}>
      <circle cx={240} cy={160} r={108} fill="var(--color-primary-text)" fillOpacity={0.16} stroke="var(--color-primary-text)" strokeOpacity={0.6} strokeWidth={2} />
      <circle cx={168} cy={284} r={108} fill="var(--color-text)" fillOpacity={0.07} stroke="var(--color-text)" strokeOpacity={0.35} strokeWidth={2} />
      <circle cx={312} cy={284} r={108} fill="var(--color-text)" fillOpacity={0.07} stroke="var(--color-text)" strokeOpacity={0.35} strokeWidth={2} />
      <text x={240} y={98} {...label}>{t('positioning.diagram.people')}</text>
      <text x={120} y={326} {...label}>{t('positioning.diagram.business')}</text>
      <text x={360} y={326} {...label}>{t('positioning.diagram.tech')}</text>
      <text x={240} y={247} {...label} fill="var(--color-primary-text)" style={{ fill: 'var(--color-primary-text)', fontWeight: 800 }}>
        {t('positioning.diagram.center')}
      </text>
    </svg>
  );
}

export default function Positioning() {
  const { t } = useLang();

  return (
    <section id="positioning" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .positioning-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 72px;
            align-items: center;
          }
          @media (max-width: 900px) {
            .positioning-grid { grid-template-columns: 1fr; gap: 40px; }
          }
        `}</style>

        <div className="positioning-grid">
          <div>
            <FadeIn delay={0.1}>
              <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 24px' }}>
                {t('positioning.title')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text)', lineHeight: 1.7, margin: '0 0 20px' }}>
                {t('positioning.p1')}
              </p>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text)', lineHeight: 1.7, margin: '0 0 24px' }}>
                {t('positioning.p2')}
              </p>
              <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--color-primary-text)', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>
                {t('positioning.p3')}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div style={{ aspectRatio: '4 / 3.8', borderRadius: '20px', overflow: 'hidden', background: SURFACE.card }}>
              <IntersectionDiagram />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
