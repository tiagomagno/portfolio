'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AtuacaoCategory } from '@/data/portfolio';
import { caseRecordToFormData, type CaseFormData } from '@/lib/caseForm';
import CaseForm from '@/components/admin/CaseForm';
import Sheet from '@/components/admin/Sheet';

export const MAX_FEATURED_ON_HOME = 10;

export interface CaseRow {
  id: string;
  empresa: string;
  slug: string;
  atuacao: AtuacaoCategory[];
  hasCover: boolean;
  hasHero: boolean;
  galleryCount: number;
  visible: boolean;
  removedAt: string | null;
  featuredOnHome: boolean;
  homeOrder: number;
}

type StatusFilter = 'all' | 'ativo' | 'desativado' | 'excluido';
type CoverFilter = 'all' | 'with' | 'without';
type HomeFilter = 'all' | 'selected' | 'not-selected';
type SheetState = { slug: string } | { mode: 'new' } | null;

export default function CasesTable({ rows, categories }: { rows: CaseRow[]; categories: AtuacaoCategory[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<AtuacaoCategory | 'all'>('all');
  const [coverFilter, setCoverFilter] = useState<CoverFilter>('all');
  const [homeFilter, setHomeFilter] = useState<HomeFilter>('all');
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [sheetInitialData, setSheetInitialData] = useState<CaseFormData | undefined>(undefined);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetEmpresa, setSheetEmpresa] = useState('');

  const featuredCount = useMemo(() => rows.filter((r) => r.featuredOnHome).length, [rows]);
  const featuredOrder = useMemo(
    () => [...rows].filter((r) => r.featuredOnHome).sort((a, b) => a.homeOrder - b.homeOrder).map((r) => r.slug),
    [rows]
  );

  // Sem "excluído" no filtro padrão ('all' = ativos + desativados) — mantém o lixo fora
  // da visão principal, só aparece escolhendo "Excluído" no select de Status.
  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter === 'excluido') list = rows.filter((r) => !!r.removedAt);
    else if (statusFilter === 'ativo') list = rows.filter((r) => r.visible && !r.removedAt);
    else if (statusFilter === 'desativado') list = rows.filter((r) => !r.visible && !r.removedAt);
    else list = rows.filter((r) => !r.removedAt);

    if (categoryFilter !== 'all') list = list.filter((r) => r.atuacao.includes(categoryFilter));
    if (coverFilter !== 'all') list = list.filter((r) => (coverFilter === 'with' ? r.hasCover : !r.hasCover));
    if (homeFilter !== 'all') list = list.filter((r) => (homeFilter === 'selected' ? r.featuredOnHome : !r.featuredOnHome));

    // Ativos antes de desativados; dentro dos ativos, selecionados pra home primeiro (ordem de prioridade).
    return [...list].sort((a, b) => {
      if (a.visible !== b.visible) return a.visible ? -1 : 1;
      if (a.visible && a.featuredOnHome !== b.featuredOnHome) return a.featuredOnHome ? -1 : 1;
      if (a.visible && a.featuredOnHome && b.featuredOnHome) return a.homeOrder - b.homeOrder;
      return 0;
    });
  }, [rows, statusFilter, categoryFilter, coverFilter, homeFilter]);

  async function updateStatus(slug: string, visible: boolean, removed: boolean) {
    setUpdatingSlug(slug);
    try {
      await fetch(`/api/admin/cases/${slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible, removed }),
      });
      router.refresh();
    } finally {
      setUpdatingSlug(null);
    }
  }

  async function toggleFeatured(slug: string, featured: boolean) {
    setUpdatingSlug(slug);
    setFeaturedError(null);
    try {
      const res = await fetch(`/api/admin/cases/${slug}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFeaturedError(data?.error ?? 'Não foi possível atualizar.');
        return;
      }
      router.refresh();
    } finally {
      setUpdatingSlug(null);
    }
  }

  async function reorderFeatured(slug: string, direction: 'up' | 'down') {
    setUpdatingSlug(slug);
    try {
      await fetch(`/api/admin/cases/${slug}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      router.refresh();
    } finally {
      setUpdatingSlug(null);
    }
  }

  function openNewSheet() {
    setSheetEmpresa('Novo case');
    setSheetInitialData(undefined);
    setSheet({ mode: 'new' });
  }

  async function openEditSheet(row: CaseRow) {
    setSheetEmpresa(row.empresa);
    setSheet({ slug: row.slug });
    setSheetLoading(true);
    try {
      const res = await fetch(`/api/admin/cases/${row.slug}`);
      const data = await res.json();
      setSheetInitialData(caseRecordToFormData(data.case));
    } finally {
      setSheetLoading(false);
    }
  }

  function closeSheet() {
    setSheet(null);
    setSheetInitialData(undefined);
  }

  return (
    <div>
      <style>{`
        .admin-icon-action:hover:not(:disabled) { background: rgba(26,26,26,0.06); }
        .admin-th-select { font: inherit; color: inherit; }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={openNewSheet}
          type="button"
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#fff',
            background: 'var(--color-primary)',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + Novo case
        </button>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: featuredCount >= MAX_FEATURED_ON_HOME ? '#166534' : 'rgba(26,26,26,0.6)',
            background: featuredCount >= MAX_FEATURED_ON_HOME ? 'rgba(22,101,52,0.1)' : 'rgba(26,26,26,0.06)',
            padding: '5px 12px',
            borderRadius: '100px',
          }}
        >
          {featuredCount}/{MAX_FEATURED_ON_HOME} selecionados para a home
        </span>
        {featuredError && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }} role="alert">{featuredError}</span>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Th>Case</Th>
              <Th>
                <ThSelect
                  value={categoryFilter}
                  onChange={(v) => setCategoryFilter(v as AtuacaoCategory | 'all')}
                  options={[{ value: 'all', label: 'Categoria' }, ...categories.map((c) => ({ value: c, label: c }))]}
                />
              </Th>
              <Th align="center">
                <ThSelect
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as StatusFilter)}
                  options={[
                    { value: 'all', label: 'Status' },
                    { value: 'ativo', label: 'Ativo' },
                    { value: 'desativado', label: 'Desativado' },
                    { value: 'excluido', label: 'Excluído' },
                  ]}
                />
              </Th>
              <Th align="center">
                <ThSelect
                  value={homeFilter}
                  onChange={(v) => setHomeFilter(v as HomeFilter)}
                  options={[
                    { value: 'all', label: 'Home' },
                    { value: 'selected', label: 'Selecionados' },
                    { value: 'not-selected', label: 'Não selecionados' },
                  ]}
                />
              </Th>
              <Th align="center">
                <ThSelect
                  value={coverFilter}
                  onChange={(v) => setCoverFilter(v as CoverFilter)}
                  options={[
                    { value: 'all', label: 'Capa' },
                    { value: 'with', label: 'Com capa' },
                    { value: 'without', label: 'Sem capa' },
                  ]}
                />
              </Th>
              <Th align="center">Topo</Th>
              <Th align="center">Galeria</Th>
              <Th align="right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td>
                  <span style={{ color: 'rgba(26,26,26,0.4)' }}>Nenhum case encontrado.</span>
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
                  {!row.removedAt && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="checkbox"
                        checked={row.featuredOnHome}
                        disabled={updatingSlug === row.slug || (!row.featuredOnHome && featuredCount >= MAX_FEATURED_ON_HOME)}
                        onChange={(e) => toggleFeatured(row.slug, e.target.checked)}
                        title={row.featuredOnHome ? 'Remover do carrossel da home' : 'Mostrar no carrossel da home'}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                      />
                      {row.featuredOnHome && (
                        <>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', minWidth: '14px' }}>
                            {featuredOrder.indexOf(row.slug) + 1}
                          </span>
                          <ReorderButton
                            direction="up"
                            disabled={updatingSlug === row.slug || featuredOrder.indexOf(row.slug) === 0}
                            onClick={() => reorderFeatured(row.slug, 'up')}
                          />
                          <ReorderButton
                            direction="down"
                            disabled={updatingSlug === row.slug || featuredOrder.indexOf(row.slug) === featuredOrder.length - 1}
                            onClick={() => reorderFeatured(row.slug, 'down')}
                          />
                        </>
                      )}
                    </div>
                  )}
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
                  <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                    {row.removedAt ? (
                      <IconAction
                        icon="restore"
                        label="Restaurar"
                        disabled={updatingSlug === row.slug}
                        onClick={() => updateStatus(row.slug, true, false)}
                      />
                    ) : (
                      <>
                        <IconAction icon="edit" label="Editar" onClick={() => openEditSheet(row)} />
                        <IconAction
                          icon={row.visible ? 'visibility_off' : 'visibility'}
                          label={row.visible ? 'Desativar' : 'Ativar'}
                          disabled={updatingSlug === row.slug}
                          onClick={() => updateStatus(row.slug, !row.visible, false)}
                        />
                        <IconAction
                          icon="delete"
                          label="Excluir"
                          tone="danger"
                          disabled={updatingSlug === row.slug}
                          onClick={() => {
                            if (confirm(`Excluir "${row.empresa}" do site? Pode ser restaurado depois filtrando por Status "Excluído".`)) {
                              updateStatus(row.slug, false, true);
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

      <Sheet open={sheet !== null} onClose={closeSheet} title={sheet && 'mode' in sheet ? 'Novo case' : sheetEmpresa}>
        {sheet !== null &&
          (sheetLoading ? (
            <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>
          ) : (
            <CaseForm
              key={'mode' in sheet ? 'new' : sheet.slug}
              mode={'mode' in sheet ? 'create' : 'edit'}
              slug={'slug' in sheet ? sheet.slug : undefined}
              initialData={sheetInitialData}
              onSuccess={closeSheet}
              onCancel={closeSheet}
            />
          ))}
      </Sheet>
    </div>
  );
}

function ThSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      className="admin-th-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: 'normal',
        color: value === 'all' ? 'rgba(26,26,26,0.5)' : '#1a1a1a',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
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

function IconAction({
  icon,
  label,
  onClick,
  disabled,
  tone = 'default',
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
}) {
  const color = tone === 'danger' ? '#b91c1c' : '#1a1a1a';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      title={label}
      aria-label={label}
      className="admin-icon-action"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: tone === 'danger' ? '1px solid rgba(185,28,28,0.25)' : '1px solid var(--color-border)',
        background: '#fff',
        color,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
        transition: 'background 0.15s',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
        {icon}
      </span>
    </button>
  );
}

function ReorderButton({ direction, onClick, disabled }: { direction: 'up' | 'down'; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      title={direction === 'up' ? 'Subir prioridade' : 'Descer prioridade'}
      aria-label={direction === 'up' ? 'Subir prioridade' : 'Descer prioridade'}
      className="admin-icon-action"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        border: '1px solid var(--color-border)',
        background: '#fff',
        color: '#1a1a1a',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        flexShrink: 0,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
        {direction === 'up' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
      </span>
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
