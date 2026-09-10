'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="hero">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            height: '600px',
            background: 'var(--color-primary)',
            opacity: 0.06,
            filter: 'blur(150px)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <style>{`
          @media (max-width: 767px) {
            .hero-content {
              padding: 90px 20px 48px !important;
              min-height: 80vh !important;
            }
            .hero-cta-group {
              width: 100%;
              justify-content: center !important;
            }
            .hero-cta-group a {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>

        {/* Main content */}
        <div
          className="section-container hero-content"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            padding: '140px 24px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '80vh',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <FadeIn delay={0.1}>
              <h1
                style={{
                  fontSize: 'var(--fs-h1)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  color: '#1a1a1a',
                  margin: '0 0 16px',
                }}
              >
                {t('hero.title.1')}
                <br />
                <span>{t('hero.title.2')}.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  lineHeight: 1.4,
                  maxWidth: '480px',
                  margin: '0 0 16px',
                }}
              >
                {t('hero.tagline')}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p
                style={{
                  fontSize: 'var(--fs-body-lg)',
                  lineHeight: 1.7,
                  color: 'rgba(26,26,26,0.6)',
                  maxWidth: '480px',
                  margin: '0 0 40px',
                }}
              >
                {t('hero.subtitle')}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="hero-cta-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <a
                  href="/briefing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '15px 32px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  {t('hero.cta.primary')}
                </a>
                <a
                  href="#cases"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    color: '#1a1a1a',
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '15px 32px',
                    borderRadius: '10px',
                    border: '1px solid rgba(26,26,26,0.15)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {t('hero.cta.secondary')}
                </a>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Mouse Scroll Icon */}
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} className="hidden-mobile">
          <FadeIn delay={0.8}>
            <style>{`
              @keyframes scroll-bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(6px); }
                60% { transform: translateY(3px); }
              }
            `}</style>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
              <div style={{
                width: '24px',
                height: '36px',
                border: '2px solid #1a1a1a',
                borderRadius: '16px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px'
              }}>
                <div style={{
                  width: '4px',
                  height: '6px',
                  background: '#1a1a1a',
                  borderRadius: '2px',
                  animation: 'scroll-bounce 2s infinite'
                }} />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
