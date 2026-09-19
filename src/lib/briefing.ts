/**
 * Schema Zod e tipos para o formulário de briefing.
 * Estrutura em JSON para permitir futura integração com banco, CRM, PDF.
 */

import { z } from 'zod';

// ── Step 1 — Sobre a empresa ────────────────────────────────────────────

export const COMPANY_STAGE_OPTIONS = [
  { value: 'startup', label: 'Startup em fase de crescimento' },
  { value: 'scaleup', label: 'Scale-up' },
  { value: 'estabelecida', label: 'Empresa estabelecida' },
  { value: 'time_interno', label: 'Time interno de produto ou engenharia' },
] as const;

export const COMPANY_STAGES = COMPANY_STAGE_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof COMPANY_STAGE_OPTIONS)[number]['value'],
  ...(typeof COMPANY_STAGE_OPTIONS)[number]['value'][],
];
export type CompanyStage = (typeof COMPANY_STAGE_OPTIONS)[number]['value'];

export const TEAM_SIZE_OPTIONS = [
  { value: 'sem_time', label: 'Ainda não tenho um time de produto' },
  { value: '1_5', label: '1 a 5 pessoas' },
  { value: '6_20', label: '6 a 20 pessoas' },
  { value: 'mais_20', label: 'Mais de 20 pessoas' },
] as const;

export const TEAM_SIZES = TEAM_SIZE_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof TEAM_SIZE_OPTIONS)[number]['value'],
  ...(typeof TEAM_SIZE_OPTIONS)[number]['value'][],
];
export type TeamSize = (typeof TEAM_SIZE_OPTIONS)[number]['value'];

// ── Step 2 — Sobre o produto ────────────────────────────────────────────

export const PRODUCT_TYPE_OPTIONS = [
  { value: 'app_web', label: 'Aplicação web' },
  { value: 'app_mobile', label: 'Aplicativo mobile' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'sistema_interno', label: 'Sistema interno / B2B' },
  { value: 'produto_novo', label: 'Produto que ainda não existe' },
  { value: 'outro', label: 'Outro tipo de produto' },
] as const;

export const PRODUCT_TYPES = PRODUCT_TYPE_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof PRODUCT_TYPE_OPTIONS)[number]['value'],
  ...(typeof PRODUCT_TYPE_OPTIONS)[number]['value'][],
];
export type ProductType = (typeof PRODUCT_TYPE_OPTIONS)[number]['value'];

export const PRODUCT_STAGE_OPTIONS = [
  { value: 'ideia', label: 'Ainda é uma ideia' },
  { value: 'mvp', label: 'MVP em desenvolvimento' },
  { value: 'operacao_evoluir', label: 'Já está em operação e precisa evoluir' },
  { value: 'operacao_problemas', label: 'Já está em operação, mas com problemas de uso' },
] as const;

export const PRODUCT_STAGES = PRODUCT_STAGE_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof PRODUCT_STAGE_OPTIONS)[number]['value'],
  ...(typeof PRODUCT_STAGE_OPTIONS)[number]['value'][],
];
export type ProductStage = (typeof PRODUCT_STAGE_OPTIONS)[number]['value'];

function getLabel<T extends string>(options: readonly { value: T; label: string }[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export const getCompanyStageLabel = (v: CompanyStage) => getLabel(COMPANY_STAGE_OPTIONS, v);
export const getTeamSizeLabel = (v: TeamSize) => getLabel(TEAM_SIZE_OPTIONS, v);
export const getProductTypeLabel = (v: ProductType) => getLabel(PRODUCT_TYPE_OPTIONS, v);
export const getProductStageLabel = (v: ProductStage) => getLabel(PRODUCT_STAGE_OPTIONS, v);

// ── Step 3 — Principal desafio ──────────────────────────────────────────
// Espelha os problemas definidos na Etapa 1 do plano de posicionamento.

export const MAIN_CHALLENGE_OPTIONS = [
  { value: 'produto_dificil_usar', label: 'O produto ficou difícil de usar' },
  { value: 'inconsistencia_visual', label: 'Telas inconsistentes / sem design system que escale' },
  { value: 'nao_acompanha_negocio', label: 'A interface não acompanha a complexidade do negócio' },
  { value: 'falta_validacao', label: 'Vamos lançar algo novo sem validar com usuários' },
  { value: 'retrabalho_handoff', label: 'Retrabalho entre design e desenvolvimento' },
  { value: 'decisoes_por_opiniao', label: 'Decisões de design tomadas por opinião, não evidência' },
  { value: 'outro', label: 'Outro desafio' },
] as const;

export const MAIN_CHALLENGES = MAIN_CHALLENGE_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof MAIN_CHALLENGE_OPTIONS)[number]['value'],
  ...(typeof MAIN_CHALLENGE_OPTIONS)[number]['value'][],
];
export type MainChallenge = (typeof MAIN_CHALLENGE_OPTIONS)[number]['value'];

const MAIN_CHALLENGE_LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  MAIN_CHALLENGE_OPTIONS.map((o) => [o.value, o.label])
);

export function formatMainChallenges(values: string[] | undefined): string {
  if (!values?.length) return '';
  return values.map((v) => MAIN_CHALLENGE_LABEL_BY_VALUE[v] ?? v).join('; ');
}

// ── Step 4 — Objetivo do projeto ────────────────────────────────────────

export const PROJECT_GOAL_OPTIONS = [
  { value: 'redesign', label: 'Redesenhar um produto existente' },
  { value: 'criacao_zero', label: 'Criar um produto novo, do zero' },
  { value: 'consultoria_continua', label: 'Ter apoio contínuo dentro do time (consultoria)' },
  { value: 'diagnostico', label: 'Um diagnóstico ou auditoria de UX' },
  { value: 'apoio_pontual', label: 'Apoio pontual em uma entrega específica' },
] as const;

