import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPortfolioItemBySlug } from '@/data/portfolio';
import CaseAssetEditor from './CaseAssetEditor';

export default async function AdminCaseEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);
  if (!item) notFound();

  return (
    <div>
      <Link href="/admin/cases" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Voltar
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 24px' }}>{item.empresa}</h1>
      <CaseAssetEditor slug={slug} fallbackImage={item.image} fallbackAtuacao={item.atuacao} />
    </div>
  );
}
