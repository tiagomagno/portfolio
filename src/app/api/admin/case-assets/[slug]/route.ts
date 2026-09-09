import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const asset = await prisma.caseAsset.findUnique({ where: { slug } });
  return NextResponse.json({ asset });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const coverImage = typeof body.coverImage === 'string' ? body.coverImage : null;
  const heroImage = typeof body.heroImage === 'string' ? body.heroImage : null;
  const heroColor = typeof body.heroColor === 'string' ? body.heroColor : null;
  const gallery = Array.isArray(body.gallery) ? body.gallery.filter((g: unknown) => typeof g === 'string') : [];

  const asset = await prisma.caseAsset.upsert({
    where: { slug },
    update: { coverImage, heroImage, heroColor, gallery },
    create: { slug, coverImage, heroImage, heroColor, gallery },
  });

  return NextResponse.json({ asset });
}
