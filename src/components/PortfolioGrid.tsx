'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PORTFOLIO_ITEMS, ATUACAO_CATEGORIES, slugify, type AtuacaoCategory } from '@/data/portfolio';
import type { CaseAssetOverrides } from '@/data/caseAssets';
import { useLang } from '@/context/LangContext';
import { CATEGORY_KEYS } from '@/lib/translations';
import { SURFACE } from '@/lib/surfaces';
import FadeIn from './ui/FadeIn';
import PortfolioCard from './PortfolioCard';

export default function PortfolioGrid({
  overrides = {},
  hiddenSlugs = [],
}: {
  overrides?: Record<string, CaseAssetOverrides>;
  hiddenSlugs?: string[];
}) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);

  const hidden = new Set(hiddenSlugs);
  const visibleItems = PORTFOLIO_ITEMS.filter((item) => !hidden.has(slugify(item.empresa))).map((item) => {
    const override = overrides[slugify(item.empresa)]?.atuacao;
    return override ? { ...item, atuacao: override } : item;
  });
  const filtered = activeFilter ? visibleItems.filter((item) => item.atuacao.includes(activeFilter)) : visibleItems;

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
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '4px' }}>
              {t('portfolioPage.filterLabel')}
            </span>
            <FilterPill label={t('cases.filterAll')} active={activeFilter === null} onClick={() => setActiveFilter(null)} />
            {ATUACAO_CATEGORIES.map((cat) => (
              <FilterPill key={cat} label={tCategory(cat)} active={activeFilter === cat} onClick={() => setActiveFilter(cat)} />
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(26,26,26,0.65)', whiteSpace: 'nowrap' }}>
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
          .portfolio-card-v2-link { display: block; text-decoration: none; height: 100%; }
          .portfolio-card-v2-image img {
            filter: saturate(0) contrast(1.02);
            transition: filter 0.5s ease, transform 0.5s ease;
          }
          .portfolio-card-v2-link:hover .portfolio-card-v2-image img,
          .portfolio-card-v2-static:hover .portfolio-card-v2-image img {
            filter: saturate(1) contrast(1);
            transform: scale(1.04);
          }
        `}</style>

        <div className="portfolio-full-grid">
          {filtered.map((item, i) => {
            const coverImage = overrides[slugify(item.empresa)]?.coverImage ?? item.image;
            const card = (
              <PortfolioCard
                item={item}
                coverImage={coverImage}
                categoryLabel={tCategory}
                comingSoonLabel={t('portfolioPage.comingSoon')}
              />
            );

            return (
              <FadeIn key={item.id} delay={0.02 * Math.min(i, 20)} style={{ height: '100%' }}>
                {item.caseStudy ? (
                  <Link href={`/portfolio/${slugify(item.empresa)}`} className="portfolio-card-v2-link">
                    {card}
                  </Link>
                ) : (
                  <div className="portfolio-card-v2-static" style={{ height: '100%' }}>
                    {card}
                  </div>
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
        background: active ? 'var(--color-primary-text)' : 'transparent',
        border: active ? '1px solid var(--color-primary-text)' : 'none',
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
