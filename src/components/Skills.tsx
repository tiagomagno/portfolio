'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';

export default function Skills() {
  const { t } = useLang();

  const groups = [1, 2, 3, 4, 5].map((n) => ({
    label: t(`skills.group${n}.label`),
    items: t(`skills.group${n}.items`),
  }));

  return (
    <section id="skills" style={{ background: SURFACE.raised, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '48px' }}>
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
              {t('skills.eyebrow')}
            </span>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, margin: 0 }}>
              {t('skills.title')}
            </h2>
          </div>
        </FadeIn>

        <style>{`
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 56px;
          }
          @media (max-width: 700px) {
            .skills-grid { grid-template-columns: 1fr; gap: 28px; }
          }
        `}</style>

        <div className="skills-grid">
          {groups.map((group, i) => (
            <FadeIn key={group.label} delay={0.1 + i * 0.05}>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
                  {group.label}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.6)', lineHeight: 1.7, margin: 0 }}>
                  {group.items}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
