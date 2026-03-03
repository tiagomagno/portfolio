/**
 * Schema Zod e tipos para o formulário de briefing.
 * Portado do projeto bergamotamkt e adaptado para o portfolio.
 */

import { z } from 'zod';

export const BUSINESS_SEGMENTS = [
    'advocacia',
    'saude',
    'servicos',
    'comercio',
    'outro',
] as const;

export const SITE_OBJECTIVES = [
    'presenca-institucional',
    'gerar-clientes',
    'modernizar-marca',
    'ferramenta-estrategica',
] as const;

export const TARGET_AUDIENCE = ['pf', 'pj', 'ambos'] as const;

export const FEATURES = [
    'agendamento-online',
    'area-cliente',
    'blog',
    'diagnostico-online',
    'whatsapp',
    'captacao-leads',
] as const;

export const ATUACAO_AREAS = [
    'civil',
    'trabalhista',
    'consumidor',
    'empresarial',
    'familia',
    'imobiliario',
    'outros',
] as const;

export const ATENDIMENTO_TIPO = ['online', 'presencial', 'ambos'] as const;
export const QUALIFICAR_CLIENTES = ['sim', 'nao'] as const;
export const TIPO_CASOS = ['volume', 'estrategicos'] as const;

const contactSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
    deadline: z.string().min(1, 'Informe o prazo desejado'),
    budget: z.string().optional(),
});

export const briefingSchema = z
    .object({
        businessSegment: z.enum(BUSINESS_SEGMENTS, {
            message: 'Selecione o segmento da sua empresa',
        }),
        siteObjective: z.enum(SITE_OBJECTIVES, {
            message: 'Selecione o objetivo do projeto',
        }),
        targetAudience: z.enum(TARGET_AUDIENCE, {
            message: 'Selecione o público-alvo',
        }),
        idealCustomer: z.string().min(5, 'Descreva seu cliente ideal (mín. 5 caracteres)'),
        differential: z.string().min(10, 'Descreva o diferencial (mín. 10 caracteres)'),
        features: z.array(z.enum(FEATURES)).default([]),
        juridicoAreas: z.array(z.enum(ATUACAO_AREAS)).optional(),
        atendimentoTipo: z.enum(ATENDIMENTO_TIPO).optional(),
        qualificarClientes: z.enum(QUALIFICAR_CLIENTES).optional(),
        tipoCasos: z.enum(TIPO_CASOS).optional(),
        ...contactSchema.shape,
    })
    .refine(
        (data) => {
            if (data.businessSegment !== 'advocacia') return true;
            return (
                data.juridicoAreas &&
                data.juridicoAreas.length > 0 &&
                data.atendimentoTipo &&
                data.qualificarClientes &&
                data.tipoCasos
            );
        },
        { message: 'Preencha todas as questões do módulo jurídico', path: ['juridicoAreas'] }
    );

export type BriefingFormData = z.infer<typeof briefingSchema>;

export function classifyProject(data: BriefingFormData): 'Institucional' | 'Captação' | 'Estratégico' {
    const { siteObjective, features } = data;
    if (siteObjective === 'presenca-institucional') return 'Institucional';
    if (siteObjective === 'gerar-clientes' || features.includes('captacao-leads')) return 'Captação';
    if (
        siteObjective === 'ferramenta-estrategica' ||
        features.includes('area-cliente') ||
        features.includes('diagnostico-online')
    ) return 'Estratégico';
    return 'Captação';
}

export function buildBriefingPayload(data: BriefingFormData) {
    const classification = classifyProject(data);
    return {
        timestamp: new Date().toISOString(),
        classification,
        data: {
            step1: {
                businessSegment: data.businessSegment,
                businessSegmentLabel: getBusinessSegmentLabel(data.businessSegment),
            },
            step2: {
                siteObjective: data.siteObjective,
                siteObjectiveLabel: getSiteObjectiveLabel(data.siteObjective),
            },
            step3: {
                targetAudience: data.targetAudience,
                targetAudienceLabel: getTargetAudienceLabel(data.targetAudience),
                idealCustomer: data.idealCustomer,
            },
            step4: { differential: data.differential },
            step5: {
                features: data.features,
                featuresLabels: data.features.map((f) => getFeatureLabel(f)),
            },
            step6:
                data.businessSegment === 'advocacia'
                    ? {
                        juridicoAreas: data.juridicoAreas,
                        atendimentoTipo: data.atendimentoTipo,
                        qualificarClientes: data.qualificarClientes,
                        tipoCasos: data.tipoCasos,
                    }
                    : null,
            step7: {
                name: data.name,
                email: data.email,
                whatsapp: data.whatsapp,
                deadline: data.deadline,
                budget: data.budget,
            },
        },
    };
}

function getBusinessSegmentLabel(value: string): string {
    const labels: Record<string, string> = {
        advocacia: 'Escritório de Advocacia',
        saude: 'Clínica / Saúde',
        servicos: 'Empresa de Serviços',
        comercio: 'Comércio',
        outro: 'Outro',
    };
    return labels[value] ?? value;
}

function getSiteObjectiveLabel(value: string): string {
    const labels: Record<string, string> = {
        'presenca-institucional': 'Presença institucional',
        'gerar-clientes': 'Gerar mais clientes',
        'modernizar-marca': 'Modernizar marca / Identidade',
        'ferramenta-estrategica': 'Transformar em ferramenta estratégica',
    };
    return labels[value] ?? value;
}

function getTargetAudienceLabel(value: string): string {
    const labels: Record<string, string> = { pf: 'Pessoa Física', pj: 'Empresas', ambos: 'Ambos' };
    return labels[value] ?? value;
}

function getFeatureLabel(value: string): string {
    const labels: Record<string, string> = {
        'agendamento-online': 'Agendamento online',
        'area-cliente': 'Área do cliente',
        blog: 'Blog',
        'diagnostico-online': 'Diagnóstico online',
        whatsapp: 'Integração com WhatsApp',
        'captacao-leads': 'Captação de leads estruturada',
    };
    return labels[value] ?? value;
}
