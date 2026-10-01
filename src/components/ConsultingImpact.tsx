'use client';

import { Users, Boxes, Sparkles, RefreshCw, type LucideIcon } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import AutoVideo from './ui/AutoVideo';
import RevealHeading from './ui/RevealHeading';

const PRINCIPLES: { n: number; Icon: LucideIcon }[] = [
  { n: 1, Icon: Users },
  { n: 2, Icon: Boxes },
  { n: 3, Icon: Sparkles },
  { n: 4, Icon: RefreshCw },
];

// "Impacto real em pessoas reais": fundo laranja com tudo em branco; o vídeo vertical é o fundo da
// metade direita da seção (no mobile vira um bloco abaixo do conteúdo).
export default function ConsultingImpact() {
  const { t } = useLang();
  return (
    <section id="impacto" className="cimp-section" style={{ position: 'relative', overflow: 'hidden', background: 'transparent', padding: 'calc(var(--section-pad-y) * 1.3) 0' }}>
      <style>{`
        .cimp-section { --color-text: #ffffff; --color-text-muted: rgba(255,255,255,0.92); --color-primary-text: #ffffff; --color-border: rgba(255,255,255,0.55); --color-border-subtle: rgba(255,255,255,0.55); }
        .cimp-content { position: relative; z-index: 1; max-width: min(640px, calc(45vw - 56px)); }
        .cimp-principles { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
        .cimp-card { border: 1px solid var(--color-border-subtle); border-radius: 28px; padding: 22px 24px; background: transparent; text-align: left; }
        .cimp-bg { position: absolute; top: 0; right: 0; bottom: 0; width: 45%; overflow: hidden; }
        .cimp-bg video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .cimp-section .cimp-card:hover { border-color: #ffffff; background: rgba(255,255,255,0.08); }
        /* Parallax leve do vídeo com a rolagem (Chrome/Edge; nos demais fica parado). */
        @media (prefers-reduced-motion: no-preference) {
          @supports (animation-timeline: view()) {
            .cimp-bg video { animation: cimp-parallax linear both; animation-timeline: view(); }
            @keyframes cimp-parallax { from { transform: translateY(-4%) scale(1.08); } to { transform: translateY(4%) scale(1.08); } }
          }
        }
        @media (max-width: 1024px) {
          .cimp-section { padding-bottom: 24px !important; }
          .cimp-content { max-width: none; }
          .cimp-bg { position: relative; width: auto; aspect-ratio: 4 / 5; margin: 40px 24px 0; border-radius: 24px; }
        }
        @media (max-width: 560px) { .cimp-principles { grid-template-columns: 1fr; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <div className="cimp-content">
          <FadeIn>
            <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
              {t('consultingImpact.eyebrow')}
            </span>
            <RevealHeading style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 24px', whiteSpace: 'pre-line' }}>{t('consultingImpact.title')}</RevealHeading>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.75, margin: 0 }}>{t('consultingImpact.text')}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="cimp-principles">
              {PRINCIPLES.map(({ n, Icon }) => (
                <div key={n} className="cimp-card hover-lift">
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={20} color="var(--color-primary-text)" strokeWidth={1.75} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{t(`consultingImpact.p${n}.title`)}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>{t(`consultingImpact.p${n}.text`)}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
      <div className="cimp-bg" aria-hidden="true">
        <AutoVideo src="/consultoria/evolucao.mp4" poster="/consultoria/evolucao.webp" />
      </div>
    </section>
  );
}
