'use client';

import { useState } from 'react';
import PillTabs from '@/components/ui/PillTabs';
import SiteSettingsForm from './SiteSettingsForm';
import TextGroupEditor from './TextGroupEditor';

const TABS = [
  { id: 'contatos', label: 'Contatos' },
  { id: 'copyright', label: 'Copyright' },
];

/** Editor do Footer (Seções → Global). Os contatos daqui alimentam o rodapé, o botão flutuante do WhatsApp,
 * os botões de contato do CTA e os dados estruturados (JSON-LD). */
export default function GlobalFooterEditor() {
  const [tab, setTab] = useState('contatos');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <PillTabs tabs={TABS} activeId={tab} onChange={setTab} />
      </div>

      <div style={{ display: tab === 'contatos' ? 'block' : 'none' }}>
        <SiteSettingsForm
          fields={[
            { key: 'contactEmail', label: 'E-mail de contato', placeholder: 'voce@exemplo.com' },
            { key: 'whatsappNumber', label: 'WhatsApp', hint: 'Só dígitos, com DDI e DDD (ex: 5592981168163). Usado no rodapé, no botão flutuante e no botão “Entre em contato”.', placeholder: '5592981168163' },
            { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/seu-usuario/' },
          ]}
        />
      </div>
      <div style={{ display: tab === 'copyright' ? 'block' : 'none' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {(['pt', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              type="button"
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                border: lang === l ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: lang === l ? 'var(--color-primary)' : 'transparent',
                color: lang === l ? '#fff' : 'rgba(26,26,26,0.6)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {l === 'pt' ? 'PT-BR' : 'EN'}
            </button>
          ))}
        </div>
        <TextGroupEditor title="Texto de copyright" filter={(item) => item.group === 'footer'} lang={lang} />
      </div>
    </div>
  );
}
