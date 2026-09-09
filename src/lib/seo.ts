import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export interface SeoOverride {
  titlePt: string | null;
  titleEn: string | null;
  descriptionPt: string | null;
  descriptionEn: string | null;
  keywordsPt: string | null;
  keywordsEn: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
}

export async function getSeoOverride(page: string): Promise<SeoOverride | null> {
  try {
    return await prisma.seoMeta.findUnique({ where: { page } });
  } catch {
    return null;
  }
}

/**
 * Aplica o override de /admin/textos sobre o Metadata padrão de uma página.
 * O <html lang> do site é sempre pt-BR no servidor (a troca de idioma é client-side),
 * então só o valor em PT do override chega a ser renderizado no <head> real.
 */
export function withSeoOverride(defaults: Metadata, override: SeoOverride | null): Metadata {
  if (!override) return defaults;

  const title = override.titlePt?.trim() || defaults.title;
  const description = override.descriptionPt?.trim() || defaults.description;
  const keywords = override.keywordsPt?.trim()
    ? override.keywordsPt.split(',').map((k) => k.trim()).filter(Boolean)
    : defaults.keywords;

  return {
    ...defaults,
    title,
    description,
    keywords,
    ...(override.canonicalUrl?.trim() ? { alternates: { canonical: override.canonicalUrl.trim() } } : {}),
    openGraph: {
      ...defaults.openGraph,
      title: title as string,
      description: description as string,
      ...(override.ogImage ? { images: [{ url: override.ogImage }] } : {}),
    },
    robots: override.noIndex ? { index: false, follow: false } : defaults.robots,
  };
}
