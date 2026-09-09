'use client';

import { useLang } from '@/context/LangContext';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

// Trajetórias de flutuação sutil e distintas por card, pra não parecerem sincronizadas.
const FLOAT_PATHS = [
  { x: [0, 10, -6, 0], y: [0, -14, 6, 0] },
  { x: [0, -12, 8, 0], y: [0, 10, -10, 0] },
  { x: [0, 8, -10, 0], y: [0, -8, 12, 0] },
];

export default function About() {
  const { t } = useLang();
  const prefersReducedMotion = useReducedMotion();

  const tags = [t('about.tag1'), t('about.tag2'), t('about.tag3'), t('about.tag4')];

  const floatingStats = [
    { value: t('hero.stat2.value'), label: t('hero.stat2.label') },
    { value: t('about.badge.number'), label: t('about.badge.label') },
    { value: t('hero.stat3.value'), label: t('hero.stat3.label') },
  ];

  return (
    <section id="about" style={{ background: SURFACE.raised, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 72px;
            align-items: center;
          }
          @media (max-width: 900px) {
            .about-grid { grid-template-columns: 1fr; gap: 40px; }
          }
          @media (max-width: 480px) {
            .about-stat-rail { right: 16px !important; gap: 12px !important; }
            .about-stat-rail > div { min-width: 130px !important; padding: 16px 20px !important; }
            .about-stat-rail > div > div:first-child { font-size: 28px !important; }
          }
        `}</style>

        <div className="about-grid">
          {/* Photo */}
          <FadeIn delay={0.1}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: '20px', overflow: 'hidden' }}>
                <Image
                  src="/about-photo.png"
                  alt={t('about.newPhoto.alt')}
                  fill
                  sizes="(max-width: 900px) 100vw, 640px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <div
                className="about-stat-rail"
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '20px',
                  padding: '28px 0',
                }}
              >
                {floatingStats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    animate={prefersReducedMotion ? undefined : FLOAT_PATHS[i % FLOAT_PATHS.length]}
                    transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      minWidth: '180px',
                      textAlign: 'center',
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: '16px',
                      padding: '24px 32px',
                      boxShadow: '0 20px 32px rgba(0,0,0,0.18)',
                    }}
                  >
                    <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'rgba(26,26,26,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginTop: '6px',
                      }}
                    >
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Text */}
          <div>
            <FadeIn delay={0.15}>
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
                {t('about.eyebrow')}
              </span>
              <h2
                style={{
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 900,
                  color: '#1a1a1a',
                  lineHeight: 1.1,
                  margin: '0 0 24px',
                }}
              >
                {t('about.heading.line1')}<br />
                <span>{t('about.heading.line2')}</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'rgba(26,26,26,0.6)', lineHeight: 1.7, marginBottom: '20px' }}>
                {t('about.p1')}
              </p>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'rgba(26,26,26,0.6)', lineHeight: 1.7, marginBottom: '32px' }}>
                {t('about.p2')}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'rgba(26,26,26,0.7)',
                      background: 'rgba(26,26,26,0.025)',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '100px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
