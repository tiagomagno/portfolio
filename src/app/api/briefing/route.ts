import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildBriefingPayload, briefingSchema } from '@/lib/briefing';

function sanitize(str: string): string {
    return str.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
}

function buildTrelloCard(payload: ReturnType<typeof buildBriefingPayload>): { name: string; desc: string } {
    const d = payload.data;
    const classification = payload.classification;
    const timestamp = new Date(payload.timestamp).toLocaleString('pt-BR');

    const name = `🚀 ${classification} — ${d.step7?.name} (${d.step1?.businessSegmentLabel})`;

    const desc = [
        `**🏷️ Classificação:** ${classification}`,
        `**📅 Recebido em:** ${timestamp}`,
        ``,
        `---`,
        `## 1. Negócio`,
        `**Segmento:** ${d.step1?.businessSegmentLabel}`,
        ``,
        `## 2. Objetivo`,
        `**Objetivo:** ${d.step2?.siteObjectiveLabel}`,
        ``,
        `## 3. Público-Alvo`,
        `**Público:** ${d.step3?.targetAudienceLabel}`,
        `**Cliente ideal:** ${d.step3?.idealCustomer}`,
        ``,
        `## 4. Diferencial`,
        d.step4?.differential,
        ``,
        `## 5. Funcionalidades`,
        (d.step5?.featuresLabels ?? []).length > 0
            ? (d.step5?.featuresLabels ?? []).map((f) => `- ${f}`).join('\n')
            : '- Nenhuma selecionada',
        d.step6
            ? [
                ``,
                `## 6. Módulo Jurídico`,
                `**Áreas:** ${(d.step6.juridicoAreas ?? []).join(', ')}`,
                `**Atendimento:** ${d.step6.atendimentoTipo}`,
                `**Qualificar clientes:** ${d.step6.qualificarClientes}`,
                `**Preferência:** ${d.step6.tipoCasos === 'volume' ? 'Volume de casos' : 'Casos estratégicos'}`,
            ].join('\n')
            : null,
        ``,
        `## 7. Contato`,
        `**Nome:** ${d.step7?.name}`,
        `**E-mail:** ${d.step7?.email}`,
        `**WhatsApp:** ${d.step7?.whatsapp}`,
        `**Prazo:** ${d.step7?.deadline}`,
        `**Orçamento:** ${d.step7?.budget || 'Não informado'}`,
    ]
        .filter((l) => l !== null)
        .join('\n');

    return { name, desc };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parseResult = briefingSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: parseResult.error.flatten() },
                { status: 400 }
            );
        }

        const raw = parseResult.data;
        const sanitized = {
            ...raw,
            name: sanitize(raw.name),
            idealCustomer: sanitize(raw.idealCustomer),
            differential: sanitize(raw.differential),
        };

        const payload = buildBriefingPayload(sanitized as Parameters<typeof buildBriefingPayload>[0]);
        const { name: cardName, desc: cardDesc } = buildTrelloCard(payload);

        const apiKey = process.env.TRELLO_API_KEY;
        const token = process.env.TRELLO_TOKEN;
        const listId = process.env.TRELLO_LEADS_LIST_ID;

        if (!apiKey || !token || !listId) {
            console.error('Trello env vars not configured');
            return NextResponse.json({ success: false, error: 'Configuração do servidor incompleta' }, { status: 500 });
        }

        const url = new URL('https://api.trello.com/1/cards');
        url.searchParams.set('key', apiKey);
        url.searchParams.set('token', token);
        url.searchParams.set('idList', listId);
        url.searchParams.set('name', cardName);
        url.searchParams.set('desc', cardDesc);

        const response = await fetch(url.toString(), { method: 'POST' });

        if (!response.ok) {
            const error = await response.text();
            console.error('Trello API error:', error);
            return NextResponse.json({ success: false, error: 'Erro ao criar card no Trello' }, { status: 500 });
        }

        return NextResponse.json({ success: true, classification: payload.classification });
    } catch (error) {
        console.error('Briefing API error:', error);
        return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
    }
}
