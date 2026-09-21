import Link from 'next/link';
import { ATUACAO_CATEGORIES, parseAtuacaoList } from '@/data/portfolio';
import { prisma } from '@/lib/prisma';
import CasesTable, { type CaseRow } from './CasesTable';

export const dynamic = 'force-dynamic';

export default async function AdminCasesPage() {
  const cases = await prisma.case.findMany({ orderBy: { createdAt: 'asc' } });

  const rows: CaseRow[] = cases.map((item) => ({
    id: item.id,
    empresa: item.empresa,
    slug: item.slug,
    atuacao: parseAtuacaoList(item.atuacao) ?? [],
    hasCover: !!item.coverImage,
    hasHero: !!item.heroImage,
    galleryCount: Array.isArray(item.gallery) ? (item.gallery as unknown[]).length : 0,
    visible: item.visible,
    removedAt: item.removedAt ? item.removedAt.toISOString() : null,
    featuredOnHome: item.featuredOnHome,
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Cases</h1>
          <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: 0 }}>
            Cadastro, imagens, visibilidade e seleção para o carrossel da home de cada case do portfólio.
          </p>
        </div>
        <Link
          href="/admin/cases/new"
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#fff',
            background: 'var(--color-primary)',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          + Novo case
        </Link>
      </div>

      <CasesTable rows={rows} categories={ATUACAO_CATEGORIES} />
    </div>
  );
}
