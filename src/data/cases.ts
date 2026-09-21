import type { Case } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { parseAtuacaoList, type PortfolioItem, type CaseStudyData } from '@/data/portfolio';

/** Aceita tanto o formato novo ({ url, active }) quanto o antigo (string[]) na galeria. */
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

const EMPTY_OVERVIEW: CaseStudyData['overview'] = { context: '', businessProblem: '', goals: [], roleScope: '', constraints: [] };
const EMPTY_DIAGNOSIS: CaseStudyData['diagnosis'] = { methodology: '', whyThisApproach: '', insight: '', stakeholderManagement: '' };
const EMPTY_DESIGN: CaseStudyData['design'] = { hypothesis: '', discardedAlternatives: [], edgeCases: '', designSystem: '', usabilityValidation: '' };
const EMPTY_HANDOFF: CaseStudyData['handoff'] = { engineeringCollaboration: '', specDocumentation: '', launchStrategy: '' };
const EMPTY_IMPACT: CaseStudyData['impact'] = { metrics: [], qualitativeImpact: '', postMortem: '' };

/** Só monta o case study quando os campos essenciais (papel/ano/subtítulo) estiverem
 * preenchidos — um case criado só com dados básicos (nome/categorias/produtos/capa) fica
 * sem `caseStudy`, exibido como card "em breve" (mesmo comportamento de itens incompletos
 * de antes). Seções de narrativa individualmente vazias caem pro placeholder em branco. */
function buildCaseStudy(row: Case): CaseStudyData | undefined {
  if (!row.role || !row.year || !row.heroSubtitle) return undefined;
  return {
    role: row.role,
    year: row.year,
    heroSubtitle: row.heroSubtitle,
    overview: (row.overview as CaseStudyData['overview'] | null) ?? EMPTY_OVERVIEW,
    diagnosis: (row.diagnosis as CaseStudyData['diagnosis'] | null) ?? EMPTY_DIAGNOSIS,
    design: (row.design as CaseStudyData['design'] | null) ?? EMPTY_DESIGN,
    handoff: (row.handoff as CaseStudyData['handoff'] | null) ?? EMPTY_HANDOFF,
    impact: (row.impact as CaseStudyData['impact'] | null) ?? EMPTY_IMPACT,
  };
}

function mapCase(row: Case): PortfolioItem {
  return {
    id: row.id,
    slug: row.slug,
    empresa: row.empresa,
    atuacao: parseAtuacaoList(row.atuacao) ?? [],
    produtos: Array.isArray(row.produtos) ? (row.produtos as string[]) : [],
    image: row.coverImage ?? undefined,
    heroImage: row.heroImage ?? undefined,
    heroColor: row.heroColor ?? undefined,
    gallery: activeGalleryUrls(row.gallery),
    caseStudy: buildCaseStudy(row),
    featuredOnHome: row.featuredOnHome,
    homeOrder: row.homeOrder,
  };
}

/** Cases visíveis no site (não desativados, não excluídos), na ordem de criação. Sempre
 * falha em silêncio (retorna []) — usado em páginas estáticas/ISR (Home, /portfolio) que
 * rodam no build; sem isso, um deploy antes da tabela Case existir no banco (ou uma
 * instabilidade pontual do banco) derrubaria o build/render inteiro. */
export async function getVisibleCases(): Promise<PortfolioItem[]> {
  try {
    const rows = await prisma.case.findMany({ where: { visible: true, removedAt: null }, orderBy: { createdAt: 'asc' } });
    return rows.map(mapCase);
  } catch (err) {
    console.error('getVisibleCases falhou:', err);
    return [];
  }
}

/** Todos os cases, independente de visibilidade — usado por generateStaticParams (a
 * página de detalhe decide em runtime se esconde ou não um case desativado). Mesma
 * falha-em-silêncio de getVisibleCases (roda no build). */
export async function getAllCases(): Promise<PortfolioItem[]> {
  try {
    const rows = await prisma.case.findMany({ orderBy: { createdAt: 'asc' } });
    return rows.map(mapCase);
  } catch (err) {
    console.error('getAllCases falhou:', err);
    return [];
  }
}

/** Um case pelo slug — retorna null se não existir, estiver desativado/excluído, OU se o
 * banco falhar (fail-silent, mesmo padrão das demais funções deste arquivo). */
export async function getCaseBySlug(slug: string): Promise<PortfolioItem | null> {
  try {
    const row = await prisma.case.findUnique({ where: { slug } });
    if (!row || !row.visible || row.removedAt) return null;
    return mapCase(row);
  } catch (err) {
    console.error(`getCaseBySlug(${slug}) falhou:`, err);
    return null;
  }
}

/** Um case pelo slug, ignorando visibilidade — usado só por generateMetadata (o corpo da
 * página usa getCaseBySlug, que já trata "não encontrado" e "escondido" da mesma forma). */
export async function getCaseBySlugIncludingHidden(slug: string): Promise<PortfolioItem | null> {
  try {
    const row = await prisma.case.findUnique({ where: { slug } });
    return row ? mapCase(row) : null;
  } catch (err) {
    console.error(`getCaseBySlugIncludingHidden(${slug}) falhou:`, err);
    return null;
  }
}
