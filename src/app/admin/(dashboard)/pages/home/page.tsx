'use client';

import { useState } from 'react';
import Link from 'next/link';
import PillTabs from '@/components/ui/PillTabs';
import HomeSectionsEditor from '@/components/admin/HomeSectionsEditor';
import TextGroupEditor from '@/components/admin/TextGroupEditor';
import SeoEditor from '@/components/admin/SeoEditor';
import type { ContentItem } from '@/components/admin/TextGroupEditor';

// Na ordem em que aparecem na página. Os filtros são por chave (não só por grupo) porque alguns
// textos ficam em chaves de outra seção (ex.: o CTA final usa work.cta.*, os Números usam
// hero.stat2, about.badge e stats.stat4). Renomear as chaves deixaria órfãs as edições já salvas.
const SECTIONS: { title: string; filter: (item: ContentItem) => boolean }[] = [
  { title: 'Hero Section', filter: (i) => i.group === 'hero' && !i.key.startsWith('hero.stat') },
  { title: 'Introdução', filter: (i) => i.group === 'intro' },
  { title: 'O que faço', filter: (i) => i.group === 'work' && !i.key.startsWith('work.cta.') && !i.key.startsWith('work.item') },
  { title: 'Cases', filter: (i) => ['cases.eyebrow', 'cases.heading', 'cases.intro', 'cases.viewAll'].includes(i.key) },
  { title: 'Como trabalho', filter: (i) => i.group === 'process' },
  { title: 'Posicionamento', filter: (i) => i.group === 'positioning' },
  { title: 'Sobre', filter: (i) => i.group === 'about' && !i.key.startsWith('about.badge') },
  { title: 'Números', filter: (i) => i.group === 'stats' || i.key.startsWith('hero.stat') || i.key.startsWith('about.badge') },
  { title: 'Trajetória', filter: (i) => i.group === 'experience' },
  { title: 'Competências', filter: (i) => i.group === 'skills' },
  { title: 'CTA final', filter: (i) => i.key.startsWith('work.cta.') },
  { title: 'Contato', filter: (i) => i.group === 'contact' },
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
            <TextGroupEditor key={s.title} title={s.title} filter={s.filter} lang={lang} />
          ))}
        </div>
      )}

      {tab === 'seo' && <SeoEditor page="home" />}
    </div>
  );
}
