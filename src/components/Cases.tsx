'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FadeIn from './ui/FadeIn';
import { useLang } from '@/context/LangContext';
import { PORTFOLIO_ITEMS, ATUACAO_CATEGORIES, slugify, type AtuacaoCategory } from '@/data/portfolio';
import type { CaseAssetOverrides } from '@/data/caseAssets';
import { CATEGORY_KEYS } from '@/lib/translations';
import { SURFACE } from '@/lib/surfaces';

const PREVIEW_LIMIT = 9;

// Só cases com case study completo entram no preview da Home — sempre clicáveis,
// nunca levam a um card "em breve". A lista completa (com os demais) fica em /portfolio.
const FEATURED_CASES = PORTFOLIO_ITEMS.filter((item) => item.caseStudy);

export default function Cases({ overrides = {} }: { overrides?: Record<string, CaseAssetOverrides> }) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);

  const filtered = (
    activeFilter ? FEATURED_CASES.filter((item) => item.atuacao.includes(activeFilter)) : FEATURED_CASES
  ).slice(0, PREVIEW_LIMIT);

  return (
    <section id="cases" style={{ background: SURFACE.base, padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
              marginBottom: '40px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 'var(--fs-eyebrow)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: 'var(--ls-eyebrow)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '14px',
                }}
              >
                {t('cases.eyebrow')}
              </span>
              <h2
                style={{
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 900,
                  color: '#1a1a1a',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {t('cases.heading.line1')}
              </h2>
            </div>

            <div className="filters-scroll no-scrollbar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <style>{`
                .filter-pill[data-active="false"]:hover {
                  background: rgba(26,26,26,0.07) !important;
                  color: rgba(26,26,26,0.85) !important;
                }
              `}</style>
              <FilterPill label={t('cases.filterAll')} active={activeFilter === null} onClick={() => setActiveFilter(null)} />
              {ATUACAO_CATEGORIES.map((cat) => (
                <FilterPill key={cat} label={tCategory(cat)} active={activeFilter === cat} onClick={() => setActiveFilter(cat)} />
              ))}
            </div>
          </div>
        </FadeIn>

        <style>{`
          .cases-preview-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          @media (max-width: 900px) {
            .cases-preview-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 560px) {
            .cases-preview-grid { grid-template-columns: 1fr; }
          }
          .portfolio-card { transition: box-shadow 0.25s; }
          .portfolio-card:hover { box-shadow: 0 16px 32px rgba(0,0,0,0.14); }
          .portfolio-card img { transition: transform 0.35s ease; }
          .portfolio-card:hover img { transform: scale(1.06); }
        `}</style>

        <div className="cases-preview-grid">
          {filtered.map((item, i) => {
            const coverImage = overrides[slugify(item.empresa)]?.coverImage ?? item.image;
            return (
              <FadeIn key={item.id} delay={0.05 * i} style={{ height: '100%' }}>
                <Link href={`/portfolio/${slugify(item.empresa)}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                  <div className="portfolio-card" style={{ position: 'relative', aspectRatio: '4 / 3', background: SURFACE.card, overflow: 'hidden', borderRadius: '20px', height: '100%' }}>
                    {coverImage ? (
                      <Image src={coverImage} alt={item.empresa} fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'top' }} priority={i === 0} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'rgba(26,26,26,0.15)' }}>
                          photo_camera
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'rgba(26,26,26,0.7)' }}>
                        north_east
                      </span>
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: '48px 16px 16px',
                        background: 'linear-gradient(to top, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.6) 55%, rgba(20,18,16,0) 100%)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {item.atuacao.map((cat) => (
                          <span
                            key={cat}
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'rgba(245,243,240,0.85)',
                              background: 'rgba(255,255,255,0.12)',
                              border: '1px solid rgba(245,243,240,0.2)',
                              padding: '4px 10px',
                              borderRadius: '100px',
                            }}
                          >
                            {tCategory(cat)}
                          </span>
                        ))}
                      </div>
                      <h3 style={{ color: '#f5f3f0', fontSize: '16px', fontWeight: 700, margin: 0 }}>
                        {item.empresa}
                      </h3>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <style>{`
              .view-all-link { display: inline-flex; align-items: center; gap: 6px; }
              .view-all-link .view-all-arrow { transition: transform 0.2s; display: inline-block; }
              .view-all-link:hover .view-all-arrow { transform: translateX(4px); }
            `}</style>
            <Link
              href="/portfolio"
              className="view-all-link"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.04em',
                textDecoration: 'none',
              }}
            >
              {t('cases.viewAll')}
              <span className="view-all-arrow">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className="filter-pill"
      data-active={active}
      onClick={onClick}
      style={{
        fontSize: '12px',
        fontWeight: 600,
        color: active ? '#fff' : 'rgba(26,26,26,0.6)',
        background: active ? 'var(--color-primary)' : 'transparent',
        border: active ? '1px solid var(--color-primary)' : 'none',
        padding: '7px 16px',
        borderRadius: '100px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
