import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { DEFAULT_SITE_SETTINGS } from '@/data/siteSettings';

const EDITABLE_FIELDS = [
  'brandName',
  'contactEmail',
  'whatsappNumber',
  'linkedinUrl',
  'contactFormRecipientEmail',
  'briefingFormRecipientEmail',
] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const row = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  return NextResponse.json({ settings: row ?? { id: 'global', ...DEFAULT_SITE_SETTINGS } });
}

/** Upsert parcial — aceita qualquer subconjunto dos campos editáveis. */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await request.json();
  const data: Record<string, string> = {};
  for (const field of EDITABLE_FIELDS) {
    if (typeof body[field] === 'string') data[field] = body[field];
  }

  const updated = await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: data,
    create: { id: 'global', ...DEFAULT_SITE_SETTINGS, ...data },
  });

  return NextResponse.json({ settings: updated });
}
