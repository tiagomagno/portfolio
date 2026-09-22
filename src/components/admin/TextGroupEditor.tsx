'use client';

import { useEffect, useState } from 'react';

export interface ContentItem {
  key: string;
  group: string;
  defaultPt: string;
  defaultEn: string;
  valuePt: string | null;
  valueEn: string | null;
}

/** Bloco de textos editáveis (chaves de src/lib/translations.ts, override salvo em
 * PageContent) filtrado por um predicado — cada instância busca /api/admin/content
 * independentemente e salva só o próprio subconjunto. Usado nas sub-páginas de
 * /admin/pages para mostrar só as chaves relevantes de cada seção. */
export default function TextGroupEditor({
  title,
  hint,
  filter,
  lang,
}: {
  title: string;
  hint?: string;
  filter: (item: ContentItem) => boolean;
  lang: 'pt' | 'en';
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [edits, setEdits] = useState<Record<string, { pt: string; en: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((data) => {
        const all: ContentItem[] = data.items ?? [];
        const filtered = all.filter(filter);
        setItems(filtered);
        const initialEdits: Record<string, { pt: string; en: string }> = {};
        for (const item of filtered) {
          initialEdits[item.key] = { pt: item.valuePt ?? item.defaultPt, en: item.valueEn ?? item.defaultEn };
        }
        setEdits(initialEdits);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetKey(item: ContentItem) {
    setEdits((prev) => ({ ...prev, [item.key]: { pt: item.defaultPt, en: item.defaultEn } }));
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const payload = items.map((item) => ({
        key: item.key,
        valuePt: edits[item.key]?.pt ?? '',
        valueEn: edits[item.key]?.en ?? '',
      }));
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
      setMessage('Salvo com sucesso.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || items.length === 0) return null;

  return (
    <details style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
      <summary style={{ padding: '14px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <span style={{ color: 'rgba(26,26,26,0.4)', fontWeight: 500, fontSize: '12px' }}>{items.length} texto{items.length > 1 ? 's' : ''}</span>
      </summary>
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {hint && <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: 0 }}>{hint}</p>}
        {items.map((item) => (
          <div key={item.key} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <code style={{ fontSize: '11px', color: 'rgba(26,26,26,0.45)' }}>{item.key}</code>
              <button onClick={() => resetKey(item)} type="button" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                Restaurar padrão
              </button>
            </div>
            <textarea
              value={lang === 'pt' ? (edits[item.key]?.pt ?? '') : (edits[item.key]?.en ?? '')}
              onChange={(e) =>
                setEdits((prev) => ({
                  ...prev,
                  [item.key]: { ...prev[item.key], [lang]: e.target.value },
                }))
              }
              rows={2}
              style={textareaStyle}
              placeholder={lang === 'pt' ? 'PT-BR' : 'EN'}
            />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={save}
            disabled={saving}
            type="button"
            style={{ alignSelf: 'flex-start', padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            {saving ? 'Salvando...' : `Salvar "${title}"`}
          </button>
          {message && <span style={{ fontSize: '12px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
        </div>
      </div>
    </details>
  );
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
  resize: 'vertical',
};
