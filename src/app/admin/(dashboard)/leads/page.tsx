'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  source: string;
  status: string;
  name: string;
  email: string;
  data: Record<string, unknown>;
  createdAt: string;
  archivedAt: string | null;
}

const STATUSES = ['novo', 'em-contato', 'convertido', 'perdido'];

const STATUS_LABEL: Record<string, string> = {
  novo: 'Novo',
  'em-contato': 'Em contato',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

const STATUS_ACCENT: Record<string, string> = {
  novo: '#6366f1',
  'em-contato': '#eab308',
  convertido: '#22c55e',
  perdido: 'rgba(26,26,26,0.35)',
};

const FIELD_LABEL: Record<string, string> = {
  Nome: 'Nome',
  Email: 'E-mail',
  WhatsApp: 'WhatsApp',
  Segmento: 'Segmento',
  Desafio_Principal: 'Desafio principal',
  Publico_Alvo: 'Público-alvo',
  Cliente_Ideal: 'Cliente ideal',
  Diferencial: 'Diferencial',
  Funcionalidades: 'Funcionalidades',
  Prazo: 'Prazo',
  Dores_RaioX: 'Dores (Raio-X)',
  Detalhes_Operacao: 'Detalhes da operação',
  message: 'Mensagem',
};

function prettifyKey(key: string): string {
  return FIELD_LABEL[key] ?? key.replace(/_/g, ' ');
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((data) => setLeads(data.leads ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function setArchived(id: string, archived: boolean) {
    const archivedAt = archived ? new Date().toISOString() : null;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, archivedAt } : l)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, archivedAt } : prev));
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived }),
    });
  }

  async function deleteLead(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected((prev) => (prev && prev.id === id ? null : prev));
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
  }

  function handleDrop(status: string, e: React.DragEvent) {
    setDragOverStatus(null);
    setDraggingId(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) updateStatus(id, status);
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  const archivedLeads = leads.filter((l) => l.archivedAt);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Leads</h1>
          <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
            Envios do formulário de contato e do briefing. Arraste um card pra mudar o status, ou clique pra ver os detalhes.
          </p>
        </div>
        <button
          onClick={() => setShowArchived((v) => !v)}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: showArchived ? '#fff' : 'rgba(26,26,26,0.55)',
            background: showArchived ? '#b91c1c' : 'transparent',
            border: showArchived ? '1px solid #b91c1c' : '1px solid var(--color-border)',
            padding: '7px 16px',
            borderRadius: '100px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {showArchived ? 'Voltar ao board' : `Arquivados (${archivedLeads.length})`}
        </button>
      </div>

      {showArchived ? (
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          {archivedLeads.length === 0 && (
            <p style={{ padding: '16px', fontSize: '13px', color: 'rgba(26,26,26,0.4)' }}>Nenhum lead arquivado.</p>
          )}
          {archivedLeads.map((lead, i) => (
            <div
              key={lead.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: i < archivedLeads.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px' }}>{lead.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: 0 }}>{lead.email}</p>
              </div>
              <button
                onClick={() => setArchived(lead.id, false)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Restaurar
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir o lead de "${lead.name}" definitivamente?`)) deleteLead(lead.id);
                }}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(185,28,28,0.3)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#b91c1c', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      ) : (
      <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
        {STATUSES.map((status) => {
          const columnLeads = leads.filter((l) => l.status === status && !l.archivedAt);
          const isDragOver = dragOverStatus === status;

          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={() => setDragOverStatus((prev) => (prev === status ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(status, e);
              }}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                background: isDragOver ? 'rgba(244,108,28,0.06)' : SURFACE_COLUMN,
                border: isDragOver ? '1px dashed var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '12px',
                minHeight: '200px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '0 4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_ACCENT[status] }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {STATUS_LABEL[status]}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.4)', marginLeft: 'auto' }}>{columnLeads.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', lead.id);
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggingId(lead.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => setSelected(lead)}
                    style={{
                      background: '#fff',
                      border: '1px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '12px',
                      cursor: 'grab',
                      opacity: draggingId === lead.id ? 0.4 : 1,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: 'var(--color-primary)',
                        marginBottom: '6px',
                      }}
                    >
                      {lead.source === 'briefing' ? 'Briefing' : 'Contato'}
                    </span>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px' }}>{lead.name}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lead.email}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.35)', margin: '8px 0 0' }}>
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
                {columnLeads.length === 0 && (
                  <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.3)', padding: '8px 4px' }}>Nenhum lead</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
          />
          <div
            data-lenis-prevent
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 'min(420px, 100vw)',
              background: '#fff',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
              zIndex: 41,
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {selected.source === 'briefing' ? 'Briefing' : 'Contato'} · {new Date(selected.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>{selected.name}</h2>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', margin: 0 }}>{selected.email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', color: 'rgba(26,26,26,0.4)', cursor: 'pointer', lineHeight: 1, padding: '4px' }}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                onClick={() => setArchived(selected.id, !selected.archivedAt)}
                style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer' }}
              >
                {selected.archivedAt ? 'Restaurar' : 'Arquivar'}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir o lead de "${selected.name}" definitivamente?`)) deleteLead(selected.id);
                }}
                style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(185,28,28,0.3)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#b91c1c', cursor: 'pointer' }}
              >
                Excluir
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Status
            </label>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>

            {Object.keys(selected.data ?? {}).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(selected.data).map(([key, value]) => (
                  <div key={key} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      {prettifyKey(key)}
                    </span>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{String(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const SURFACE_COLUMN = 'rgba(26,26,26,0.03)';
