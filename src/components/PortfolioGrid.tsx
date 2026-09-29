'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ATUACAO_CATEGORIES, type AtuacaoCategory, type PortfolioItem } from '@/data/portfolio';
import { useLang } from '@/context/LangContext';
import { CATEGORY_KEYS } from '@/lib/translations';
import FadeIn from './ui/FadeIn';
import PortfolioCard from './PortfolioCard';

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);

  const filtered = activeFilter ? items.filter((item) => item.atuacao.includes(activeFilter)) : items;

  return (
    <section style={{ background: 'transparent', padding: '24px 0 100px' }}>
      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
        <FadeIn delay={0.05}>
          <div
            className="filters-scroll no-scrollbar"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}
          >
            <style>{`
              @media (hover: hover) and (pointer: fine) {
                .filter-pill[data-active="false"]:hover {
                  background: rgba(255,255,255,0.07) !important;
                  color: rgba(255,255,255,0.85) !important;
                }
              }
            `}</style>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '4px' }}>
              {t('portfolioPage.filterLabel')}
            </span>
            <FilterPill label={t('cases.filterAll')} active={activeFilter === null} onClick={() => setActiveFilter(null)} />
            {ATUACAO_CATEGORIES.map((cat) => (
              <FilterPill key={cat} label={tCategory(cat)} active={activeFilter === cat} onClick={() => setActiveFilter(cat)} />
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
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
          .portfolio-card-v2-link { display: block; text-decoration: none; height: 100%; transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
          .portfolio-card-v2-link:active { transform: scale(0.98); }
          .filter-pill:active { transform: scale(0.97); }
          /* Cinza por padrão em mouse, cor no hover: camada cinza com mix-blend-mode: saturation
             cujo opacity anima (compositor), em vez de animar filter na imagem. */
          .portfolio-card-v2-image { isolation: isolate; }
          .portfolio-card-v2-image img {
            transition: transform 0.5s ease;
          }
          @media (hover: hover) and (pointer: fine) {
            .portfolio-card-v2-image::after {
              content: '';
              position: absolute;
              inset: 0;
              background: #808080;
              mix-blend-mode: saturation;
              opacity: 1;
              pointer-events: none;
              transition: opacity 0.5s ease;
            }
            .portfolio-card-v2-link:hover .portfolio-card-v2-image::after,
            .portfolio-card-v2-link:focus-visible .portfolio-card-v2-image::after,
            .portfolio-card-v2-static:hover .portfolio-card-v2-image::after {
              opacity: 0;
            }
            .portfolio-card-v2-link:hover .portfolio-card-v2-image img,
            .portfolio-card-v2-static:hover .portfolio-card-v2-image img {
              transform: scale(1.04);
            }
          }
        `}</style>

        <div className="portfolio-full-grid">
          {filtered.map((item, i) => {
            const card = (
              <PortfolioCard
                item={item}
                coverImage={item.image}
                categoryLabel={tCategory}
                comingSoonLabel={t('portfolioPage.comingSoon')}
              />
            );

            return (
              <FadeIn key={item.id} delay={0.02 * Math.min(i, 20)} style={{ height: '100%' }}>
                {item.caseStudy ? (
                  <Link href={`/portfolio/${item.slug}`} className="portfolio-card-v2-link">
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
        color: active ? '#000' : 'rgba(255,255,255,0.6)',
        background: active ? 'var(--color-primary-text)' : 'transparent',
        border: active ? '1px solid var(--color-primary-text)' : 'none',
        padding: '8px 18px',
        borderRadius: '100px',
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s, color 0.15s, transform 0.12s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
