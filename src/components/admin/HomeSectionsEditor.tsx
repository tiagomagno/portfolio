'use client';

import { useEffect, useState } from 'react';

interface SectionRow {
  key: string;
  label: string;
  order: number;
  visible: boolean;
}

/** Ordem/visibilidade das seções da Home (model HomeSection). */
export default function HomeSectionsEditor() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/sections')
      .then((r) => r.json())
      .then((data) => setSections(data.sections ?? []))
      .finally(() => setLoading(false));
  }, []);

  /** Move a seção arrastada pra posição da seção alvo (depois dela se veio de cima, antes se veio de baixo). */
  function moveTo(fromKey: string, toKey: string) {
    if (fromKey === toKey) return;
    const from = sections.findIndex((s) => s.key === fromKey);
    const to = sections.findIndex((s) => s.key === toKey);
    if (from < 0 || to < 0) return;
    const reordered = [...sections];
    const [item] = reordered.splice(from, 1);
    reordered.splice(to, 0, item);
    setSections(reordered.map((s, i) => ({ ...s, order: i })));
  }

  function toggleVisible(key: string) {
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      setMessage('Salvo com sucesso.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
        {sections.map((s, i) => {
          const dropping = !!dragKey && overKey === s.key && dragKey !== s.key;
          const fromIdx = sections.findIndex((x) => x.key === dragKey);
          return (
          <div
            key={s.key}
            draggable
            onDragStart={(e) => {
              setDragKey(s.key);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', s.key);
            }}
            onDragOver={(e) => {
              if (!dragKey) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (overKey !== s.key) setOverKey(s.key);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragKey) moveTo(dragKey, s.key);
              setDragKey(null);
              setOverKey(null);
            }}
            onDragEnd={() => {
              setDragKey(null);
              setOverKey(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderBottom: i < sections.length - 1 ? '1px solid var(--color-border)' : 'none',
              opacity: dragKey === s.key ? 0.4 : 1,
              boxShadow: dropping ? `inset 0 ${fromIdx < i ? -2 : 2}px 0 0 var(--color-primary)` : undefined,
            }}
          >
            <span
              title="Arraste a linha para mudar a ordem"
              aria-label="Arrastar para reordenar"
              className="material-symbols-outlined"
              style={{ fontSize: '20px', color: 'rgba(26,26,26,0.4)', cursor: 'grab' }}
            >
              drag_indicator
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', minWidth: '20px' }}>{i + 1}º</span>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: '#1a1a1a', opacity: s.visible ? 1 : 0.5 }}>{s.label}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '100px',
                color: s.visible ? '#166534' : 'rgba(26,26,26,0.55)',
                background: s.visible ? 'rgba(22,101,52,0.1)' : 'rgba(26,26,26,0.08)',
              }}
            >
              {s.visible ? 'Visível' : 'Oculta'}
            </span>
            <button
              type="button"
              onClick={() => toggleVisible(s.key)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', minWidth: '84px' }}
            >
              {s.visible ? 'Ocultar' : 'Exibir'}
            </button>
          </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={save}
          disabled={saving}
          type="button"
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
      </div>
    </div>
  );
}

