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

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Th>Case</Th>
              <Th align="center">Capa</Th>
              <Th align="center">Topo</Th>
              <Th align="center">Galeria</Th>
              <Th align="right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const slug = slugify(item.empresa);
              const asset = assetBySlug.get(slug);
              const hasCover = !!(asset?.coverImage || item.image);
              const hasHero = !!asset?.heroImage;
              const galleryCount = Array.isArray(asset?.gallery) ? (asset!.gallery as unknown[]).length : 0;

              return (
                <tr key={item.id} style={i < items.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}>
                  <Td>
                    <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{item.empresa}</span>
                  </Td>
                  <Td align="center">
                    <Dot ok={hasCover} />
                  </Td>
                  <Td align="center">
                    <Dot ok={hasHero} />
                  </Td>
                  <Td align="center">
                    <span style={{ color: galleryCount > 0 ? '#166534' : 'rgba(26,26,26,0.4)', fontWeight: 600 }}>{galleryCount || '—'}</span>
                  </Td>
                  <Td align="right">
                    <Link
                      href={`/admin/cases/${slug}`}
                      style={{
                        display: 'inline-block',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        textDecoration: 'none',
                      }}
                    >
                      Editar
                    </Link>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <th style={{ textAlign: align, padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </th>
  );
}

function Td({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'center' | 'right' }) {
  return (
    <td style={{ textAlign: align, padding: '12px 16px' }}>{children}</td>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: ok ? '#22c55e' : 'rgba(26,26,26,0.15)',
      }}
      aria-label={ok ? 'Definida' : 'Não definida'}
    />
  );
}
