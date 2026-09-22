'use client';

import { useState } from 'react';
import Link from 'next/link';
import TextGroupEditor from '@/components/admin/TextGroupEditor';

export default function AdminPagesCaseDetail() {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <Link href="/admin/pages" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Pages
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 4px' }}>Página Detalhamento dos Cases</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 20px' }}>
        Rótulos e títulos fixos usados na página de qualquer case (/portfolio/[slug]) — o conteúdo de cada case (textos, imagens) é editado em Cases, no menu principal.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['pt', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              type="button"
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
        <TextGroupEditor title="Textos padrão de exibição" filter={(item) => item.group === 'case' || item.group === 'category'} lang={lang} />
      </div>
    </div>
  );
}
