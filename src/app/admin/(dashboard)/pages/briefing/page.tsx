'use client';

import { useState } from 'react';
import Link from 'next/link';
import PillTabs from '@/components/ui/PillTabs';
import TextGroupEditor from '@/components/admin/TextGroupEditor';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';
import SeoEditor from '@/components/admin/SeoEditor';

const TEXT_BLOCKS = [
  { prefix: 'briefing.intro.', title: 'Introdução' },
  { prefix: 'briefing.steps.', title: 'Navegação entre etapas' },
  { prefix: 'briefing.step1.', title: 'Etapa 1 — Empresa' },
  { prefix: 'briefing.step2.', title: 'Etapa 2 — Produto' },
  { prefix: 'briefing.step3.', title: 'Etapa 3 — Desafio' },
  { prefix: 'briefing.step4.', title: 'Etapa 4 — Objetivo' },
  { prefix: 'briefing.step5.', title: 'Etapa 5 — Prazo' },
  { prefix: 'briefing.step6.', title: 'Etapa 6 — Contato' },
  { prefix: 'briefing.options.', title: 'Opções de múltipla escolha' },
];

type Tab = 'texts' | 'recipient' | 'seo';

export default function AdminPagesBriefing() {
  const [tab, setTab] = useState<Tab>('texts');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <Link href="/admin/pages" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Pages
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 20px' }}>Página Briefing</h1>

      <div style={{ marginBottom: '24px' }}>
        <PillTabs
          tabs={[
            { id: 'texts', label: 'Textos' },
            { id: 'recipient', label: 'Destinatário do e-mail' },
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
          {TEXT_BLOCKS.map((b) => (
            <TextGroupEditor key={b.prefix} title={b.title} filter={(item) => item.key.startsWith(b.prefix)} lang={lang} />
          ))}
        </div>
      )}

      {tab === 'recipient' && (
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', maxWidth: '480px' }}>
          <SiteSettingsForm
            fields={[{ key: 'briefingFormRecipientEmail', label: 'E-mail de destino', hint: 'Pra onde vai o formulário de briefing.', placeholder: 'voce@exemplo.com' }]}
          />
        </div>
      )}

      {tab === 'seo' && <SeoEditor page="briefing" />}
    </div>
  );
}
