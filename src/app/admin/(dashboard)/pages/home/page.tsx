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
const SECTIONS: { title: string; hint?: string; filter: (item: ContentItem) => boolean }[] = [
  { title: 'Hero', hint: 'Título, nome, texto e botões do topo da Home.', filter: (i) => i.group === 'hero' && !i.key.startsWith('hero.stat') },
  { title: 'Cases (portfólio)', filter: (i) => ['cases.eyebrow', 'cases.heading', 'cases.intro', 'cases.viewAll'].includes(i.key) },
  { title: 'Processo (Problema → Solução)', filter: (i) => i.group === 'process' },
  { title: 'Sobre mim', hint: 'Título da seção, nome e textos (Sobre em blocos).', filter: (i) => i.key === 'aboutBento.title' || i.key === 'about.eyebrow' || i.key === 'about.heading' || i.key === 'about.newPhoto.alt' || /^about\.p[1-5]$/.test(i.key) },
  { title: 'Sobre: números', hint: 'Os três números do bloco.', filter: (i) => i.key.startsWith('about.badge') || i.key.startsWith('hero.stat') || i.key.startsWith('stats.stat4') },
  { title: 'Sobre: habilidades', hint: 'Rótulos dos grupos e as listas de habilidades (a Home mostra só algumas etiquetas de cada grupo).', filter: (i) => i.group === 'skills' || ['aboutBento.skill2', 'aboutBento.skill5', 'aboutBento.skillAi', 'aboutBento.toolsList', 'aboutBento.aiList'].includes(i.key) },
  { title: 'Sobre: tipos de projetos', filter: (i) => i.key === 'aboutBento.areas' || i.key === 'aboutBento.areasList' },
  { title: 'Sobre: trajetória', filter: (i) => i.group === 'experience' || i.key === 'aboutBento.timeline' },
  { title: 'Design Lab', hint: 'Título, subtítulo e filtros. Os projetos do Lab são cadastrados em Seções → Conteúdo → Design Lab.', filter: (i) => i.group === 'labs' },
  { title: 'CTA final + rodapé', hint: 'Também usado no fim das páginas Consultoria e Cases.', filter: (i) => i.key.startsWith('work.cta.') || i.group === 'footer' },
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
            <TextGroupEditor key={s.title} title={s.title} hint={s.hint} filter={s.filter} lang={lang} />
          ))}
        </div>
      )}

      {tab === 'seo' && <SeoEditor page="home" />}
    </div>
  );
}
