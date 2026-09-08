import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

const VALID_STATUSES = new Set(['novo', 'em-contato', 'convertido', 'perdido']);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  if (typeof status !== 'string' || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
  }

  const lead = await prisma.lead.update({ where: { id }, data: { status } });
  return NextResponse.json({ lead });
}
