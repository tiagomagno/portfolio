'use client';

import { useEffect, useState } from 'react';
import FadeIn from './ui/FadeIn';
import { PORTFOLIO_ITEMS, ATUACAO_CATEGORIES, type AtuacaoCategory, type PortfolioItem } from '@/data/portfolio';

const ITEMS_PER_PAGE = 9;

export default function Cases() {
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const filtered = activeFilter
    ? PORTFOLIO_ITEMS.filter((item) => item.atuacao.includes(activeFilter))
    : PORTFOLIO_ITEMS;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleFilter(cat: AtuacaoCategory | null) {
    setActiveFilter(cat);
    setPage(1);
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <section id="cases" style={{ background: '#131313', padding: '96px 0' }}>
      <div className="section-container" style={{ maxWidth: '85vw', margin: '0 auto', padding: '0 24px' }}>

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
                  color: '#ff5625',
                  letterSpacing: 'var(--ls-eyebrow)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Trabalho selecionado
              </span>
              <h2
                style={{
                  fontSize: 'var(--fs-h2)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Impacto real<br />em projetos
              </h2>
            </div>

            <span style={{ fontSize: 'var(--fs-small)', color: '#666', alignSelf: 'flex-end' }}>
              {filtered.length} {filtered.length === 1 ? 'projeto' : 'projetos'}
            </span>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.15}>
          <div
            className="filters-scroll no-scrollbar"
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <FilterButton
              label="Todos"
              active={activeFilter === null}
              onClick={() => handleFilter(null)}
            />
            {ATUACAO_CATEGORIES.map((cat) => (
              <FilterButton
                key={cat}
                label={cat}
                active={activeFilter === cat}
                onClick={() => handleFilter(cat)}
              />
            ))}
          </div>
        </FadeIn>

        {/* Cards Grid */}
        <div
          className="cases-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {paginated.map((item, i) => (
            <FadeIn key={item.id} delay={0.05 * (i % ITEMS_PER_PAGE)} direction="up" style={{ height: '100%' }}>
              <div
                onClick={() => setSelected(item)}
                style={{
                  background: '#1c1b1b',
                  border: '1px solid #2a2a2a',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'border-color 0.2s, transform 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,86,37,0.4)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Image placeholder */}
                <div
                  style={{
                    background: '#0e0e0e',
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '48px', color: '#2a2a2a' }}
                  >
                    photo_camera
                  </span>

                  <span
                    className="card-tag"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: 'var(--fs-tiny)',
                      fontWeight: 800,
                      letterSpacing: 'var(--ls-tiny)',
                      color: '#ff5625',
                      background: 'rgba(255,86,37,0.1)',
                      border: '1px solid rgba(255,86,37,0.3)',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.atuacao[0]}
                  </span>
                </div>

                {/* Content */}
                <div className="card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: 'var(--fs-card-title)', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
                    {item.empresa}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {item.produtos.map((prod) => (
                      <span
                        key={prod}
                        style={{
                          fontSize: 'var(--fs-tiny)',
                          fontWeight: 500,
                          color: '#666',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {prod}{item.produtos.indexOf(prod) < item.produtos.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>

                  <div style={{ flex: 1 }} />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#ff5625',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 700,
                      marginTop: '8px',
                    }}
                  >
                    Ver detalhes
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '48px',
            }}
          >
            <PaginationButton
              icon="chevron_left"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: p === page ? '1px solid #ff5625' : '1px solid #2a2a2a',
                  background: p === page ? 'rgba(255,86,37,0.1)' : '#1c1b1b',
                  color: p === page ? '#ff5625' : '#a8a29e',
                  fontSize: 'var(--fs-small)',
                  fontWeight: p === page ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
            <PaginationButton
              icon="chevron_right"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <PortfolioModal item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

/* ── Portfolio Modal ── */
function PortfolioModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 310,
          width: 'min(92vw, 640px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#1c1b1b',
          border: '1px solid #2a2a2a',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image area */}
        <div
          style={{
            background: '#0e0e0e',
            aspectRatio: '16/7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#2a2a2a' }}>
            photo_camera
          </span>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>

          {/* Atuação badge */}
          <span
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              fontSize: 'var(--fs-tiny)',
              fontWeight: 800,
              letterSpacing: 'var(--ls-tiny)',
              color: '#ff5625',
              background: 'rgba(255,86,37,0.15)',
              border: '1px solid rgba(255,86,37,0.4)',
              padding: '4px 12px',
              borderRadius: '999px',
            }}
          >
            {item.atuacao[0]}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 28px 32px' }}>
          <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.1 }}>
            {item.empresa}
          </h2>

          {/* All atuações */}
          {item.atuacao.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {item.atuacao.map((a) => (
                <span
                  key={a}
                  style={{
                    fontSize: 'var(--fs-tiny)',
                    fontWeight: 700,
                    color: '#ff5625',
                    background: 'rgba(255,86,37,0.08)',
                    border: '1px solid rgba(255,86,37,0.2)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* Produtos */}
          <div style={{ marginBottom: '28px' }}>
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: '#a8a29e',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Produtos entregues
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {item.produtos.map((prod) => (
                <span
                  key={prod}
                  style={{
                    fontSize: 'var(--fs-small)',
                    fontWeight: 500,
                    color: '#e5e2e1',
                    background: '#2a2a2a',
                    border: '1px solid #3a3a3a',
                    padding: '5px 12px',
                    borderRadius: '8px',
                  }}
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>

          {/* Coming soon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,86,37,0.06)',
              border: '1px solid rgba(255,86,37,0.15)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#ff5625', fontSize: '20px', flexShrink: 0 }}>
              hourglass_top
            </span>
            <div>
              <p style={{ fontSize: 'var(--fs-body)', color: '#fff', fontWeight: 600, margin: '0 0 4px' }}>
                Detalhamento em produção
              </p>
              <p style={{ fontSize: 'var(--fs-small)', color: '#a8a29e', margin: 0, lineHeight: 1.5 }}>
                Em breve este case terá descrição completa, imagens e resultados do projeto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 'var(--fs-small)',
        fontWeight: active ? 700 : 500,
        color: active ? '#ff5625' : '#a8a29e',
        background: active ? 'rgba(255,86,37,0.1)' : '#1c1b1b',
        border: active ? '1px solid rgba(255,86,37,0.4)' : '1px solid #2a2a2a',
        padding: '6px 16px',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </button>
  );
}

function PaginationButton({
  icon,
  disabled,
  onClick,
}: {
  icon: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
        background: '#1c1b1b',
        color: disabled ? '#3a3a3a' : '#a8a29e',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
    </button>
  );
}
