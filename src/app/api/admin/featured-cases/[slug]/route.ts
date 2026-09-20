import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const MAX_FEATURED = 10;

/**
 * Marca/desmarca um case pra aparecer no carrossel de Cases da home. Limitado a
 * MAX_FEATURED itens no total — não mexe nos outros campos do CaseAsset (capa,
 * galeria, categorias).
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const featured = body.featured === true;

  if (featured) {
    const count = await prisma.caseAsset.count({ where: { featuredOnHome: true } });
    const already = await prisma.caseAsset.findUnique({ where: { slug }, select: { featuredOnHome: true } });
    if (!already?.featuredOnHome && count >= MAX_FEATURED) {
      return NextResponse.json({ error: `Limite de ${MAX_FEATURED} cases na home atingido.` }, { status: 400 });
    }
  }

  const asset = await prisma.caseAsset.upsert({
    where: { slug },
    update: { featuredOnHome: featured },
    create: { slug, featuredOnHome: featured },
  });

  return NextResponse.json({ featuredOnHome: asset.featuredOnHome });
}
