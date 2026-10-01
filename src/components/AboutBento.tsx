'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { splitParagraphs } from '@/lib/paragraphs';

const MILESTONES = [1, 2, 3, 4, 5, 6];
// Etapas do processo (as mesmas da seção "Do problema à solução").
const METHOD = [1, 2, 3, 4];
// `pick` escolhe quais itens de cada lista aparecem como etiqueta; `itemsKey` usa uma lista própria
// (todas as etiquetas) em vez de escolher da lista do grupo original.
const SKILL_GROUPS: { n: number; pick?: number[]; itemsKey?: string }[] = [
  { n: 1, pick: [0, 1, 2] },
  { n: 2, pick: [1, 2, 3] }, // Design Tokens, Componentes, Acessibilidade
  { n: 4, itemsKey: 'aboutBento.toolsList' }, // Figma, Pacote Adobe, Design Thinking, Scrum
  { n: 6, itemsKey: 'aboutBento.aiList' }, // Claude, Codex
];
const eyebrow = {
  fontSize: 'var(--fs-eyebrow)',
  fontWeight: 700,
  color: 'var(--color-primary-text)',
  letterSpacing: 'var(--ls-eyebrow)',
  textTransform: 'uppercase' as const,
  display: 'block',
};

// Sobre mim: cabeçalho centralizado, depois duas colunas (foto + anos + etapas | texto + etiquetas)
// e a trajetória numa faixa horizontal embaixo. A foto estica pra a coluna da esquerda terminar
// na mesma linha que a da direita.
export default function AboutBento() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const paragraphs = splitParagraphs([1, 2, 3, 4, 5].map((n) => t(`about.p${n}`)));
  const areas = t('aboutBento.areasList').split(' · ');
  const skills = SKILL_GROUPS.flatMap(({ n, pick, itemsKey }) => {
    const all = t(itemsKey ?? `skills.group${n}.items`).split(' · ');
    return (pick ? pick.map((idx) => all[idx]) : all).filter(Boolean);
  });

  return (
    <section id="about" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .ab-wrap { display: grid; grid-template-columns: 5fr 7fr; gap: 0 clamp(40px, 6vw, 96px); align-items: stretch; }
        .ab-wrap > * { min-width: 0; }
        .ab-col-left { display: flex; flex-direction: column; }
        .ab-col-right { display: flex; flex-direction: column; justify-content: space-between; gap: 40px; }
        .ab-label { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 14px 0; border-top: 1px solid var(--color-border-subtle); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); }
        .ab-photo { position: relative; flex: 1 1 auto; min-height: 380px; border-radius: 20px; overflow: hidden; background: var(--color-bg-high); }
        .ab-years { display: flex; align-items: flex-end; gap: 20px; padding: 24px 0; margin-top: 24px; border-top: 1px solid var(--color-border); }
        .ab-years-num { font-size: clamp(4rem, 7vw, 6.5rem); font-weight: 800; line-height: 0.85; letter-spacing: -0.06em; color: var(--color-text); }
        .ab-years-cap { font-size: 14px; line-height: 1.5; color: var(--color-text-muted); max-width: 220px; padding-bottom: 4px; }
        .ab-method { display: flex; flex-wrap: wrap; gap: 8px 22px; padding: 20px 0 0; border-top: 1px solid var(--color-border); }
        .ab-method-item { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text); }
        .ab-method-item::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary); }
        .ab-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .ab-pill { font-size: 12px; font-weight: 600; color: var(--color-text); border: 1px solid var(--color-border-subtle); padding: 8px 14px; border-radius: 999px; white-space: nowrap; }
        .ab-group-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 12px; }

        /* Trajetória: faixa horizontal, linha que se desenha e marcos que entram em sequência */
        .ab-steps { list-style: none; margin: 0; padding: 0; position: relative; display: grid; grid-template-columns: repeat(6, 1fr); gap: 0 24px; }
        .ab-line { position: absolute; left: 0; right: 0; top: 8px; height: 1px; background: var(--color-border-subtle); transform-origin: left center; margin: 0; padding: 0; list-style: none; }
        .ab-step { position: relative; padding-top: 32px; }
        .ab-dot { --dot: #22c55e; position: absolute; left: 0; top: 0; width: 17px; height: 17px; border-radius: 50%; background: var(--dot); animation: ab-pulse 2.4s ease-out infinite; animation-delay: var(--d, 0s); }
        .ab-step:last-child .ab-dot { --dot: var(--color-primary); }
        @keyframes ab-pulse {
          0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--dot) 55%, transparent); }
          70%, 100% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--dot) 0%, transparent); }
        }
        @media (prefers-reduced-motion: reduce) { .ab-dot { animation: none; } }

        @media (max-width: 1100px) {
          .ab-wrap { grid-template-columns: 1fr; gap: 56px; }
          .ab-photo { flex: none; aspect-ratio: 16 / 10; min-height: 0; }
          .ab-steps { grid-template-columns: repeat(3, 1fr); row-gap: 40px; }
          .ab-line { display: none; }
          .ab-step { padding-top: 28px; border-top: 1px solid var(--color-border-subtle); }
          .ab-dot { top: -8px; }
        }
        @media (max-width: 640px) {
          .ab-photo { aspect-ratio: 4 / 3; }
          .ab-steps { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.05}>
          <div className="section-head">
            <div>
              <span style={{ ...eyebrow, marginBottom: '14px' }}>{t('about.eyebrow')}</span>
              <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.05, margin: 0 }}>
                {t('aboutBento.title')}
              </h2>
            </div>
            <div className="section-head-aside">
              <p>{t('about.heading')}</p>
            </div>
          </div>
        </FadeIn>

        <div className="ab-wrap">
          {/* Coluna esquerda: foto, anos de experiência, etapas do processo */}
          <FadeIn className="ab-col-left">
            <div className="ab-label">
              <span>{t('aboutBento.expLabel')}</span>
              <span>{t('aboutBento.since')}</span>
            </div>
            <div className="ab-photo" style={{ marginTop: '4px' }}>
              <Image
                src="/about-photo.webp"
                alt={t('about.newPhoto.alt')}
                fill
                sizes="(max-width: 1100px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="ab-years">
              <span className="ab-years-num">{t('about.badge.number').replace('+', '')}<span style={{ color: 'var(--color-primary-text)' }}>+</span></span>
              <span className="ab-years-cap">{t('aboutBento.yearsCaption')}</span>
            </div>
            <div className="ab-method">
              {METHOD.map((n) => (
                <span key={n} className="ab-method-item">{t(`process.step${n}.title`)}</span>
              ))}
            </div>
          </FadeIn>

          {/* Coluna direita: texto e etiquetas (as etiquetas ficam alinhadas à base da coluna) */}
          <FadeIn delay={0.08} className="ab-col-right">
            <div>
              {paragraphs.map((text, i) => (
                <p key={i} style={{ fontSize: 'clamp(1.0625rem, 1.25vw, 1.1875rem)', color: 'var(--color-text-muted)', lineHeight: 1.75, margin: i === paragraphs.length - 1 ? 0 : '0 0 20px' }}>
                  {text}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <span className="ab-group-label">{t('aboutBento.areas')}</span>
                <div className="ab-pills">
                  {areas.map((item) => (
                    <span key={item} className="ab-pill">{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="ab-group-label">{t('aboutBento.skillsLabel')}</span>
                <div className="ab-pills">
                  {skills.map((item) => (
                    <span key={item} className="ab-pill">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Trajetória: faixa horizontal abaixo das colunas */}
        <FadeIn delay={0.1}>
          <div className="ab-label" style={{ marginTop: '88px', marginBottom: '32px' }}>
            <span>{t('aboutBento.timeline')}</span>
            <span>{t('experience.item1.period')} — {t('experience.item6.period')}</span>
          </div>
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
              variants={{ hidden: { scaleX: reduce ? 1 : 0 }, visible: { scaleX: 1, transition: { duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] } } }}
            />
            {MILESTONES.map((n) => (
              <motion.li
                key={n}
                className="ab-step"
                variants={{
                  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <span className="ab-dot" style={{ ['--d' as string]: `${n * 0.35}s` }} />
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-text)', marginBottom: '6px' }}>{t(`experience.item${n}.period`)}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>{t(`experience.item${n}.title`)}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.55, marginTop: '6px' }}>{t(`experience.item${n}.desc`)}</div>
              </motion.li>
            ))}
          </motion.ol>
        </FadeIn>
      </div>
    </section>
  );
}
