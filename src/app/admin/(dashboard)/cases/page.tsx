import { ATUACAO_CATEGORIES, getCaseStudyItems, parseAtuacaoList, slugify } from '@/data/portfolio';
import { prisma } from '@/lib/prisma';
import { getPortfolioVisibilityMap } from '@/data/portfolioVisibility';
import CasesTable, { type CaseRow } from './CasesTable';

export const dynamic = 'force-dynamic';

export default async function AdminCasesPage() {
  const items = getCaseStudyItems();
  const [assets, visibilityMap] = await Promise.all([prisma.caseAsset.findMany(), getPortfolioVisibilityMap()]);
  const assetBySlug = new Map(assets.map((a) => [a.slug, a]));

  const rows: CaseRow[] = items.map((item) => {
    const slug = slugify(item.empresa);
    const asset = assetBySlug.get(slug);
    const visibility = visibilityMap.get(slug);
    return {
      id: item.id,
      empresa: item.empresa,
      slug,
      atuacao: parseAtuacaoList(asset?.atuacao) ?? item.atuacao,
      fallbackImage: item.image,
      hasCover: !!(asset?.coverImage || item.image),
      hasHero: !!asset?.heroImage,
      galleryCount: Array.isArray(asset?.gallery) ? (asset!.gallery as unknown[]).length : 0,
      visible: visibility?.visible ?? true,
      removedAt: visibility?.removedAt ? visibility.removedAt.toISOString() : null,
    };
  });

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Cases</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Capa (listagem/home), imagem de topo e galeria de cada case do portfólio.
      </p>

      <CasesTable rows={rows} categories={ATUACAO_CATEGORIES} />
    </div>
  );
}
