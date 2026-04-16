/**
 * Schema Zod e tipos para o formulário de briefing.
 * Estrutura em JSON para permitir futura integração com banco, CRM, PDF.
 */

import { z } from 'zod';

/** Lista para o select (valor, rótulo, grupo de optgroup) */
export const BUSINESS_SEGMENT_OPTIONS = [
  {
    group: 'Serviços profissionais e atendimento',
    value: 'advocacia',
    label: 'Escritório de Advocacia',
  },
  {
    group: 'Serviços profissionais e atendimento',
    value: 'saude',
    label: 'Clínica, consultório ou hospital',
  },
  {
    group: 'Serviços profissionais e atendimento',
    value: 'servicos',
    label: 'Empresa de serviços (B2B)',
  },
  {
    group: 'Comércio e varejo',
    value: 'comercio',
    label: 'Comércio (varejo ou atacado)',
  },
  {
    group: 'Comércio e varejo',
    value: 'varejo_online',
    label: 'E-commerce / varejo digital',
  },
  {
    group: 'Tecnologia e conhecimento',
    value: 'tecnologia_saas',
    label: 'Tecnologia, software ou SaaS',
  },
  {
    group: 'Tecnologia e conhecimento',
    value: 'educacao',
    label: 'Educação, cursos ou treinamentos',
  },
  {
    group: 'Tecnologia e conhecimento',
    value: 'midia_marketing',
    label: 'Mídia, marketing ou publicidade',
  },
  {
    group: 'Operações e indústria',
    value: 'industria_manufatura',
    label: 'Indústria ou manufatura',
  },
  {
    group: 'Operações e indústria',
    value: 'agronegocio',
    label: 'Agronegócio',
  },
  {
    group: 'Operações e indústria',
    value: 'construcao_engenharia',
    label: 'Construção ou engenharia',
  },
  {
    group: 'Operações e indústria',
    value: 'logistica_transporte',
    label: 'Logística ou transporte',
  },
  {
    group: 'Operações e indústria',
    value: 'energia_sustentabilidade',
    label: 'Energia ou sustentabilidade',
  },
  {
    group: 'Experiência e consumo',
    value: 'alimentacao_hospedagem',
    label: 'Restaurante, bar ou hotelaria',
  },
  {
    group: 'Experiência e consumo',
    value: 'estetica_bemestar',
    label: 'Estética, beleza ou bem-estar',
  },
  {
    group: 'Experiência e consumo',
    value: 'eventos_entretenimento',
    label: 'Eventos, shows ou entretenimento',
  },
  {
    group: 'Experiência e consumo',
    value: 'turismo_lazer',
    label: 'Turismo, lazer ou agência de viagens',
  },
  {
    group: 'Outros setores',
    value: 'imobiliario',
    label: 'Imobiliário ou incorporação',
  },
  {
    group: 'Outros setores',
    value: 'financeiro_seguros',
    label: 'Financeiro, investimentos ou seguros',
  },
  {
    group: 'Outros setores',
    value: 'saude_animal',
    label: 'Veterinária ou saúde animal',
  },
  {
    group: 'Outros setores',
    value: 'automotivo',
    label: 'Automotivo, oficina ou autopeças',
  },
  {
    group: 'Outros setores',
    value: 'moda_textil',
    label: 'Moda, confecção ou têxtil',
  },
  {
    group: 'Outros setores',
    value: 'arte_cultura',
    label: 'Arte, cultura ou produção audiovisual',
  },
  {
    group: 'Outros setores',
    value: 'associacao_ong',
    label: 'Associação, ONG ou terceiro setor',
  },
  {
    group: 'Outros setores',
    value: 'consultoria_corporativa',
    label: 'Consultoria geral (não jurídica)',
  },
  {
    group: 'Outros setores',
    value: 'rh_recursos_humanos',
    label: 'RH, recrutamento ou people',
  },
  {
    group: 'Outros setores',
    value: 'outro',
    label: 'Outro segmento (especificar)',
  },
] as const;

export type BusinessSegment = (typeof BUSINESS_SEGMENT_OPTIONS)[number]['value'];

/** Segmentos com formulário “Raio-X” dedicado no passo 2 */
export const SPECIALIZED_BRIEFING_SEGMENTS = new Set<BusinessSegment>([
  'advocacia',
  'saude',
  'servicos',
  'comercio',
]);

