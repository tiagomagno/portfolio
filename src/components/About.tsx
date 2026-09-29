'use client';

import Image from 'next/image';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function About() {
  const { t } = useLang();

  const paragraphs = [1, 2, 3, 4, 5].map((n) => t(`about.p${n}`));

  return (
    <section id="about" style={{ background: SURFACE.raised, padding: 'var(--section-pad-y) 0' }}>
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
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 3.8',
                borderRadius: '20px',
                overflow: 'hidden',
                background: SURFACE.card,
              }}
            >
              <Image
                src="/about-photo.webp"
                alt={t('about.newPhoto.alt')}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
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
                  color: 'var(--color-primary-text)',
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
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                  margin: '0 0 24px',
                  whiteSpace: 'pre-line',
                }}
              >
                {t('about.heading')}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              {paragraphs.map((text, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: i === 0 ? 'clamp(1.125rem, 1.6vw, 1.25rem)' : 'var(--fs-body-lg)',
                    fontWeight: i === 0 ? 500 : 400,
                    color: 'var(--color-text)',
                    lineHeight: i === 0 ? 1.6 : 1.7,
                    margin: i === paragraphs.length - 1 ? 0 : i === 0 ? '0 0 24px' : '0 0 18px',
                  }}
                >
                  {text}
                </p>
              ))}
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
