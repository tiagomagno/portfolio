import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const MAX_FEATURED = 10;

/** Marca/desmarca um case pra aparecer no carrossel de Cases da home. Limitado a MAX_FEATURED itens no total. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const featured = body.featured === true;

  if (featured) {
    const count = await prisma.case.count({ where: { featuredOnHome: true } });
    const current = await prisma.case.findUnique({ where: { slug }, select: { featuredOnHome: true } });
    if (!current?.featuredOnHome && count >= MAX_FEATURED) {
      return NextResponse.json({ error: `Limite de ${MAX_FEATURED} cases na home atingido.` }, { status: 400 });
    }
  }

  const updated = await prisma.case.update({ where: { slug }, data: { featuredOnHome: featured } });
  return NextResponse.json({ featuredOnHome: updated.featuredOnHome });
}
