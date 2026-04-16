'use client';

import { useLang } from '@/context/LangContext';
import Image from 'next/image';
import FadeIn from './ui/FadeIn';

export default function Hero() {
  const { t } = useLang();

  const stats = [
    { value: t('stats.1.number'), label: t('stats.1.label') },
    { value: t('stats.2.number'), label: t('stats.2.label') },
    { value: t('stats.3.number'), label: t('stats.3.label') },
    { value: t('stats.4.number'), label: t('stats.4.label') },
    { value: t('stats.5.number'), label: t('stats.5.label') },
  ];

  const tags = ['UI e UX Designer', 'Product Design', 'Design Systems'];

  return (
    <section id="hero" style={{ background: 'var(--color-bg)' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '600px',
          height: '600px',
          background: '#ff5625',
          opacity: 0.06,
          filter: 'blur(150px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Background Photo */}
      <div
        className="hero-image-bg"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          minWidth: '300px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Image 
          src="/eu.jpg" 
          alt="Tiago Magno" 
          fill 
          style={{ objectFit: 'cover', objectPosition: 'center top' }} 
          priority 
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--color-bg) 0%, transparent 40%), linear-gradient(to top, var(--color-bg) 0%, transparent 15%)',
          }}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-image-bg {
            width: 100% !important;
            opacity: 0.2;
          }
        }
      `}</style>

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '120px 24px 60px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '48px',
          minHeight: '100vh',
          flexWrap: 'wrap',
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Badge */}
          <FadeIn delay={0.1}>
            <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1c1b1b',
              border: '1px solid #2a2a2a',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'block',
                animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#e7bdb2',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {t('hero.badge')}
            </span>
          </div>
          </FadeIn>

          {/* H1 */}
          <FadeIn delay={0.2}>
          <h1
            style={{
              fontSize: 'clamp(52px, 7vw, 96px)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px',
            }}
          >
            {t('hero.title.1')}
            <br />
            <span style={{ color: '#ff5625' }}>{t('hero.title.2')}</span>
          </h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.3}>
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: '#a8a29e',
              maxWidth: '480px',
              margin: '0 0 40px',
            }}
          >
            {t('hero.subtitle')}
          </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.4}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ff5625',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              {t('nav.startProject')}
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                arrow_forward
              </span>
            </a>
            <a
              href="#cases"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: '#fff',
                fontWeight: 500,
                fontSize: '15px',
                padding: '14px 32px',
                borderRadius: '8px',
                border: '1px solid #353534',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              {t('hero.cta.secondary')}
            </a>
          </div>
          </FadeIn>

          {/* Tags */}
          <FadeIn delay={0.5}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#a8a29e',
                  background: '#1c1b1b',
                  border: '1px solid #2a2a2a',
                  borderRadius: '999px',
                  padding: '6px 14px',
                }}
              >
                {tag}
              </span>
            ))}
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
              border: '2px solid #fff', 
              borderRadius: '16px', 
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px'
            }}>
              <div style={{
                width: '4px',
                height: '6px',
                background: '#fff',
                borderRadius: '2px',
                animation: 'scroll-bounce 2s infinite'
              }} />
            </div>
          </div>
        </FadeIn>
      </div>

      </div>
      {/* Stats bar */}
      <div style={{ borderTop: '1px solid #1c1b1b', background: 'var(--color-bg)' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px 0',
          }}
        >
          {stats.map((s, i) => (
            <FadeIn key={s.value} delay={0.5 + i * 0.1} style={{ height: '100%' }}>
              <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '4px',
                borderLeft: '1px solid #2a2a2a',
                paddingLeft: '24px',
                height: '100%',
              }}
              >
                <span style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 900, color: '#fff' }}>
                  {s.value}
                </span>
                <span style={{ fontSize: '12px', color: '#a8a29e', marginTop: '4px' }}>{s.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
