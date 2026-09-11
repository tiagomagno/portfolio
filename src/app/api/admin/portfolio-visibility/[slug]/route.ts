import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/**
 * Atualiza a visibilidade de um case do portfólio (desativar/ativar, excluir/restaurar
 * da lista do admin). Não mexe no texto/dados do case — esses continuam fixos em
 * src/data/portfolio.ts.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const visible = typeof body.visible === 'boolean' ? body.visible : true;
  const removed = typeof body.removed === 'boolean' ? body.removed : false;

  // Estado padrão (visível, não excluído) não precisa de linha no banco — remove pra manter limpo.
  if (visible && !removed) {
    await prisma.portfolioItemVisibility.deleteMany({ where: { slug } });
    return NextResponse.json({ visible: true, removedAt: null });
  }

  const item = await prisma.portfolioItemVisibility.upsert({
    where: { slug },
    update: { visible, removedAt: removed ? new Date() : null },
    create: { slug, visible, removedAt: removed ? new Date() : null },
  });

  return NextResponse.json({ visible: item.visible, removedAt: item.removedAt });
}
