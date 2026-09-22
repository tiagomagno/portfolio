'use client';

import { useEffect, useState } from 'react';

export interface SiteSettingsData {
  brandName: string;
  contactEmail: string;
  whatsappNumber: string;
  linkedinUrl: string;
  contactFormRecipientEmail: string;
  briefingFormRecipientEmail: string;
}

interface FieldDef {
  key: keyof SiteSettingsData;
  label: string;
  hint?: string;
  placeholder?: string;
}

/** Formulário de um subconjunto de campos de SiteSettings (marca, contato, redes
 * sociais, destinatários de formulário) — cada instância busca o estado atual e salva
 * só os campos que lhe foram passados via `fields`. */
export default function SiteSettingsForm({ fields, buttonLabel = 'Salvar' }: { fields: FieldDef[]; buttonLabel?: string }) {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((r) => r.json())
      .then((data) => setSettings(data.settings))
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof SiteSettingsData, value: string) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const payload: Record<string, string> = {};
      for (const f of fields) payload[f.key] = settings[f.key];
      await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setMessage('Salvo com sucesso.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {fields.map((f) => (
        <div key={f.key}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{f.label}</label>
          {f.hint && <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 8px' }}>{f.hint}</p>}
          <input
            value={settings[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            style={inputStyle}
          />
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={save}
          disabled={saving}
          type="button"
          style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          {saving ? 'Salvando...' : buttonLabel}
        </button>
        {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
};
