'use client';

import Image from 'next/image';

export default function ImageField({
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
      {label && <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>{label}</span>}
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
      {hint && <p style={{ fontSize: '11px', color: 'rgba(26,26,26,0.55)', margin: '8px 0 0' }}>{hint}</p>}
    </div>
  );
}
