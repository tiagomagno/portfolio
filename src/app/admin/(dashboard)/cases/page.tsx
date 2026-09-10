import { ATUACAO_CATEGORIES, getCaseStudyItems, slugify } from '@/data/portfolio';
import { prisma } from '@/lib/prisma';
import CasesTable, { type CaseRow } from './CasesTable';

export const dynamic = 'force-dynamic';

export default async function AdminCasesPage() {
  const items = getCaseStudyItems();
  const assets = await prisma.caseAsset.findMany();
  const assetBySlug = new Map(assets.map((a) => [a.slug, a]));

  const rows: CaseRow[] = items.map((item) => {
    const slug = slugify(item.empresa);
    const asset = assetBySlug.get(slug);
    return {
      id: item.id,
      empresa: item.empresa,
      slug,
      atuacao: item.atuacao,
      fallbackImage: item.image,
      hasCover: !!(asset?.coverImage || item.image),
      hasHero: !!asset?.heroImage,
      galleryCount: Array.isArray(asset?.gallery) ? (asset!.gallery as unknown[]).length : 0,
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
