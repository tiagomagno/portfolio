import { prisma } from '@/lib/prisma';

export interface CaseAssetOverrides {
  coverImage: string | null;
  heroImage: string | null;
  heroColor: string | null;
  gallery: string[];
}

/**
 * Itens de galeria são salvos como { url, active }. Aceita também o formato antigo
 * (string[]) por compatibilidade com registros salvos antes dessa mudança — nesse
 * caso, tudo é tratado como ativo. Imagens desativadas no admin não entram na lista
 * retornada aqui, então nunca aparecem no site público.
 */
function activeGalleryUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') {
        const obj = item as { url: string; active?: unknown };
        return obj.active === false ? null : obj.url;
      }
      return null;
    })
    .filter((url): url is string => url !== null);
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
      gallery: activeGalleryUrls(asset.gallery),
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
          gallery: activeGalleryUrls(a.gallery),
        },
      ])
    );
  } catch (err) {
    console.error('getAllCaseAssetOverrides falhou:', err);
    return new Map();
  }
}
