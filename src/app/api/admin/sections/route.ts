import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { HOME_SECTION_KEYS, HOME_SECTION_LABELS, mergeSectionOrder } from '@/lib/homeSections';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  // Só as seções que ainda existem no layout da Home; as antigas ficam de fora do admin.
  const known: string[] = [...HOME_SECTION_KEYS];
  let sections = await prisma.homeSection.findMany({ where: { key: { in: known } }, orderBy: { order: 'asc' } });

  // Seção nova do layout (sem linha no banco ainda): cria no lugar padrão e renumera, pra aparecer na lista.
  const merged = mergeSectionOrder(sections.map((s) => s.key));
  if (merged.length !== sections.length) {
    await prisma.$transaction(
      merged.map((key, order) =>
        prisma.homeSection.upsert({
          where: { key },
          update: { order },
          create: { key, label: HOME_SECTION_LABELS[key] ?? key, order, visible: true },
        })
      )
    );
    sections = await prisma.homeSection.findMany({ where: { key: { in: known } }, orderBy: { order: 'asc' } });
  }
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
