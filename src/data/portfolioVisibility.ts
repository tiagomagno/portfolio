import { prisma } from '@/lib/prisma';

export interface PortfolioVisibility {
  visible: boolean;
  removedAt: Date | null;
}

/**
 * Status de visibilidade de todos os cases com override salvo (desativados e/ou
 * excluídos), por slug. Sem entrada no mapa = case exibido normalmente. Sempre falha
 * em silêncio — sem DATABASE_URL ou banco fora do ar, o site continua exibindo todos
 * os cases estáticos de src/data/portfolio.ts.
 */
export async function getPortfolioVisibilityMap(): Promise<Map<string, PortfolioVisibility>> {
  try {
    const rows = await prisma.portfolioItemVisibility.findMany();
    return new Map(rows.map((r) => [r.slug, { visible: r.visible, removedAt: r.removedAt }]));
  } catch (err) {
    console.error('getPortfolioVisibilityMap falhou:', err);
    return new Map();
  }
}

/** Slugs que não devem aparecer no site (desativados ou excluídos — mesmo efeito público). */
export async function getHiddenPortfolioSlugs(): Promise<Set<string>> {
  const map = await getPortfolioVisibilityMap();
  return new Set([...map.entries()].filter(([, v]) => !v.visible).map(([slug]) => slug));
}
