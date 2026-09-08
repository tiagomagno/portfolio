import Link from 'next/link';
import { getCaseStudyItems, slugify } from '@/data/portfolio';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminCasesPage() {
  const items = getCaseStudyItems();
  const assets = await prisma.caseAsset.findMany();
  const assetBySlug = new Map(assets.map((a) => [a.slug, a]));

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Imagens dos Cases</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Capa (listagem/home), imagem de topo e galeria de cada case do portfólio.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {items.map((item) => {
          const slug = slugify(item.empresa);
          const asset = assetBySlug.get(slug);
          const hasCover = !!(asset?.coverImage || item.image);
          const hasHero = !!asset?.heroImage;
          const galleryCount = Array.isArray(asset?.gallery) ? (asset!.gallery as unknown[]).length : 0;

          return (
            <Link
              key={item.id}
              href={`/admin/cases/${slug}`}
              style={{
                display: 'block',
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
              }}
            >
              <span style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>{item.empresa}</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <Badge ok={hasCover} label="Capa" />
                <Badge ok={hasHero} label="Topo" />
                <Badge ok={galleryCount > 0} label={`Galeria (${galleryCount})`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: '100px',
        color: ok ? '#166534' : 'rgba(26,26,26,0.45)',
        background: ok ? 'rgba(34,197,94,0.15)' : 'rgba(26,26,26,0.06)',
      }}
    >
      {label}
    </span>
  );
}
