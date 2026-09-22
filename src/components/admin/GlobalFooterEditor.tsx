'use client';

import { useState } from 'react';
import PillTabs from '@/components/ui/PillTabs';
import SiteSettingsForm from './SiteSettingsForm';
import TextGroupEditor from './TextGroupEditor';

const TABS = [
  { id: 'redes', label: 'Redes sociais' },
  { id: 'contato', label: 'Form. de contato' },
  { id: 'copyright', label: 'Copyright' },
];

/** Editor do Footer, aberto dentro do Sheet de /admin/global — mesmo padrão de abas do
 * GlobalHeaderEditor/CaseForm (PillTabs + display:none na seção inativa). */
export default function GlobalFooterEditor() {
  const [tab, setTab] = useState('redes');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <PillTabs tabs={TABS} activeId={tab} onChange={setTab} />
      </div>

      <div style={{ display: tab === 'redes' ? 'block' : 'none' }}>
        <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.65)', margin: 0, lineHeight: 1.6 }}>
          Os ícones de LinkedIn e WhatsApp exibidos no rodapé usam os mesmos valores configurados em Global → Seção de Contatos — editar lá atualiza o rodapé também.
        </p>
      </div>

      <div style={{ display: tab === 'contato' ? 'block' : 'none' }}>
        <SiteSettingsForm
          fields={[
            {
              key: 'contactFormRecipientEmail',
              label: 'E-mail de destino',
              hint: 'Pra onde vai o formulário de contato da home. O destinatário do Briefing é configurado separadamente em Pages → Briefing.',
              placeholder: 'voce@exemplo.com',
            },
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
