/**
 * Schema Zod do formulário de case do admin (criar/editar). Espelha `CaseStudyData` +
 * dados básicos de `PortfolioItem` (src/data/portfolio.ts). Isomórfico: usado tanto no
 * client (CaseForm.tsx, validação com react-hook-form) quanto no server (rotas de API).
 */
import { z } from 'zod';
import { ATUACAO_CATEGORIES, type AtuacaoCategory } from '@/data/portfolio';

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
