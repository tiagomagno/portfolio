import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { translations } from '@/lib/translations';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const overrides = await prisma.pageContent.findMany();
  const overrideByKey = new Map(overrides.map((o) => [o.key, o]));

  const keys = Object.keys(translations['pt-BR']);
  const items = keys.map((key) => {
    const override = overrideByKey.get(key);
    return {
      key,
      group: key.split('.')[0],
      defaultPt: (translations['pt-BR'] as Record<string, string>)[key],
      defaultEn: (translations['en-US'] as Record<string, string>)[key] ?? '',
      valuePt: override?.valuePt ?? null,
      valueEn: override?.valueEn ?? null,
    };
  });

  return NextResponse.json({ items });
}

/** Upsert em lote — recebe [{ key, valuePt, valueEn }]. valuePt/valueEn vazios removem o override. */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { items } = await request.json();
  if (!Array.isArray(items)) return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });

  await prisma.$transaction(
    items.map((item: { key: string; valuePt: string; valueEn: string }) => {
      if (!item.valuePt.trim() && !item.valueEn.trim()) {
        return prisma.pageContent.deleteMany({ where: { key: item.key } });
      }
      return prisma.pageContent.upsert({
        where: { key: item.key },
        update: { valuePt: item.valuePt, valueEn: item.valueEn },
        create: { key: item.key, valuePt: item.valuePt, valueEn: item.valueEn },
      });
    })
  );

  return NextResponse.json({ ok: true });
}
