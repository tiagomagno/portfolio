'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

const MILESTONES = [1, 2, 3, 4, 5, 6];
// `pick` escolhe quais itens de cada lista aparecem como etiqueta; `labelKey` troca o rótulo do grupo
// quando o original é longo demais pra ficar numa linha só.
// `itemsKey` usa uma lista própria (todas as etiquetas) em vez de escolher da lista do grupo original.
const SKILL_GROUPS: { n: number; pick?: number[]; labelKey?: string; itemsKey?: string }[] = [
  { n: 1, pick: [0, 1, 2] },
  { n: 2, pick: [1, 2, 3], labelKey: 'aboutBento.skill2' }, // Design Tokens, Componentes, Acessibilidade
  { n: 4, itemsKey: 'aboutBento.toolsList' }, // Figma, Pacote Adobe, Design Thinking, Scrum
  { n: 6, labelKey: 'aboutBento.skillAi', itemsKey: 'aboutBento.aiList' }, // Claude, Codex
  { n: 5, pick: [0, 1, 2], labelKey: 'aboutBento.skill5' },
];
const eyebrow = {
  fontSize: 'var(--fs-eyebrow)',
  fontWeight: 700,
  color: 'var(--color-primary-text)',
  letterSpacing: 'var(--ls-eyebrow)',
  textTransform: 'uppercase' as const,
  display: 'block',
};

