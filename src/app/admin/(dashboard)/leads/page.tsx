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
}

const STATUSES = ['novo', 'em-contato', 'convertido', 'perdido'];

const STATUS_LABEL: Record<string, string> = {
  novo: 'Novo',
  'em-contato': 'Em contato',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((data) => setLeads(data.leads ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  const filtered = filter === 'todos' ? leads : leads.filter((l) => l.status === filter);

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Leads</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 20px' }}>
        Envios do formulário de contato e do briefing.
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['todos', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              border: '1px solid var(--color-border)',
              background: filter === s ? 'var(--color-primary)' : '#fff',
              color: filter === s ? '#fff' : '#1a1a1a',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s === 'todos' ? 'Todos' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Nenhum lead encontrado.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((lead) => (
          <div key={lead.id} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-primary)',
                    marginBottom: '6px',
                  }}
                >
                  {lead.source === 'briefing' ? 'Briefing' : 'Contato'} · {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px' }}>{lead.name}</p>
                <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.6)', margin: 0 }}>{lead.email}</p>
              </div>
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px', fontWeight: 600 }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            {Object.keys(lead.data ?? {}).length > 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {Object.entries(lead.data).map(([key, value]) => (
                  <p key={key} style={{ fontSize: '12px', color: 'rgba(26,26,26,0.65)', margin: 0 }}>
                    <strong style={{ color: '#1a1a1a' }}>{key}:</strong> {String(value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
