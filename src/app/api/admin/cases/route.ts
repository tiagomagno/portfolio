import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { caseFormSchema } from '@/lib/caseForm';
import { caseFormToPrismaData } from '@/lib/caseFormServer';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const parsed = caseFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos.', issues: parsed.error.issues }, { status: 400 });
  }

  const existing = await prisma.case.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: 'Já existe um case com essa URL. Escolha outra.' }, { status: 409 });
  }

  const created = await prisma.case.create({ data: caseFormToPrismaData(parsed.data) });
  return NextResponse.json({ case: created }, { status: 201 });
}
