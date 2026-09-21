import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

/** Ativa/desativa ou exclui (soft-delete)/restaura um case. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const visible = typeof body.visible === 'boolean' ? body.visible : true;
  const removed = typeof body.removed === 'boolean' ? body.removed : false;

  const updated = await prisma.case.update({
    where: { slug },
    data: { visible, removedAt: removed ? new Date() : null },
  });

  return NextResponse.json({ visible: updated.visible, removedAt: updated.removedAt });
}
