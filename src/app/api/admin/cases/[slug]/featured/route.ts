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

  const current = await prisma.case.findUnique({ where: { slug }, select: { featuredOnHome: true } });

  if (featured) {
    const count = await prisma.case.count({ where: { featuredOnHome: true } });
    if (!current?.featuredOnHome && count >= MAX_FEATURED) {
      return NextResponse.json({ error: `Limite de ${MAX_FEATURED} cases na home atingido.` }, { status: 400 });
    }
  }

  // Ao marcar, entra no fim da fila de prioridade (pode ser reordenado depois com as setas
  // da tabela). Ao desmarcar, não precisa zerar homeOrder — fica sem efeito até ser marcado de novo.
  let homeOrder: number | undefined;
  if (featured && !current?.featuredOnHome) {
    const last = await prisma.case.findFirst({ where: { featuredOnHome: true }, orderBy: { homeOrder: 'desc' }, select: { homeOrder: true } });
    homeOrder = (last?.homeOrder ?? -1) + 1;
  }

  const updated = await prisma.case.update({
    where: { slug },
    data: { featuredOnHome: featured, ...(homeOrder !== undefined ? { homeOrder } : {}) },
  });
  return NextResponse.json({ featuredOnHome: updated.featuredOnHome, homeOrder: updated.homeOrder });
}
