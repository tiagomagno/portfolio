'use client';

import { useState } from 'react';
import AdminListTable from '@/components/admin/AdminListTable';
import IconActionButton from '@/components/admin/IconActionButton';
import Sheet from '@/components/admin/Sheet';
import GlobalHeaderEditor from '@/components/admin/GlobalHeaderEditor';
import GlobalFooterEditor from '@/components/admin/GlobalFooterEditor';
import LabEditor from '@/components/admin/LabEditor';
import HomePage from './home/page';
import ConsultoriaPage from './consultoria/page';
import CasesPage from './cases/page';
import CaseDetailPage from './case-detail/page';
import BriefingPage from './briefing/page';
import PrivacyPage from './privacy/page';

// Global (header e footer, presentes em todas as páginas) + as seções de cada página.
const GLOBAL = [
  { id: 'header', title: 'Header', desc: 'Logo, nome da marca, currículo, itens do menu e textos fixos da navegação.' },
  { id: 'footer', title: 'Footer', desc: 'E-mail, WhatsApp e LinkedIn (também usados no botão flutuante e nos CTAs) e o copyright.' },
] as const;

const CONTENT = [
  { id: 'lab', title: 'Design Lab', desc: 'Projetos do Lab da Home: nome, descrição, status, link, imagem e ordem.' },
] as const;

const PAGES = [
  { id: 'home', href: '/admin/pages/home', title: 'Home', desc: 'Seções, textos por seção e SEO da página inicial.' },
  { id: 'consultoria', href: '/admin/pages/consultoria', title: 'Consultoria', desc: 'Hero, serviços, processo, impacto, FAQ e SEO da página de venda (/consultoria).' },
  { id: 'cases', href: '/admin/pages/cases', title: 'Cases', desc: 'Hero, "Próximo Passo" e SEO da listagem de cases (/portfolio).' },
  { id: 'case-detail', href: '/admin/pages/case-detail', title: 'Detalhamento dos Cases', desc: 'Textos padrão de exibição de qualquer case (/portfolio/[slug]).' },
  { id: 'briefing', href: '/admin/pages/briefing', title: 'Briefing', desc: 'Textos do formulário, destinatário do e-mail e SEO.' },
  { id: 'privacy', href: '/admin/pages/privacy', title: 'Privacidade', desc: 'Texto da Política de Privacidade (/privacidade).' },
];

// Título com linha, separando os grupos da lista.
function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.55)' }}>
      {label}
      <span style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
    </div>
  );
}

type GlobalId = (typeof GLOBAL)[number]['id'];
type PageId = (typeof PAGES)[number]['id'];
type OpenId = GlobalId | PageId | 'lab';

// Cada página abre no Sheet com o mesmo conteúdo da rota própria (que segue existindo); o link de voltar e o título
// da rota ficam ocultos, porque o Sheet já mostra o título.
const PAGE_VIEWS: Record<PageId, React.ComponentType> = {
  home: HomePage,
  consultoria: ConsultoriaPage,
  cases: CasesPage,
  'case-detail': CaseDetailPage,
  briefing: BriefingPage,
  privacy: PrivacyPage,
};

export default function AdminSectionsIndex() {
  const [openId, setOpenId] = useState<OpenId | null>(null);
  const open = [...GLOBAL, ...CONTENT, ...PAGES].find((g) => g.id === openId) ?? null;
  const PageView = openId && openId in PAGE_VIEWS ? PAGE_VIEWS[openId as PageId] : null;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Seções</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Conteúdo do site: o Global (header e footer, em todas as páginas) e as seções de cada página.
      </p>

      <SectionDivider label="Global" />
      <AdminListTable
        rows={GLOBAL.map((r) => ({ id: r.id, title: r.title, desc: r.desc }))}
        renderAction={(row) => <IconActionButton icon="edit" label="Editar" onClick={() => setOpenId(row.id as OpenId)} />}
      />

      <div style={{ height: '32px' }} />
      <SectionDivider label="Conteúdo" />
      <AdminListTable
        rows={CONTENT.map((r) => ({ id: r.id, title: r.title, desc: r.desc }))}
        renderAction={(row) => <IconActionButton icon="edit" label="Editar" onClick={() => setOpenId(row.id as OpenId)} />}
      />

      <div style={{ height: '32px' }} />
      <SectionDivider label="Páginas" />
      <AdminListTable
        rows={PAGES.map((r) => ({ id: r.id, title: r.title, desc: r.desc }))}
        renderAction={(row) => <IconActionButton icon="edit" label="Editar" onClick={() => setOpenId(row.id as OpenId)} />}
      />

      <Sheet open={!!open} onClose={() => setOpenId(null)} title={open?.title}>
        {open?.id === 'header' && <GlobalHeaderEditor />}
        {open?.id === 'footer' && <GlobalFooterEditor />}
        {open?.id === 'lab' && <LabEditor />}
        {PageView && (
          <div className="admin-embed">
            <style>{'.admin-embed > div > a[href="/admin/pages"], .admin-embed > div > h1 { display: none; }'}</style>
            <PageView />
          </div>
        )}
      </Sheet>
    </div>
  );
}
