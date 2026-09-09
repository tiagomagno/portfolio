'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { CATEGORY_KEYS } from '@/lib/translations';
import { getCaseStudyItems, slugify, type PortfolioItem } from '@/data/portfolio';
import { SURFACE } from '@/lib/surfaces';
import FadeIn from './ui/FadeIn';
import SectionDivider from './ui/SectionDivider';

export default function CaseStudyPage({ item }: { item: PortfolioItem }) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);
  const cs = item.caseStudy!;
  const category = tCategory(item.atuacao[0]);

  const allCases = getCaseStudyItems();
  const currentIndex = allCases.findIndex((c) => c.id === item.id);
  const nextCase = allCases.length > 1 ? allCases[(currentIndex + 1) % allCases.length] : null;

  // Banner do topo: cor sólida tem prioridade sobre a imagem de topo dedicada; sem
  // nenhuma das duas, cai pra capa.
  const bannerColor = item.heroColor;
  const bannerImage = bannerColor ? undefined : item.heroImage ?? item.image;
  const hasBanner = Boolean(bannerColor || bannerImage);

  // Sem banner, a Hero não tem o scrim escuro por trás — o texto precisa ficar escuro nesse caso.
  const heroFg = hasBanner ? '245,243,240' : '26,26,26';
  const heroSolid = hasBanner ? '#f5f3f0' : '#1a1a1a';

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', paddingTop: '72px', background: SURFACE.base, overflow: 'hidden' }}>
        {bannerImage && (
          <>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
              <Image src={bannerImage} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, rgba(28,27,27,0.5) 0%, rgba(28,27,27,0.95) 80%, ${SURFACE.raised} 100%)`,
              }}
            />
          </>
        )}
        {bannerColor && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, ${bannerColor} 0%, ${bannerColor} 75%, ${SURFACE.raised} 100%)`,
            }}
          />
        )}

        <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 24px 72px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '110px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontSize: '12px', color: `rgba(${heroFg},0.4)`, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {t('breadcrumb.home')}
            </Link>
            <span style={{ fontSize: '10px', color: 'rgba(244,108,28,0.4)' }}>›</span>
            <Link href="/portfolio" style={{ fontSize: '12px', color: `rgba(${heroFg},0.4)`, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {t('nav.cases')}
            </Link>
            <span style={{ fontSize: '10px', color: 'rgba(244,108,28,0.4)' }}>›</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {item.empresa}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span
              style={{
                background: 'rgba(244,108,28,0.15)',
                border: '1px solid rgba(244,108,28,0.3)',
                color: 'var(--color-primary)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '4px 14px',
                borderRadius: '100px',
              }}
            >
              {category}
            </span>
            <span style={{ fontSize: '12px', color: `rgba(${heroFg},0.4)` }}>{cs.year}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 900,
              color: heroSolid,
              letterSpacing: '-0.02em',
              margin: '0 0 20px',
              lineHeight: 1.05,
            }}
          >
            {item.empresa}
          </h1>

          <p style={{ fontSize: '18px', color: `rgba(${heroFg},0.65)`, lineHeight: 1.7, maxWidth: '640px', margin: 0 }}>
            {cs.heroSubtitle}
          </p>
        </div>
      </section>

      <SectionDivider from={hasBanner ? SURFACE.raised : SURFACE.base} to={SURFACE.raised} />

      {/* Info strip */}
      <section style={{ background: SURFACE.raised, padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <style>{`
            .case-info-strip {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
            }
            @media (max-width: 700px) {
              .case-info-strip { grid-template-columns: repeat(2, 1fr); }
            }
          `}</style>
          <div className="case-info-strip">
            {[
              { label: t('case.info.project'), value: item.empresa },
              { label: t('case.info.role'), value: cs.role },
              { label: t('case.info.year'), value: cs.year },
              { label: t('case.info.category'), value: category },
            ].map((f) => (
              <div key={f.label} style={{ background: SURFACE.base, border: '1px solid var(--color-border)', borderBottom: '3px solid rgba(244,108,28,0.2)', borderRadius: '12px', padding: '28px 24px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {f.label}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 01 */}
      <CaseSection number="01" title={t('case.section1.title')} bg={SURFACE.raised}>
        <InfoRow label={t('case.section1.context')}>{cs.overview.context}</InfoRow>
        <InfoRow label={t('case.section1.businessProblem')}>{cs.overview.businessProblem}</InfoRow>
        <InfoRow label={t('case.section1.goals')}>
          <BulletList items={cs.overview.goals} />
        </InfoRow>
        <InfoRow label={t('case.section1.roleScope')}>{cs.overview.roleScope}</InfoRow>
        <InfoRow label={t('case.section1.constraints')} noBorder>
          <DashList items={cs.overview.constraints} />
        </InfoRow>
      </CaseSection>

      <SectionDivider from={SURFACE.raised} to={SURFACE.base} />

      {/* Section 02 */}
      <CaseSection number="02" title={t('case.section2.title')} bg={SURFACE.base}>
        <InfoRow label={t('case.section2.methodology')}>{cs.diagnosis.methodology}</InfoRow>
        <InfoRow label={t('case.section2.why')}>{cs.diagnosis.whyThisApproach}</InfoRow>
        <Quote>{cs.diagnosis.insight}</Quote>
        <InfoRow label={t('case.section2.insight')}>{cs.diagnosis.insight}</InfoRow>
        <InfoRow label={t('case.section2.stakeholders')} noBorder>{cs.diagnosis.stakeholderManagement}</InfoRow>
      </CaseSection>

      <SectionDivider from={SURFACE.base} to={SURFACE.raised} />

      {/* Section 03 */}
      <CaseSection number="03" title={t('case.section3.title')} bg={SURFACE.raised}>
        <InfoRow label={t('case.section3.hypothesis')}>
          <HighlightBox>{cs.design.hypothesis}</HighlightBox>
        </InfoRow>
        <InfoRow label={t('case.section3.discarded')}>
          <AlternativesGrid items={cs.design.discardedAlternatives} />
        </InfoRow>
        <InfoRow label={t('case.section3.edgeCases')}>{cs.design.edgeCases}</InfoRow>
        <InfoRow label={t('case.section3.designSystem')}>{cs.design.designSystem}</InfoRow>
        <InfoRow label={t('case.section3.usability')} noBorder>{cs.design.usabilityValidation}</InfoRow>
      </CaseSection>

      <SectionDivider from={SURFACE.raised} to={SURFACE.base} />

      {/* Section 04 */}
      <CaseSection number="04" title={t('case.section4.title')} bg={SURFACE.base}>
        <InfoRow label={t('case.section4.engineering')}>{cs.handoff.engineeringCollaboration}</InfoRow>
        <InfoRow label={t('case.section4.spec')}>{cs.handoff.specDocumentation}</InfoRow>
        <InfoRow label={t('case.section4.launch')} noBorder>{cs.handoff.launchStrategy}</InfoRow>
      </CaseSection>

      <SectionDivider from={SURFACE.base} to={SURFACE.raised} />

      {/* Galeria (opcional) */}
      {item.gallery && item.gallery.length > 0 && (
        <section style={{ background: SURFACE.raised, padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <FadeIn delay={0.05}>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
                {t('case.gallery.title')}
              </span>
            </FadeIn>
            <style>{`
              .case-gallery-grid { column-count: 3; column-gap: 16px; }
              .case-gallery-grid > div {
                break-inside: avoid;
                margin-bottom: 16px;
                border-radius: 16px;
                overflow: hidden;
                background: ${SURFACE.base};
              }
              @media (max-width: 900px) { .case-gallery-grid { column-count: 2; } }
              @media (max-width: 560px) { .case-gallery-grid { column-count: 1; } }
            `}</style>
            <div className="case-gallery-grid">
              {item.gallery.map((src, i) => (
                <div key={src}>
                  <Image
                    src={src}
                    alt={`${item.empresa} — imagem ${i + 1}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 05 */}
      <CaseSection number="05" title={t('case.section5.title')} bg={SURFACE.raised}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            {t('case.section5.quantitative')}
          </span>
          <MetricGrid items={cs.impact.metrics} />
        </div>
        <InfoRow label={t('case.section5.qualitative')}>{cs.impact.qualitativeImpact}</InfoRow>
        <PostMortem label={t('case.section5.postMortem')}>{cs.impact.postMortem}</PostMortem>
      </CaseSection>

      {/* Next case */}
      <section style={{ background: SURFACE.base, padding: '0 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {nextCase ? (
            <Link
              href={`/portfolio/${slugify(nextCase.empresa)}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(26,26,26,0.1)',
                padding: '60px 0',
                textDecoration: 'none',
                gap: '24px',
              }}
            >
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {t('case.nextCase')}
                </span>
                <h3 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a1a', margin: 0, letterSpacing: '-0.02em' }}>
                  {nextCase.empresa} →
                </h3>
              </div>
              {nextCase.image && (
                <div style={{ position: 'relative', width: '120px', height: '80px', flexShrink: 0, overflow: 'hidden' }}>
                  <Image src={nextCase.image} alt={nextCase.empresa} fill sizes="120px" style={{ objectFit: 'cover' }} />
                </div>
              )}
            </Link>
          ) : (
            <div style={{ borderTop: '1px solid rgba(26,26,26,0.1)', padding: '48px 0', textAlign: 'center' }}>
              <Link href="/portfolio" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                {t('case.backToPortfolio')}
              </Link>
            </div>
          )}
        </div>
      </section>

      <SectionDivider from={SURFACE.base} to={SURFACE.footer} />
    </>
  );
}

/* ── Building blocks ── */

function CaseSection({ number, title, bg, children }: { number: string; title: string; bg: string; children: React.ReactNode }) {
  return (
    <section style={{ background: bg, padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <FadeIn delay={0.05}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em' }}>{number}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(244,108,28,0.2)' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', margin: '4px 0 40px' }}>
            {title}
          </h2>
        </FadeIn>
        {children}
      </div>
    </section>
  );
}

function InfoRow({ label, children, noBorder }: { label: string; children: React.ReactNode; noBorder?: boolean }) {
  return (
    <FadeIn delay={0.05}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: '16px',
          padding: '20px 0',
          borderBottom: noBorder ? 'none' : '1px solid rgba(26,26,26,0.08)',
        }}
        className="case-info-row"
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', paddingTop: '2px' }}>
          {label}
        </span>
        <div style={{ fontSize: '15px', color: 'rgba(26,26,26,0.75)', lineHeight: 1.7 }}>{children}</div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .case-info-row { grid-template-columns: 1fr !important; gap: 6px !important; }
        }
      `}</style>
    </FadeIn>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--color-primary)', fontSize: '15px', lineHeight: '25.5px' }}>◆</span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

function DashList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: 'rgba(244,108,28,0.6)', fontSize: '15px', lineHeight: '25.5px' }}>—</span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <FadeIn delay={0.05}>
      <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '24px', margin: '32px 0' }}>
        <p style={{ fontSize: '17px', fontStyle: 'italic', color: 'rgba(26,26,26,0.8)', lineHeight: 1.75, margin: 0 }}>
          &quot;{children}&quot;
        </p>
      </div>
    </FadeIn>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(244,108,28,0.08)',
        borderTop: '1px solid var(--color-primary)',
        borderRight: '1px solid var(--color-primary)',
        borderBottom: '1px solid var(--color-primary)',
        borderLeft: '3px solid var(--color-primary)',
        borderRadius: '12px',
        padding: '16px 20px',
      }}
    >
      <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'rgba(26,26,26,0.8)', lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );
}

function AlternativesGrid({ items }: { items: { title: string; reason: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
      {items.map((it, i) => (
        <div key={i} style={{ background: SURFACE.raised, border: '1px solid rgba(26,26,26,0.1)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(244,108,28,0.5)', fontSize: '13px', fontWeight: 600 }}>✗</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(26,26,26,0.85)' }}>{it.title}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.45)', lineHeight: 1.6, margin: 0 }}>{it.reason}</p>
        </div>
      ))}
    </div>
  );
}

function MetricGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
      {items.map((m, i) => (
        <div
          key={i}
          style={{
            background: SURFACE.base,
            border: '1px solid rgba(244,108,28,0.2)',
            borderTop: '3px solid var(--color-primary)',
            borderRadius: '12px',
            padding: '24px 20px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)' }}>{m.value}</div>
          <div style={{ fontSize: '12px', color: 'rgba(26,26,26,0.62)', marginTop: '6px' }}>{m.label}</div>
        </div>
      ))}
    </div>
  );
}

function PostMortem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', background: SURFACE.base, border: '1px solid rgba(26,26,26,0.08)', borderRadius: '12px', overflow: 'hidden', padding: '32px 36px', marginTop: '40px' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--color-primary)' }} />
      <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
        {label}
      </span>
      <p style={{ fontSize: '15px', color: 'rgba(26,26,26,0.7)', lineHeight: 1.8, margin: 0 }}>{children}</p>
    </div>
  );
}
