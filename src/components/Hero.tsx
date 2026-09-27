'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import HeroBackground from './HeroBackground';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="hero">
      <div style={{ position: 'relative', overflow: 'hidden' }}>

        <style>{`
          @media (max-width: 767px) {
            .hero-content {
              padding: 24px 20px 64px !important;
              min-height: 100vh !important;
              min-height: 100dvh !important;
              justify-content: flex-end !important;
            }
            .hero-inner {
              text-align: center !important;
            }
            .hero-cta-group {
              width: 100%;
            }
            .hero-cta-primary,
            .hero-cta-secondary {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>

        <HeroBackground />

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
            minHeight: '100vh',
          }}
        >
          <div className="hero-inner" style={{ maxWidth: '960px' }}>
            <FadeIn delay={0.05} duration={0.4} direction="none">
              <h1
                style={{
                  fontSize: 'var(--fs-h1)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  color: '#1a1a1a',
                  margin: '0 0 24px',
                  whiteSpace: 'pre-line',
                }}
              >
                {t('hero.title')}
              </h1>
            </FadeIn>

            <FadeIn delay={0.1} duration={0.4} direction="none">
              <p
                style={{
                  fontSize: 'var(--fs-body-lg)',
                  lineHeight: 1.7,
                  color: 'rgba(26,26,26,1)',
                  maxWidth: '560px',
                  margin: '0 0 40px',
                }}
              >
                {t('hero.subtitle')}
              </p>
            </FadeIn>

            <FadeIn delay={0.15} duration={0.4} direction="none">
              <div className="hero-cta-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <a
                  href="#cases"
                  className="hero-cta-primary cta-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--color-primary-text)',
                    color: '#fff',
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '15px 32px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                  }}
                >
                  {t('hero.cta.primary')}
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#about"
                  className="hero-cta-secondary cta-ghost"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    color: '#1a1a1a',
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '15px 32px',
                    borderRadius: '10px',
                    border: '1px solid rgba(26,26,26,0.2)',
                    textDecoration: 'none',
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
