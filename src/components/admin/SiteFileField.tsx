'use client';

import { useEffect, useState } from 'react';

/** Campo de arquivo do site (currículo ou logo): envia um arquivo OU aceita um link direto.
 * Salva só o próprio campo em SiteSettings. */
export default function SiteFileField({
  settingKey,
  kind,
  label,
  hint,
  accept,
  preview,
}: {
  settingKey: 'resumeUrl' | 'logoUrl';
  kind: 'resume' | 'logo';
  label: string;
  hint?: string;
  accept: string;
  preview?: 'image' | 'link';
}) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((r) => r.json())
      .then((d) => setValue(d.settings?.[settingKey] ?? ''))
      .finally(() => setLoading(false));
  }, [settingKey]);

  async function persist(next: string) {
    const res = await fetch('/api/admin/site-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [settingKey]: next }),
    });
    if (!res.ok) throw new Error('save');
    setValue(next);
  }

  async function upload(file: File) {
    setBusy(true);
    setMessage('');
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('kind', kind);
      const res = await fetch('/api/admin/upload/site', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro no envio');
      await persist(data.url);
      setMessage('Arquivo enviado e salvo.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erro ao enviar.');
    } finally {
      setBusy(false);
    }
  }

  async function saveLink() {
    setBusy(true);
    setMessage('');
    try {
      await persist(value.trim());
      setMessage('Salvo com sucesso.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    setBusy(true);
    try {
      await persist('');
      setMessage(kind === 'logo' ? 'Logo padrão restaurada.' : 'Link removido.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{label}</span>
        {hint && <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: 0 }}>{hint}</p>}
      </div>

      {preview === 'image' && value && (
        <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '16px', width: 'fit-content' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Logo atual" style={{ height: '36px', width: 'auto', display: 'block' }} />
        </div>
      )}
      {preview === 'link' && value && (
        <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
          Ver arquivo atual ↗
        </a>
      )}

      <label
        style={{ display: 'inline-block', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--color-border)', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', width: 'fit-content' }}
      >
        {busy ? 'Enviando...' : 'Enviar arquivo'}
        <input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} style={{ display: 'none' }} disabled={busy} />
      </label>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(26,26,26,0.65)', marginBottom: '4px' }}>Ou informe um link</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://..."
            style={{ flex: 1, boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', fontFamily: 'inherit' }}
          />
          <button onClick={saveLink} disabled={busy} type="button" style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            Salvar
          </button>
        </div>
      </div>

      {value && (
        <button onClick={clear} disabled={busy} type="button" style={{ background: 'none', border: 'none', color: 'rgba(26,26,26,0.55)', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: 0, width: 'fit-content' }}>
          {kind === 'logo' ? 'Restaurar logo padrão' : 'Remover'}
        </button>
      )}
      {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
    </div>
  );
}
