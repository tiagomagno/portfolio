'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';

// Bloco único: foto + sobre (reduzido) e os dois convites (trajetória e portfólio) em botões outline laranja.
export function CasesAndAbout() {
  const { t } = useLang();
  return (
    <section style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
      <style>{`
        .cabout { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); border: 1px solid var(--color-border-subtle); border-radius: 32px; overflow: hidden; }
        .cabout-photo { position: relative; min-height: 440px; }
        .cabout-photo img { transition: transform 600ms var(--ease-out); }
        @media (hover: hover) and (pointer: fine) { .cabout:hover .cabout-photo img { transform: scale(1.04); } }
        @media (prefers-reduced-motion: reduce) { .cabout:hover .cabout-photo img { transform: none; } }
        .cabout-body { padding: 56px 48px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
        @media (max-width: 800px) {
          .cabout { grid-template-columns: 1fr; }
          .cabout-photo { min-height: 0; aspect-ratio: 4 / 5; }
          .cabout-photo img { transition: transform 600ms var(--ease-out); }
        @media (hover: hover) and (pointer: fine) { .cabout:hover .cabout-photo img { transform: scale(1.04); } }
        @media (prefers-reduced-motion: reduce) { .cabout:hover .cabout-photo img { transform: none; } }
        .cabout-body { padding: 36px 24px; }
        }
        @media (max-width: 560px) { .cabout-btns a { width: 100%; } }
      `}</style>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn>
          <div className="cabout">
            <div className="cabout-photo">
              <Image src="/about-photo.webp" alt={t('hero.name')} fill sizes="(max-width: 800px) 100vw, 35vw" style={{ objectFit: 'cover', objectPosition: '30% 40%' }} />
            </div>
            <div className="cabout-body">
              <span style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: 'var(--color-primary-text)', letterSpacing: 'var(--ls-eyebrow)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                {t('about.eyebrow')}
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1, margin: '0 0 16px' }}>{t('hero.name')}</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 12px', maxWidth: '520px' }}>{t('aboutBento.p1')}</p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 32px', maxWidth: '520px' }}>{t('consultingPage.cases.text')}</p>
              <div className="cabout-btns" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/#about" className="btn-outline-orange">
                  {t('consultingPage.about.link')}
                  <ArrowRight size={16} />
                </Link>
                <Link href="/portfolio" className="btn-outline-orange">
                  {t('consultingHero.portfolio')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
