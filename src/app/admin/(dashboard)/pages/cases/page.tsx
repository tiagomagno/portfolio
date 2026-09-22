'use client';

import { useState } from 'react';
import Link from 'next/link';
import PillTabs from '@/components/ui/PillTabs';
import TextGroupEditor from '@/components/admin/TextGroupEditor';
import SeoEditor from '@/components/admin/SeoEditor';

type Tab = 'texts' | 'seo';

export default function AdminPagesCases() {
  const [tab, setTab] = useState<Tab>('texts');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <Link href="/admin/pages" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Pages
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 4px' }}>Página Cases</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 20px' }}>
        Listagem de cases (/portfolio). O conteúdo de cada case é editado em Cases, no menu principal.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <PillTabs
          tabs={[
            { id: 'texts', label: 'Textos' },
            { id: 'seo', label: 'SEO' },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id as Tab)}
        />
      </div>

      {tab === 'texts' && (
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
          <TextGroupEditor
            title="Hero Section"
            filter={(item) => item.group === 'portfolioPage' && !item.key.startsWith('portfolioPage.cta.')}
            lang={lang}
          />
          <TextGroupEditor
            title="Próximo Passo"
            filter={(item) => item.key.startsWith('portfolioPage.cta.')}
            lang={lang}
          />
        </div>
      )}

      {tab === 'seo' && <SeoEditor page="portfolio" />}
    </div>
  );
}
