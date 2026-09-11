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
  visible: boolean;
  removedAt: string | null;
}

export default function CasesTable({ rows, categories }: { rows: CaseRow[]; categories: AtuacaoCategory[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<AtuacaoCategory | null>(null);
  const [selected, setSelected] = useState<CaseRow | null>(null);
  const [showRemoved, setShowRemoved] = useState(false);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);

  const removedCount = useMemo(() => rows.filter((r) => r.removedAt).length, [rows]);

  const filtered = useMemo(() => {
    let list = showRemoved ? rows.filter((r) => r.removedAt) : rows.filter((r) => !r.removedAt);
    if (activeFilter) list = list.filter((r) => r.atuacao.includes(activeFilter));
    return list;
  }, [rows, activeFilter, showRemoved]);

  function closePanel() {
    setSelected(null);
    router.refresh();
  }

  async function updateVisibility(slug: string, visible: boolean, removed: boolean) {
    setUpdatingSlug(slug);
    try {
      await fetch(`/api/admin/portfolio-visibility/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible, removed }),
      });
      router.refresh();
    } finally {
      setUpdatingSlug(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <FilterPill label="Todas" active={activeFilter === null} onClick={() => setActiveFilter(null)} />
        {categories.map((cat) => (
          <FilterPill key={cat} label={cat} active={activeFilter === cat} onClick={() => setActiveFilter(cat)} />
        ))}
        <button
          onClick={() => setShowRemoved((v) => !v)}
          style={{
            marginLeft: 'auto',
            fontSize: '12px',
            fontWeight: 600,
            color: showRemoved ? '#fff' : 'rgba(26,26,26,0.55)',
            background: showRemoved ? '#b91c1c' : 'transparent',
            border: showRemoved ? '1px solid #b91c1c' : '1px solid var(--color-border)',
            padding: '7px 16px',
            borderRadius: '100px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {showRemoved ? 'Voltar aos ativos' : `Excluídos (${removedCount})`}
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Th>Case</Th>
              <Th>Categoria</Th>
              <Th align="center">Status</Th>
              <Th align="center">Capa</Th>
              <Th align="center">Topo</Th>
              <Th align="center">Galeria</Th>
              <Th align="right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td>
                  <span style={{ color: 'rgba(26,26,26,0.4)' }}>
                    {showRemoved ? 'Nenhum case excluído.' : 'Nenhum case encontrado.'}
                  </span>
                </Td>
              </tr>
            )}
            {filtered.map((row, i) => (
              <tr key={row.id} style={i < filtered.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}>
                <Td>
                  <span style={{ fontWeight: 600, color: '#1a1a1a', opacity: row.visible ? 1 : 0.5 }}>{row.empresa}</span>
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
                  <StatusBadge visible={row.visible} removed={!!row.removedAt} />
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
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {row.removedAt ? (
                      <ActionButton
                        label="Restaurar"
                        disabled={updatingSlug === row.slug}
                        onClick={() => updateVisibility(row.slug, true, false)}
                      />
                    ) : (
                      <>
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
                        <ActionButton
                          label={row.visible ? 'Desativar' : 'Ativar'}
                          disabled={updatingSlug === row.slug}
                          onClick={() => updateVisibility(row.slug, !row.visible, false)}
                        />
                        <ActionButton
                          label="Excluir"
                          danger
                          disabled={updatingSlug === row.slug}
                          onClick={() => {
                            if (confirm(`Excluir "${row.empresa}" do site? Pode ser restaurado depois em "Excluídos".`)) {
                              updateVisibility(row.slug, false, true);
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
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

function StatusBadge({ visible, removed }: { visible: boolean; removed: boolean }) {
  const label = removed ? 'Excluído' : visible ? 'Ativo' : 'Desativado';
  const color = removed ? '#b91c1c' : visible ? '#166534' : 'rgba(26,26,26,0.5)';
  const bg = removed ? 'rgba(185,28,28,0.1)' : visible ? 'rgba(22,101,52,0.1)' : 'rgba(26,26,26,0.06)';
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: 700,
        color,
        background: bg,
        padding: '3px 10px',
        borderRadius: '100px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '8px',
        border: danger ? '1px solid rgba(185,28,28,0.3)' : '1px solid var(--color-border)',
        background: '#fff',
        fontSize: '12px',
        fontWeight: 600,
        color: danger ? '#b91c1c' : '#1a1a1a',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
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
