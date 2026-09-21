import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/** Troca a posição de um case com o vizinho adjacente (anterior/próximo) entre os
 * selecionados pra home — só faz sentido pra cases com featuredOnHome = true. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const direction = body.direction === 'up' || body.direction === 'down' ? body.direction : null;
  if (!direction) return NextResponse.json({ error: 'Direção inválida.' }, { status: 400 });

  const current = await prisma.case.findUnique({ where: { slug } });
  if (!current || !current.featuredOnHome) {
    return NextResponse.json({ error: 'Case não encontrado ou não está na home.' }, { status: 404 });
  }

  const neighbor = await prisma.case.findFirst({
    where: {
      featuredOnHome: true,
      homeOrder: direction === 'up' ? { lt: current.homeOrder } : { gt: current.homeOrder },
    },
    orderBy: { homeOrder: direction === 'up' ? 'desc' : 'asc' },
  });

  if (!neighbor) {
    // Já está na ponta — nada a fazer.
    return NextResponse.json({ homeOrder: current.homeOrder });
  }

  await prisma.$transaction([
    prisma.case.update({ where: { slug: current.slug }, data: { homeOrder: neighbor.homeOrder } }),
    prisma.case.update({ where: { slug: neighbor.slug }, data: { homeOrder: current.homeOrder } }),
  ]);

  return NextResponse.json({ homeOrder: neighbor.homeOrder });
}