export const PROJECT_GOALS = PROJECT_GOAL_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof PROJECT_GOAL_OPTIONS)[number]['value'],
  ...(typeof PROJECT_GOAL_OPTIONS)[number]['value'][],
];
export type ProjectGoal = (typeof PROJECT_GOAL_OPTIONS)[number]['value'];

export const getProjectGoalLabel = (v: ProjectGoal) => getLabel(PROJECT_GOAL_OPTIONS, v);

// ── Step 5 — Prazo, investimento e formato de trabalho ──────────────────

export const BUDGET_RANGE_OPTIONS = [
  { value: 'ate_10k', label: 'Até R$ 10 mil' },
  { value: '10k_30k', label: 'R$ 10 mil a R$ 30 mil' },
  { value: '30k_60k', label: 'R$ 30 mil a R$ 60 mil' },
  { value: 'acima_60k', label: 'Acima de R$ 60 mil' },
  { value: 'nao_sei', label: 'Ainda não sei' },
] as const;

export const BUDGET_RANGES = BUDGET_RANGE_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof BUDGET_RANGE_OPTIONS)[number]['value'],
  ...(typeof BUDGET_RANGE_OPTIONS)[number]['value'][],
];
export type BudgetRange = (typeof BUDGET_RANGE_OPTIONS)[number]['value'];

export const ENGAGEMENT_FORMAT_OPTIONS = [
  { value: 'projeto_pontual', label: 'Projeto pontual, com escopo fechado' },
  { value: 'consultoria_mensal', label: 'Consultoria contínua, mensal' },
  { value: 'nao_sei', label: 'Ainda não sei / quero conversar sobre isso' },
] as const;

export const ENGAGEMENT_FORMATS = ENGAGEMENT_FORMAT_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof ENGAGEMENT_FORMAT_OPTIONS)[number]['value'],
  ...(typeof ENGAGEMENT_FORMAT_OPTIONS)[number]['value'][],
];
export type EngagementFormat = (typeof ENGAGEMENT_FORMAT_OPTIONS)[number]['value'];

export const getBudgetRangeLabel = (v: BudgetRange | undefined) => (v ? getLabel(BUDGET_RANGE_OPTIONS, v) : '—');
export const getEngagementFormatLabel = (v: EngagementFormat) => getLabel(ENGAGEMENT_FORMAT_OPTIONS, v);

// ── Step 6 — Contato ─────────────────────────────────────────────────────

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
] as const;

export const PREFERRED_CONTACTS = PREFERRED_CONTACT_OPTIONS.map((o) => o.value) as unknown as readonly [
  (typeof PREFERRED_CONTACT_OPTIONS)[number]['value'],
  ...(typeof PREFERRED_CONTACT_OPTIONS)[number]['value'][],
];
export type PreferredContact = (typeof PREFERRED_CONTACT_OPTIONS)[number]['value'];

export const getPreferredContactLabel = (v: PreferredContact) => getLabel(PREFERRED_CONTACT_OPTIONS, v);

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'WhatsApp inválido. Use o formato (XX) XXXXX-XXXX'),
  preferredContact: z.enum(PREFERRED_CONTACTS, { error: 'Selecione a forma preferida de contato' }),
});

// ── Schema completo estruturado para 6 passos ───────────────────────────

export const briefingSchema = z
  .object({
    // Step 1 - Sobre a empresa
    companyStage: z.enum(COMPANY_STAGES, { error: 'Selecione como sua empresa se encaixa' }),
    teamSize: z.enum(TEAM_SIZES, { error: 'Selecione o tamanho do time' }),

    // Step 2 - Sobre o produto
    productType: z.enum(PRODUCT_TYPES, { error: 'Selecione o tipo de produto' }),
    productTypeOther: z.string().optional(),
    productStage: z.enum(PRODUCT_STAGES, { error: 'Selecione o estágio atual do produto' }),

    // Step 3 - Principal desafio (múltipla escolha)
    mainChallenge: z.array(z.enum(MAIN_CHALLENGES)).min(1, 'Selecione pelo menos uma opção'),
    mainChallengeOther: z.string().optional(),

    // Step 4 - Objetivo do projeto
    projectGoal: z.enum(PROJECT_GOALS, { error: 'Selecione o objetivo do projeto' }),
    goalDescription: z.string().min(10, 'Descreva o objetivo em algumas palavras (mín. 10 caracteres)'),

    // Step 5 - Prazo, investimento e formato de trabalho
    deadline: z.string().min(1, 'Informe o prazo desejado'),
    // Campo opcional: quando nenhuma opção é marcada, o react-hook-form reporta
    // null (não undefined) pra esse grupo de radios sem defaultValue.
    budgetRange: z
      .union([z.enum(BUDGET_RANGES), z.literal(''), z.null()])
      .optional()
      .transform((v) => (v === '' || v == null ? undefined : v)),
    engagementFormat: z.enum(ENGAGEMENT_FORMATS, { error: 'Selecione o formato de trabalho' }),

    // Step 6 - Contato
    ...contactSchema.shape,
  })
  .refine(
    (data) => {
      if (data.productType !== 'outro') return true;
      return (data.productTypeOther?.trim() ?? '').length >= 2;
    },
    { message: 'Informe o tipo do seu produto (campo obrigatório).', path: ['productTypeOther'] }
  )
  .refine(
    (data) => {
      if (!data.mainChallenge.includes('outro')) return true;
      return (data.mainChallengeOther?.trim() ?? '').length >= 2;
    },
    { message: 'Descreva o outro desafio (campo obrigatório).', path: ['mainChallengeOther'] }
  );

export type BriefingFormData = z.infer<typeof briefingSchema>;
