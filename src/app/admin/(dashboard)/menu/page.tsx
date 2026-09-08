'use client';

import { useEffect, useState } from 'react';

interface MenuItemRow {
  id: string;
  labelPt: string;
  labelEn: string;
  href: string;
  order: number;
  visible: boolean;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ labelPt: '', labelEn: '', href: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/admin/menu')
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateItem(id: string, patch: Partial<MenuItemRow>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    await fetch(`/api/admin/menu/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const withOrders = reordered.map((item, i) => ({ ...item, order: i }));
    setItems(withOrders);
    await Promise.all(withOrders.map((item) => fetch(`/api/admin/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: item.order }),
    })));
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
  }

  async function addItem() {
    if (!newItem.labelPt || !newItem.labelEn || !newItem.href) return;
    setSaving(true);
    try {
      await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      setNewItem({ labelPt: '', labelEn: '', href: '' });
      load();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Menu</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Itens de navegação do cabeçalho do site.
      </p>

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={arrowStyle}>▲</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={arrowStyle}>▼</button>
            </div>
            <input
              value={item.labelPt}
              onChange={(e) => updateItem(item.id, { labelPt: e.target.value })}
              placeholder="Rótulo (PT)"
              style={{ ...inputStyle, width: '140px' }}
            />
            <input
              value={item.labelEn}
              onChange={(e) => updateItem(item.id, { labelEn: e.target.value })}
              placeholder="Rótulo (EN)"
              style={{ ...inputStyle, width: '140px' }}
            />
            <input
              value={item.href}
              onChange={(e) => updateItem(item.id, { href: e.target.value })}
              placeholder="Link"
              style={{ ...inputStyle, flex: 1 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(26,26,26,0.65)', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={item.visible} onChange={(e) => updateItem(item.id, { visible: e.target.checked })} />
              Visível
            </label>
            <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: '#d92d20', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              Remover
            </button>
          </div>
        ))}
        {items.length === 0 && <p style={{ padding: '16px', fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Nenhum item ainda.</p>}
      </div>

      <div style={{ background: '#fff', border: '1px dashed var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          value={newItem.labelPt}
          onChange={(e) => setNewItem((p) => ({ ...p, labelPt: e.target.value }))}
          placeholder="Rótulo (PT)"
          style={{ ...inputStyle, width: '140px' }}
        />
        <input
          value={newItem.labelEn}
          onChange={(e) => setNewItem((p) => ({ ...p, labelEn: e.target.value }))}
          placeholder="Rótulo (EN)"
          style={{ ...inputStyle, width: '140px' }}
        />
        <input
          value={newItem.href}
          onChange={(e) => setNewItem((p) => ({ ...p, href: e.target.value }))}
          placeholder="Link (ex: /#contact)"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={addItem}
          disabled={saving}
          style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          + Adicionar
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
};

const arrowStyle: React.CSSProperties = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '10px',
  color: 'rgba(26,26,26,0.5)',
  padding: '2px 4px',
  lineHeight: 1,
};