export const BUSINESS_SEGMENTS = BUSINESS_SEGMENT_OPTIONS.map(
  (o) => o.value
) as unknown as readonly [BusinessSegment, ...BusinessSegment[]];

const BUSINESS_SEGMENT_LABELS: Record<BusinessSegment, string> =
  BUSINESS_SEGMENT_OPTIONS.reduce(
    (acc, o) => {
      acc[o.value] = o.label;
      return acc;
    },
    {} as Record<BusinessSegment, string>
  );

export function getBusinessSegmentLabel(segment: BusinessSegment): string {
  return BUSINESS_SEGMENT_LABELS[segment];
}

export const MAIN_CHALLENGES = [
  'branding',
  'website',
  'social',
  'growth',
  'uxui',
  'audiovisual',
] as const;

export const TARGET_AUDIENCE = ['pf', 'pj', 'ambos'] as const;

// Constantes de Enums para Segmentos
export const SAUDE_ATTENDANCE_TYPE = ['particular', 'convenio', 'ambos'] as const;
export const SAUDE_FOCUS = ['exames', 'consultas', 'procedimentos'] as const;
export const COMERCIO_SALES_TYPE = ['varejo', 'atacado', 'b2b', 'varejo_atacado'] as const;
export const COMERCIO_LOGISTICS = ['local', 'nacional', 'internacional'] as const;
export const SERVICOS_CLOSURE_MODEL = ['orcamento', 'visita', 'tabela'] as const;
export const ADVOCACIA_FORMAT = ['online', 'presencial', 'misto'] as const;
export const ADVOCACIA_FOCUS = ['volume', 'estrategico'] as const;
export const YES_NO = ['sim', 'nao'] as const;

/** Opções de dor/desafio — Raio-X genérico (passo 2, segmentos não especializados) */
export const GENERIC_RAIOX_PAIN_OPTIONS = [
  { id: 'poucos_leads', label: 'Poucos leads ou contatos qualificados' },
  { id: 'presenca_digital', label: 'Site ou redes sociais não trazem clientes' },
  { id: 'conversao_baixa', label: 'Interesse nas visitas, mas poucas vendas / conversão baixa' },
  { id: 'concorrencia_preco', label: 'Concorrência forte ou disputa por preço' },
  { id: 'processo_followup', label: 'Sem processo de vendas ou follow-up organizado' },
  { id: 'indicacao_reputacao', label: 'Poucas indicações ou reputação fraca no digital' },
  { id: 'canal_marketing', label: 'Não sei onde investir (anúncios, SEO, conteúdo…)' },
  { id: 'tempo_equipe', label: 'Pouco tempo ou equipe enxuta para marketing' },
  { id: 'sazonalidade', label: 'Demanda irregular, sazonalidade ou picos difíceis de prever' },
] as const;

// Schema base - Contato
const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'WhatsApp inválido. Use o formato (XX) XXXXX-XXXX'),
  deadline: z.string().min(1, 'Informe o prazo desejado'),
});

