import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { caseFormSchema } from '@/lib/caseForm';
import { caseFormToPrismaData } from '@/lib/caseFormServer';

/** Aceita tanto o formato novo ({ url, active }) quanto o antigo (string[]) na galeria salva. */
function galleryUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') return (item as { url: string }).url;
      return null;
    })
    .filter((url): url is string => url !== null);
}

/** Apaga do disco (public/uploads/cases) os arquivos que saíram do case ao salvar — best-effort. */
async function deleteOrphanedUploads(oldUrls: string[], keepUrls: Set<string>) {
  await Promise.all(
    oldUrls
      .filter((url) => !keepUrls.has(url) && url.startsWith('/uploads/cases/'))
      .map((url) => unlink(path.join(process.cwd(), 'public', url)).catch(() => {}))
  );
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const item = await prisma.case.findUnique({ where: { slug } });
  if (!item) return NextResponse.json({ error: 'Case não encontrado.' }, { status: 404 });
  return NextResponse.json({ case: item });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const { slug } = await params;
  const previous = await prisma.case.findUnique({ where: { slug } });
  if (!previous) return NextResponse.json({ error: 'Case não encontrado.' }, { status: 404 });

  const body = await request.json();
  const parsed = caseFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos.', issues: parsed.error.issues }, { status: 400 });
  }

  // Slug pode mudar no form, mas continua precisando ser único.
  if (parsed.data.slug !== slug) {
    const clash = await prisma.case.findUnique({ where: { slug: parsed.data.slug } });
    if (clash) return NextResponse.json({ error: 'Já existe um case com essa URL. Escolha outra.' }, { status: 409 });
  }

  const data = caseFormToPrismaData(parsed.data);
  const updated = await prisma.case.update({ where: { slug }, data });

  const keepUrls = new Set<string>(galleryUrls(data.gallery));
  if (data.coverImage) keepUrls.add(data.coverImage);
  if (data.heroImage) keepUrls.add(data.heroImage);

  const oldUrls = galleryUrls(previous.gallery);
  if (previous.coverImage) oldUrls.push(previous.coverImage);
  if (previous.heroImage) oldUrls.push(previous.heroImage);

  await deleteOrphanedUploads(oldUrls, keepUrls);

  return NextResponse.json({ case: updated });
}
