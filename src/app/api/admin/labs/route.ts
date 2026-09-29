import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DEFAULT_LAB_ITEMS, LAB_STATUSES } from '@/data/labs';

/** Lista os projetos do Lab; na primeira vez (tabela vazia) grava os padrões pra você editar em cima deles. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  let rows = await prisma.labItem.findMany({ orderBy: { order: 'asc' } });
  if (rows.length === 0) {
    await prisma.labItem.createMany({ data: DEFAULT_LAB_ITEMS.map((d, i) => ({ ...d, order: i, visible: true })) });
    rows = await prisma.labItem.findMany({ orderBy: { order: 'asc' } });
  }
  return NextResponse.json({ items: rows });
}

interface IncomingItem {
  id?: string;
  title: string;
  tagline: string;
  status: string;
  href: string;
  image: string;
  visible: boolean;
}

/** Salva a lista inteira: a posição vira a ordem, itens novos (sem id) são criados e os que sumiram são removidos. */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { items } = (await request.json()) as { items?: IncomingItem[] };
  if (!Array.isArray(items)) return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  if (items.some((i) => !i.title?.trim())) return NextResponse.json({ error: 'Todo projeto precisa de um nome' }, { status: 400 });

  const keepIds = items.filter((i) => i.id).map((i) => i.id as string);
  await prisma.$transaction([
    prisma.labItem.deleteMany({ where: { id: { notIn: keepIds } } }),
    ...items.map((i, order) => {
      const data = {
        title: i.title.trim(),
        tagline: i.tagline ?? '',
        status: (LAB_STATUSES as readonly string[]).includes(i.status) ? i.status : 'Protótipo',
        href: (i.href ?? '').trim(),
        image: i.image ?? '',
        visible: i.visible !== false,
        order,
      };
      return i.id ? prisma.labItem.update({ where: { id: i.id }, data }) : prisma.labItem.create({ data });
    }),
  ]);

  const rows = await prisma.labItem.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ items: rows });
}
