'use client';

import { useState } from 'react';
import Sheet from '@/components/admin/Sheet';
import AdminListTable from '@/components/admin/AdminListTable';
import IconActionButton from '@/components/admin/IconActionButton';
import GlobalHeaderEditor from '@/components/admin/GlobalHeaderEditor';
import GlobalFooterEditor from '@/components/admin/GlobalFooterEditor';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

const ITEMS = [
  { id: 'header', title: 'Header', desc: 'Marca exibida no cabeçalho e rodapé, itens de navegação, e os textos fixos do menu.' },
  { id: 'contact', title: 'Seção de Contatos', desc: 'E-mail, WhatsApp e LinkedIn exibidos na home, no rodapé, no botão flutuante e nos dados estruturados do site.' },
  { id: 'footer', title: 'Footer', desc: 'Links de redes sociais/WhatsApp exibidos no rodapé e o destinatário do formulário de contato da home.' },
] as const;

type ItemId = (typeof ITEMS)[number]['id'];

export default function AdminGlobalPage() {
  const [openId, setOpenId] = useState<ItemId | null>(null);
  const open = ITEMS.find((i) => i.id === openId) ?? null;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Global</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Organização de conteúdos globais — header, seção de contatos e footer, usados em todas as páginas do site.
      </p>

      <AdminListTable
        rows={ITEMS.map((item) => ({ id: item.id, title: item.title, desc: item.desc }))}
        renderAction={(row) => <IconActionButton icon="edit" label="Editar" onClick={() => setOpenId(row.id as ItemId)} />}
      />

      <Sheet open={!!open} onClose={() => setOpenId(null)} title={open?.title}>
        {open?.id === 'header' && <GlobalHeaderEditor />}
        {open?.id === 'contact' && (
          <SiteSettingsForm
            fields={[
              { key: 'contactEmail', label: 'E-mail de contato', placeholder: 'voce@exemplo.com' },
              { key: 'whatsappNumber', label: 'WhatsApp', hint: 'Só dígitos, com DDI e DDD (ex: 5592981168163).', placeholder: '5592981168163' },
              { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/seu-usuario/' },
            ]}
          />
        )}
        {open?.id === 'footer' && <GlobalFooterEditor />}
      </Sheet>
    </div>
  );
}
