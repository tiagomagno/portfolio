/**
 * Schema Zod do formulário de case do admin (criar/editar). Espelha `CaseStudyData` +
 * dados básicos de `PortfolioItem` (src/data/portfolio.ts). Isomórfico: usado tanto no
 * client (CaseForm.tsx, validação com react-hook-form) quanto no server (rotas de API).
 */
import { z } from 'zod';
import { ATUACAO_CATEGORIES, parseAtuacaoList, type AtuacaoCategory } from '@/data/portfolio';

const metricSchema = z.object({ value: z.string(), label: z.string() });
const alternativeSchema = z.object({ title: z.string(), reason: z.string() });
const galleryItemSchema = z.object({ url: z.string(), active: z.boolean() });

const overviewSchema = z.object({
  context: z.string(),
  businessProblem: z.string(),
  goals: z.array(z.string()),
  roleScope: z.string(),
  constraints: z.array(z.string()),
});

const diagnosisSchema = z.object({
  methodology: z.string(),
  whyThisApproach: z.string(),
  insight: z.string(),
  stakeholderManagement: z.string(),
});

const designSchema = z.object({
  hypothesis: z.string(),
  discardedAlternatives: z.array(alternativeSchema),
  edgeCases: z.string(),
  designSystem: z.string(),
  usabilityValidation: z.string(),
});

const handoffSchema = z.object({
  engineeringCollaboration: z.string(),
  specDocumentation: z.string(),
  launchStrategy: z.string(),
});

const impactSchema = z.object({
  metrics: z.array(metricSchema),
  qualitativeImpact: z.string(),
  postMortem: z.string(),
});

export const caseFormSchema = z.object({
  empresa: z.string().min(2, 'Informe o nome da empresa.'),
  slug: z
    .string()
    .min(2, 'Informe a URL do case.')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use apenas letras minúsculas, números e hífen.'),
  atuacao: z
    .array(z.string())
    .min(1, 'Selecione ao menos uma categoria.')
    .refine((arr) => arr.every((v) => ATUACAO_CATEGORIES.includes(v as AtuacaoCategory)), {
      message: 'Categoria inválida.',
    }),
  produtos: z.array(z.string().min(1, 'Produto não pode ficar em branco.')).min(1, 'Adicione ao menos um produto.'),
  coverImage: z.string(),
  heroImage: z.string(),
  heroColor: z.string(),
  gallery: z.array(galleryItemSchema),
  role: z.string(),
  year: z.string(),
  heroSubtitle: z.string(),
  overview: overviewSchema,
  diagnosis: diagnosisSchema,
  design: designSchema,
  handoff: handoffSchema,
  impact: impactSchema,
});

export type CaseFormData = z.infer<typeof caseFormSchema>;

export const emptyCaseFormDefaults: CaseFormData = {
  empresa: '',
  slug: '',
  atuacao: [],
  produtos: [''],
  coverImage: '',
  heroImage: '',
  heroColor: '',
  gallery: [],
  role: '',
  year: '',
  heroSubtitle: '',
  overview: { context: '', businessProblem: '', goals: [''], roleScope: '', constraints: [''] },
  diagnosis: { methodology: '', whyThisApproach: '', insight: '', stakeholderManagement: '' },
  design: { hypothesis: '', discardedAlternatives: [], edgeCases: '', designSystem: '', usabilityValidation: '' },
  handoff: { engineeringCollaboration: '', specDocumentation: '', launchStrategy: '' },
  impact: { metrics: [], qualitativeImpact: '', postMortem: '' },
};

/** Formato genérico o bastante pra cobrir tanto uma linha do Prisma (server) quanto o
 * JSON já desserializado de GET /api/admin/cases/[slug] (client) — sem depender de
 * @prisma/client, que não pode ser importado em componentes client. */
export interface CaseRecordLike {
  slug: string;
  empresa: string;
  atuacao: unknown;
  produtos: unknown;
  coverImage: string | null;
  heroImage: string | null;
  heroColor: string | null;
  gallery: unknown;
  role: string | null;
  year: string | null;
  heroSubtitle: string | null;
  overview: unknown;
  diagnosis: unknown;
  design: unknown;
  handoff: unknown;
  impact: unknown;
}

/** Converte uma linha do banco (ou a resposta da API) no formato do formulário, pra prefill da edição. */
export function caseRecordToFormData(row: CaseRecordLike): CaseFormData {
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
