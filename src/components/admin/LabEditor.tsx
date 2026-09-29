'use client';

import { useEffect, useState } from 'react';
import ImageField from './ImageField';

const STATUSES = ['MVP no ar', 'Em desenvolvimento', 'Protótipo', 'Em breve'];

interface Row {
  key: string; // chave local estável (id do banco ou temporária)
  id?: string;
  title: string;
  tagline: string;
  status: string;
  href: string;
  image: string;
  visible: boolean;
}

const uid = () => Math.random().toString(36).slice(2);

/** Cadastro dos projetos do Design Lab (home): nome, descrição, status, link, imagem, ordem e visibilidade. */
export default function LabEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/labs')
      .then((r) => r.json())
      .then((d) => setRows((d.items ?? []).map((i: Omit<Row, 'key'>) => ({ ...i, key: i.id ?? uid() }))))
      .finally(() => setLoading(false));
  }, []);

  const patch = (key: string, data: Partial<Row>) => setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...data } : r)));

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
  }

  function add() {
    setRows((prev) => [...prev, { key: uid(), title: '', tagline: '', status: 'Protótipo', href: '', image: '', visible: true }]);
  }

  function remove(key: string) {
    if (!window.confirm('Remover este projeto? A remoção só vale depois de salvar.')) return;
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  async function upload(key: string, file: File) {
    setUploadingKey(key);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro no envio');
      patch(key, { image: data.url });
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erro ao enviar a imagem.');
    } finally {
      setUploadingKey(null);
    }
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/labs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: rows.map(({ key: _key, ...r }) => r) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro ao salvar');
      setRows((data.items ?? []).map((i: Omit<Row, 'key'>) => ({ ...i, key: i.id ?? uid() })));
      setMessage('Salvo com sucesso.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: 0 }}>
        A ordem daqui é a ordem no site. Com um link, o card ganha o botão “Acessar”; com imagem, ela aparece no card. Os filtros “No ar” e “Protótipos” usam o status.
      </p>

      {rows.map((r, i) => (
        <div key={r.key} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: r.visible ? 1 : 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={iconBtn} aria-label="Subir">▲</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} style={iconBtn} aria-label="Descer">▼</button>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{r.title || 'Novo projeto'}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(26,26,26,0.65)', cursor: 'pointer' }}>
              <input type="checkbox" checked={r.visible} onChange={(e) => patch(r.key, { visible: e.target.checked })} />
              Visível
            </label>
            <button type="button" onClick={() => remove(r.key)} style={{ ...iconBtn, color: '#b3261e' }}>Remover</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px' }}>
            <Field label="Nome">
              <input value={r.title} onChange={(e) => patch(r.key, { title: e.target.value })} style={input} />
            </Field>
            <Field label="Status">
              <select value={r.status} onChange={(e) => patch(r.key, { status: e.target.value })} style={input}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Descrição">
            <textarea value={r.tagline} onChange={(e) => patch(r.key, { tagline: e.target.value })} rows={3} style={{ ...input, resize: 'vertical' }} />
          </Field>

          <Field label="Link (opcional)">
            <input value={r.href} onChange={(e) => patch(r.key, { href: e.target.value })} placeholder="https://..." style={input} />
          </Field>

          <ImageField
            label="Imagem do card (opcional)"
            hint="Aparece abaixo do texto; a proporção se ajusta ao card."
            value={r.image || null}
            uploading={uploadingKey === r.key}
            onUpload={(file) => upload(r.key, file)}
            onRemove={() => patch(r.key, { image: '' })}
          />
        </div>
      ))}

      <button type="button" onClick={add} style={{ alignSelf: 'flex-start', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--color-border)', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer' }}>
        + Adicionar projeto
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button type="button" onClick={save} disabled={saving} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{label}</label>
      {children}
    </div>
  );
}

const input: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
  background: '#fff',
  color: '#1a1a1a',
};

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '4px 6px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'rgba(26,26,26,0.6)',
  cursor: 'pointer',
};
