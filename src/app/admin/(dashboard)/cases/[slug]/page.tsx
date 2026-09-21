import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { caseRowToFormData } from '@/lib/caseFormServer';
import CaseForm from '@/components/admin/CaseForm';

export default async function AdminCaseEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.case.findUnique({ where: { slug } });
  if (!item) notFound();

  return (
    <div>
      <Link href="/admin/cases" style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
        ← Voltar
      </Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '8px 0 24px' }}>{item.empresa}</h1>
      <CaseForm mode="edit" slug={slug} initialData={caseRowToFormData(item)} />
    </div>
  );
}
