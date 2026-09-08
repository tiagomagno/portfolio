import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (typeof body.labelPt === 'string') data.labelPt = body.labelPt;
  if (typeof body.labelEn === 'string') data.labelEn = body.labelEn;
  if (typeof body.href === 'string') data.href = body.href;
  if (typeof body.order === 'number') data.order = body.order;
  if (typeof body.visible === 'boolean') data.visible = body.visible;

  const item = await prisma.menuItem.update({ where: { id }, data });
  return NextResponse.json({ item });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
