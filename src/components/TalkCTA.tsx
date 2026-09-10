'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function TalkCTA() {
  const { t } = useLang();

  return (
    <section style={{ background: SURFACE.raised, padding: '48px 0 96px' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .work-cta-grid {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            align-items: center;
            gap: 32px;
          }
          .work-cta-bleed {
            margin: -48px -56px -48px 0;
          }
          @media (max-width: 700px) {
            .work-cta-grid { grid-template-columns: 1fr; }
            .work-cta-visual { justify-content: center !important; }
            .work-cta-bleed { margin: 0 !important; }
          }
        `}</style>

        <FadeIn delay={0.1} direction="up">
          <div
            className="work-cta-grid"
            style={{
              background: SURFACE.card,
              borderRadius: '28px',
              padding: '48px 56px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 'var(--fs-eyebrow)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: 'var(--ls-eyebrow)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                {t('work.cta.eyebrow')}
              </span>
              <h3 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, margin: '0 0 12px' }}>
                {t('work.cta.title')}
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.7)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '440px' }}>
                {t('work.cta.text')}
              </p>
              <a
                href="/briefing"
                style={{
                  display: 'inline-block',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '15px 32px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('work.cta.button')}
              </a>
            </div>

            <div className="work-cta-visual" style={{ display: 'flex' }}>
              <div className="work-cta-bleed" style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3' }}>
                {/* Camada de vazamento: quando uma foto real entrar aqui (Image fill, object-fit
                    cover), ela aparece deslocada atrás da moldura, criando profundidade. Vazia,
                    fica só como uma sombra sutil por trás do mockup. */}
                <div
                  className="work-cta-leak"
                  style={{
                    position: 'absolute',
                    inset: '18px -22px -22px 22px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                    zIndex: 0,
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    borderRadius: '16px',
                    border: '1.5px dashed rgba(26,26,26,0.2)',
                    background: SURFACE.raised,
                    boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      height: '26px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '0 12px',
                      borderBottom: '1px solid rgba(26,26,26,0.1)',
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(26,26,26,0.15)' }} />
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(26,26,26,0.15)' }} />
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(26,26,26,0.15)' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'rgba(26,26,26,0.18)' }}>
                      image
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
