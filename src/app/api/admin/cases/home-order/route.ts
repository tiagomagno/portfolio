import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/** Grava a ordem de prioridade dos cases selecionados pra home a partir da lista completa
 * de slugs (na ordem desejada), renumerando homeOrder de 0 a n-1. Regravar tudo de uma vez
 * também conserta valores duplicados que quebravam a troca com o vizinho. */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const slugs: unknown = body?.slugs;
  if (!Array.isArray(slugs) || slugs.some((s) => typeof s !== 'string') || new Set(slugs).size !== slugs.length) {
    return NextResponse.json({ error: 'Lista de slugs inválida.' }, { status: 400 });
  }

  const featured = await prisma.case.findMany({ where: { featuredOnHome: true }, select: { slug: true } });
  const featuredSlugs = new Set(featured.map((c) => c.slug));
  if (slugs.length !== featuredSlugs.size || !slugs.every((s: string) => featuredSlugs.has(s))) {
    return NextResponse.json({ error: 'A lista não corresponde aos cases selecionados pra home.' }, { status: 400 });
  }

  await prisma.$transaction(
    (slugs as string[]).map((slug, index) => prisma.case.update({ where: { slug }, data: { homeOrder: index } }))
  );

  return NextResponse.json({ ok: true });
}
