import { prisma } from '@/lib/prisma';

export interface CaseAssetOverrides {
  coverImage: string | null;
  heroImage: string | null;
  heroColor: string | null;
  gallery: string[];
}

/**
 * Sobreposições de imagem geridas pelo admin (/admin/cases), por slug.
 * Sempre falha em silêncio (retorna null) — sem DATABASE_URL configurada, ou se o banco
 * estiver fora do ar, o site continua funcionando normalmente com as imagens estáticas
 * de src/data/portfolio.ts.
 */
export async function getCaseAssetOverrides(slug: string): Promise<CaseAssetOverrides | null> {
  try {
    const asset = await prisma.caseAsset.findUnique({ where: { slug } });
    if (!asset) return null;
    return {
      coverImage: asset.coverImage,
      heroImage: asset.heroImage,
      heroColor: asset.heroColor,
      gallery: Array.isArray(asset.gallery) ? (asset.gallery as string[]) : [],
    };
  } catch (err) {
    console.error(`getCaseAssetOverrides(${slug}) falhou:`, err);
    return null;
  }
}

export async function getAllCaseAssetOverrides(): Promise<Map<string, CaseAssetOverrides>> {
  try {
    const assets = await prisma.caseAsset.findMany();
    return new Map(
      assets.map((a) => [
        a.slug,
        {
          coverImage: a.coverImage,
          heroImage: a.heroImage,
          heroColor: a.heroColor,
          gallery: Array.isArray(a.gallery) ? (a.gallery as string[]) : [],
        },
      ])
    );
  } catch (err) {
    console.error('getAllCaseAssetOverrides falhou:', err);
    return new Map();
  }
}
