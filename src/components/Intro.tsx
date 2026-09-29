'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

// Cada linha começa emaranhada à esquerda e termina reta e alinhada à direita.
const LINES = [
  'M40,300 C90,120 140,380 200,200 S270,168 310,168 L440,168',
  'M40,140 C110,320 150,90 210,260 S270,204 310,204 L440,204',
  'M40,230 C80,60 170,400 220,150 S270,240 310,240 L440,240',
  'M40,360 C120,180 160,330 205,120 S270,276 310,276 L440,276',
  'M40,90 C100,260 140,60 215,330 S270,312 310,312 L440,312',
];
const HIGHLIGHT = 2;

function ClarityIllustration() {
  return (
    <svg viewBox="0 0 480 456" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {LINES.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={i === HIGHLIGHT ? 'var(--color-primary-text)' : '#1a1a1a'}
          strokeOpacity={i === HIGHLIGHT ? 1 : 0.22}
          strokeWidth={i === HIGHLIGHT ? 4 : 3}
          strokeLinecap="round"
        />
      ))}
      {LINES.map((d, i) => (
        <circle
          key={`dot-${d}`}
          cx={440}
          cy={168 + i * 36}
          r={i === HIGHLIGHT ? 7 : 5}
          fill={i === HIGHLIGHT ? 'var(--color-primary-text)' : '#1a1a1a'}
          fillOpacity={i === HIGHLIGHT ? 1 : 0.35}
        />
      ))}
    </svg>
  );
}

export default function Intro() {
  const { t } = useLang();

  return (
    <section id="intro" style={{ background: SURFACE.base, padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .intro-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 72px;
            align-items: center;
          }
          .intro-visual { order: -1; }
          @media (max-width: 900px) {
            .intro-grid { grid-template-columns: 1fr; gap: 40px; }
            .intro-visual { order: 0; }
          }
        `}</style>

        <div className="intro-grid">
          <FadeIn delay={0.1} className="intro-visual">
            <div style={{ aspectRatio: '4 / 3.8', borderRadius: '20px', overflow: 'hidden', background: SURFACE.card }}>
              <ClarityIllustration />
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={0.15}>
              <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 24px' }}>
                {t('intro.title')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text)', lineHeight: 1.7, margin: '0 0 20px' }}>
                {t('intro.p1')}
              </p>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text)', lineHeight: 1.7, margin: '0 0 20px' }}>
                {t('intro.p2')}
              </p>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text)', fontWeight: 700, lineHeight: 1.7, margin: 0 }}>
                {t('intro.p3')}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
