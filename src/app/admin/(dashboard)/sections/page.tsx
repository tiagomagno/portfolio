'use client';

import { useEffect, useState } from 'react';

interface SectionRow {
  key: string;
  label: string;
  order: number;
  visible: boolean;
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/sections')
      .then((r) => r.json())
      .then((data) => setSections(data.sections ?? []))
      .finally(() => setLoading(false));
  }, []);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
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
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Seções da Home</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Ordem em que as seções aparecem na página inicial, e quais ficam visíveis.
      </p>

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
        {sections.map((s, i) => (
          <div
            key={s.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderBottom: i < sections.length - 1 ? '1px solid var(--color-border)' : 'none',
              opacity: s.visible ? 1 : 0.5,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={arrowStyle}>▲</button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} style={arrowStyle}>▼</button>
            </div>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{s.label}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(26,26,26,0.65)' }}>
              <input type="checkbox" checked={s.visible} onChange={() => toggleVisible(s.key)} />
              Visível
            </label>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
      </div>
    </div>
  );
}

const arrowStyle: React.CSSProperties = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '10px',
  color: 'rgba(26,26,26,0.5)',
  padding: '2px 4px',
  lineHeight: 1,
};
