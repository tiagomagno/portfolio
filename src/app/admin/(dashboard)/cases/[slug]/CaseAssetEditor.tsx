'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CaseAssetEditorProps {
  slug: string;
  fallbackImage?: string;
}

export default function CaseAssetEditor({ slug, fallbackImage }: CaseAssetEditorProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
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
        setGallery(Array.isArray(data.asset?.gallery) ? data.asset.gallery : []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Falha no upload');
    return data.url as string;
  }

  async function handleSingleUpload(field: 'cover' | 'hero', file: File) {
    setUploadingField(field);
    setMessage('');
    try {
      const url = await uploadFile(file);
      if (field === 'cover') setCoverImage(url);
      else setHeroImage(url);
    } catch {
      setMessage('Erro ao enviar imagem.');
    } finally {
      setUploadingField(null);
    }
  }

  async function handleGalleryUpload(files: FileList) {
    setUploadingField('gallery');
    setMessage('');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file));
      }
      setGallery((prev) => [...prev, ...urls]);
    } catch {
      setMessage('Erro ao enviar uma ou mais imagens da galeria.');
    } finally {
      setUploadingField(null);
    }
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
        body: JSON.stringify({ coverImage, heroImage, gallery }),
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
      <ImageField
        label="Capa"
        hint="Home, listagem do portfólio e card de próximo case. Formato recomendado: 1600×1200px (4:3)."
        value={coverImage}
        placeholderImage={fallbackImage}
        uploading={uploadingField === 'cover'}
        onUpload={(file) => handleSingleUpload('cover', file)}
        onRemove={() => setCoverImage(null)}
      />

      <ImageField
        label="Imagem de topo"
        hint="Banner do topo da página de detalhamento. Formato recomendado: 1920×1080px (16:9). Se vazio, usa a capa."
        value={heroImage}
        uploading={uploadingField === 'hero'}
        onUpload={(file) => handleSingleUpload('hero', file)}
        onRemove={() => setHeroImage(null)}
      />

      <div>
        <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Galeria</span>
        <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' }}>
          Posts, mockup do site, telas do app etc. Formato recomendado: 1200×900px (4:3) por imagem.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          {gallery.map((src, i) => (
            <div key={src + i} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <Image src={src} alt={`Galeria ${i + 1}`} fill sizes="140px" style={{ objectFit: 'cover' }} />
              <button
                onClick={() => removeGalleryImage(i)}
                type="button"
                style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: 1 }}
                aria-label="Remover"
              >
                ×
              </button>
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
      <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>{label}</span>
      <p style={{ fontSize: '12px', color: 'rgba(26,26,26,0.55)', margin: '0 0 12px' }}>{hint}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {preview && (
          <div style={{ position: 'relative', width: '160px', aspectRatio: '4 / 3', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
            <Image src={preview} alt={label} fill sizes="160px" style={{ objectFit: 'cover' }} />
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
          {value && (
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
