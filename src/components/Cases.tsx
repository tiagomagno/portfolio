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

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Quantos cards ficam totalmente visíveis por vez — o resto da largura vira o
// "peek" nas bordas (parcialmente visível, esmaecido pela máscara de gradiente).
function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(2);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 560) setItemsPerView(1);
      else setItemsPerView(2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return itemsPerView;
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
  const visibleFeaturedCases = useMemo(() => {
    const pool = FEATURED_CASES.filter((item) => !hidden.has(slugify(item.empresa)));
    const featuredSlugs = new Set(
      Object.entries(overrides)
        .filter(([, o]) => o.featuredOnHome)
        .map(([slug]) => slug)
    );
    // Enquanto o admin não selecionar nenhum case pra home (/admin/cases), mantém o
    // comportamento antigo (mostra todos) em vez de deixar o carrossel vazio.
    const selected = featuredSlugs.size > 0 ? pool.filter((item) => featuredSlugs.has(slugify(item.empresa))) : pool;
    return selected.map((item) => {
      const override = overrides[slugify(item.empresa)]?.atuacao;
      return override ? { ...item, atuacao: override } : item;
    });
  }, [hiddenSlugs, overrides]);

  // Ordem embaralhada a cada carregamento da página. Começa com a ordem original
  // (idêntica no server e no client) e só embaralha depois de montar, pra não gerar
  // um HTML diferente do que o React espera na hidratação.
  const [shuffledCases, setShuffledCases] = useState(visibleFeaturedCases);
  useEffect(() => {
    setShuffledCases(shuffle(visibleFeaturedCases));
  }, [visibleFeaturedCases]);

  const itemsPerView = useItemsPerView();

  // Carrossel infinito: o track renderiza a lista 3x (anterior/atual/próxima),
  // sempre parte no início da cópia do meio e, ao chegar perto do fim de uma
  // ponta, salta silenciosamente (sem animação) pro mesmo ponto na cópia do
  // meio — dá a sensação de loop sem fim em qualquer direção (arrasto ou seta).
  const trackItems = useMemo(
    () => [...shuffledCases, ...shuffledCases, ...shuffledCases],
    [shuffledCases]
  );
  const setCount = shuffledCases.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const dragDistance = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Posiciona o track no início da cópia do meio. Em telas com peek (2/3 colunas
  // cheias), desloca uma coluna pra trás, assim já nasce com uma coluna esmaecida
  // "espiando" nos dois lados (peek — cheia — cheia — cheia — peek), em vez de
  // começar exatamente no início de um card. No mobile (1 card, sem peek — o card
  // ocupa a tela toda respeitando as margens), começa direto no primeiro card.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || setCount === 0) return;
    const third = track.scrollWidth / 3;
    const cardStep = third / setCount;
    track.scrollLeft = itemsPerView === 1 ? third - 24 : third - cardStep;
  }, [setCount, itemsPerView]);

  const wrapIfNeeded = () => {
    const track = trackRef.current;
    if (!track || setCount === 0) return;
    const third = track.scrollWidth / 3;
    if (track.scrollLeft < third * 0.5) {
      track.scrollLeft += third;
    } else if (track.scrollLeft > third * 1.5) {
      track.scrollLeft -= third;
    }
  };

  const handleScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(wrapIfNeeded, 120);
  };

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track || setCount === 0) return;
    const cardStep = (track.scrollWidth / 3) / setCount;
    track.scrollTo({ left: track.scrollLeft + direction * cardStep * itemsPerView, behavior: 'smooth' });
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
      trackRef.current.classList.add('is-dragging');
    }
    trackRef.current.scrollLeft = dragStartScroll.current - delta;
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    if (trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    trackRef.current.classList.remove('is-dragging');
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
    <section id="cases" style={{ background: SURFACE.base, padding: 'var(--section-pad-y) 0' }}>
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
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 900,
                  color: '#1a1a1a',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {t('cases.heading')}
              </h2>
            </div>

            {setCount > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <CarouselArrow direction="left" disabled={false} onClick={() => step(-1)} />
                <CarouselArrow direction="right" disabled={false} onClick={() => step(1)} />
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      <style>{`
        .cases-carousel-viewport {
          -webkit-mask-image: linear-gradient(to right, transparent 0, black 120px, black calc(100% - 120px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, black 120px, black calc(100% - 120px), transparent 100%);
        }
        .cases-carousel-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x proximity;
          scrollbar-width: none;
          -webkit-user-drag: none;
        }
        .cases-carousel-track::-webkit-scrollbar { display: none; }
        .cases-carousel-track.is-dragging { scroll-snap-type: none; user-select: none; cursor: grabbing; }
        .cases-carousel-track.is-dragging * { pointer-events: none; }
        .cases-carousel-track img { -webkit-user-drag: none; user-drag: none; }
        .cases-carousel-card {
          /* ${itemsPerView} colunas cheias + 1 coluna esmaecida ("peek") de cada lado,
             todas do mesmo tamanho — ${itemsPerView + 2} colunas iguais ao todo. */
          flex: 0 0 calc((100% - 16px * (${itemsPerView + 2} - 1)) / ${itemsPerView + 2});
          scroll-snap-align: start;
        }
        /* Mobile (1 item por vez): card ocupa 100% da tela respeitando as mesmas
           margens de 24px do resto do site, sem peek nem esmaecimento lateral —
           scroll-padding desloca o ponto de encaixe em vez de um card menor. */
        @media (max-width: 560px) {
          .cases-carousel-card {
            flex: 0 0 calc(100vw - 48px) !important;
            scroll-snap-align: start !important;
          }
          .cases-carousel-track {
            scroll-padding: 0 24px;
          }
          .cases-carousel-viewport {
            -webkit-mask-image: none;
            mask-image: none;
          }
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

      {/* Full-bleed: sai do section-container de propósito, pra a máscara de
          esmaecimento nas bordas usar 100% da largura da tela. */}
      <div className="cases-carousel-viewport">
        <div
          ref={trackRef}
          className="cases-carousel-track"
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={handleTrackClickCapture}
          onDragStart={(e) => e.preventDefault()}
          style={{ cursor: 'grab' }}
        >
          {trackItems.map((item, idx) => {
            const coverImage = overrides[slugify(item.empresa)]?.coverImage ?? item.image;
            return (
              <div key={`${item.id}-${idx}`} className="cases-carousel-card">
                <FadeIn delay={0.02 * (idx % setCount)} style={{ height: '100%' }}>
                  <Link href={`/portfolio/${slugify(item.empresa)}`} className="portfolio-card-v2-link">
                      <PortfolioCard item={item} coverImage={coverImage} categoryLabel={tCategory} priority={idx === setCount} />
                    </Link>
                  </FadeIn>
                </div>
              );
            })}
          </div>
        </div>

      <div className="section-container" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px' }}>
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
                padding: '13px 24px',
                borderRadius: '10px',
                border: '1px solid rgba(26,26,26,0.15)',
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
