import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const items = await prisma.menuItem.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { labelPt, labelEn, href } = await request.json();
  if (!labelPt || !labelEn || !href) {
    return NextResponse.json({ error: 'Preencha rótulo (PT), rótulo (EN) e link' }, { status: 400 });
  }

  const count = await prisma.menuItem.count();
  const item = await prisma.menuItem.create({ data: { labelPt, labelEn, href, order: count } });
  return NextResponse.json({ item });
}
