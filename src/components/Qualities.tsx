'use client';

import { useLang } from '@/context/LangContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import FadeIn from './ui/FadeIn';
import { SURFACE } from '@/lib/surfaces';
import { ArrowUpRight, PenTool, Component, Monitor, Wrench, Palette, type LucideIcon } from 'lucide-react';

const MILESTONES = [1, 2, 3, 4, 5, 6];
const SKILL_GROUPS = [1, 2, 3, 4, 5];
const SKILL_ICONS: Record<number, LucideIcon> = { 1: PenTool, 2: Component, 3: Monitor, 4: Wrench, 5: Palette };

const eyebrowStyle = {
  fontSize: 'var(--fs-eyebrow)',
  fontWeight: 700,
  color: 'var(--color-primary-text)',
  letterSpacing: 'var(--ls-eyebrow)',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '20px',
};

// Mix de Números + Trajetória + Habilidades: as qualidades do Tiago numa seção só,
// logo abaixo do Sobre. Reaproveita as chaves de tradução das seções originais.
export default function Qualities() {
  const { t } = useLang();
  const { linkedinUrl } = useSiteSettings();

  const stats = [
    { value: t('hero.stat2.value'), label: t('hero.stat2.label') },
    { value: t('about.badge.number'), label: t('about.badge.label') },
    { value: t('stats.stat4.value'), label: t('stats.stat4.label') },
  ];

  return (
    <section id="qualities" style={{ background: SURFACE.raised, padding: '0 0 var(--section-pad-y)' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .qual-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 40px 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }
          .qual-stats > div + div { border-left: 1px solid var(--color-border); }
          .qual-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; margin-top: 64px; }
          .qual-timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 24px; }
          .qual-timeline li { display: grid; grid-template-columns: 96px 1fr; gap: 20px; border-top: 1px solid var(--color-border); padding-top: 20px; }
          .qual-skills { display: grid; gap: 28px; }
          @media (max-width: 900px) {
            .qual-cols { grid-template-columns: 1fr; gap: 56px; margin-top: 48px; }
          }
          @media (max-width: 600px) {
            .qual-stats { gap: 12px; padding: 32px 0; }
            .qual-stats > div + div { padding-left: 12px; }
            .qual-timeline li { grid-template-columns: 1fr; gap: 6px; }
          }
        `}</style>

        <div className="qual-stats">
          {stats.map((s) => (
            <FadeIn key={s.label}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: 'var(--color-primary-text)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '8px' }}>
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="qual-cols">
          <div>
            <FadeIn>
              <span style={eyebrowStyle}>{t('experience.title')}</span>
            </FadeIn>
            <ol className="qual-timeline">
              {MILESTONES.map((n, i) => (
                <FadeIn key={n} delay={0.04 * i}>
                  <li>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-text)', lineHeight: 1.2 }}>
                      {t(`experience.item${n}.period`)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>
                        {t(`experience.item${n}.title`)}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.65, margin: 0 }}>
                        {t(`experience.item${n}.desc`)}
                      </p>
                    </div>
                  </li>
                </FadeIn>
              ))}
            </ol>
            <FadeIn delay={0.15}>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-ghost"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '32px',
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

          <div>
            <FadeIn>
              <span style={eyebrowStyle}>{t('skills.title')}</span>
            </FadeIn>
            <div className="qual-skills">
              {SKILL_GROUPS.map((n, i) => {
                const Icon = SKILL_ICONS[n];
                return (
                  <FadeIn key={n} delay={0.05 * i}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '14px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={24} color="var(--color-primary-text)" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>
                          {t(`skills.group${n}.label`)}
                        </h3>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                          {t(`skills.group${n}.items`)}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
