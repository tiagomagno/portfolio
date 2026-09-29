'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import FadeIn from './ui/FadeIn';
import PortfolioCard from './PortfolioCard';
import { useLang } from '@/context/LangContext';
import type { PortfolioItem } from '@/data/portfolio';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORY_KEYS } from '@/lib/translations';

// Movimento mínimo (px) pra um toque virar arrasto; abaixo disso ainda conta como clique no card.
const DRAG_THRESHOLD = 10;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Quantos cards ficam totalmente visíveis por vez — o resto da largura vira o
// "peek" nas bordas (parcialmente visível, esmaecido pela máscara de gradiente).
// Modos: celular (1 card por vez, sem peek), tablet (2 cards cheios, sem peek) e desktop (2 cheios + peeks).
type CarouselMode = 'phone' | 'tablet' | 'desktop';
function useItemsPerView(): { itemsPerView: number; mode: CarouselMode } {
  const [mode, setMode] = useState<CarouselMode>('desktop');
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setMode(w <= 560 ? 'phone' : w <= 1024 ? 'tablet' : 'desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return { itemsPerView: mode === 'phone' ? 1 : 2, mode };
}

export default function Cases({ items }: { items: PortfolioItem[] }) {
  const { t } = useLang();
  const tCategory = (cat: string) => t(CATEGORY_KEYS[cat] ?? cat);

  // Só cases com case study completo entram no preview da Home — sempre clicáveis,
  // nunca levam a um card "em breve". A lista completa (com os demais) fica em /portfolio.
  // Selecionados pra home aparecem na ordem definida no admin (homeOrder, menor primeiro);
  // sem nenhum selecionado, mantém o comportamento antigo (mostra todos, ordem de criação).
  const visibleFeaturedCases = useMemo(() => {
    const pool = items.filter((item) => item.caseStudy);
    const selected = pool.filter((item) => item.featuredOnHome).sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0));
    return selected.length > 0 ? selected : pool;
  }, [items]);

  const { itemsPerView, mode } = useItemsPerView();

  // Carrossel infinito: o track renderiza a lista 3x (anterior/atual/próxima),
  // sempre parte no início da cópia do meio e, ao chegar perto do fim de uma
  // ponta, salta silenciosamente (sem animação) pro mesmo ponto na cópia do
  // meio — dá a sensação de loop sem fim em qualquer direção (arrasto ou seta).
  const trackItems = useMemo(
    () => [...visibleFeaturedCases, ...visibleFeaturedCases, ...visibleFeaturedCases],
    [visibleFeaturedCases]
  );
  const setCount = visibleFeaturedCases.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const dragDistance = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Velocidade do cursor (px/ms) na última amostra de pointermove — usada só pra dar
  // inércia ao soltar o arrasto (sem isso o carrossel travava seco na hora do "solta").
  const dragVelocity = useRef(0);
  const lastMoveTime = useRef(0);
  const lastMoveX = useRef(0);
  const momentumFrame = useRef<number | null>(null);

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
    track.scrollLeft = mode === 'desktop' ? third - cardStep : third - 24;
  }, [setCount, mode]);

  useEffect(() => {
    return () => {
      if (momentumFrame.current) cancelAnimationFrame(momentumFrame.current);
    };
  }, []);

  // As 3 cópias têm conteúdo idêntico, então saltar exatamente 1/3 é invisível. Também roda
  // durante o arrasto e a inércia (não só depois de parar) pra o usuário nunca chegar na borda
  // das cópias; nesse caso a base do arrasto sofre o mesmo salto, senão o próximo movimento
  // devolveria o carrossel pra posição antiga.
  const wrapIfNeeded = () => {
    const track = trackRef.current;
    if (!track || setCount === 0) return;
    const third = track.scrollWidth / 3;
    const shift = track.scrollLeft < third * 0.5 ? third : track.scrollLeft > third * 1.5 ? -third : 0;
    if (shift !== 0) {
      track.scrollLeft += shift;
      dragStartScroll.current += shift;
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
    // Sem snap, a posição depois de um arrasto livre é qualquer uma; a seta alinha à grade dos
    // cards (no mobile a grade começa 24px antes do card, igual à posição inicial).
    const gridOffset = mode === 'desktop' ? 0 : 24;
    const base = Math.round((track.scrollLeft + gridOffset) / cardStep) * cardStep - gridOffset;
    track.scrollTo({ left: base + direction * cardStep * itemsPerView, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !trackRef.current) return;
    if (momentumFrame.current) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
    isDragging.current = true;
    dragDistance.current = 0;
    dragStartX.current = e.clientX;
    dragStartScroll.current = trackRef.current.scrollLeft;
    activePointerId.current = e.pointerId;
    dragVelocity.current = 0;
    lastMoveTime.current = e.timeStamp;
    lastMoveX.current = e.clientX;
    // Não captura o ponteiro aqui ainda: setPointerCapture logo no pointerdown faz o clique
    // (mesmo parado, sem arrastar nada) mirar o track em vez do link do card por baixo do dedo/
    // cursor — só captura de fato depois que handlePointerMove confirma que é um arrasto real.
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const delta = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(delta);
    if (dragDistance.current > DRAG_THRESHOLD && activePointerId.current !== null && !trackRef.current.hasPointerCapture(activePointerId.current)) {
      trackRef.current.setPointerCapture(activePointerId.current);
      trackRef.current.classList.add('is-dragging');
    }
    trackRef.current.scrollLeft = dragStartScroll.current - delta;
    wrapIfNeeded();

    // Velocidade instantânea (px/ms) desde a última amostra — descarta amostras com dt
    // ~0 (alguns navegadores disparam pointermove duplicado no mesmo frame) pra não gerar
    // picos irreais de velocidade que fariam a inércia disparar longe demais.
    const dt = e.timeStamp - lastMoveTime.current;
    if (dt > 4) {
      dragVelocity.current = (e.clientX - lastMoveX.current) / dt;
      lastMoveTime.current = e.timeStamp;
      lastMoveX.current = e.clientX;
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    if (trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    activePointerId.current = null;

    // Inércia: continua deslizando na direção do arrasto, desacelerando, em vez de
    // travar seco no ponto exato em que o botão do mouse foi solto.
    // A classe is-dragging (que desliga o scroll-snap) fica até a inércia acabar: com o snap
    // religado durante o deslize, cada scrollLeft escrito aqui era corrigido pelo snap do
    // navegador e os dois brigavam, deixando o movimento entrecortado.
    const track = trackRef.current;
    let velocity = dragVelocity.current;
    const glide = (lastTime: number) => (time: number) => {
      const dt = Math.min(time - lastTime, 32);
      velocity *= Math.pow(0.88, dt / 16);
      if (Math.abs(velocity) < 0.02) {
        momentumFrame.current = null;
        track.classList.remove('is-dragging');
        return;
      }
      track.scrollLeft -= velocity * dt;
      wrapIfNeeded();
      momentumFrame.current = requestAnimationFrame(glide(time));
    };
    if (Math.abs(velocity) > 0.05 && !prefersReducedMotion()) {
      momentumFrame.current = requestAnimationFrame(glide(performance.now()));
    } else {
      track.classList.remove('is-dragging');
    }
  };

  // O arrasto do carrossel usa o mesmo ponteiro do clique nos cards — sem isso, qualquer
  // pointerdown/up (mesmo um clique parado, com o mínimo de jitter do mouse) podia disparar
  // o click sintético do <Link> só depois de já ter "arrastado" alguns pixels, fazendo o
  // card parecer não-clicável. Só suprime o click quando o arrasto foi real.
  const handleTrackClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="cases" style={{ background: 'transparent', padding: 'var(--section-pad-y) 0' }}>
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
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                  margin: '0 0 16px',
                  maxWidth: '760px',
                }}
              >
                {t('cases.heading')}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, maxWidth: '640px' }}>
                {t('cases.intro')}
              </p>
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
          scrollbar-width: none;
          -webkit-user-drag: none;
        }
        .cases-carousel-track::-webkit-scrollbar { display: none; }
        ${mode === 'tablet' ? '.cases-carousel-track { scroll-padding: 0 24px; }' : ''}
        /* Snap só em toque, onde o navegador já faz arrasto e inércia nativos. Com mouse o arrasto
           é nosso (JS + inércia) e o snap "puxando" o carrossel pras bordas dos cards brigava com
           o movimento e o deixava travado. */
        @media (pointer: coarse) {
          .cases-carousel-track { scroll-snap-type: x proximity; }
        }
        .cases-carousel-track.is-dragging { scroll-snap-type: none; user-select: none; cursor: grabbing; }
        .cases-carousel-track.is-dragging * { pointer-events: none; }
        .cases-carousel-track img { -webkit-user-drag: none; user-drag: none; }
        .cases-carousel-card {
          /* ${itemsPerView} colunas cheias + 1 coluna esmaecida ("peek") de cada lado,
             todas do mesmo tamanho — ${itemsPerView + 2} colunas iguais ao todo. */
          flex: 0 0 ${mode === 'tablet' ? 'calc((100vw - 48px - 16px) / 2)' : `calc((100% - 16px * (${itemsPerView + 2} - 1)) / ${itemsPerView + 2})`};
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
        .portfolio-card-v2-link { display: block; text-decoration: none; height: 100%; transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
        .portfolio-card-v2-link:active { transform: scale(0.98); }
        /* Cinza por padrão em mouse, cor no hover. A desaturação vem de uma camada cinza com
           mix-blend-mode: saturation por cima da imagem; só o opacity dela anima (compositor),
           em vez de animar filter na imagem inteira. */
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
          .portfolio-card-v2-link:focus-visible .portfolio-card-v2-image::after {
            opacity: 0;
          }
          .portfolio-card-v2-link:hover .portfolio-card-v2-image img {
            transform: scale(1.04);
          }
        }
        .carousel-arrow { transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1), opacity 0.15s; }
        .carousel-arrow:active:not(:disabled) { transform: scale(0.95); }
      `}</style>

      {/* Full-bleed: sai do section-container de propósito, pra a máscara de
          esmaecimento nas bordas usar 100% da largura da tela. */}
      <div className="cases-carousel-viewport" style={mode === 'tablet' ? { WebkitMaskImage: 'none', maskImage: 'none' } : undefined}>
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
            return (
              <div key={`${item.id}-${idx}`} className="cases-carousel-card">
                {/* Sem FadeIn aqui de propósito: dezenas de reveals dentro do scroller disputam a
                    thread principal enquanto o usuário arrasta, e o carrossel já se move por si. */}
                <div style={{ height: '100%' }}>
                  <Link href={`/portfolio/${item.slug}`} className="portfolio-card-v2-link">
                      <PortfolioCard item={item} coverImage={item.image} categoryLabel={tCategory} priority={idx === setCount} />
                    </Link>
                  </div>
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
              @media (hover: hover) and (pointer: fine) {
                .view-all-link:hover .view-all-arrow { transform: translateX(4px); }
              }
            `}</style>
            <Link
              href="/portfolio"
              className="view-all-link cta-ghost"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-primary-text)',
                padding: '13px 24px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.15)',
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
      className="carousel-arrow"
      aria-label={direction === 'left' ? 'Anterior' : 'Próximo'}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {direction === 'left' ? (
        <ChevronLeft size={20} color="rgba(255,255,255,0.7)" />
      ) : (
        <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
      )}
    </button>
  );
}
