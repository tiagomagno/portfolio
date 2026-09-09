'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PORTFOLIO_ITEMS, ATUACAO_CATEGORIES, slugify, type AtuacaoCategory } from '@/data/portfolio';
import type { CaseAssetOverrides } from '@/data/caseAssets';
import { useLang } from '@/context/LangContext';
import { CATEGORY_KEYS } from '@/lib/translations';
import { SURFACE } from '@/lib/surfaces';
import FadeIn from './ui/FadeIn';

export default function PortfolioGrid({ overrides = {} }: { overrides?: Record<string, CaseAssetOverrides> }) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);

  const filtered = activeFilter ? PORTFOLIO_ITEMS.filter((item) => item.atuacao.includes(activeFilter)) : PORTFOLIO_ITEMS;

  return (
    <section style={{ background: SURFACE.raised, padding: '60px 0 100px' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.05}>
          <div
            className="filters-scroll no-scrollbar"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}
          >
            <style>{`
              .filter-pill[data-active="false"]:hover {
                background: rgba(26,26,26,0.07) !important;
                color: rgba(26,26,26,0.85) !important;
              }
            `}</style>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '4px' }}>
              {t('portfolioPage.filterLabel')}
            </span>
            <FilterPill label={t('cases.filterAll')} active={activeFilter === null} onClick={() => setActiveFilter(null)} />
            {ATUACAO_CATEGORIES.map((cat) => (
              <FilterPill key={cat} label={tCategory(cat)} active={activeFilter === cat} onClick={() => setActiveFilter(cat)} />
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(26,26,26,0.3)', whiteSpace: 'nowrap' }}>
              {filtered.length} {filtered.length === 1 ? t('cases.count.singular') : t('cases.count.plural')}
            </span>
          </div>
        </FadeIn>

        <style>{`
          .portfolio-full-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          @media (max-width: 900px) {
            .portfolio-full-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 560px) {
            .portfolio-full-grid { grid-template-columns: 1fr; }
          }
          .portfolio-card { transition: box-shadow 0.25s; }
          .portfolio-card:hover { box-shadow: 0 16px 32px rgba(0,0,0,0.14); }
          .portfolio-card img { transition: transform 0.35s ease; }
          .portfolio-card:hover img { transform: scale(1.06); }
        `}</style>

        <div className="portfolio-full-grid">
          {filtered.map((item, i) => {
            const coverImage = overrides[slugify(item.empresa)]?.coverImage ?? item.image;
            const card = (
              <div
                className="portfolio-card"
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  cursor: item.caseStudy ? 'pointer' : 'default',
                  background: SURFACE.card,
                  overflow: 'hidden',
                  borderRadius: '20px',
                  height: '100%',
                }}
              >
                {coverImage ? (
                  <Image src={coverImage} alt={item.empresa} fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'rgba(26,26,26,0.15)' }}>
                      photo_camera
                    </span>
                  </div>
                )}

                {!item.caseStudy && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(30,32,33,0.75)',
                      color: 'rgba(245,243,240,0.85)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      padding: '3px 8px',
                      borderRadius: '100px',
                    }}
                  >
                    {t('portfolioPage.comingSoon')}
                  </span>
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
            );

            return (
              <FadeIn key={item.id} delay={0.02 * Math.min(i, 20)} style={{ height: '100%' }}>
                {item.caseStudy ? (
                  <Link href={`/portfolio/${slugify(item.empresa)}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </FadeIn>
            );
          })}
        </div>
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
        padding: '8px 18px',
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
