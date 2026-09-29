'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { CATEGORY_KEYS } from '@/lib/translations';
import type { PortfolioItem } from '@/data/portfolio';
import FadeIn from './ui/FadeIn';
import PortfolioCTA from './PortfolioCTA';

// Cores do texto em fundo preto (mesma escala da home).
const TEXT = 'var(--color-text)';
const MUTED = 'var(--color-text-muted)';

// Quantidade de placeholders (com alturas variadas) quando o case ainda não tem galeria.
const GALLERY_PLACEHOLDERS = [260, 340, 220, 300, 380, 240];

export default function CaseStudyPage({ item, allCases }: { item: PortfolioItem; allCases: PortfolioItem[] }) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);
  const cs = item.caseStudy!;
  const category = tCategory(item.atuacao[0]);

  const currentIndex = allCases.findIndex((c) => c.id === item.id);
  const nextCase = allCases.length > 1 ? allCases[(currentIndex + 1) % allCases.length] : null;
  const prevCase = allCases.length > 1 ? allCases[(currentIndex - 1 + allCases.length) % allCases.length] : null;

  // Banner do topo: cor sólida tem prioridade sobre a imagem de topo dedicada; sem
  // nenhuma das duas, cai pra capa.
  const bannerColor = item.heroColor;
  const bannerImage = bannerColor ? undefined : item.heroImage ?? item.image;

  const hasGallery = Boolean(item.gallery && item.gallery.length > 0);

  return (
    <>
      <style>{`
        .case-wrap { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; }
        .case-block { margin-bottom: 72px; }
        .case-head { display: flex; align-items: center; gap: 16px; margin-bottom: 36px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-primary-text); }
        .case-head::after { content: ''; flex: 1; height: 1px; background: var(--color-border-subtle); }
        .case-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
                .case-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
        .case-gallery { column-count: 3; column-gap: 16px; }
        .case-gallery > div { break-inside: avoid; margin-bottom: 16px; border-radius: 20px; overflow: hidden; }
        .case-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 1024px) {
          .case-cols { grid-template-columns: 1fr; gap: 36px; }
          .case-gallery { column-count: 2; }
        }
        @media (max-width: 640px) {
          .case-block { margin-bottom: 56px; }
          .case-gallery { column-count: 1; }
          .case-nav { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: '72px', overflow: 'hidden' }}>
        {bannerImage && (
          <>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
              <Image src={bannerImage} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.95) 80%, #000 100%)' }} />
          </>
        )}
        {bannerColor && (
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${bannerColor} 0%, ${bannerColor} 75%, #000 100%)` }} />
        )}

        <div className="case-wrap" style={{ padding: '28px 24px 64px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '72px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {t('breadcrumb.home')}
            </Link>
            <span style={{ fontSize: '10px', color: 'rgba(244,108,28,0.4)' }}>›</span>
            <Link href="/portfolio" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {t('nav.cases')}
            </Link>
            <span style={{ fontSize: '10px', color: 'rgba(244,108,28,0.4)' }}>›</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary-text)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {item.empresa}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span
              style={{
                background: 'rgba(244,108,28,0.15)',
                border: '1px solid rgba(244,108,28,0.3)',
                color: 'var(--color-primary-text)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '4px 14px',
                borderRadius: '100px',
              }}
            >
              {category}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{cs.year}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, color: TEXT, letterSpacing: '-0.02em', margin: '0 0 20px', lineHeight: 1.05 }}>
            {item.empresa}
          </h1>

          <p style={{ fontSize: '16px', color: MUTED, lineHeight: 1.7, maxWidth: '640px', margin: 0 }}>{cs.heroSubtitle}</p>
        </div>
      </section>

      <div className="case-wrap" style={{ paddingBottom: '24px' }}>
        {/* Problema: visão geral + diagnóstico */}
        <FadeIn>
          <Phase label={t('case.phase.problem')}>
            <div className="case-cols">
              <Column title={t('case.section1.title')}>
                <Row label={t('case.section1.context')}>{cs.overview.context}</Row>
                <Row label={t('case.section1.businessProblem')}>{cs.overview.businessProblem}</Row>
                <Row label={t('case.section1.goals')}>
                  <List items={cs.overview.goals} mark="◆" />
                </Row>
                <Row label={t('case.section1.roleScope')}>{cs.overview.roleScope}</Row>
                <Row label={t('case.section1.constraints')}>
                  <List items={cs.overview.constraints} mark="—" />
                </Row>
              </Column>
              <Column title={t('case.section2.title')}>
                <Row label={t('case.section2.methodology')}>{cs.diagnosis.methodology}</Row>
                <Row label={t('case.section2.why')}>{cs.diagnosis.whyThisApproach}</Row>
                <Row label={t('case.section2.insight')}>{cs.diagnosis.insight}</Row>
                <Row label={t('case.section2.stakeholders')}>{cs.diagnosis.stakeholderManagement}</Row>
              </Column>
            </div>
          </Phase>
        </FadeIn>

        {/* Solução: arquitetura e decisões + handoff */}
        <FadeIn>
          <Phase label={t('case.phase.solution')}>
            <div className="case-cols">
              <Column title={t('case.section3.title')}>
                <Row label={t('case.section3.hypothesis')}>{cs.design.hypothesis}</Row>
                <Row label={t('case.section3.discarded')}>
                  <List items={cs.design.discardedAlternatives.map((a) => `${a.title} — ${a.reason}`)} mark="✗" />
                </Row>
                <Row label={t('case.section3.edgeCases')}>{cs.design.edgeCases}</Row>
                <Row label={t('case.section3.designSystem')}>{cs.design.designSystem}</Row>
                <Row label={t('case.section3.usability')}>{cs.design.usabilityValidation}</Row>
              </Column>
              <Column title={t('case.section4.title')}>
                <Row label={t('case.section4.engineering')}>{cs.handoff.engineeringCollaboration}</Row>
                <Row label={t('case.section4.spec')}>{cs.handoff.specDocumentation}</Row>
                <Row label={t('case.section4.launch')}>{cs.handoff.launchStrategy}</Row>
              </Column>
            </div>
          </Phase>
        </FadeIn>

        {/* Evolução: impacto e resultados */}
        <FadeIn>
          <Phase label={t('case.phase.evolution')}>
            <Column title={t('case.section5.title')}>
              <div className="case-metrics">
                {cs.impact.metrics.map((m, i) => (
                  <div key={i} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '22px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', fontWeight: 800, color: 'var(--color-primary-text)', lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: '12px', color: TEXT, marginTop: '8px', lineHeight: 1.4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="case-cols" style={{ gap: '32px 48px' }}>
                <Row label={t('case.section5.qualitative')}>{cs.impact.qualitativeImpact}</Row>
                <Row label={t('case.section5.postMortem')}>{cs.impact.postMortem}</Row>
              </div>
            </Column>
          </Phase>
        </FadeIn>

        {/* Galeria (masonry; placeholders enquanto o case não tem imagens) */}
        <FadeIn>
          <div className="case-block">
            <div className="case-head">{t('case.gallery.title')}</div>
            <div className="case-gallery">
              {hasGallery
                ? item.gallery!.map((src, i) => (
                    <div key={src} style={{ background: '#1a1a1a' }}>
                      <Image
                        src={src}
                        alt={`${item.empresa} — imagem ${i + 1}`}
                        width={0}
                        height={0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
                  ))
                : GALLERY_PLACEHOLDERS.map((h, i) => (
                    <div key={i} style={{ height: `${h}px`, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={28} color="rgba(255,255,255,0.15)" />
                    </div>
                  ))}
            </div>
          </div>
        </FadeIn>

        {/* Case anterior / próximo case */}
        {(prevCase || nextCase) && (
          <div className="case-nav">
            {prevCase && <NavCard item={prevCase} label={t('case.prevCase')} align="left" />}
            {nextCase && <NavCard item={nextCase} label={t('case.nextCase')} align="right" />}
          </div>
        )}
      </div>

      <PortfolioCTA />
    </>
  );
}

/* ── Building blocks ── */

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: 'var(--color-primary-text)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
};

// Bloco grande de uma fase (Problema / Solução / Evolução).
function Phase({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="case-block">
      <div className="case-head">{label}</div>
      {children}
    </div>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="case-col">
      <h2 style={{ fontSize: 'clamp(1.125rem, 1.6vw, 1.375rem)', fontWeight: 800, color: TEXT, letterSpacing: '-0.01em', lineHeight: 1.25, margin: '0 0 24px' }}>{title}</h2>
      {children}
    </div>
  );
}

// Rótulo em cima, texto embaixo (sem coluna lateral).
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <span style={{ ...labelStyle, fontSize: '10px', marginBottom: '6px' }}>{label}</span>
      <div style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function List({ items, mark }: { items: string[]; mark: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: 'rgba(244,108,28,0.7)', fontSize: '12px', lineHeight: '24px', flexShrink: 0 }}>{mark}</span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

function NavCard({ item, label, align }: { item: PortfolioItem; label: string; align: 'left' | 'right' }) {
  const isNext = align === 'right';
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="case-nav-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isNext ? 'space-between' : 'flex-start',
        flexDirection: isNext ? 'row-reverse' : 'row',
        gap: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '28px',
        padding: '24px 28px',
        textDecoration: 'none',
        textAlign: isNext ? 'right' : 'left',
      }}
    >
      {item.image && (
        <div style={{ position: 'relative', width: '96px', height: '72px', flexShrink: 0, overflow: 'hidden', borderRadius: '14px' }}>
          <Image src={item.image} alt={item.empresa} fill sizes="96px" style={{ objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...labelStyle, color: 'rgba(255,255,255,0.65)', marginBottom: '8px' }}>{isNext ? `${label} →` : `← ${label}`}</span>
        <h3 style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.01em' }}>{item.empresa}</h3>
      </div>
    </Link>
  );
}
