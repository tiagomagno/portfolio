/** Server-only: converte CaseFormData validado em payload do Prisma. Não importar de client components. */
import { Prisma, type Case } from '@prisma/client';
import { parseAtuacaoList } from '@/data/portfolio';
import type { CaseFormData } from '@/lib/caseForm';

/** Seções de narrativa só são salvas se tiverem algum conteúdo — evita gravar um objeto
 * cheio de strings/arrays vazias pra um case recém-criado com só os dados básicos. */
function sectionOrNull(section: Record<string, unknown>): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  const hasContent = Object.values(section).some((v) =>
    Array.isArray(v) ? v.some((item) => (typeof item === 'string' ? item.trim().length > 0 : Boolean(item))) : typeof v === 'string' ? v.trim().length > 0 : false
  );
  return hasContent ? (section as unknown as Prisma.InputJsonValue) : Prisma.JsonNull;
}

export function caseFormToPrismaData(data: CaseFormData) {
  const cleanGoals = data.overview.goals.filter((g) => g.trim().length > 0);
  const cleanConstraints = data.overview.constraints.filter((c) => c.trim().length > 0);
  const cleanProdutos = data.produtos.filter((p) => p.trim().length > 0);

  return {
    slug: data.slug,
    empresa: data.empresa,
    atuacao: data.atuacao as unknown as Prisma.InputJsonValue,
    produtos: cleanProdutos as unknown as Prisma.InputJsonValue,
    coverImage: data.coverImage.trim() || null,
    heroImage: data.heroImage.trim() || null,
    heroColor: data.heroColor.trim() || null,
    gallery: (data.gallery.length > 0 ? data.gallery : Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
    role: data.role.trim() || null,
    year: data.year.trim() || null,
    heroSubtitle: data.heroSubtitle.trim() || null,
    overview: sectionOrNull({ ...data.overview, goals: cleanGoals, constraints: cleanConstraints }),
    diagnosis: sectionOrNull(data.diagnosis),
    design: sectionOrNull(data.design),
    handoff: sectionOrNull(data.handoff),
    impact: sectionOrNull(data.impact),
  };
}

/** Converte uma linha do banco (Case) no formato do formulário, pra prefill da edição. */
export function caseRowToFormData(row: Case): CaseFormData {
  const overview = (row.overview as CaseFormData['overview'] | null) ?? { context: '', businessProblem: '', goals: [], roleScope: '', constraints: [] };
  const diagnosis = (row.diagnosis as CaseFormData['diagnosis'] | null) ?? { methodology: '', whyThisApproach: '', insight: '', stakeholderManagement: '' };
  const design = (row.design as CaseFormData['design'] | null) ?? { hypothesis: '', discardedAlternatives: [], edgeCases: '', designSystem: '', usabilityValidation: '' };
  const handoff = (row.handoff as CaseFormData['handoff'] | null) ?? { engineeringCollaboration: '', specDocumentation: '', launchStrategy: '' };
  const impact = (row.impact as CaseFormData['impact'] | null) ?? { metrics: [], qualitativeImpact: '', postMortem: '' };
  const produtos = Array.isArray(row.produtos) ? (row.produtos as string[]) : [];
  const gallery = Array.isArray(row.gallery) ? (row.gallery as CaseFormData['gallery']) : [];

  return {
    empresa: row.empresa,
    slug: row.slug,
    atuacao: parseAtuacaoList(row.atuacao) ?? [],
    produtos: produtos.length > 0 ? produtos : [''],
    coverImage: row.coverImage ?? '',
    heroImage: row.heroImage ?? '',
    heroColor: row.heroColor ?? '',
    gallery,
    role: row.role ?? '',
    year: row.year ?? '',
    heroSubtitle: row.heroSubtitle ?? '',
    overview: { ...overview, goals: overview.goals.length > 0 ? overview.goals : [''], constraints: overview.constraints.length > 0 ? overview.constraints : [''] },
    diagnosis,
    design,
    handoff,
    impact,
  };
}
