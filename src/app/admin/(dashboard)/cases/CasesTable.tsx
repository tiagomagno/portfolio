'use client';

import { useEffect, useMemo, useState } from 'react';
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
  coverImage: string | null;
  hasCover: boolean;
  hasHero: boolean;
  galleryCount: number;
  visible: boolean;
  removedAt: string | null;
  featuredOnHome: boolean;
  homeOrder: number;
  /** Papel + Ano + Subtítulo do topo preenchidos — sem isso, o case fica sem `caseStudy`
   * (data/cases.ts) e não aparece no carrossel da home mesmo marcado "Home". */
  hasCaseStudy: boolean;
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
  const featuredMissingCaseStudy = useMemo(
    () => rows.filter((r) => r.featuredOnHome && !r.hasCaseStudy).length,
    [rows]
  );
  // Ordem local (otimista) enquanto o servidor grava; deixa de valer sozinha quando `rows` é recarregado.
  const [orderOverride, setOrderOverride] = useState<{ base: CaseRow[]; order: string[] } | null>(null);
  const [dragSlug, setDragSlug] = useState<string | null>(null);
  const [overSlug, setOverSlug] = useState<string | null>(null);
  const featuredOrder = useMemo(() => {
    if (orderOverride && orderOverride.base === rows) return orderOverride.order;
    return [...rows].filter((r) => r.featuredOnHome).sort((a, b) => a.homeOrder - b.homeOrder).map((r) => r.slug);
  }, [rows, orderOverride]);

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
      if (a.visible && a.featuredOnHome && b.featuredOnHome) return featuredOrder.indexOf(a.slug) - featuredOrder.indexOf(b.slug);
      return 0;
    });
  }, [rows, statusFilter, categoryFilter, coverFilter, homeFilter, featuredOrder]);

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

  /** Move `from` pra posição de `to` na fila de prioridade e grava a ordem completa. */
  async function moveFeatured(from: string, to: string) {
    if (from === to) return;
    const fromIndex = featuredOrder.indexOf(from);
    const toIndex = featuredOrder.indexOf(to);
    if (fromIndex < 0 || toIndex < 0) return;
    const next = featuredOrder.filter((slug) => slug !== from);
    // Arrastando pra baixo o item cai depois do alvo; pra cima, antes.
    next.splice(fromIndex < toIndex ? next.indexOf(to) + 1 : next.indexOf(to), 0, from);
    setOrderOverride({ base: rows, order: next });
    setFeaturedError(null);
    try {
      const res = await fetch('/api/admin/cases/home-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFeaturedError(data?.error ?? 'Não foi possível salvar a ordem.');
        setOrderOverride(null);
        return;
      }
      router.refresh();
    } catch {
      setFeaturedError('Não foi possível salvar a ordem.');
      setOrderOverride(null);
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
        {featuredMissingCaseStudy > 0 && (
          <span
            title='Esses cases não vão aparecer no carrossel: falta preencher Papel, Ano ou Subtítulo do topo na aba "Visão Geral" (veja o ícone de aviso na coluna Home).'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#b45309',
              background: 'rgba(180,83,9,0.1)',
              padding: '5px 12px',
              borderRadius: '100px',
              cursor: 'help',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              warning
            </span>
            {featuredMissingCaseStudy} sem case study completo
          </span>
        )}
        {featuredError && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }} role="alert">{featuredError}</span>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', fontSize: '13px' }}>
          <thead>
            <tr>
              <Th width={36}>&nbsp;</Th>
              <Th width={64}>&nbsp;</Th>
              <Th>
                <ThSelect
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as StatusFilter)}
                  options={[
                    { value: 'all', label: 'Case' },
                    { value: 'ativo', label: 'Case · Ativos' },
                    { value: 'desativado', label: 'Case · Desativados' },
                    { value: 'excluido', label: 'Case · Excluídos' },
                  ]}
                />
              </Th>
              <Th>
                <ThSelect
                  value={categoryFilter}
                  onChange={(v) => setCategoryFilter(v as AtuacaoCategory | 'all')}
                  options={[{ value: 'all', label: 'Categoria' }, ...categories.map((c) => ({ value: c, label: c }))]}
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
                    { value: 'all', label: 'Capa / Topo' },
                    { value: 'with', label: 'Com capa' },
                    { value: 'without', label: 'Sem capa' },
                  ]}
                />
              </Th>
              <Th align="center">Galeria</Th>
              <Th align="right" width={64}>&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <Td>&nbsp;</Td>
                <Td colSpan={7}>
                  <span style={{ color: 'rgba(26,26,26,0.4)' }}>Nenhum case encontrado.</span>
                </Td>
              </tr>
            )}
            {filtered.map((row) => {
              const canDrag = row.featuredOnHome && !row.removedAt;
              const dropping = !!dragSlug && overSlug === row.slug && dragSlug !== row.slug;
              const dropLine = dropping
                ? `inset 0 ${featuredOrder.indexOf(dragSlug!) < featuredOrder.indexOf(row.slug) ? -2 : 2}px 0 0 var(--color-primary)`
                : undefined;
              const cellStyle = { boxShadow: dropLine };
              return (
                <tr
                  key={row.id}
                  draggable={canDrag}
                  onDragStart={(e) => {
                    setDragSlug(row.slug);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', row.slug);
                  }}
                  onDragOver={(e) => {
                    if (!dragSlug || !canDrag) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (overSlug !== row.slug) setOverSlug(row.slug);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragSlug && canDrag) moveFeatured(dragSlug, row.slug);
                    setDragSlug(null);
                    setOverSlug(null);
                  }}
                  onDragEnd={() => {
                    setDragSlug(null);
                    setOverSlug(null);
                  }}
                  style={dragSlug === row.slug ? { opacity: 0.4 } : undefined}
                >
                  <Td first style={cellStyle} align="center">
                    {canDrag && (
                      <span
                        title="Arraste a linha para mudar a prioridade"
                        aria-label="Arrastar para reordenar"
                        className="material-symbols-outlined"
                        style={{ fontSize: '20px', color: 'rgba(26,26,26,0.4)', cursor: 'grab', display: 'block' }}
                      >
                        drag_indicator
                      </span>
                    )}
                  </Td>
                  <Td style={cellStyle}>
                    <Thumb src={row.coverImage} alt={row.empresa} dim={!row.visible} />
                  </Td>
                  <Td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#1a1a1a', opacity: row.visible ? 1 : 0.5 }}>{row.empresa}</span>
                      {(!row.visible || row.removedAt) && <StatusBadge visible={row.visible} removed={!!row.removedAt} />}
                    </div>
                  </Td>
                  <Td style={cellStyle}>
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
                  <Td align="center" style={cellStyle}>
                    {!row.removedAt && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(26,26,26,0.6)', minWidth: '14px' }}>
                              {featuredOrder.indexOf(row.slug) + 1}º
                            </span>
                            {!row.hasCaseStudy && (
                              <span
                                title='Não vai aparecer no carrossel da home: falta preencher Papel, Ano ou Subtítulo do topo na aba "Visão Geral".'
                                style={{ display: 'inline-flex', color: '#b45309', cursor: 'help' }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                  warning
                                </span>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </Td>
                  <Td align="center" style={cellStyle}>
                    <CoverTopDot cover={row.hasCover} top={row.hasHero} />
                  </Td>
                  <Td align="center" style={cellStyle}>
                    <span style={{ color: row.galleryCount > 0 ? '#166534' : 'rgba(26,26,26,0.4)', fontWeight: 600 }}>
                      {row.galleryCount > 0 ? `${row.galleryCount} ${row.galleryCount === 1 ? 'item' : 'itens'}` : '—'}
                    </span>
                  </Td>
                  <Td last align="right" style={cellStyle}>
                    <ActionsMenu
                      disabled={updatingSlug === row.slug}
                      items={
                        row.removedAt
                          ? [{ icon: 'restore', label: 'Restaurar', onClick: () => updateStatus(row.slug, true, false) }]
                          : [
                              { icon: 'edit', label: 'Editar', onClick: () => openEditSheet(row) },
                              {
                                icon: row.visible ? 'visibility_off' : 'visibility',
                                label: row.visible ? 'Desativar' : 'Ativar',
                                onClick: () => updateStatus(row.slug, !row.visible, false),
                              },
                              {
                                icon: 'delete',
                                label: 'Excluir',
                                tone: 'danger',
                                onClick: () => {
                                  if (confirm(`Excluir "${row.empresa}" do site? Pode ser restaurado depois filtrando por Status "Excluído".`)) {
                                    updateStatus(row.slug, false, true);
                                  }
                                },
                              },
                            ]
                      }
                    />
                  </Td>
                </tr>
              );
            })}
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

function Th({
  children,
  align = 'left',
  width,
}: {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number;
}) {
  return (
    <th
      style={{
        textAlign: align,
        padding: '6px 16px',
        width,
        fontSize: '11px',
        fontWeight: 700,
        color: 'rgba(26,26,26,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </th>
  );
}

/** Célula com fundo próprio: o "card" da linha é montado pelas células (bordas nas pontas). */
function Td({
  children,
  align = 'left',
  first,
  last,
  colSpan,
  style,
}: {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  first?: boolean;
  last?: boolean;
  colSpan?: number;
  style?: React.CSSProperties;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        textAlign: align,
        padding: '10px 16px',
        background: '#fff',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        ...(first ? { borderLeft: '1px solid var(--color-border)', borderRadius: '10px 0 0 10px', paddingRight: 0 } : {}),
        ...(last ? { borderRight: '1px solid var(--color-border)', borderRadius: '0 10px 10px 0' } : {}),
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function Thumb({ src, alt, dim }: { src: string | null; alt: string; dim: boolean }) {
  return (
    <div
      style={{
        width: '48px',
        height: '36px',
        borderRadius: '6px',
        overflow: 'hidden',
        background: 'rgba(26,26,26,0.06)',
        opacity: dim ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
      ) : (
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'rgba(26,26,26,0.3)' }}>
          image
        </span>
      )}
    </div>
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

interface MenuItem {
  icon: string;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}

/** Menu de ações da linha. Posição fixa calculada a partir do botão, pra não ser cortado pelo scroll da tabela. */
function ActionsMenu({ items, disabled }: { items: MenuItem[]; disabled?: boolean }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const open = pos !== null;

  useEffect(() => {
    if (!open) return;
    const close = () => setPos(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        title="Ações"
        aria-label="Ações"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        className="admin-icon-action"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos(open ? null : { top: rect.bottom + 4, right: window.innerWidth - rect.right });
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          border: 'none',
          background: open ? 'rgba(26,26,26,0.06)' : 'transparent',
          color: '#1a1a1a',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          more_vert
        </span>
      </button>
      {open && (
        <>
          <div onClick={() => setPos(null)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            role="menu"
            style={{
              position: 'fixed',
              top: pos.top,
              right: pos.right,
              zIndex: 41,
              minWidth: '160px',
              padding: '6px',
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              textAlign: 'left',
            }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className="admin-icon-action"
                onClick={() => {
                  setPos(null);
                  item.onClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: item.tone === 'danger' ? '#b91c1c' : '#1a1a1a',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** Verde inteiro = capa e topo definidos; metade verde/metade cinza = só um deles (esquerda capa, direita topo); cinza = nenhum. */
function CoverTopDot({ cover, top }: { cover: boolean; top: boolean }) {
  const green = '#22c55e';
  const gray = 'rgba(26,26,26,0.15)';
  const background =
    cover && top ? green : !cover && !top ? gray : `linear-gradient(90deg, ${cover ? green : gray} 50%, ${top ? green : gray} 50%)`;
  const label = cover && top ? 'Capa e topo definidos' : !cover && !top ? 'Sem capa e sem topo' : cover ? 'Só a capa definida' : 'Só o topo definido';
  return (
    <span
      title={label}
      aria-label={label}
      style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background }}
    />
  );
}
