'use client';

import { useLang } from '@/context/LangContext';
import Image from 'next/image';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function About() {
  const { t } = useLang();

  const tags = [t('about.tag1'), t('about.tag2'), t('about.tag3'), t('about.tag4')];

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
        `}</style>

        <div className="about-grid">
          {/* Photo */}
          <FadeIn delay={0.1}>
            <div style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: '20px', overflow: 'hidden' }}>
              <Image
                src="/about-photo.png"
                alt={t('about.newPhoto.alt')}
                fill
                sizes="(max-width: 900px) 100vw, 640px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
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
                  whiteSpace: 'pre-line',
                }}
              >
                {t('about.heading')}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'rgba(26,26,26,1)', lineHeight: 1.7, marginBottom: '20px' }}>
                {t('about.p1')}
              </p>
              <p style={{ fontSize: 'var(--fs-body-lg)', color: 'rgba(26,26,26,1)', lineHeight: 1.7, marginBottom: '32px' }}>
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
