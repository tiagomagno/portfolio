import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const sections = await prisma.homeSection.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ sections });
}

/** Recebe a lista inteira já reordenada e grava order/visible de cada seção. */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { sections } = await request.json();
  if (!Array.isArray(sections)) return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });

  await prisma.$transaction(
    sections.map((s: { key: string; order: number; visible: boolean }) =>
      prisma.homeSection.update({ where: { key: s.key }, data: { order: s.order, visible: s.visible } })
    )
  );

  return NextResponse.json({ ok: true });
}
