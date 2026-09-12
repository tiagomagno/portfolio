'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import FadeIn from './ui/FadeIn';
import PortfolioCard from './PortfolioCard';
import { useLang } from '@/context/LangContext';
import { PORTFOLIO_ITEMS, slugify } from '@/data/portfolio';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CaseAssetOverrides } from '@/data/caseAssets';
import { CATEGORY_KEYS } from '@/lib/translations';
import { SURFACE } from '@/lib/surfaces';

// Só cases com case study completo entram no preview da Home — sempre clicáveis,
// nunca levam a um card "em breve". A lista completa (com os demais) fica em /portfolio.
const FEATURED_CASES = PORTFOLIO_ITEMS.filter((item) => item.caseStudy);

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// No mobile a página do carrossel é 2 colunas x 1 linha (swipe mais suave, sem
// precisar rolar um par empilhado verticalmente); tablet/desktop seguem 2 linhas.
function useCarouselLayout() {
  const [layout, setLayout] = useState({ columns: 3, rows: 2 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 560) setLayout({ columns: 2, rows: 1 });
      else if (w <= 900) setLayout({ columns: 2, rows: 2 });
      else setLayout({ columns: 3, rows: 2 });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return layout;
}

export default function Cases({
  overrides = {},
  hiddenSlugs = [],
}: {
  overrides?: Record<string, CaseAssetOverrides>;
  hiddenSlugs?: string[];
}) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);

  const hidden = new Set(hiddenSlugs);
  const visibleFeaturedCases = useMemo(
    () =>
      FEATURED_CASES.filter((item) => !hidden.has(slugify(item.empresa))).map((item) => {
        const override = overrides[slugify(item.empresa)]?.atuacao;
        return override ? { ...item, atuacao: override } : item;
      }),
    [hiddenSlugs, overrides]
  );

  // Ordem embaralhada a cada carregamento da página. Começa com a ordem original
  // (idêntica no server e no client) e só embaralha depois de montar, pra não gerar
  // um HTML diferente do que o React espera na hidratação.
  const [shuffledCases, setShuffledCases] = useState(visibleFeaturedCases);
  useEffect(() => {
    setShuffledCases(shuffle(visibleFeaturedCases));
  }, [visibleFeaturedCases]);

  const { columns, rows } = useCarouselLayout();
  const itemsPerPage = columns * rows;
  const pages = useMemo(() => chunk(shuffledCases, itemsPerPage), [shuffledCases, itemsPerPage]);
  const totalPages = pages.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const dragDistance = useRef(0);
  const activePointerId = useRef<number | null>(null);

  useEffect(() => {
    setPageIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [itemsPerPage]);

  const goToPage = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(totalPages - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setPageIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !trackRef.current) return;
    isDragging.current = true;
    dragDistance.current = 0;
    dragStartX.current = e.clientX;
    dragStartScroll.current = trackRef.current.scrollLeft;
    activePointerId.current = e.pointerId;
    // Não captura o ponteiro aqui ainda: setPointerCapture logo no pointerdown faz o clique
    // (mesmo parado, sem arrastar nada) mirar o track em vez do link do card por baixo do dedo/
    // cursor — só captura de fato depois que handlePointerMove confirma que é um arrasto real.
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(delta);
    if (dragDistance.current > 6 && activePointerId.current !== null && !trackRef.current.hasPointerCapture(activePointerId.current)) {
      trackRef.current.setPointerCapture(activePointerId.current);
    }
    trackRef.current.scrollLeft = dragStartScroll.current - delta;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    if (trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    activePointerId.current = null;
  };

  // O arrasto do carrossel usa o mesmo ponteiro do clique nos cards — sem isso, qualquer
  // pointerdown/up (mesmo um clique parado, com o mínimo de jitter do mouse) podia disparar
  // o click sintético do <Link> só depois de já ter "arrastado" alguns pixels, fazendo o
  // card parecer não-clicável. Só suprime o click quando o arrasto foi real.
  const handleTrackClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

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
                  color: 'var(--color-primary-text)',
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
                  fontSize: 'clamp(32px, 4.5vw, 56px)',
                  fontWeight: 900,
                  color: '#1a1a1a',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {t('cases.heading')}
              </h2>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <CarouselArrow direction="left" disabled={pageIndex === 0} onClick={() => goToPage(pageIndex - 1)} />
                <CarouselArrow direction="right" disabled={pageIndex >= totalPages - 1} onClick={() => goToPage(pageIndex + 1)} />
              </div>
            )}
          </div>
        </FadeIn>

        <style>{`
          .cases-carousel-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }
          .cases-carousel-track::-webkit-scrollbar { display: none; }
          .cases-carousel-page {
            flex: 0 0 100%;
            scroll-snap-align: start;
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            grid-auto-rows: 1fr;
            gap: 16px;
          }
          .portfolio-card-v2-link { display: block; text-decoration: none; height: 100%; }
          .portfolio-card-v2-image img {
            filter: saturate(0) contrast(1.02);
            transition: filter 0.5s ease, transform 0.5s ease;
          }
          .portfolio-card-v2-link:hover .portfolio-card-v2-image img {
            filter: saturate(1) contrast(1);
            transform: scale(1.04);
          }
        `}</style>

        <div
          ref={trackRef}
          className="cases-carousel-track"
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={handleTrackClickCapture}
          style={{ cursor: 'grab' }}
        >
          {pages.map((pageItems, pageI) => (
            <div key={pageI} className="cases-carousel-page">
              {pageItems.map((item, i) => {
                const coverImage = overrides[slugify(item.empresa)]?.coverImage ?? item.image;
                return (
                  <FadeIn key={item.id} delay={0.05 * i} style={{ height: '100%' }}>
                    <Link href={`/portfolio/${slugify(item.empresa)}`} className="portfolio-card-v2-link">
                      <PortfolioCard item={item} coverImage={coverImage} categoryLabel={tCategory} priority={pageI === 0 && i === 0} />
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          ))}
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
                color: 'var(--color-primary-text)',
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

function CarouselArrow({ direction, disabled, onClick }: { direction: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Anterior' : 'Próximo'}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(26,26,26,0.15)',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {direction === 'left' ? (
        <ChevronLeft size={20} color="rgba(26,26,26,0.7)" />
      ) : (
        <ChevronRight size={20} color="rgba(26,26,26,0.7)" />
      )}
    </button>
  );
}
