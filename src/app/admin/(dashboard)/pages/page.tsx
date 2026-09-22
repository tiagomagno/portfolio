'use client';

import AdminListTable from '@/components/admin/AdminListTable';
import IconActionButton from '@/components/admin/IconActionButton';

const PAGES = [
  { id: 'home', href: '/admin/pages/home', title: 'Página Home', desc: 'Seções, textos por seção e SEO da página inicial.' },
  { id: 'cases', href: '/admin/pages/cases', title: 'Página Cases', desc: 'Hero, "Próximo Passo" e SEO da listagem de cases (/portfolio).' },
  { id: 'case-detail', href: '/admin/pages/case-detail', title: 'Página Detalhamento dos Cases', desc: 'Textos padrão de exibição de qualquer case (/portfolio/[slug]).' },
  { id: 'briefing', href: '/admin/pages/briefing', title: 'Página Briefing', desc: 'Textos do formulário, destinatário do e-mail e SEO.' },
];

export default function AdminPagesIndex() {
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Pages</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Organização de conteúdo das páginas do site.
      </p>

      <AdminListTable
        rows={PAGES}
        renderAction={(row) => {
          const page = PAGES.find((p) => p.id === row.id)!;
          return <IconActionButton icon="edit" label="Editar" href={page.href} />;
        }}
      />
    </div>
  );
}
