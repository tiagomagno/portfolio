'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface ContentItem {
  key: string;
  group: string;
  page: string;
  defaultPt: string;
  defaultEn: string;
  valuePt: string | null;
  valueEn: string | null;
}

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

type Lang = 'pt' | 'en';

export default function AdminTextosPage() {
  const [lang, setLang] = useState<Lang>('pt');

  const [items, setItems] = useState<ContentItem[]>([]);
  const [pageOrder, setPageOrder] = useState<string[]>([]);
  const [edits, setEdits] = useState<Record<string, { pt: string; en: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingGroup, setSavingGroup] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [seoPages, setSeoPages] = useState<SeoPage[]>([]);
  const [seoEdits, setSeoEdits] = useState<Record<string, SeoPage>>({});
  const [activeSeoPage, setActiveSeoPage] = useState<string>('home');
  const [seoLoading, setSeoLoading] = useState(true);
  const [seoLoadError, setSeoLoadError] = useState(false);
  const [savingSeo, setSavingSeo] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [seoMessage, setSeoMessage] = useState('');

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

    fetch('/api/admin/seo')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const loaded: SeoPage[] = data.pages ?? [];
        setSeoPages(loaded);
        setSeoEdits(Object.fromEntries(loaded.map((p) => [p.page, p])));
      })
      .catch(() => setSeoLoadError(true))
      .finally(() => setSeoLoading(false));
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

  const activeSeo = seoEdits[activeSeoPage];

  function updateSeo(field: keyof SeoPage, value: string | boolean) {
    setSeoEdits((prev) => ({ ...prev, [activeSeoPage]: { ...prev[activeSeoPage], [field]: value } }));
  }

  async function saveSeo() {
    if (!activeSeo) return;
    setSavingSeo(true);
    setSeoMessage('');
    try {
      await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeSeo),
      });
      setSeoPages((prev) => prev.map((p) => (p.page === activeSeo.page ? activeSeo : p)));
      setSeoMessage('Salvo com sucesso.');
    } catch {
      setSeoMessage('Erro ao salvar.');
    } finally {
      setSavingSeo(false);
    }
  }

  async function uploadOgImage(file: File) {
    setUploadingOg(true);
    setSeoMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error();
      updateSeo('ogImage', data.url as string);
    } catch {
      setSeoMessage('Erro ao enviar imagem.');
    } finally {
      setUploadingOg(false);
    }
  }

  if (loading || seoLoading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Textos e SEO do Site</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 20px' }}>
        Sobrescreve os textos do site e o SEO de cada página, em PT e EN. Deixe igual ao original pra manter o padrão do código.
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {(['pt', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '8px 18px',
              borderRadius: '100px',
              border: lang === l ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: lang === l ? 'var(--color-primary)' : 'transparent',
              color: lang === l ? '#fff' : 'rgba(26,26,26,0.6)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {l === 'pt' ? 'PT-BR' : 'EN'}
          </button>
        ))}
      </div>

      {/* SEO */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px' }}>SEO</h2>
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
          {seoLoadError && (
            <p style={{ fontSize: '13px', color: '#b91c1c', margin: 0 }}>
              Não foi possível carregar o SEO — a tabela ainda não existe neste banco (falta rodar a sincronização do schema aqui). Os textos abaixo continuam funcionando normalmente.
            </p>
          )}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {seoPages.map((p) => (
              <button
                key={p.page}
                onClick={() => setActiveSeoPage(p.page)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: activeSeoPage === p.page ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: activeSeoPage === p.page ? 'var(--color-primary)' : 'transparent',
                  color: activeSeoPage === p.page ? '#fff' : 'rgba(26,26,26,0.6)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {activeSeo && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Field label={`Título (meta title) — ${lang === 'pt' ? 'PT-BR' : 'EN'}`}>
                <input
                  value={lang === 'pt' ? activeSeo.titlePt : activeSeo.titleEn}
                  onChange={(e) => updateSeo(lang === 'pt' ? 'titlePt' : 'titleEn', e.target.value)}
                  style={inputStyle}
                  placeholder={lang === 'pt' ? 'Título que aparece na aba do navegador e no Google' : 'Title (EN)'}
                />
              </Field>

              <Field label={`Descrição (meta description) — ${lang === 'pt' ? 'PT-BR' : 'EN'}`}>
                <textarea
                  value={lang === 'pt' ? activeSeo.descriptionPt : activeSeo.descriptionEn}
                  onChange={(e) => updateSeo(lang === 'pt' ? 'descriptionPt' : 'descriptionEn', e.target.value)}
                  rows={2}
                  style={textareaStyle}
                  placeholder={lang === 'pt' ? 'Texto exibido abaixo do título nos resultados de busca' : 'Description (EN)'}
                />
              </Field>

              <Field label={`Palavras-chave (meta keywords) — ${lang === 'pt' ? 'PT-BR' : 'EN'}`} hint="Separadas por vírgula.">
                <input
                  value={lang === 'pt' ? activeSeo.keywordsPt : activeSeo.keywordsEn}
                  onChange={(e) => updateSeo(lang === 'pt' ? 'keywordsPt' : 'keywordsEn', e.target.value)}
                  style={inputStyle}
                  placeholder="ux design, product design, design system"
                />
              </Field>

              <Field label="Imagem de compartilhamento (OG image)" hint="Aparece ao compartilhar o link no WhatsApp/Instagram/redes sociais. Recomendado: 1200×630px.">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {activeSeo.ogImage && (
                    <div style={{ position: 'relative', width: '160px', aspectRatio: '1200 / 630', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                      <Image src={activeSeo.ogImage} alt="Imagem de compartilhamento" fill sizes="160px" style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'inline-block', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--color-border)', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', width: 'fit-content' }}>
                      {uploadingOg ? 'Enviando...' : activeSeo.ogImage ? 'Trocar imagem' : 'Enviar imagem'}
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadOgImage(e.target.files[0])} style={{ display: 'none' }} disabled={uploadingOg} />
                    </label>
                    {activeSeo.ogImage && (
                      <button onClick={() => updateSeo('ogImage', '')} type="button" style={{ background: 'none', border: 'none', color: 'rgba(26,26,26,0.55)', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              <Field label="URL canônica" hint="Evita penalização por conteúdo duplicado quando a página é acessível por mais de uma URL. Deixe vazio se não tiver certeza.">
                <input
                  value={activeSeo.canonicalUrl}
                  onChange={(e) => updateSeo('canonicalUrl', e.target.value)}
                  style={inputStyle}
                  placeholder="https://tiagosmagno.com.br/portfolio"
                />
              </Field>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1a1a1a', cursor: 'pointer' }}>
                <input type="checkbox" checked={!activeSeo.noIndex} onChange={(e) => updateSeo('noIndex', !e.target.checked)} />
                Permitir que o Google indexe esta página
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={saveSeo}
                  disabled={savingSeo}
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  {savingSeo ? 'Salvando...' : 'Salvar SEO'}
                </button>
                {seoMessage && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{seoMessage}</span>}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Textos */}
      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px' }}>Textos</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por chave ou texto..."
        style={{ width: '100%', maxWidth: '360px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', marginBottom: '24px' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {pages.map(({ page, groups, total }) => (
          <section key={page}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {page}
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(26,26,26,0.4)' }}>{total} texto{total > 1 ? 's' : ''}</span>
            </h3>
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
                        <textarea
                          value={lang === 'pt' ? (edits[item.key]?.pt ?? '') : (edits[item.key]?.en ?? '')}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [item.key]: { ...prev[item.key], [lang === 'pt' ? 'pt' : 'en']: e.target.value },
                            }))
                          }
                          rows={2}
                          style={textareaStyle}
                          placeholder={lang === 'pt' ? 'PT-BR' : 'EN'}
                        />
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