// Schema completo estruturado para 6 passos
export const briefingSchema = z
  .object({
    // Step 1 - Negócio
    businessSegment: z.enum(BUSINESS_SEGMENTS, {
      error: 'Selecione o segmento da sua empresa',
    }),
    businessSegmentOther: z.string().optional(),
    
    // Step 2 - Raio-X do Segmento (Campos Opcionais mas validados via refine)
    // Advocacia
    advocacia_practiceAreas: z.string().optional(), // Quais áreas?
    advocacia_format: z.enum(ADVOCACIA_FORMAT).optional(),
    advocacia_screening: z.enum(YES_NO).optional(),
    advocacia_caseFocus: z.enum(ADVOCACIA_FOCUS).optional(),
    
    // Saúde
    saude_attendanceType: z.enum(SAUDE_ATTENDANCE_TYPE).optional(),
    saude_mainVolume: z.string().optional(),
    saude_hasMedicalSoftware: z.enum(YES_NO).optional(),
    saude_focus: z.enum(SAUDE_FOCUS).optional(),
    
    // Comércio
    comercio_salesChannel: z.array(z.string()).optional(),
    comercio_salesType: z.enum(COMERCIO_SALES_TYPE).optional(),
    comercio_logistics: z.enum(COMERCIO_LOGISTICS).optional(),
    comercio_hasERP: z.enum(YES_NO).optional(),
    
    // Serviços
    servicos_closureModel: z.enum(SERVICOS_CLOSURE_MODEL).optional(),
    servicos_proposalVolume: z.string().optional(),
    servicos_mainPainPoint: z.string().optional(),

    // Raio-X genérico (segmentos sem formulário dedicado)
    genericRaioXPainPoints: z.array(z.string()).optional(),
    outro_operationDetails: z.string().optional(),

    // Step 3 - Desafio Central
    mainChallenge: z.enum(MAIN_CHALLENGES, {
      error: 'Selecione a sua necessidade principal',
    }),

    // Step 4 - Detalhes/Funcionalidades (Dinâmico)
    features: z.array(z.string()).min(1, 'Selecione pelo menos um item'),

    // Step 5 - Sobre a Empresa (Público, Cliente e Diferencial)
    targetAudience: z.enum(TARGET_AUDIENCE, {
      error: 'Selecione o público-alvo',
    }),
    idealCustomer: z.string().min(5, 'Descreva seu cliente ideal (mín. 5 caracteres)'),
    differential: z.string().min(10, 'Descreva o diferencial (mín. 10 caracteres)'),
    
    // Step 6 - Contato
    ...contactSchema.shape,
  })
  .refine((data) => {
    if (data.businessSegment !== 'outro') return true;
    const t = data.businessSegmentOther?.trim() ?? '';
    return t.length >= 2;
  }, {
    message: 'Informe o segmento do seu negócio (campo obrigatório).',
    path: ['businessSegmentOther'],
  })
  // Refines para obrigar os campos condicionados
  .refine((data) => {
    if (data.businessSegment === 'advocacia') {
      return !!data.advocacia_practiceAreas && !!data.advocacia_format && !!data.advocacia_screening && !!data.advocacia_caseFocus;
    }
    return true;
  }, {
    message: 'Preencha todos os campos do Raio-X Jurídico',
    path: ['advocacia_practiceAreas'], // Colocando no primeiro campo como âncora geral para erro
  })
  .refine((data) => {
    if (data.businessSegment === 'saude') {
      return !!data.saude_attendanceType && !!data.saude_mainVolume && !!data.saude_hasMedicalSoftware && !!data.saude_focus;
    }
    return true;
  }, {
    message: 'Preencha todos os campos do Raio-X da Saúde',
    path: ['saude_mainVolume'],
  })
  .refine((data) => {
    if (data.businessSegment === 'comercio') {
      return data.comercio_salesChannel && data.comercio_salesChannel.length > 0 && !!data.comercio_salesType && !!data.comercio_logistics && !!data.comercio_hasERP;
    }
    return true;
  }, {
    message: 'Preencha todos os campos do Raio-X do Comércio',
    path: ['comercio_logistics'],
  })
  .refine((data) => {
    if (data.businessSegment === 'servicos') {
      return !!data.servicos_closureModel && !!data.servicos_proposalVolume && !!data.servicos_mainPainPoint;
    }
    return true;
  }, {
    message: 'Preencha todos os campos do Raio-X de Serviços',
    path: ['servicos_proposalVolume'],
  })
  .refine((data) => {
    if (SPECIALIZED_BRIEFING_SEGMENTS.has(data.businessSegment)) {
      return true;
    }
    const allowed = new Set<string>(
      GENERIC_RAIOX_PAIN_OPTIONS.map((o) => o.id)
    );
    const pts = data.genericRaioXPainPoints ?? [];
    if (pts.length < 1) return false;
    return pts.every((id: string) => allowed.has(id));
  }, {
    message: 'Marque pelo menos uma opção que represente sua dor ou desafio',
    path: ['genericRaioXPainPoints'],
  });

export type BriefingFormData = z.infer<typeof briefingSchema>;

const GENERIC_PAIN_LABEL_BY_ID: Record<string, string> = Object.fromEntries(
  GENERIC_RAIOX_PAIN_OPTIONS.map((o) => [o.id, o.label])
);

export function formatGenericRaioXPainPoints(ids: string[] | undefined): string {
  if (!ids?.length) return '';
  return ids.map((id) => GENERIC_PAIN_LABEL_BY_ID[id] ?? id).join('; ');
}
