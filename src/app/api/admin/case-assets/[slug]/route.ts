import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { parseAtuacaoList } from '@/data/portfolio';

interface GalleryItem {
  url: string;
  active: boolean;
}

/** Aceita tanto o formato novo ({ url, active }) quanto o antigo (string[]), tratando strings como ativas. */
function normalizeGallery(input: unknown): GalleryItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item): GalleryItem | null => {
      if (typeof item === 'string') return { url: item, active: true };
      if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') {
        const obj = item as { url: string; active?: unknown };
        return { url: obj.url, active: obj.active !== false };
      }
      return null;
    })
    .filter((item): item is GalleryItem => item !== null);
}

/**
 * Apaga do disco (public/uploads/cases) os arquivos que saíram do case ao salvar.
 * Sem isso, imagens excluídas/trocadas no admin ficam órfãs no volume para sempre —
 * best-effort: falha de unlink (arquivo já removido, permissão, etc.) não derruba o save.
 */
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
  const gallery = normalizeGallery(body.gallery);
  const galleryJson = gallery as unknown as Prisma.InputJsonValue;
  // Categorias não enviadas/ inválidas voltam a usar as fixas de src/data/portfolio.ts (JsonNull = sem override).
  const atuacaoOverride = parseAtuacaoList(body.atuacao);
  const atuacaoJson = (atuacaoOverride ?? Prisma.JsonNull) as Prisma.InputJsonValue;

  const previous = await prisma.caseAsset.findUnique({ where: { slug } });

  const asset = await prisma.caseAsset.upsert({
    where: { slug },
    update: { coverImage, heroImage, heroColor, gallery: galleryJson, atuacao: atuacaoJson },
    create: { slug, coverImage, heroImage, heroColor, gallery: galleryJson, atuacao: atuacaoJson },
  });

  if (previous) {
    const keepUrls = new Set<string>(gallery.map((g) => g.url));
    if (coverImage) keepUrls.add(coverImage);
    if (heroImage) keepUrls.add(heroImage);

    const oldUrls = normalizeGallery(previous.gallery).map((g) => g.url);
    if (previous.coverImage) oldUrls.push(previous.coverImage);
    if (previous.heroImage) oldUrls.push(previous.heroImage);

    await deleteOrphanedUploads(oldUrls, keepUrls);
  }

  return NextResponse.json({ asset });
}