// Sobre em formato bento (versão de teste, ao lado do Profile/About/Qualities):
// linha 1 = foto | nome + texto | trajetória vertical; linha 2 = habilidades | números + áreas de atuação.
export default function AboutBento() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const stats = [
    { value: t('about.badge.number'), label: t('about.badge.label') },
    { value: t('hero.stat2.value'), label: t('hero.stat2.label') },
    { value: t('stats.stat4.value'), label: t('stats.stat4.label') },
  ];
  const areas = t('aboutBento.areasList').split(' · ');
  const paragraphs = [1, 2, 3, 4, 5].map((n) => t(`about.p${n}`));

  return (
    <section id="about" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .ab-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
        .ab-col-3 { grid-column: span 3; }
        .ab-col-4 { grid-column: span 4; }
        .ab-col-5 { grid-column: span 5; }
        .ab-col-7 { grid-column: span 7; }
        .ab-card { position: relative; overflow: hidden; border-radius: 28px; padding: 36px; background: transparent; border: 1px solid rgba(255,255,255,0.06); }
        .ab-photo { padding: 0; min-height: 320px; }
        .ab-text { display: flex; flex-direction: column; justify-content: flex-start; }
        .ab-stack { display: flex; flex-direction: column; gap: 16px; height: 100%; }
        .ab-nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ab-num { padding: 24px 12px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ab-areas { flex: 1; }
        .ab-skill-row { display: grid; grid-template-columns: 150px 1fr; gap: 8px 20px; align-items: center; padding: 10px 0; }
        .ab-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .ab-chip { font-size: 11px; font-weight: 600; color: var(--color-text-muted); background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px; white-space: nowrap; }

        /* Trajetória vertical: função + texto à esquerda, período à direita */
        .ab-steps { list-style: none; margin: 0; padding: 0; position: relative; display: grid; gap: 16px; }
        .ab-line { position: absolute; left: 8px; top: 8px; bottom: 8px; width: 1px; background: var(--color-border-subtle); transform-origin: top center; margin: 0; padding: 0; }
        .ab-step { position: relative; padding-left: 36px; display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; align-items: start; }
        .ab-dot { --dot: #22c55e; position: absolute; left: 0; top: 0; width: 17px; height: 17px; border-radius: 50%; background: var(--dot); animation: ab-pulse 2.4s ease-out infinite; animation-delay: var(--d, 0s); }
        .ab-step:last-child .ab-dot { --dot: var(--color-primary); }
        @keyframes ab-pulse {
          0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--dot) 55%, transparent); }
          70%, 100% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--dot) 0%, transparent); }
        }
        @media (prefers-reduced-motion: reduce) { .ab-dot { animation: none; } }

        @media (max-width: 1100px) {
          .ab-col-3, .ab-col-5, .ab-col-4, .ab-col-7 { grid-column: 1 / -1; }
          .ab-photo { aspect-ratio: 16 / 9; min-height: 0; }
        }
        @media (max-width: 800px) {
          .ab-photo { aspect-ratio: 4 / 3; }
        }
        @media (max-width: 560px) {
          .ab-card { padding: 28px 22px; }
          .ab-num { padding: 20px 22px; }
          .ab-skill-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.05}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ ...eyebrow, marginBottom: '14px' }}>{t('about.eyebrow')}</span>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 16px' }}>
              {t('aboutBento.title')}
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 auto', maxWidth: '520px' }}>
              {t('about.heading')}
            </p>
          </div>
        </FadeIn>

        <div className="ab-grid">
          {/* Coluna 1: foto */}
          <FadeIn className="ab-col-3" style={{ height: '100%' }}>
            <div className="ab-card ab-photo" style={{ height: '100%' }}>
              <Image
                src="/about-photo.webp"
                alt={t('about.newPhoto.alt')}
                fill
                sizes="(max-width: 800px) 100vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </FadeIn>

          {/* Coluna 2: nome + texto */}
          <FadeIn className="ab-col-5" delay={0.05} style={{ height: '100%' }}>
            <div className="ab-card ab-text" style={{ height: '100%' }}>
              <h3 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 18px' }}>
                {t('hero.name')}
              </h3>
              {paragraphs.map((text, i) => (
                <p key={i} style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.75, margin: i === paragraphs.length - 1 ? 0 : '0 0 12px' }}>
                  {text}
                </p>
              ))}
            </div>
          </FadeIn>

          {/* Coluna 3: trajetória vertical, animada */}
          <FadeIn className="ab-col-4" delay={0.1} style={{ height: '100%' }}>
            <div className="ab-card" style={{ height: '100%' }}>
              <span style={{ ...eyebrow, marginBottom: '24px' }}>{t('aboutBento.timeline')}</span>
              <motion.ol
                className="ab-steps"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.2 } } }}
              >
                <motion.li
                  aria-hidden="true"
                  className="ab-line"
                  style={{ listStyle: 'none' }}
                  variants={{ hidden: { scaleY: reduce ? 1 : 0 }, visible: { scaleY: 1, transition: { duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] } } }}
                />
                {MILESTONES.map((n) => (
                  <motion.li
                    key={n}
                    className="ab-step"
                    variants={{
                      hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -12 },
                      visible: { opacity: 1, x: 0, transition: { duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="ab-dot" style={{ ['--d' as string]: `${n * 0.35}s` }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.35 }}>
                        {t(`experience.item${n}.title`)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.55, marginTop: '4px' }}>
                        {t(`experience.item${n}.desc`)}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-text)', lineHeight: 1.35, whiteSpace: 'nowrap' }}>
                      {t(`experience.item${n}.period`)}
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </FadeIn>

          {/* Linha 2: habilidades */}
          <FadeIn className="ab-col-7" delay={0.05} style={{ height: '100%' }}>
            <div className="ab-card" style={{ height: '100%' }}>
              <span style={{ ...eyebrow, marginBottom: '20px' }}>{t('skills.eyebrow')}</span>
              {SKILL_GROUPS.map(({ n, pick, labelKey, itemsKey }) => {
                const all = t(itemsKey ?? `skills.group${n}.items`).split(' · ');
                const items = pick ? pick.map((idx) => all[idx]) : all;
                return (
                  <div key={n} className="ab-skill-row">
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', margin: 0, whiteSpace: 'nowrap' }}>
                      {t(labelKey ?? `skills.group${n}.label`)}
                    </h3>
                    <div className="ab-chips">
                      {items.filter(Boolean).map((item) => (
                        <span key={item} className="ab-chip">{item}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Linha 2: números + áreas de atuação */}
          <FadeIn className="ab-col-5" delay={0.1} style={{ height: '100%' }}>
            <div className="ab-stack">
              <div className="ab-nums">
                {stats.map((st) => (
                  <div key={st.label} className="ab-card ab-num">
                    <div style={{ fontSize: 'clamp(2rem, 3.4vw, 2.75rem)', fontWeight: 800, lineHeight: 1, color: 'var(--color-primary-text)' }}>{st.value}</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '8px', lineHeight: 1.4 }}>{st.label}</div>
                  </div>
                ))}
              </div>
              <div className="ab-card ab-areas">
                <span style={{ ...eyebrow, marginBottom: '16px' }}>{t('aboutBento.areas')}</span>
                <div className="ab-chips">
                  {areas.map((item) => (
                    <span key={item} className="ab-chip">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
