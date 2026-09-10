'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AtuacaoCategory } from '@/data/portfolio';
import CaseAssetEditor from './[slug]/CaseAssetEditor';

export interface CaseRow {
  id: number;
  empresa: string;
  slug: string;
  atuacao: AtuacaoCategory[];
  fallbackImage?: string;
  hasCover: boolean;
  hasHero: boolean;
  galleryCount: number;
}

export default function CasesTable({ rows, categories }: { rows: CaseRow[]; categories: AtuacaoCategory[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);
  const [selected, setSelected] = useState<CaseRow | null>(null);

  const filtered = useMemo(
    () => (activeFilter ? rows.filter((r) => r.atuacao.includes(activeFilter)) : rows),
    [rows, activeFilter]
  );

  function closePanel() {
    setSelected(null);
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <FilterPill label="Todas" active={activeFilter === null} onClick={() => setActiveFilter(null)} />
        {categories.map((cat) => (
          <FilterPill key={cat} label={cat} active={activeFilter === cat} onClick={() => setActiveFilter(cat)} />
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Th>Case</Th>
              <Th>Categoria</Th>
              <Th align="center">Capa</Th>
              <Th align="center">Topo</Th>
              <Th align="center">Galeria</Th>
              <Th align="right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} style={i < filtered.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}>
                <Td>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{row.empresa}</span>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {row.atuacao.map((cat) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'rgba(26,26,26,0.55)',
                          background: 'rgba(26,26,26,0.06)',
                          padding: '3px 8px',
                          borderRadius: '100px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </Td>
                <Td align="center">
                  <Dot ok={row.hasCover} />
                </Td>
                <Td align="center">
                  <Dot ok={row.hasHero} />
                </Td>
                <Td align="center">
                  <span style={{ color: row.galleryCount > 0 ? '#166534' : 'rgba(26,26,26,0.4)', fontWeight: 600 }}>
                    {row.galleryCount || '—'}
                  </span>
                </Td>
                <Td align="right">
                  <button
                    onClick={() => setSelected(row)}
                    style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Editar
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <>
          <div
            onClick={closePanel}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
          />
          <div
            data-lenis-prevent
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 'min(560px, 100vw)',
              background: '#fff',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
              zIndex: 41,
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{selected.empresa}</h2>
              <button
                onClick={closePanel}
                aria-label="Fechar"
                style={{
                  background: 'var(--color-bg-high)',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#1a1a1a',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
            <CaseAssetEditor slug={selected.slug} fallbackImage={selected.fallbackImage} />
          </div>
        </>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: '12px',
        fontWeight: 600,
        color: active ? '#fff' : 'rgba(26,26,26,0.6)',
        background: active ? 'var(--color-primary)' : '#fff',
        border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
        padding: '7px 16px',
        borderRadius: '100px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <th style={{ textAlign: align, padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </th>
  );
}

function Td({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <td style={{ textAlign: align, padding: '12px 16px' }}>{children}</td>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: ok ? '#22c55e' : 'rgba(26,26,26,0.15)',
      }}
      aria-label={ok ? 'Definida' : 'Não definida'}
    />
  );
}
