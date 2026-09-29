'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

const ghost = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  height: '52px',
  boxSizing: 'border-box' as const,
  padding: '0 32px',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--color-text)',
  border: '1px solid rgba(255,255,255,0.2)',
  textDecoration: 'none',
  whiteSpace: 'nowrap' as const,
};

// Dois blocos lado a lado: convite pro portfólio (imagem a inserir) e Sobre reduzido, com link pro Sobre da home.
export function CasesAndAbout() {
  const { t } = useLang();
  const card = { border: '1px solid rgba(255,255,255,0.06)', borderRadius: '28px', padding: '40px 32px', background: 'transparent', display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start' };
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .cpair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 800px) { .cpair { grid-template-columns: 1fr; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <div className="cpair">
          <FadeIn style={{ height: '100%' }}>
            <div style={{ ...card, height: '100%' }}>
              {/* Espaço reservado pra imagem de chamada do portfólio (a inserir). */}
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.15, margin: '0 0 12px' }}>{t('consultingPage.cases.title')}</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: '440px' }}>{t('consultingPage.cases.text')}</p>
              <Link href="/portfolio" className="cta-ghost" style={{ ...ghost, marginTop: 'auto' }}>
                {t('consultingHero.portfolio')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} style={{ height: '100%' }}>
            <div style={{ ...card, height: '100%' }}>
              <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                {t('about.eyebrow')}
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.15, margin: '0 0 12px' }}>{t('hero.name')}</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: '440px' }}>{t('aboutBento.p1')}</p>
              <Link href="/#about" className="cta-ghost" style={{ ...ghost, marginTop: 'auto' }}>
                {t('consultingPage.about.link')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
