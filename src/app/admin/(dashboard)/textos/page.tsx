'use client';

import { useEffect, useMemo, useState } from 'react';

interface ContentItem {
  key: string;
  group: string;
  page: string;
  defaultPt: string;
  defaultEn: string;
  valuePt: string | null;
  valueEn: string | null;
}

export default function AdminTextosPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [pageOrder, setPageOrder] = useState<string[]>([]);
  const [edits, setEdits] = useState<Record<string, { pt: string; en: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingGroup, setSavingGroup] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        const loaded: ContentItem[] = data.items ?? [];
        setItems(loaded);
        setPageOrder(data.pageOrder ?? []);
        const initialEdits: Record<string, { pt: string; en: string }> = {};
        for (const item of loaded) {
          initialEdits[item.key] = { pt: item.valuePt ?? item.defaultPt, en: item.valueEn ?? item.defaultEn };
        }
        setEdits(initialEdits);
      })
      .finally(() => setLoading(false));
  }, []);

  const pages = useMemo(() => {
    const filtered = search.trim()
      ? items.filter((i) => i.key.toLowerCase().includes(search.toLowerCase()) || i.defaultPt.toLowerCase().includes(search.toLowerCase()))
      : items;

    const byPage = new Map<string, Map<string, ContentItem[]>>();
    for (const item of filtered) {
      if (!byPage.has(item.page)) byPage.set(item.page, new Map());
      const groups = byPage.get(item.page)!;
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group)!.push(item);
    }

    const orderedPageNames = [...pageOrder, ...Array.from(byPage.keys()).filter((p) => !pageOrder.includes(p))];
    return orderedPageNames
      .filter((p) => byPage.has(p))
      .map((page) => ({
        page,
        groups: Array.from(byPage.get(page)!.entries()).sort(([a], [b]) => a.localeCompare(b)),
        total: Array.from(byPage.get(page)!.values()).reduce((sum, arr) => sum + arr.length, 0),
      }));
  }, [items, search, pageOrder]);

  async function saveGroup(groupItems: ContentItem[]) {
    setSavingGroup(groupItems[0].group);
    try {
      const payload = groupItems.map((item) => ({
        key: item.key,
        valuePt: edits[item.key]?.pt ?? '',
        valueEn: edits[item.key]?.en ?? '',
      }));
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      setItems((prev) =>
        prev.map((i) => {
          const p = payload.find((x) => x.key === i.key);
          if (!p) return i;
          const isDefault = p.valuePt === i.defaultPt && p.valueEn === i.defaultEn;
          return { ...i, valuePt: isDefault ? null : p.valuePt, valueEn: isDefault ? null : p.valueEn };
        })
      );
    } finally {
      setSavingGroup(null);
    }
  }

  function resetKey(item: ContentItem) {
    setEdits((prev) => ({ ...prev, [item.key]: { pt: item.defaultPt, en: item.defaultEn } }));
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Textos do Site</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 20px' }}>
        Sobrescreve os textos em PT e EN, organizados por página. Deixe igual ao original pra manter o padrão do código.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por chave ou texto..."
        style={{ width: '100%', maxWidth: '360px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', marginBottom: '24px' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {pages.map(({ page, groups, total }) => (
          <section key={page}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {page}
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.4)' }}>{total} texto{total > 1 ? 's' : ''}</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {groups.map(([group, groupItems]) => (
                <details key={group} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                  <summary style={{ padding: '12px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: '#1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{group}</span>
                    <span style={{ color: 'rgba(26,26,26,0.4)', fontWeight: 500 }}>{groupItems.length} texto{groupItems.length > 1 ? 's' : ''}</span>
                  </summary>
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {groupItems.map((item) => (
                      <div key={item.key} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <code style={{ fontSize: '11px', color: 'rgba(26,26,26,0.45)' }}>{item.key}</code>
                          <button onClick={() => resetKey(item)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Restaurar padrão
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <textarea
                            value={edits[item.key]?.pt ?? ''}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [item.key]: { ...prev[item.key], pt: e.target.value } }))}
                            rows={2}
                            style={textareaStyle}
                            placeholder="PT"
                          />
                          <textarea
                            value={edits[item.key]?.en ?? ''}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [item.key]: { ...prev[item.key], en: e.target.value } }))}
                            rows={2}
                            style={textareaStyle}
                            placeholder="EN"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => saveGroup(groupItems)}
                      disabled={savingGroup === group}
                      style={{ alignSelf: 'flex-start', padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                    >
                      {savingGroup === group ? 'Salvando...' : `Salvar "${group}"`}
                    </button>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const textareaStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
  resize: 'vertical',
};
