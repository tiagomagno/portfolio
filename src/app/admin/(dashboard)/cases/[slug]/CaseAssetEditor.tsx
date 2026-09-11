'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ATUACAO_CATEGORIES, parseAtuacaoList, type AtuacaoCategory } from '@/data/portfolio';

interface CaseAssetEditorProps {
  slug: string;
  fallbackImage?: string;
  fallbackAtuacao: AtuacaoCategory[];
}

interface GalleryItem {
  url: string;
  active: boolean;
}

/** Aceita tanto o formato novo ({ url, active }) quanto o antigo (string[]) vindo do banco. */
function normalizeGallery(raw: unknown): GalleryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): GalleryItem | null => {
      if (typeof item === 'string') return { url: item, active: true };
      if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') {
        const obj = item as { url: string; active?: unknown };
        return { url: obj.url, active: obj.active !== false };
      }
      return null;
    })
    .filter((item): item is GalleryItem => item !== null);
}

export default function CaseAssetEditor({ slug, fallbackImage, fallbackAtuacao }: CaseAssetEditorProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroColor, setHeroColor] = useState<string | null>(null);
  const [heroMode, setHeroMode] = useState<'image' | 'color'>('image');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [atuacao, setAtuacao] = useState<AtuacaoCategory[]>(fallbackAtuacao);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/admin/case-assets/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setCoverImage(data.asset?.coverImage ?? null);
        setHeroImage(data.asset?.heroImage ?? null);
        setHeroColor(data.asset?.heroColor ?? null);
        setHeroMode(data.asset?.heroColor ? 'color' : 'image');
        setGallery(normalizeGallery(data.asset?.gallery));
        setAtuacao(parseAtuacaoList(data.asset?.atuacao) ?? fallbackAtuacao);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  function toggleAtuacao(cat: AtuacaoCategory) {
    setAtuacao((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  function selectHeroMode(mode: 'image' | 'color') {
    setHeroMode(mode);
    // Imagem e cor são mutuamente exclusivas — trocar o modo limpa o campo do outro.
    if (mode === 'image') setHeroColor(null);
    else setHeroImage(null);
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Falha no upload');
    return data.url as string;
  }

  async function handleSingleUpload(field: 'cover' | 'hero', file: File) {
    // Preview local instantâneo (blob: do próprio arquivo escolhido) — não depende do
    // servidor nem do otimizador de imagem, então mostra a thumb imediatamente ao
    // escolher o arquivo, antes mesmo do upload terminar.
    const setImage = field === 'cover' ? setCoverImage : setHeroImage;
    const previous = field === 'cover' ? coverImage : heroImage;
    const localUrl = URL.createObjectURL(file);
    setImage(localUrl);
    setUploadingField(field);
    setMessage('');
    try {
      const url = await uploadFile(file);
      setImage(url);
    } catch {
      setImage(previous);
      setMessage('Erro ao enviar imagem.');
    } finally {
      setUploadingField(null);
      URL.revokeObjectURL(localUrl);
    }
  }

  async function handleGalleryUpload(files: FileList) {
    setUploadingField('gallery');
    setMessage('');
    let hadError = false;
    for (const file of Array.from(files)) {
      const localUrl = URL.createObjectURL(file);
      setGallery((prev) => [...prev, { url: localUrl, active: true }]);
      try {
        const url = await uploadFile(file);
        setGallery((prev) => prev.map((item) => (item.url === localUrl ? { ...item, url } : item)));
      } catch {
        hadError = true;
        setGallery((prev) => prev.filter((item) => item.url !== localUrl));
      } finally {
        URL.revokeObjectURL(localUrl);
      }
    }
    if (hadError) setMessage('Erro ao enviar uma ou mais imagens da galeria.');
    setUploadingField(null);
  }

  function toggleGalleryImage(index: number) {
    setGallery((prev) => prev.map((item, i) => (i === index ? { ...item, active: !item.active } : item)));
  }

  function removeGalleryImage(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/case-assets/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImage, heroImage, heroColor, gallery, atuacao }),
      });
      if (!res.ok) throw new Error();
      setMessage('Salvo com sucesso.');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)' }}>Carregando...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '720px' }}>
      <div>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Categorias</span>
        <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' }}>
          Usadas no filtro do portfólio e exibidas no card do case. Escolha uma ou mais.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {ATUACAO_CATEGORIES.map((cat) => {
            const active = atuacao.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleAtuacao(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: active ? 'var(--color-primary)' : 'transparent',
                  color: active ? '#fff' : 'rgba(26,26,26,0.6)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <ImageField
        label="Capa"
        hint="Home, listagem do portfólio e card de próximo case. Formato recomendado: 1600×1200px (4:3)."
        value={coverImage}
        placeholderImage={fallbackImage}
        uploading={uploadingField === 'cover'}
        onUpload={(file) => handleSingleUpload('cover', file)}
        onRemove={() => setCoverImage('')}
      />

      <div>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Imagem de topo</span>
        <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' }}>
          Banner do topo da página de detalhamento: imagem (1920×1080px, 16:9) ou uma cor sólida. Se nenhuma for definida, usa a capa.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['image', 'color'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => selectHeroMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                border: heroMode === mode ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: heroMode === mode ? 'var(--color-primary)' : 'transparent',
                color: heroMode === mode ? '#fff' : 'rgba(26,26,26,0.6)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {mode === 'image' ? 'Imagem' : 'Cor'}
            </button>
          ))}
        </div>

        {heroMode === 'image' ? (
          <ImageField
            label=""
            hint=""
            value={heroImage}
            uploading={uploadingField === 'hero'}
            onUpload={(file) => handleSingleUpload('hero', file)}
            onRemove={() => setHeroImage('')}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="color"
              value={heroColor ?? '#1a1a1a'}
              onChange={(e) => setHeroColor(e.target.value)}
              style={{ width: '48px', height: '48px', padding: 0, border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
            />
            <input
              type="text"
              value={heroColor ?? ''}
              onChange={(e) => setHeroColor(e.target.value)}
              placeholder="#1a1a1a"
              style={{ width: '120px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px' }}
            />
          </div>
        )}
      </div>

      <div>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Galeria</span>
        <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' }}>
          Posts, mockup do site, telas do app etc. Formato recomendado: 1200×900px (4:3) por imagem.
        </p>
        {/* unoptimized: a thumb some acabou de subir e não passou pelo otimizador do Next ainda —
            pedir a versão otimizada nesse instante dava ícone quebrado até a página recarregar. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          {gallery.map((item, i) => (
            <div
              key={item.url + i}
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                opacity: item.active ? 1 : 0.4,
              }}
            >
              <Image src={item.url} alt={`Galeria ${i + 1}`} fill sizes="140px" style={{ objectFit: 'cover' }} unoptimized />
              {!item.active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  Desativada
                </span>
              )}
              <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => toggleGalleryImage(i)}
                  type="button"
                  title={item.active ? 'Desativar (esconde do site sem excluir)' : 'Ativar'}
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}
                  aria-label={item.active ? 'Desativar' : 'Ativar'}
                >
                  {item.active ? '◐' : '○'}
                </button>
                <button
                  onClick={() => removeGalleryImage(i)}
                  type="button"
                  title="Excluir definitivamente"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}
                  aria-label="Excluir"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
        <label
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px dashed var(--color-border)',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1a1a1a',
            cursor: 'pointer',
          }}
        >
          {uploadingField === 'gallery' ? 'Enviando...' : '+ Adicionar imagens'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
            style={{ display: 'none' }}
            disabled={uploadingField === 'gallery'}
          />
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleSave}
          disabled={saving || uploadingField !== null}
          style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: saving || uploadingField !== null ? 'default' : 'pointer', opacity: saving || uploadingField !== null ? 0.7 : 1 }}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {message && <span style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)' }}>{message}</span>}
      </div>
    </div>
  );
}

function ImageField({
  label,
  hint,
  value,
  placeholderImage,
  uploading,
  onUpload,
  onRemove,
}: {
  label: string;
  hint: string;
  value: string | null;
  placeholderImage?: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const preview = value ?? placeholderImage;

  return (
    <div>
      {label && <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{label}</span>}
      {hint && <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' }}>{hint}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {preview && (
          <div style={{ position: 'relative', width: '160px', aspectRatio: '4 / 3', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
            <Image src={preview} alt={label} fill sizes="160px" style={{ objectFit: 'cover' }} unoptimized />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px dashed var(--color-border)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1a1a1a',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            {uploading ? 'Enviando...' : value ? 'Trocar imagem' : 'Enviar imagem'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
          {preview && (
            <button
              onClick={onRemove}
              type="button"
              style={{ background: 'none', border: 'none', color: 'rgba(26,26,26,0.55)', fontSize: '12px', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
