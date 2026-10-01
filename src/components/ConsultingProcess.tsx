'use client';

import { Check } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import RevealHeading from './ui/RevealHeading';

// Mesmo visual do Processo da home (duas fases, quatro etapas), agora com o detalhamento de
// cada etapa (o que acontece na prática) e a evolução contínua como adendo.
const PHASES = [
  { labelKey: 'process.diamond1', steps: [1, 2] },
  { labelKey: 'process.diamond2', steps: [3, 4] },
];

export default function ConsultingProcess() {
  const { t } = useLang();

  const items = (n: number) => [1, 2].map((i) => t(`consultingProcess.s${n}.i${i}`));

  return (
    <section id="processo" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .cproc-phases { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .cproc-head { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); }
        .cproc-head::after { content: ''; flex: 1; height: 1px; background: var(--color-border-subtle); }
        .cproc-steps { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .cproc-list { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; }
        .cproc-list li { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: var(--color-text); line-height: 1.5; }
        .cproc-evo { margin-top: 40px; padding: 24px 28px; border-radius: 20px; border: 1px dashed var(--color-border-subtle); display: grid; grid-template-columns: 220px 1fr; gap: 12px 32px; align-items: start; }
        @media (max-width: 1024px) { .cproc-phases { grid-template-columns: 1fr; gap: 40px; } .cproc-evo { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .cproc-steps { grid-template-columns: 1fr; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.1}>
          <div className="section-head" style={{ marginBottom: '48px' }}>
            <div>
              <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                {t('process.eyebrow')}
              </span>
              <RevealHeading style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.05, margin: 0 }}>{t('process.title')}</RevealHeading>
            </div>
            <div className="section-head-aside">
              <p>{t('consultingProcess.subtitle')}</p>
            </div>
          </div>
        </FadeIn>

        <div className="cproc-phases">
          {PHASES.map((phase, p) => (
            <FadeIn key={phase.labelKey} delay={0.1 + p * 0.1}>
              <div className="cproc-head">{t(phase.labelKey)}</div>
              <div className="cproc-steps">
                {phase.steps.map((n) => (
                  <div key={n}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-text)', letterSpacing: '0.06em', marginBottom: '10px' }}>{String(n).padStart(2, '0')}</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 10px' }}>{t(`process.step${n}.title`)}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0 }}>{t(`consultingProcess.d${n}`)}</p>
                    <ul className="cproc-list">
                      {items(n).map((it) => (
                        <li key={it}>
                          <Check size={15} color="var(--color-primary-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="cproc-evo">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{t('consulting.pillars.escala.title')}</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>{t('process.step5.title')}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.65, margin: '0 0 12px' }}>{t('consulting.pillars.escala.desc')}</p>
              <ul className="cproc-list" style={{ marginTop: 0 }}>
                {[1, 2, 3].map((i) => (
                  <li key={i}>
                    <Check size={15} color="var(--color-primary-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{t(`consulting.pillars.escala.item${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
