'use client';

import Image from 'next/image';
import { useLang } from '@/context/LangContext';
import FadeIn from './ui/FadeIn';
import { ArrowRight, ArrowDown, Mail, Linkedin, Camera } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

// variant 'consulting': mesmo hero (foto, título grande, botões, scroll), com o conteúdo da página de consultoria.
export default function Hero({ variant = 'home' }: { variant?: 'home' | 'consulting' }) {
  const { t } = useLang();
  const { contactEmail, linkedinUrl } = useSiteSettings();
  const isConsulting = variant === 'consulting';
  const titleText = isConsulting ? t('consultingHero.title') : t('hero.title');
  const words = titleText.split(' ');
  const firstCount = isConsulting ? 2 : 1;
  const titleFirst = words.slice(0, firstCount).join(' ');
  const titleRest = words.slice(firstCount).join(' ');

  return (
    <section id="hero">
      <div style={{ position: 'relative', overflow: 'hidden' }}>

        <style>{`
          .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; width: 100%; }
          .hero-visual { position: relative; width: 100%; aspect-ratio: 0.9; }
          .hero-photo { position: absolute; inset: 0; -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 16%, #000 90%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 10%, #000 88%, transparent 100%); -webkit-mask-composite: source-in; mask-image: linear-gradient(90deg, transparent 0%, #000 16%, #000 90%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 10%, #000 88%, transparent 100%); mask-composite: intersect; }
          .hero-note { position: absolute; top: 8%; right: 4%; display: flex; gap: 6px; align-items: flex-start; color: rgba(255,255,255,0.75); font-family: 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive; font-style: italic; font-size: 14px; line-height: 1.3; white-space: pre-line; transform: rotate(-5deg); }
          .hero-note svg { margin-top: 18px; }
          .hero-bottom-stack { position: absolute; right: 4%; bottom: 8%; display: flex; flex-direction: column; align-items: flex-end; gap: 20px; }
          .hero-status { text-shadow: 0 1px 12px #000, 0 0 3px #000; display: flex; gap: 12px; padding: 4px 0 4px 16px; border-left: 1px solid var(--color-border-subtle); }
          .hero-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 999px; background: #fff; color: #000; transition: transform 0.15s, background 0.15s; }
          .hero-icon-btn:active { transform: scale(0.94); }
          @media (hover: hover) and (pointer: fine) { .hero-icon-btn:hover { background: var(--color-primary); color: #fff; } }
          .hero-status-dot { width: 8px; height: 8px; margin-top: 6px; border-radius: 50%; background: var(--color-primary); flex-shrink: 0; }
          @media (max-width: 1024px) {
            .hero-grid { grid-template-columns: 1fr; gap: 40px; }
            .hero-bottom-stack { right: 8px; }
            .hero-visual { aspect-ratio: 1; max-width: 560px; margin: 0 auto; }
            .hero-note { right: 8px; }
            .hero-status { right: 8px; }
          }
          @media (max-width: 1024px) {
            .hero-content { padding: 72px 20px 24px !important; min-height: 100vh !important; min-height: 100dvh !important; align-items: stretch !important; }
            .hero-grid { gap: 20px !important; grid-template-rows: minmax(0, 1fr) auto; }
            .hero-visual-wrap { order: -1; height: 100%; min-height: 0; }
            .hero-visual { aspect-ratio: auto !important; height: 100%; min-height: 220px; max-width: none !important; }
            .hero-inner h1 { font-size: 3.75rem !important; margin: 0 0 14px !important; }
            .hero-name-row { margin: 0 0 8px !important; }
            .hero-name-row p { font-size: 1.125rem !important; }
            .hero-inner > div > p, .hero-lead { font-size: 13.5px !important; line-height: 1.6 !important; margin: 0 auto 20px !important; }
            .hero-icon-btn { width: 44px; height: 44px; }
            .hero-inner { text-align: center; }
            .hero-name-row { justify-content: center; }
            .hero-cta-group { width: 100%; justify-content: center; gap: 12px !important; }
            .hero-cta-primary,
            .hero-cta-secondary { flex: 1 1 calc(50% - 6px); justify-content: center; padding: 13px 12px !important; }
          }
          @media (min-width: 600px) and (max-width: 1024px) {
            .hero-content { padding-left: 32px !important; padding-right: 32px !important; min-height: min(100vh, 900px) !important; min-height: min(100dvh, 900px) !important; }
            .hero-inner h1 { font-size: 4.5rem !important; white-space: nowrap; }
            .hero-inner h1 > span { display: inline !important; }
            .hero-inner h1 > span:first-child { margin-right: 0.25em; }
            .hero-name-row p { font-size: 1.5rem !important; }
            .hero-inner > div > p, .hero-lead { font-size: 16px !important; max-width: 560px; }
            .hero-icon-btn { width: 50px; height: 50px; }
          }
          .hero-inner h1.hero-title-compact { white-space: normal; }
          .hero-photo-slot { -webkit-mask-image: none !important; mask-image: none !important; border: 1px solid rgba(255,255,255,0.06); border-radius: 32px; background: transparent; display: flex; align-items: center; justify-content: center; }
          @media (min-width: 1025px) { .hero-cta-compact .hero-cta-primary, .hero-cta-compact .hero-cta-secondary { padding: 15px 22px !important; } .hero-cta-compact { gap: 10px !important; } }
          .hero-inner h1.hero-title-compact > span { display: block !important; margin-right: 0 !important; }
          @media (max-width: 1024px) { .hero-inner h1.hero-title-compact { font-size: 2.6rem !important; } }
          @media (min-width: 600px) and (max-width: 1024px) { .hero-inner h1.hero-title-compact { font-size: 3.5rem !important; } }
        `}</style>

        {/* Main content */}
        <div
          className="section-container hero-content"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            padding: '140px 24px 80px',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="hero-grid">
            <div className="hero-inner">
              <FadeIn delay={0.05} duration={0.4} direction="none">
                <h1
                  aria-label={titleText}
                  className={isConsulting ? 'hero-title-compact' : undefined}
                  style={{
                    fontSize: isConsulting ? 'clamp(2.25rem, 3.9vw, 3.4rem)' : 'clamp(3.25rem, 9vw, 8rem)',
                    fontWeight: 800,
                    lineHeight: 0.98,
                    letterSpacing: '-0.03em',
                    color: 'var(--color-text)',
                    margin: '0 0 36px',
                  }}
                >
                  <span aria-hidden="true" style={{ display: 'block', color: 'var(--color-primary-text)' }}>{titleFirst}</span>
                  <span aria-hidden="true" className="hero-title-second" style={{ display: 'block' }}>
                    {titleRest}
                  </span>
                </h1>
                <div className="hero-name-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '0 0 16px' }}>
                  <p style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.5rem)', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                    {isConsulting ? t('consultingHero.tagline') : t('hero.name')}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1} duration={0.4} direction="none">
                <p className="hero-lead" style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 0 36px' }}>
                  {isConsulting ? t('consultingHero.subtitle') : t('hero.subtitle')}
                </p>
              </FadeIn>

              <FadeIn delay={0.15} duration={0.4} direction="none">
                <div className={isConsulting ? "hero-cta-group hero-cta-compact" : "hero-cta-group"} style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  <a
                    href={isConsulting ? '/briefing' : '#cases'}
                    className="hero-cta-primary cta-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--color-primary-text)',
                      color: '#fff',
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: '15px 32px',
                      borderRadius: '999px',
                      textDecoration: 'none',
                    }}
                  >
                    {isConsulting ? t('nav.startProject') : t('hero.cta.primary')}
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href={isConsulting ? '/portfolio' : '#about'}
                    className="hero-cta-secondary cta-ghost"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: '15px 32px',
                      borderRadius: '999px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      textDecoration: 'none',
                    }}
                  >
                    {isConsulting ? t('consultingHero.portfolio') : t('hero.cta.secondary')}
                    {isConsulting ? <ArrowRight size={16} /> : <ArrowDown size={16} />}
                  </a>
                  {!isConsulting && (<>
                  <a href={`mailto:${contactEmail}`} aria-label="E-mail" className="hero-icon-btn">
                    <Mail size={18} />
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hero-icon-btn">
                    <Linkedin size={18} />
                  </a>
                  </>)}
                </div>
              </FadeIn>
            </div>

            {/* Retrato + anotações */}
            <FadeIn className="hero-visual-wrap" delay={0.15} duration={0.5} direction="none">
              <div className="hero-visual">
                {isConsulting ? (
                  // Espaço reservado pra imagem da página de consultoria (a inserir).
                  <div className="hero-photo hero-photo-slot" aria-hidden="true">
                    <Camera size={32} color="rgba(255,255,255,0.15)" />
                  </div>
                ) : (
                  <div className="hero-photo" aria-hidden="true">
                    <Image src="/eu.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
                  </div>
                )}
                {!isConsulting && (
                <div className="hero-note" aria-hidden="true">
                  <svg width="44" height="40" viewBox="0 0 44 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M40 4C24 4 10 14 6 32" />
                    <path d="M2 24l4 9 8-6" />
                  </svg>
                  <span>{t('hero.note')}</span>
                </div>
                )}

                {!isConsulting && (
                <div className="hero-bottom-stack">
                  <div className="hero-status">
                    <span className="hero-status-dot" />
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
                      {t('hero.status.line1')}
                      <br />
                      <strong style={{ color: 'var(--color-text)', fontWeight: 700 }}>{t('hero.status.line2')}</strong>
                    </p>
                  </div>
                </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Mouse Scroll Icon */}
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} className="hidden-mobile">
          <FadeIn delay={0.8}>
            <style>{`
              @keyframes scroll-bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(6px); }
                60% { transform: translateY(3px); }
              }
              @media (prefers-reduced-motion: reduce) {
                .scroll-dot { animation: none !important; }
              }
            `}</style>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
              <div style={{
                width: '24px',
                height: '36px',
                border: '2px solid var(--color-text)',
                borderRadius: '16px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px'
              }}>
                <div className="scroll-dot" style={{
                  width: '4px',
                  height: '6px',
                  background: 'var(--color-text)',
                  borderRadius: '2px',
                  animation: 'scroll-bounce 2s infinite'
                }} />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
