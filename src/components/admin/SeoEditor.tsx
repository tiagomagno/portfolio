'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SeoPage {
  page: string;
  label: string;
  titlePt: string;
  titleEn: string;
  descriptionPt: string;
  descriptionEn: string;
  keywordsPt: string;
  keywordsEn: string;
  ogImage: string | null;
  canonicalUrl: string;
  noIndex: boolean;
}

/** Editor de SEO (título, descrição, keywords, OG image, canônica, indexação) de UMA
 * página fixa (model SeoMeta). Cada sub-página de /admin/pages renderiza uma instância
 * apontando pro seu próprio `page` (ex. "home", "portfolio", "briefing"). */
export default function SeoEditor({ page }: { page: string }) {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [seo, setSeo] = useState<SeoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/seo')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const found: SeoPage[] = data.pages ?? [];
        setSeo(found.find((p) => p.page === page) ?? null);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [page]);

  function update(field: keyof SeoPage, value: string | boolean) {
    setSeo((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function save() {
    if (!seo) return;
    setSaving(true);
    setMessage('');
    try {
      await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seo),
      });
      setMessage('Salvo com sucesso.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadOgImage(file: File) {
    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error();
      update('ogImage', data.url as string);
    } catch {
      setMessage('Erro ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  if (loadError) {
    return (
      <p style={{ fontSize: '13px', color: '#b91c1c' }}>
        Não foi possível carregar o SEO — a tabela ainda não existe neste banco (falta rodar a sincronização do schema aqui).
      </p>
    );
  }

  if (!seo) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Página de SEO não encontrada.</p>;

  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
        {(['pt', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            type="button"
            style={{
              padding: '6px 14px',
              borderRadius: '100px',
              border: lang === l ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: lang === l ? 'var(--color-primary)' : 'transparent',
              color: lang === l ? '#fff' : 'rgba(26,26,26,0.6)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {l === 'pt' ? 'PT-BR' : 'EN'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label={`Título (meta title) — ${lang === 'pt' ? 'PT-BR' : 'EN'}`}>
          <input
            value={lang === 'pt' ? seo.titlePt : seo.titleEn}
            onChange={(e) => update(lang === 'pt' ? 'titlePt' : 'titleEn', e.target.value)}
            style={inputStyle}
            placeholder={lang === 'pt' ? 'Título que aparece na aba do navegador e no Google' : 'Title (EN)'}
          />
        </Field>

        <Field label={`Descrição (meta description) — ${lang === 'pt' ? 'PT-BR' : 'EN'}`}>
          <textarea
            value={lang === 'pt' ? seo.descriptionPt : seo.descriptionEn}
            onChange={(e) => update(lang === 'pt' ? 'descriptionPt' : 'descriptionEn', e.target.value)}
            rows={2}
            style={textareaStyle}
            placeholder={lang === 'pt' ? 'Texto exibido abaixo do título nos resultados de busca' : 'Description (EN)'}
          />
        </Field>

        <Field label={`Palavras-chave (meta keywords) — ${lang === 'pt' ? 'PT-BR' : 'EN'}`} hint="Separadas por vírgula.">
          <input
            value={lang === 'pt' ? seo.keywordsPt : seo.keywordsEn}
            onChange={(e) => update(lang === 'pt' ? 'keywordsPt' : 'keywordsEn', e.target.value)}
            style={inputStyle}
            placeholder="ux design, product design, design system"
          />
        </Field>

        <Field label="Imagem de compartilhamento (OG image)" hint="Aparece ao compartilhar o link no WhatsApp/Instagram/redes sociais. Recomendado: 1200×630px.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {seo.ogImage && (
              <div style={{ position: 'relative', width: '160px', aspectRatio: '1200 / 630', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                <Image src={seo.ogImage} alt="Imagem de compartilhamento" fill sizes="160px" style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'inline-block', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--color-border)', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', width: 'fit-content' }}>
                {uploading ? 'Enviando...' : seo.ogImage ? 'Trocar imagem' : 'Enviar imagem'}
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadOgImage(e.target.files[0])} style={{ display: 'none' }} disabled={uploading} />
              </label>
              {seo.ogImage && (
                <button onClick={() => update('ogImage', '')} type="button" style={{ background: 'none', border: 'none', color: 'rgba(26,26,26,0.55)', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Remover
                </button>
              )}
            </div>
          </div>
        </Field>

        <Field label="URL canônica" hint="Evita penalização por conteúdo duplicado quando a página é acessível por mais de uma URL. Deixe vazio se não tiver certeza.">
          <input
            value={seo.canonicalUrl}
            onChange={(e) => update('canonicalUrl', e.target.value)}
            style={inputStyle}
            placeholder="https://tiagosmagno.com.br/portfolio"
          />
        </Field>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a1a1a', cursor: 'pointer' }}>
          <input type="checkbox" checked={!seo.noIndex} onChange={(e) => update('noIndex', !e.target.checked)} />
          Permitir que o Google indexe esta página
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={save}
            disabled={saving}
            type="button"
            style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            {saving ? 'Salvando...' : 'Salvar SEO'}
          </button>
          {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{label}</span>
      {hint && <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 8px' }}>{hint}</p>}
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid var(--color-border)',
  fontSize: '13px',
  fontFamily: 'inherit',
  resize: 'vertical',
};
