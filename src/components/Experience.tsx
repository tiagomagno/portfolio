'use client';

import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';
import { ArrowUpRight } from 'lucide-react';

const MILESTONES = [1, 2, 3, 4, 5, 6];

export default function Experience() {
  const { t } = useLang();
  const { linkedinUrl } = useSiteSettings();

  return (
    <section id="experience" style={{ background: SURFACE.raised, padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .experience-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .experience-item {
            border-top: 1px solid var(--color-border);
            padding-top: 24px;
          }
          @media (min-width: 640px) {
            .experience-grid { grid-template-columns: repeat(2, 1fr); gap: 48px; }
          }
          @media (min-width: 1000px) {
            .experience-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 767px) {
            .experience-linkedin-cta {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}</style>

        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.15, margin: 0, maxWidth: '760px' }}>
              {t('experience.title')}
            </h2>
          </div>
        </FadeIn>

        <div className="experience-grid">
          {MILESTONES.map((n, i) => (
            <FadeIn key={n} delay={0.05 * i}>
              <div className="experience-item">
                <div
                  style={{
                    fontSize: 'clamp(28px, 3vw, 36px)',
                    fontWeight: 800,
                    color: 'var(--color-primary-text)',
                    lineHeight: 1,
                    marginBottom: '14px',
                  }}
                >
                  {t(`experience.item${n}.period`)}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>
                  {t(`experience.item${n}.title`)}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.65, margin: 0 }}>
                  {t(`experience.item${n}.desc`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="experience-linkedin-cta cta-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '48px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-primary-text)',
              padding: '13px 24px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)',
              textDecoration: 'none',
            }}
          >
            {t('experience.linkedinCta')}
            <ArrowUpRight size={16} />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
