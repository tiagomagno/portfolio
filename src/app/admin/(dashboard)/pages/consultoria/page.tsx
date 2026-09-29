'use client';

import { useState } from 'react';
import Link from 'next/link';
import PillTabs from '@/components/ui/PillTabs';
import TextGroupEditor from '@/components/admin/TextGroupEditor';
import SeoEditor from '@/components/admin/SeoEditor';
import type { ContentItem } from '@/components/admin/TextGroupEditor';

// Na ordem em que aparecem na página. Os filtros são por chave (não só por grupo) porque alguns
// textos ficam em chaves de outra seção (ex.: o CTA final usa work.cta.*, os Números usam
// hero.stat2, about.badge e stats.stat4). Renomear as chaves deixaria órfãs as edições já salvas.
// Ordem em que aparecem na página de venda. O hero é o mesmo componente da Home (variação "consultoria"),
// mas com textos próprios; o CTA/rodapé final é compartilhado (ver "CTA final + rodapé" na Home).
const SECTIONS: { title: string; hint?: string; filter: (item: ContentItem) => boolean }[] = [
  { title: 'Hero', hint: 'Título, subtítulo e chamada do topo. Os botões usam "Falar sobre meu projeto" (nav.startProject).', filter: (i) => i.group === 'consultingHero' || i.key === 'consulting.eyebrow' },
  { title: 'Serviços', filter: (i) => i.key === 'work.title' || i.group === 'consultingServices' },
  { title: 'Processo', hint: 'Visão geral (Problema/Solução) e detalhamento de cada etapa.', filter: (i) => i.group === 'consultingProcess' || i.group === 'process' },
  { title: 'Evolução contínua (adendo do processo)', filter: (i) => i.key.startsWith('consulting.pillars.escala.') },
  { title: 'Impacto real', filter: (i) => i.group === 'consultingImpact' },
  { title: 'Portfólio + Sobre (blocos)', hint: 'O texto do Sobre reduzido vem de aboutBento.p1.', filter: (i) => i.group === 'consultingPage' || i.key === 'aboutBento.p1' || i.key === 'aboutBento.p2' },
  { title: 'FAQ', filter: (i) => i.group === 'faq' },
  { title: 'Textos antigos da consultoria (não usados na página atual)', filter: (i) => i.group === 'consulting' && !i.key.startsWith('consulting.pillars.escala.') && i.key !== 'consulting.eyebrow' },
];

type Tab = 'texts' | 'seo';

export default function AdminPagesConsultoria() {
  const [tab, setTab] = useState<Tab>('texts');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <Link href="/admin/pages" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Pages
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 20px' }}>Página Consultoria</h1>

      <div style={{ marginBottom: '24px' }}>
        <PillTabs
          tabs={[
            { id: 'texts', label: 'Textos por seção' },
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
          {SECTIONS.map((s) => (
            <TextGroupEditor key={s.title} title={s.title} hint={s.hint} filter={s.filter} lang={lang} />
          ))}
        </div>
      )}

      {tab === 'seo' && <SeoEditor page="consultoria" />}
    </div>
  );
}
