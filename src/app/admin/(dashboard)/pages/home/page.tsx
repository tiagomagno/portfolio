'use client';

import { useState } from 'react';
import Link from 'next/link';
import PillTabs from '@/components/ui/PillTabs';
import HomeSectionsEditor from '@/components/admin/HomeSectionsEditor';
import TextGroupEditor from '@/components/admin/TextGroupEditor';
import SeoEditor from '@/components/admin/SeoEditor';

const SECTIONS = [
  { group: 'hero', title: 'Hero Section' },
  { group: 'about', title: 'Sobre' },
  { group: 'work', title: 'Serviços' },
  { group: 'process', title: 'Processo' },
  { group: 'experience', title: 'Experiência' },
  { group: 'cases', title: 'Cases' },
  { group: 'contact', title: 'Vamos Conversar' },
  { group: 'stats', title: 'Números' },
  { group: 'skills', title: 'Competências' },
];

type Tab = 'sections' | 'texts' | 'seo';

export default function AdminPagesHome() {
  const [tab, setTab] = useState<Tab>('sections');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <Link href="/admin/pages" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Pages
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 20px' }}>Página Home</h1>

      <div style={{ marginBottom: '24px' }}>
        <PillTabs
          tabs={[
            { id: 'sections', label: 'Seções' },
            { id: 'texts', label: 'Textos por seção' },
            { id: 'seo', label: 'SEO' },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id as Tab)}
        />
      </div>

      {tab === 'sections' && <HomeSectionsEditor />}

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
          {SECTIONS.map((s) => (
            <TextGroupEditor key={s.group} title={s.title} filter={(item) => item.group === s.group} lang={lang} />
          ))}
        </div>
      )}

      {tab === 'seo' && <SeoEditor page="home" />}
    </div>
  );
}
