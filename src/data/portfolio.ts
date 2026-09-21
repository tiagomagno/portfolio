export type AtuacaoCategory =
  | 'Redes Sociais'
  | 'Identidade Visual'
  | 'Produtos Digitais'
  | 'Fotografia'
  | 'Design Gráfico'
  | 'Sistemas Web'
  | 'Consultoria UX/UI';

export interface CaseStudyData {
  role: string;
  year: string;
  heroSubtitle: string;
  overview: {
    context: string;
    businessProblem: string;
    goals: string[];
    roleScope: string;
    constraints: string[];
  };
  diagnosis: {
    methodology: string;
    whyThisApproach: string;
    insight: string;
    stakeholderManagement: string;
  };
  design: {
    hypothesis: string;
    discardedAlternatives: { title: string; reason: string }[];
    edgeCases: string;
    designSystem: string;
    usabilityValidation: string;
  };
  handoff: {
    engineeringCollaboration: string;
    specDocumentation: string;
    launchStrategy: string;
  };
  impact: {
    metrics: { value: string; label: string }[];
    qualitativeImpact: string;
    postMortem: string;
  };
}

export interface PortfolioItem {
  id: string;
  /** Persistido no banco na criação — não recalcular via slugify(empresa), pode divergir se o nome mudar depois. */
  slug: string;
  empresa: string;
  atuacao: AtuacaoCategory[];
  produtos: string[];
  /** Capa: home, listagem do portfólio e card de "próximo case". */
  image?: string;
  /** Banner de topo da página de detalhamento. Se ausente, cai para `image`. */
  heroImage?: string;
  /** Cor sólida alternativa ao heroImage no banner de topo. Mutuamente exclusiva com heroImage. */
  heroColor?: string;
  /** Imagens da galeria dentro do case (posts, mockup do site, telas do app...). */
  gallery?: string[];
  caseStudy?: CaseStudyData;
  /** Selecionado para aparecer no carrossel de Cases da home. */
  featuredOnHome?: boolean;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Resumo curto de um item pra exibir nos cards do portfólio, truncado em `max` caracteres. */
export function portfolioSummary(item: PortfolioItem, max = 144): string {
  const text = item.caseStudy?.heroSubtitle ?? item.produtos.join(' · ');
  if (!text || text === TBD) return item.produtos.join(' · ');
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Placeholder padrão pra campos de narrativa ainda não preenchidos no admin. */
export const TBD = 'A preencher.';

export const ATUACAO_CATEGORIES: AtuacaoCategory[] = [
  'Produtos Digitais',
  'Identidade Visual',
  'Redes Sociais',
  'Design Gráfico',
  'Sistemas Web',
  'Consultoria UX/UI',
  'Fotografia',
];

/**
 * Valida um valor vindo de fora (ex.: campo `atuacao` salvo no banco) contra as categorias
 * conhecidas, descartando qualquer entrada inválida. `null`/não-array = nenhuma categoria
 * reconhecida (quem chama decide o fallback); array (mesmo vazio) = lista válida.
 */
export function parseAtuacaoList(raw: unknown): AtuacaoCategory[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.filter((v): v is AtuacaoCategory => ATUACAO_CATEGORIES.includes(v as AtuacaoCategory));
}
