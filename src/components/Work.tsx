'use client';

import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import RevealHeading from './ui/RevealHeading';
import { ArrowRight } from 'lucide-react';

const SERVICES = [1, 2, 3, 4, 5, 6];

// Serviços (o que faço) na Home: cabeçalho 70/30 (título | texto de apoio), os seis serviços no mesmo
// formato dos passos do Processo (número, título e descrição, sem caixa) e o botão depois da grade.
export default function Work() {
  const { t } = useLang();

  return (
    <section id="work" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <style>{`
          .work-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 32px; }
          .work-item { padding-top: 20px; border-top: 1px solid var(--color-border-subtle); }
          @media (max-width: 900px) { .work-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 560px) {
            .work-grid { grid-template-columns: 1fr; }
            .work-cta-button { width: 100%; justify-content: center; }
          }
        `}</style>

        <FadeIn delay={0.1}>
          <div className="section-head">
            <div>
              <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
                {t('work.eyebrow')}
              </span>
              <RevealHeading style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.05, margin: 0 }}>
                {t('work.title')}
              </RevealHeading>
            </div>
            <div className="section-head-aside">
              <p>{t('work.subtitle')}</p>
            </div>
          </div>
        </FadeIn>

        <div className="work-grid">
          {SERVICES.map((n, i) => (
            <FadeIn key={n} delay={0.1 + i * 0.05}>
              <div className="work-item">
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-text)', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  {String(n).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 10px' }}>{t(`work.svc${n}.title`)}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--color-text-muted)', margin: 0 }}>{t(`work.svc${n}.label`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <a
            href="/briefing"
            className="work-cta-button cta-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '48px',
              background: 'var(--color-primary-text-hover)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            {t('nav.startProject')}
            <ArrowRight size={16} />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
