'use client';

import { Users, Boxes, Sparkles, RefreshCw, type LucideIcon } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

const PRINCIPLES: { n: number; Icon: LucideIcon }[] = [
  { n: 1, Icon: Users },
  { n: 2, Icon: Boxes },
  { n: 3, Icon: Sparkles },
  { n: 4, Icon: RefreshCw },
];

// "Impacto real em pessoas reais": fecha a página antes dos convites (portfólio/sobre) e do FAQ.
export default function ConsultingImpact() {
  const { t } = useLang();
  return (
    <section id="impacto" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .cimp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .cimp-principles { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cimp-card { border: 1px solid rgba(255,255,255,0.06); border-radius: 28px; padding: 28px; background: transparent; }
        @media (max-width: 1024px) { .cimp-grid { grid-template-columns: 1fr; gap: 40px; } }
        @media (max-width: 560px) { .cimp-principles { grid-template-columns: 1fr; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <div className="cimp-grid">
          <FadeIn>
            <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
              {t('consultingImpact.eyebrow')}
            </span>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 20px', whiteSpace: 'pre-line' }}>{t('consultingImpact.title')}</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.75, margin: 0, maxWidth: '460px' }}>{t('consultingImpact.text')}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="cimp-principles">
              {PRINCIPLES.map(({ n, Icon }) => (
                <div key={n} className="cimp-card">
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
    </section>
  );
}
