'use client';

import { useState } from 'react';
import PillTabs from '@/components/ui/PillTabs';
import MenuEditor from './MenuEditor';
import SiteSettingsForm from './SiteSettingsForm';
import SiteFileField from './SiteFileField';
import TextGroupEditor from './TextGroupEditor';

const TABS = [
  { id: 'marca', label: 'Marca e logo' },
  { id: 'curriculo', label: 'Currículo' },
  { id: 'menu', label: 'Menu' },
  { id: 'textos', label: 'Textos do menu' },
];

/** Editor do Header, aberto dentro do Sheet de /admin/global — mesmo padrão de abas
 * (PillTabs + display:none na seção inativa) usado no CaseForm, pra trocar de conteúdo
 * sem desmontar (preserva edição não salva ao alternar de aba). */
export default function GlobalHeaderEditor() {
  const [tab, setTab] = useState('marca');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <PillTabs tabs={TABS} activeId={tab} onChange={setTab} />
      </div>

      <div style={{ display: tab === 'marca' ? 'block' : 'none' }}>
        <SiteSettingsForm
          fields={[{ key: 'brandName', label: 'Nome da marca', hint: 'Exibido no cabeçalho, rodapé e dados estruturados (JSON-LD) do site.' }]}
        />
      </div>

      <div style={{ display: tab === 'marca' ? 'block' : 'none', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
        <SiteFileField
          settingKey="logoUrl"
          kind="logo"
          label="Logo"
          hint="SVG, PNG ou WebP (até 2 MB). Substitui a logo do cabeçalho, do rodapé e da abertura. Fundo transparente e versão clara funcionam melhor no tema escuro."
          accept="image/svg+xml,image/png,image/webp"
          preview="image"
        />
      </div>

      <div style={{ display: tab === 'curriculo' ? 'block' : 'none' }}>
        <SiteFileField
          settingKey="resumeUrl"
          kind="resume"
          label="Currículo (botão “Baixar currículo”)"
          hint="Envie um PDF (até 10 MB) ou informe um link. O botão do cabeçalho passa a baixar este arquivo."
          accept="application/pdf"
          preview="link"
        />
      </div>

      <div style={{ display: tab === 'menu' ? 'block' : 'none' }}>
        <MenuEditor />
      </div>

      <div style={{ display: tab === 'textos' ? 'block' : 'none' }}>
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
        <TextGroupEditor
          title="Textos fixos do menu"
          hint="Rótulos padrão do menu (usados quando não há itens cadastrados) e das trilhas de navegação (breadcrumb)."
          filter={(item) => item.group === 'nav' || item.group === 'breadcrumb'}
          lang={lang}
        />
      </div>
    </div>
  );
}
